import { NextRequest, NextResponse } from 'next/server';
import { getRoom, saveRoom, generatePlayerId, sanitizeRoomForPlayer } from '@/lib/room';
import { RoomPlayer } from '@/types/game';
import { trackGameEvent } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { code, playerName, playerId } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a valid 4-character room code.' },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();
    const room = await getRoom(normalizedCode);

    if (!room) {
      return NextResponse.json(
        { error: `Room "${normalizedCode}" not found. Please verify the code.` },
        { status: 404 }
      );
    }

    const trimmedName = (playerName || '').trim().slice(0, 18);
    let resolvedPlayerId = playerId || generatePlayerId();

    // Check if player already exists in the room
    const existingPlayerIndex = room.players.findIndex(
      (p) => p.id === resolvedPlayerId || (trimmedName && p.name.toLowerCase() === trimmedName.toLowerCase())
    );

    if (existingPlayerIndex >= 0) {
      // Reconnecting existing player
      const p = room.players[existingPlayerIndex];
      resolvedPlayerId = p.id;
      if (trimmedName) p.name = trimmedName;
      p.lastSeen = Date.now();
    } else {
      // New player joining
      if (room.status === 'playing') {
        return NextResponse.json(
          { error: 'Game already in progress in this room.' },
          { status: 400 }
        );
      }

      if (!trimmedName) {
        return NextResponse.json(
          { error: 'Please enter your name.' },
          { status: 400 }
        );
      }

      // Check max players limit (e.g. 20)
      if (room.players.length >= 20) {
        return NextResponse.json(
          { error: 'Room is full (max 20 players).' },
          { status: 400 }
        );
      }

      // Ensure unique display name
      let finalName = trimmedName;
      let count = 2;
      while (room.players.some((p) => p.name.toLowerCase() === finalName.toLowerCase())) {
        finalName = `${trimmedName} (${count})`;
        count++;
      }

      const newPlayer: RoomPlayer = {
        id: resolvedPlayerId,
        name: finalName,
        isHost: room.players.length === 0,
        isReady: false,
        isEliminated: false,
        lastSeen: Date.now(),
      };

      room.players.push(newPlayer);
      room.settings.players = room.players.map((p) => p.name);
    }

    await saveRoom(room);
    await trackGameEvent('room_player_joined', { code: room.code });

    const sanitized = sanitizeRoomForPlayer(room, resolvedPlayerId);

    return NextResponse.json({
      code: room.code,
      playerId: resolvedPlayerId,
      hostId: room.hostId,
      room: sanitized.room,
      myPlayer: sanitized.myPlayer,
    });
  } catch (err: any) {
    console.error('Error joining room:', err);
    return NextResponse.json(
      { error: 'Failed to join room. Please try again.' },
      { status: 500 }
    );
  }
}
