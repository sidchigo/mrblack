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

  async lpush(key: string, ...elements: any[]): Promise<number> {
    const item = this.store.get(key);
    let list: any[] = [];
    if (item && (!item.expiresAt || Date.now() <= item.expiresAt)) {
      try {
        list = JSON.parse(item.value);
        if (!Array.isArray(list)) list = [];
      } catch {
        list = [];
      }
    }
    const stringElements = elements.map((el) => (typeof el === 'string' ? el : JSON.stringify(el)));
    list.unshift(...stringElements);
    this.store.set(key, {
      value: JSON.stringify(list),
      expiresAt: item?.expiresAt,
    });
    return list.length;
  }

  async lrange<T = string>(key: string, start: number, stop: number): Promise<T[]> {
    const item = this.store.get(key);
    if (!item) return [];
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return [];
    }
    try {
      const list = JSON.parse(item.value);
      if (!Array.isArray(list)) return [];
      const end = stop < 0 ? list.length + stop + 1 : stop + 1;
      const sliced = list.slice(start, end);
      return sliced.map((val) => {
        try {
          return typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))
            ? JSON.parse(val)
            : val;
        } catch {
          return val;
        }
      }) as T[];
    } catch {
      return [];
    }
  }

  async lrem(key: string, count: number, element: any): Promise<number> {
    const item = this.store.get(key);
    if (!item) return 0;
    try {
      let list: any[] = JSON.parse(item.value);
      if (!Array.isArray(list)) return 0;
      const targetStr = typeof element === 'string' ? element : JSON.stringify(element);
      const prevLen = list.length;
      list = list.filter((el) => {
        const elStr = typeof el === 'string' ? el : JSON.stringify(el);
        return elStr !== targetStr;
      });
      this.store.set(key, { value: JSON.stringify(list), expiresAt: item.expiresAt });
      return prevLen - list.length;
    } catch {
      return 0;
    }
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
