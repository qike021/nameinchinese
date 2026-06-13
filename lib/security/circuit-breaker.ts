/**
 * Simple circuit breaker for external API calls (DeepSeek, cnlunar).
 *
 * After N consecutive failures, the circuit opens and fast-fails
 * subsequent calls for a cooldown period. After cooldown, one
 * probe request is allowed through. If it succeeds, the circuit closes.
 *
 * Uses globalThis for cross-request state within a serverless instance.
 */

interface CircuitState {
  failures: number;
  lastFailureTime: number;
  open: boolean;
}

const THRESHOLD = 5; // consecutive failures to open circuit
const COOLDOWN_MS = 30_000; // 30 second cooldown before probing

const globalForBreakers = globalThis as unknown as {
  circuitBreakers: Map<string, CircuitState> | undefined;
};

function getStore(): Map<string, CircuitState> {
  if (!globalForBreakers.circuitBreakers) {
    globalForBreakers.circuitBreakers = new Map();
  }
  return globalForBreakers.circuitBreakers;
}

/**
 * Check if a circuit is closed (allowed to call).
 * If open, check if cooldown has passed for a probe.
 *
 * @param name - Circuit name (e.g. "deepseek", "cnlunar")
 * @returns true if the call is allowed, false if circuit is open
 */
export function circuitAllowed(name: string): boolean {
  const store = getStore();
  const state = store.get(name);

  if (!state || !state.open) return true;

  // Circuit is open — check cooldown
  const elapsed = Date.now() - state.lastFailureTime;
  if (elapsed > COOLDOWN_MS) {
    // Allow one probe request
    state.open = false;
    return true;
  }

  return false;
}

/** Record a successful call — closes the circuit */
export function circuitSuccess(name: string): void {
  const store = getStore();
  store.set(name, { failures: 0, lastFailureTime: 0, open: false });
}

/** Record a failed call — may open the circuit */
export function circuitFailure(name: string): void {
  const store = getStore();
  const state = store.get(name) || { failures: 0, lastFailureTime: 0, open: false };

  state.failures++;
  state.lastFailureTime = Date.now();

  if (state.failures >= THRESHOLD) {
    state.open = true;
  }

  store.set(name, state);
}

/** Get circuit status for monitoring */
export function circuitStatus(name: string): { open: boolean; failures: number } {
  const store = getStore();
  const state = store.get(name);
  return {
    open: state?.open ?? false,
    failures: state?.failures ?? 0,
  };
}
