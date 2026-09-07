import { redis } from './redis';

export async function trackGameEvent(event: string, meta?: Record<string, any>) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const key = `analytics:events:${today}:${event}`;
    await redis.incr(key);
    await redis.expire(key, 86400 * 90); // 90 days TTL as per design-decisions.md
  } catch (error) {
    console.error('Analytics event tracking error:', error);
  }
}

export async function trackDailyActiveUser(clientId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const key = `analytics:dau:${today}`;
    await redis.incr(key);
    await redis.expire(key, 86400 * 90);
  } catch (error) {
    console.error('DAU tracking error:', error);
  }
}
