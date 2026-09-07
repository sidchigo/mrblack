import { Redis } from '@upstash/redis';

// If UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, use real Redis.
// Otherwise, provide a reliable in-memory fallback store for local development.

class InMemoryRedis {
  private store: Map<string, { value: string; expiresAt?: number }> = new Map();

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    try {
      return JSON.parse(item.value) as T;
    } catch {
      return item.value as unknown as T;
    }
  }

  async set(key: string, value: any, options?: { ex?: number }): Promise<'OK'> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    const expiresAt = options?.ex ? Date.now() + options.ex * 1000 : undefined;
    this.store.set(key, { value: stringValue, expiresAt });
    return 'OK';
  }

  async incr(key: string): Promise<number> {
    const item = this.store.get(key);
    let val = 0;
    if (item && (!item.expiresAt || Date.now() <= item.expiresAt)) {
      val = parseInt(item.value, 10) || 0;
    }
    val += 1;
    this.store.set(key, {
      value: val.toString(),
      expiresAt: item?.expiresAt,
    });
    return val;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.store.get(key);
    if (!item) return 0;
    item.expiresAt = Date.now() + seconds * 1000;
    this.store.set(key, item);
    return 1;
  }
}

let redisClient: Redis | InMemoryRedis;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} else {
  // Global memory store across hot reloads in dev
  const globalWithRedis = global as typeof globalThis & {
    __mrblack_in_memory_redis?: InMemoryRedis;
  };
  if (!globalWithRedis.__mrblack_in_memory_redis) {
    globalWithRedis.__mrblack_in_memory_redis = new InMemoryRedis();
  }
  redisClient = globalWithRedis.__mrblack_in_memory_redis;
}

export const redis = redisClient;
