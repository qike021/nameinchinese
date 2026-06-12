/**
 * POST /api/bazi/calculate
 *
 * Internal proxy to the cnlunar Python microservice.
 * The microservice runs on Railway/Fly.io; this endpoint
 * allows the frontend to call Bazi via the Next.js backend.
 *
 * Note: This is a thin proxy — the heavy computation happens
 * in the Python service. This endpoint just forwards the request.
 */
import { NextRequest, NextResponse } from "next/server";
import { calculateBazi } from "@/lib/bazi/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = ["birth_date", "birth_time", "latitude", "longitude"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const result = await calculateBazi({
      birth_date: body.birth_date,
      birth_time: body.birth_time,
      latitude: body.latitude,
      longitude: body.longitude,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Bazi calculation failed:", error);

    const message =
      error instanceof Error ? error.message : "Bazi calculation failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
