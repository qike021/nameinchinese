/**
 * POST /api/bazi/calculate
 *
 * Internal proxy to the cnlunar Python microservice.
 * Protected by rate limiting (3 req/min per IP) since the Python
 * microservice has limited capacity on free-tier hosting.
 */
import { NextRequest, NextResponse } from "next/server";
import { calculateBazi } from "@/lib/bazi/client";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // ── Rate limiting (stricter: 3/min, Bazi is heavy) ──
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const { allowed, remaining, resetIn } = checkRateLimit(`bazi:${ip}`);

    if (!allowed) {
      return NextResponse.json(
        {
          error: `Too many Bazi requests. Please wait ${resetIn} seconds.`,
          retry_after: resetIn,
        },
        {
          status: 429,
          headers: { "Retry-After": String(resetIn) },
        }
      );
    }

    const body = await request.json();

    // Validate required fields
    const required = ["birth_date", "birth_time", "latitude", "longitude"];
    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Basic type validation
    if (
      typeof body.latitude !== "number" ||
      typeof body.longitude !== "number" ||
      body.latitude < -90 || body.latitude > 90 ||
      body.longitude < -180 || body.longitude > 180
    ) {
      return NextResponse.json(
        { error: "latitude/longitude must be valid decimal coordinates" },
        { status: 400 }
      );
    }

    const result = await calculateBazi({
      birth_date: String(body.birth_date),
      birth_time: String(body.birth_time),
      latitude: body.latitude,
      longitude: body.longitude,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Bazi calculation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bazi calculation failed" },
      { status: 500 }
    );
  }
}
