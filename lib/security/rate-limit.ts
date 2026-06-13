/**
 * In-memory rate limiter with async interface.
 *
 * Uses globalThis for Vercel serverless compatibility (shared across
 * warm invocations within a single instance).
 *
 * For production at scale, replace with Upstash Redis or similar
 * distributed counter to coordinate across multiple instances.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

// Per-endpoint overrides
const LIMITS: Record<string, number> = {
  "name-gen": 10,
  bazi: 3,
};

const globalForRateLimit = globalThis as unknown as {
  rateLimitStore: Map<string, RateLimitEntry> | undefined;
};

function getStore(): Map<string, RateLimitEntry> {
  if (!globalForRateLimit.rateLimitStore) {
    globalForRateLimit.rateLimitStore = new Map();
  }
  return globalForRateLimit.rateLimitStore;
}

export async function checkRateLimit(key: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetIn: number;
}> {
  const store = getStore();
  const now = Date.now();
  const [prefix] = key.split(":");
  const max = LIMITS[prefix] ?? MAX_REQUESTS;

  // Lazy cleanup (~10% of requests)
  if (Math.random() < 0.1) {
    for (const [k, entry] of store) {
      if (now > entry.resetAt) store.delete(k);
    }
  }

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: max - 1, resetIn: Math.ceil(WINDOW_MS / 1000) };
  }

  if (entry.count >= max) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: max - entry.count,
    resetIn: Math.ceil((entry.resetAt - now) / 1000),
  };
}
