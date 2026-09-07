import { NextRequest, NextResponse } from 'next/server';
import { trackGameEvent, trackDailyActiveUser } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, clientId, meta } = body;

    if (clientId) {
      await trackDailyActiveUser(clientId);
    }

    if (event) {
      await trackGameEvent(event, meta);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
  }
}
