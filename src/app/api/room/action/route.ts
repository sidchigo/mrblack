import { NextRequest, NextResponse } from 'next/server';
import { getRoom, saveRoom, sanitizeRoomForPlayer, deleteRoom } from '@/lib/room';
import { initializeGame, checkGameEndCondition } from '@/lib/game/game-engine';
import { RoomState, Pack, Player } from '@/types/game';
import { trackGameEvent } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { code: rawCode, playerId, action, payload } = body;

    const code = (rawCode || '').trim().toUpperCase();
    if (!code) {
      return NextResponse.json({ error: 'Missing room code' }, { status: 400 });
    }

    const room = await getRoom(code);
    if (!room) {
      return NextResponse.json({ error: 'Room not found or expired', roomClosed: true }, { status: 404 });
    }

    const player = room.players.find((p) => p.id === playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found in room' }, { status: 403 });
    }

    player.lastSeen = Date.now();

    switch (action) {
      case 'update_settings': {
        if (!player.isHost) {
          return NextResponse.json({ error: 'Only host can update settings' }, { status: 403 });
        }
        if (payload?.selectedPackIds) room.settings.selectedPackIds = payload.selectedPackIds;
        if (typeof payload?.undercoverCount === 'number') room.settings.undercoverCount = payload.undercoverCount;
        if (typeof payload?.mrblackCount === 'number') room.settings.mrblackCount = payload.mrblackCount;
        if (typeof payload?.customTopic === 'string') room.settings.customTopic = payload.customTopic;
        break;
      }

      case 'start_game': {
        if (!player.isHost) {
          return NextResponse.json({ error: 'Only host can start the game' }, { status: 403 });
        }

        if (room.players.length < 3) {
          return NextResponse.json({ error: 'Need at least 3 players to start' }, { status: 400 });
        }

        const totalPlayers = room.players.length;
        const undercoverCount = room.settings.undercoverCount;
        const mrblackCount = room.settings.mrblackCount;
        const civilianCount = totalPlayers - undercoverCount - mrblackCount;

        if (civilianCount < 1 || (undercoverCount === 0 && mrblackCount === 0)) {
          return NextResponse.json({ error: 'Invalid role configuration' }, { status: 400 });
        }

        const customPacks: Pack[] = payload?.customPacks || [];

        const settings = {
          ...room.settings,
          players: room.players.map((p) => p.name),
        };

        const initialGameState = initializeGame(settings, customPacks, room.gameState);

        room.players.forEach((p, idx) => {
          const gamePlayer = initialGameState.players[idx];
          if (gamePlayer) {
            p.role = gamePlayer.role;
            p.word = gamePlayer.word;
            p.isEliminated = false;
            p.revealedCard = false;
            p.isReady = false;
            p.votedFor = null;
            gamePlayer.id = p.id;
          }
        });

        initialGameState.votes = {};
        initialGameState.readyPlayers = [];

        room.gameState = initialGameState;
        room.status = 'playing';

        await trackGameEvent('room_game_started', {
          code: room.code,
          players: room.players.length,
        });
        break;
      }

      case 'player_ready': {
        if (!room.gameState || room.status !== 'playing') {
          return NextResponse.json({ error: 'Game not active' }, { status: 400 });
        }

        player.isReady = true;
        player.revealedCard = true;

        if (!room.gameState.readyPlayers) {
          room.gameState.readyPlayers = [];
        }
        if (!room.gameState.readyPlayers.includes(player.id)) {
          room.gameState.readyPlayers.push(player.id);
        }

        const allReady = room.players.every((p) => room.gameState?.readyPlayers?.includes(p.id));
        if (allReady && room.gameState.phase === 'reveal') {
          room.gameState.phase = 'voting';
        }
        break;
      }

      case 'start_voting': {
        if (!room.gameState || room.status !== 'playing') {
          return NextResponse.json({ error: 'Game not active' }, { status: 400 });
        }
        room.gameState.phase = 'voting';
        break;
      }

      case 'cast_vote': {
        if (!room.gameState || room.status !== 'playing' || room.gameState.phase !== 'voting') {
          return NextResponse.json({ error: 'Voting is not active' }, { status: 400 });
        }
        if (player.isEliminated) {
          return NextResponse.json({ error: 'Eliminated players cannot vote' }, { status: 403 });
        }

        const targetId = payload?.targetPlayerId;
        const targetPlayer = room.players.find((p) => p.id === targetId);
        if (!targetPlayer || targetPlayer.isEliminated) {
          return NextResponse.json({ error: 'Invalid target player' }, { status: 400 });
        }

        if (!room.gameState.votes) {
          room.gameState.votes = {};
        }

        room.gameState.votes[player.id] = targetId;
        player.votedFor = targetId;
        break;
      }

      case 'eliminate_player': {
        if (!room.gameState || room.status !== 'playing') {
          return NextResponse.json({ error: 'Game not active' }, { status: 400 });
        }

        if (!player.isHost) {
          return NextResponse.json({ error: 'Only the host can confirm player elimination' }, { status: 403 });
        }

        const targetId = payload?.targetPlayerId;
        const targetPlayer = room.players.find((p) => p.id === targetId);
        if (!targetPlayer || targetPlayer.isEliminated) {
          return NextResponse.json({ error: 'Invalid target player' }, { status: 400 });
        }

        targetPlayer.isEliminated = true;
        targetPlayer.eliminatedRound = room.gameState.currentRound;

        const gameTarget = room.gameState.players.find((p) => p.id === targetId);
        if (gameTarget) {
          gameTarget.isEliminated = true;
          gameTarget.eliminatedRound = room.gameState.currentRound;
        }

        const votedOutCopy: Player = {
          id: targetPlayer.id,
          name: targetPlayer.name,
          role: targetPlayer.role!,
          word: targetPlayer.word!,
          isEliminated: true,
          eliminatedRound: room.gameState.currentRound,
        };

        room.gameState.votes = {};
        room.players.forEach((p) => {
          p.votedFor = null;
        });

        if (targetPlayer.role === 'mrblack') {
          room.gameState.votedOutPlayer = votedOutCopy;
          room.gameState.phase = 'mrblack_guess';
          break;
        }

        room.gameState.votedOutPlayer = votedOutCopy;

        const result = checkGameEndCondition(room.gameState.players);
        if (result.isOver) {
          room.gameState.phase = 'game_over';
          room.gameState.winner = result.winner;
          room.gameState.winReason = result.reason;
          room.status = 'game_over';
        } else {
          room.gameState.phase = 'voting';
          room.gameState.currentRound += 1;
        }
        break;
      }

      case 'skip_vote': {
        if (!room.gameState || room.status !== 'playing') {
          return NextResponse.json({ error: 'Game not active' }, { status: 400 });
        }

        if (!player.isHost) {
          return NextResponse.json({ error: 'Only the host can skip the voting round' }, { status: 403 });
        }

        room.gameState.votes = {};
        room.players.forEach((p) => {
          p.votedFor = null;
        });
        room.gameState.votedOutPlayer = null;
        room.gameState.currentRound += 1;
        room.gameState.phase = 'voting';
        break;
      }

      case 'mrblack_guess': {
        if (!room.gameState || room.gameState.phase !== 'mrblack_guess') {
          return NextResponse.json({ error: 'Not in guess phase' }, { status: 400 });
        }

        const guessedWord = (payload?.guess || '').trim();
        const civilianWord = room.gameState.activePair.a;

        const cleanGuess = guessedWord.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanTarget = civilianWord.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isCorrect = cleanGuess === cleanTarget;

        room.gameState.mrblackGuessedWord = guessedWord;
        room.gameState.mrblackGuessSuccess = isCorrect;

        if (isCorrect) {
          room.gameState.phase = 'game_over';
          room.gameState.winner = 'mrblack';
          room.gameState.winReason = `Mr. Black correctly guessed "${civilianWord}" and hijacked the victory!`;
          room.status = 'game_over';
        } else {
          const result = checkGameEndCondition(room.gameState.players);
          if (result.isOver) {
            room.gameState.phase = 'game_over';
            room.gameState.winner = result.winner;
            room.gameState.winReason = result.reason;
            room.status = 'game_over';
          } else {
            room.gameState.phase = 'voting';
            room.gameState.currentRound += 1;
          }
        }
        break;
      }

      case 'play_again': {
        if (!player.isHost) {
          return NextResponse.json({ error: 'Only the host can start a new game' }, { status: 403 });
        }

        const customPacks: Pack[] = payload?.customPacks || [];
        const settings = {
          ...room.settings,
          players: room.players.map((p) => p.name),
        };

        const newGame = initializeGame(settings, customPacks, room.gameState);

        room.players.forEach((p, idx) => {
          const gamePlayer = newGame.players[idx];
          if (gamePlayer) {
            p.role = gamePlayer.role;
            p.word = gamePlayer.word;
            p.isEliminated = false;
            p.revealedCard = false;
            p.isReady = false;
            p.votedFor = null;
            gamePlayer.id = p.id;
          }
        });

        newGame.votes = {};
        newGame.readyPlayers = [];

        room.gameState = newGame;
        room.status = 'playing';
        break;
      }

      case 'back_to_lobby': {
        if (!player.isHost) {
          return NextResponse.json({ error: 'Only the host can return room to lobby' }, { status: 403 });
        }

        room.status = 'lobby';
        room.gameState = null;
        room.players.forEach((p) => {
          p.isReady = false;
          p.isEliminated = false;
          p.revealedCard = false;
          p.role = undefined;
          p.word = undefined;
          p.votedFor = null;
        });
        break;
      }

      case 'kick_player': {
        if (!player.isHost) {
          return NextResponse.json({ error: 'Only host can remove players' }, { status: 403 });
        }
        const targetId = payload?.targetPlayerId;
        if (targetId && targetId !== room.hostId) {
          room.players = room.players.filter((p) => p.id !== targetId);
          room.settings.players = room.players.map((p) => p.name);
        }
        break;
      }

      case 'leave_room': {
        if (player.isHost) {
          await deleteRoom(room.code);
          return NextResponse.json({
            roomClosed: true,
            message: 'Host left the room. Room has been closed.',
          });
        }

        room.players = room.players.filter((p) => p.id !== player.id);
        room.settings.players = room.players.map((p) => p.name);
        break;
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    await saveRoom(room);

    const sanitized = sanitizeRoomForPlayer(room, playerId);

    return NextResponse.json({
      room: sanitized.room,
      myPlayer: sanitized.myPlayer,
    });
  } catch (err: any) {
    console.error('Room action error:', err);
    return NextResponse.json(
      { error: 'Failed to perform room action' },
      { status: 500 }
    );
  }
}
