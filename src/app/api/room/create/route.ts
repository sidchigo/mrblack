import { NextRequest, NextResponse } from 'next/server';
import { generateRoomCode, generatePlayerId, getRoom, saveRoom, sanitizeRoomForPlayer } from '@/lib/room';
import { RoomState, RoomPlayer } from '@/types/game';
import { BUILT_IN_PACKS } from '@/lib/game/packs';
import { trackGameEvent } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const hostName = (body.hostName || 'Host').trim().slice(0, 18);
    const selectedPackIds = Array.isArray(body.selectedPackIds) && body.selectedPackIds.length > 0
      ? body.selectedPackIds
      : [BUILT_IN_PACKS[0].id, BUILT_IN_PACKS[1].id];

    // Find unique 4-letter room code (retry up to 5 times for collision safety)
    let code = generateRoomCode();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await getRoom(code);
      if (!existing) break;
      code = generateRoomCode();
      attempts++;
    }

    const hostId = generatePlayerId();

    const hostPlayer: RoomPlayer = {
      id: hostId,
      name: hostName || 'Player 1',
      isHost: true,
      isReady: false,
      isEliminated: false,
      lastSeen: Date.now(),
    };

    const room: RoomState = {
      code,
      hostId,
      status: 'lobby',
      settings: {
        players: [hostPlayer.name],
        undercoverCount: body.undercoverCount ?? 1,
        mrblackCount: body.mrblackCount ?? 1,
        selectedPackIds,
      },
      players: [hostPlayer],
      gameState: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveRoom(room);
    await trackGameEvent('room_created', { code });

    const sanitized = sanitizeRoomForPlayer(room, hostId);

    return NextResponse.json({
      code,
      playerId: hostId,
      hostId,
      room: sanitized.room,
      myPlayer: sanitized.myPlayer,
    });
  } catch (err: any) {
    console.error('Error creating room:', err);
    return NextResponse.json(
      { error: 'Failed to create room. Please try again.' },
      { status: 500 }
    );
  }
}
