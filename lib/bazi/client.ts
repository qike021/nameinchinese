/**
 * TypeScript client for the cnlunar Bazi microservice.
 *
 * The Python service is deployed separately (Railway/Fly.io free tier).
 * This client handles serialization, error handling, and type safety
 * for the cross-service HTTP call.
 */

/** Input parameters for Bazi calculation */
export interface BaziRequest {
  birth_date: string;
  birth_time: string;
  latitude: number;
  longitude: number;
}

/** Complete Bazi (八字) calculation result */
export interface BaziResult {
  year_pillar: string;
  month_pillar: string;
  day_pillar: string;
  hour_pillar: string;
  day_master: string;
  day_master_element: string;
  five_elements: Record<string, number>;
  missing_elements: string[];
}

/** Base URL of the cnlunar microservice */
const CNLUNAR_URL =
  process.env.CNLUNAR_SERVICE_URL || "http://localhost:8000";

/**
 * Calculate a full Bazi chart for the given birth information.
 *
 * @param data - Birth date, time, and geographic coordinates
 * @returns Complete Bazi result with pillars, elements, and day master
 * @throws Error if the microservice is unavailable or returns an error
 */
export async function calculateBazi(data: BaziRequest): Promise<BaziResult> {
  const res = await fetch(`${CNLUNAR_URL}/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    // Vercel serverless functions have a 10s timeout;
    // the microservice typically responds in < 200ms
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(
      `Bazi calculation failed (HTTP ${res.status}): ${errorBody}`
    );
  }

  return res.json();
}

/**
 * Health check — verifies the microservice is reachable.
 * @returns true if the service responds with ok status
 */
export async function baziHealthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${CNLUNAR_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    const body = await res.json();
    return body.status === "ok";
  } catch {
    return false;
  }
}
