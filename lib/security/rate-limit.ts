/**
 * Rate limiter — Redis-backed when available, in-memory fallback.
 *
 * Redis mode coordinates across all Vercel instances.
 * In-memory mode works per-instance (fine for MVP scale).
 */
import { redisIncr, hasRedis } from "@/lib/redis/client";

const WINDOW_SEC = 60;
const LIMITS: Record<string, number> = {
  "name-gen": 10,
  bazi: 3,
};

// ── In-memory fallback ──

interface MemEntry { count: number; resetAt: number; }

const globalForRL = globalThis as unknown as {
  rlStore: Map<string, MemEntry> | undefined;
};

function memStore(): Map<string, MemEntry> {
  if (!globalForRL.rlStore) globalForRL.rlStore = new Map();
  return globalForRL.rlStore;
}

function memCheck(key: string, max: number): { allowed: boolean; remaining: number; resetIn: number } {
  const store = memStore();
  const now = Date.now();
  // lazy cleanup
  if (Math.random() < 0.05) {
    for (const [k, e] of store) if (now > e.resetAt) store.delete(k);
  }
  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_SEC * 1000 });
    return { allowed: true, remaining: max - 1, resetIn: WINDOW_SEC };
  }
  if (entry.count >= max) {
    return { allowed: false, remaining: 0, resetIn: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { allowed: true, remaining: max - entry.count, resetIn: Math.ceil((entry.resetAt - now) / 1000) };
}

// ── Public API ──

export async function checkRateLimit(key: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetIn: number;
}> {
  const [prefix] = key.split(":");
  const max = LIMITS[prefix] ?? 10;

  // Try Redis first
  if (hasRedis()) {
    const count = await redisIncr(`rl:${key}`, WINDOW_SEC);
    if (count !== null) {
      if (count > max) {
        return { allowed: false, remaining: 0, resetIn: WINDOW_SEC };
      }
      return { allowed: true, remaining: max - count, resetIn: WINDOW_SEC };
    }
  }

  // Fallback to in-memory
  return memCheck(key, max);
}
