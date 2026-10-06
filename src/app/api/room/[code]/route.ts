import { NextRequest, NextResponse } from 'next/server';
import { getRoom, saveRoom, sanitizeRoomForPlayer } from '@/lib/room';

interface RouteContext {
  params: { code: string };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const code = params.code?.toUpperCase();
    if (!code) {
      return NextResponse.json({ error: 'Missing room code' }, { status: 400 });
    }

    const room = await getRoom(code);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const playerId = searchParams.get('playerId');

    if (playerId) {
      const player = room.players.find((p) => p.id === playerId);
      if (player) {
        player.lastSeen = Date.now();
        // Update presence in background
        await saveRoom(room);
      }
    }

    const sanitized = sanitizeRoomForPlayer(room, playerId);

    return NextResponse.json({
      room: sanitized.room,
      myPlayer: sanitized.myPlayer,
    });
  } catch (err: any) {
    console.error('Error fetching room:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve room details' },
      { status: 500 }
    );
  }
}
