import { redis } from './redis';

export function normalizeTopicToSlug(topic: string): string {
  return topic
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/-+/g, '-') // collapse consecutive hyphens
    .slice(0, 60); // limit length
}

// Configurable via env variables as per design-decisions.md
const PER_IP_RPM = parseInt(process.env.RATE_LIMIT_PER_IP_RPM || '2', 10);
const GLOBAL_RPM = parseInt(process.env.RATE_LIMIT_GLOBAL_RPM || '5', 10);
const GLOBAL_RPD = parseInt(process.env.RATE_LIMIT_GLOBAL_RPD || '900', 10);

export interface RateLimitResult {
  success: boolean;
  reason?: 'IP_RPM_EXCEEDED' | 'GLOBAL_RPM_EXCEEDED' | 'GLOBAL_RPD_EXCEEDED';
  message?: string;
}

export async function checkRateLimits(ip: string): Promise<RateLimitResult> {
  const now = new Date();
  const minuteKey = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}-${now.getUTCMinutes()}`;
  const dayKey = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;

  const ipKey = `rl:ip:${ip}:${minuteKey}`;
  const globalMinKey = `rl:global:rpm:${minuteKey}`;
  const globalDayKey = `rl:global:rpd:${dayKey}`;

  try {
    // Check & increment IP RPM
    const currentIpRpm = await redis.incr(ipKey);
    if (currentIpRpm === 1) {
      await redis.expire(ipKey, 65);
    }
    if (currentIpRpm > PER_IP_RPM) {
      return {
        success: false,
        reason: 'IP_RPM_EXCEEDED',
        message: 'You are generating packs too quickly. Please wait a minute.',
      };
    }

    // Check & increment Global RPM
    const currentGlobalRpm = await redis.incr(globalMinKey);
    if (currentGlobalRpm === 1) {
      await redis.expire(globalMinKey, 65);
    }
    if (currentGlobalRpm > GLOBAL_RPM) {
      return {
        success: false,
        reason: 'GLOBAL_RPM_EXCEEDED',
        message: 'High server load for AI generation. Please wait a moment.',
      };
    }

    // Check & increment Global RPD
    const currentGlobalRpd = await redis.incr(globalDayKey);
    if (currentGlobalRpd === 1) {
      await redis.expire(globalDayKey, 86400 * 2);
    }
    if (currentGlobalRpd > GLOBAL_RPD) {
      return {
        success: false,
        reason: 'GLOBAL_RPD_EXCEEDED',
        message: 'Daily AI pack quota reached. Please use built-in packs or try again tomorrow.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // In case Redis encounters an issue, allow with caution or log
    return { success: true };
  }
}
