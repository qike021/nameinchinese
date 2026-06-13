/**
 * Upstash Redis client — shared state across Vercel instances.
 *
 * Falls back gracefully if Redis is not configured:
 * - rate limiting degrades to in-memory
 * - caching is skipped
 *
 * Setup: Create a free Redis at https://upstash.com → copy REST URL + Token
 * Env vars: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */
import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;
let _checked = false;

function getClient(): Redis | null {
  if (_checked) return _redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    _redis = new Redis({ url, token });
    console.log("[Redis] Connected to Upstash");
  } else {
    console.warn("[Redis] Not configured — using in-memory fallback");
  }

  _checked = true;
  return _redis;
}

/** Check if Redis is available */
export function hasRedis(): boolean {
  return getClient() !== null;
}

/** Get a cached value (JSON) */
export async function redisGet<T>(key: string): Promise<T | null> {
  const r = getClient();
  if (!r) return null;
  try {
    const val = await r.get<string>(key);
    return val ? (JSON.parse(val) as T) : null;
  } catch {
    return null;
  }
}

/** Set a cached value with TTL (seconds) */
export async function redisSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const r = getClient();
  if (!r) return;
  try {
    await r.set(key, JSON.stringify(value), { ex: ttlSeconds });
  } catch {
    // Fail silently — cache is optional
  }
}

/** Increment a counter, returns the new value. Used for rate limiting. */
export async function redisIncr(key: string, ttlSeconds: number): Promise<number | null> {
  const r = getClient();
  if (!r) return null;
  try {
    const count = await r.incr(key);
    if (count === 1) {
      await r.expire(key, ttlSeconds);
    }
    return count;
  } catch {
    return null;
  }
}
