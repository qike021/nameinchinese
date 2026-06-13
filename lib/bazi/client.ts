/**
 * TypeScript client for the cnlunar Bazi microservice.
 *
 * The Python service is deployed separately (Railway/Fly.io free tier).
 * Service URL is read from database platform_settings table,
 * with CNLUNAR_SERVICE_URL env var as fallback.
 *
 * Configure in: Admin → Settings → API Configuration.
 */

import { getSetting } from "@/lib/config/settings";

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

/** 获取 cnlunar 微服务 URL（DB 优先，env 兜底，最终默认 localhost） */
async function getCnlunarUrl(): Promise<string> {
  const fromDb = await getSetting("cnlunar_service_url");
  if (fromDb) return fromDb;

  const fromEnv = process.env.CNLUNAR_SERVICE_URL;
  if (fromEnv) return fromEnv;

  return "http://localhost:8000";
}

/**
 * Calculate a full Bazi chart for the given birth information.
 *
 * @param data - Birth date, time, and geographic coordinates
 * @returns Complete Bazi result with pillars, elements, and day master
 * @throws Error if the microservice is unavailable or returns an error
 */
export async function calculateBazi(data: BaziRequest): Promise<BaziResult> {
  const cnlunarUrl = await getCnlunarUrl();

  const res = await fetch(`${cnlunarUrl}/calculate`, {
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
    const cnlunarUrl = await getCnlunarUrl();

    const res = await fetch(`${cnlunarUrl}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    const body = await res.json();
    return body.status === "ok";
  } catch {
    return false;
  }
}
