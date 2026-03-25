import Redis from "ioredis";
import { env } from "../config/env.js";

type CacheValue = unknown;

class CacheService {
  private memory = new Map<string, CacheValue>();
  private redis?: Redis;

  constructor() {
    try {
      this.redis = new Redis(env.REDIS_URL, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
      });
      void this.redis.connect().catch(() => {
        this.redis = undefined;
      });
    } catch {
      this.redis = undefined;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.redis) {
      const raw = await this.redis.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    }

    return (this.memory.get(key) as T) ?? null;
  }

  async set(key: string, value: CacheValue, ttlSeconds = 60) {
    if (this.redis) {
      await this.redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
      return;
    }

    this.memory.set(key, value);
    setTimeout(() => this.memory.delete(key), ttlSeconds * 1000).unref();
  }

  async del(key: string) {
    if (this.redis) {
      await this.redis.del(key);
      return;
    }

    this.memory.delete(key);
  }
}

export const cache = new CacheService();
