/**
 * Simple in-memory rate limiter.
 *
 * Uses globalThis for Vercel serverless compatibility (shared across
 * warm invocations, reset on cold start). Not suitable for multi-region
 * production, but sufficient for MVP scale.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10; // per window per key

const globalForRateLimit = globalThis as unknown as {
  rateLimitStore: Map<string, RateLimitEntry> | undefined;
};

function getStore(): Map<string, RateLimitEntry> {
  if (!globalForRateLimit.rateLimitStore) {
    globalForRateLimit.rateLimitStore = new Map();
  }
  return globalForRateLimit.rateLimitStore;
}

/** Returns true if the request is allowed, false if rate-limited */
export function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const store = getStore();
  const now = Date.now();

  // Clean up expired entries periodically
  if (Math.random() < 0.1) {
    for (const [k, entry] of store) {
      if (now > entry.resetAt) store.delete(k);
    }
  }

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetIn: WINDOW_MS };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetIn: Math.ceil((entry.resetAt - now) / 1000),
  };
}
