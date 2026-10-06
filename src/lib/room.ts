import { redis } from './redis';
import { RoomState, RoomPlayer, GameState, GameSettings, Pack } from '@/types/game';
import { initializeGame, checkGameEndCondition } from './game/game-engine';
import { BUILT_IN_PACKS } from './game/packs';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 chars, excludes confusing 0, O, 1, I
const ROOM_TTL_SECONDS = 60 * 60 * 24; // 24 hours

export function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * CODE_CHARS.length);
    code += CODE_CHARS[randomIndex];
  }
  return code;
}

export function generatePlayerId(): string {
  return 'p_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export async function getRoom(code: string): Promise<RoomState | null> {
  const normalizedCode = code.trim().toUpperCase();
  const room = await redis.get<RoomState>(`room:${normalizedCode}`);
  return room;
}

export async function saveRoom(room: RoomState): Promise<void> {
  room.updatedAt = Date.now();
  await redis.set(`room:${room.code}`, room, { ex: ROOM_TTL_SECONDS });
}

export async function deleteRoom(code: string): Promise<void> {
  const normalizedCode = code.trim().toUpperCase();
  await redis.del(`room:${normalizedCode}`);
}


/**
 * Sanitizes room state before sending to a client:
 * - Conceals roles and words of other players during active rounds (unless eliminated or game over).
 * - Only includes the requesting player's own role and secret word.
 */
export function sanitizeRoomForPlayer(
  room: RoomState,
  playerId?: string | null
): { room: RoomState; myPlayer: RoomPlayer | null } {
  const myPlayer = room.players.find((p) => p.id === playerId) || null;
  const isGameOver = room.status === 'game_over' || room.gameState?.phase === 'game_over';

  const sanitizedPlayers = room.players.map((p) => {
    const isMe = p.id === playerId;
    const canSeeIdentity = isGameOver || p.isEliminated || isMe;

    return {
      ...p,
      role: canSeeIdentity ? p.role : undefined,
      word: canSeeIdentity ? p.word : undefined,
    };
  });

  let sanitizedGameState: GameState | null = null;
  if (room.gameState) {
    const sanitizedGamePlayers = room.gameState.players.map((p) => {
      const isMe = p.id === playerId;
      const canSeeIdentity = isGameOver || p.isEliminated || isMe;

      return {
        ...p,
        role: canSeeIdentity ? p.role : ('civilian' as const), // Safe fallback
        word: canSeeIdentity ? p.word : null,
      };
    });

    sanitizedGameState = {
      ...room.gameState,
      // Hide activePair secret words unless game is over
      activePair: isGameOver
        ? room.gameState.activePair
        : {
            a: myPlayer?.role === 'civilian' ? (myPlayer.word || '') : '',
            b: myPlayer?.role === 'undercover' ? (myPlayer.word || '') : '',
          },
      players: sanitizedGamePlayers,
    };
  }

  const sanitizedRoom: RoomState = {
    ...room,
    players: sanitizedPlayers,
    gameState: sanitizedGameState,
  };

  return {
    room: sanitizedRoom,
    myPlayer,
  };
}
