/**
 * POST /api/name/generate
 *
 * Free tier endpoint — generates Chinese names for a user.
 * Returns 2 names: #1 unlocked (full details), #2 locked (teaser only).
 *
 * The full 5-name report requires payment via /api/name/unlock.
 */
import { NextRequest, NextResponse } from "next/server";
import { generateNames } from "@/lib/naming/engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Validate required fields ──
    if (!body.english_name || !body.gender) {
      return NextResponse.json(
        { error: "english_name and gender are required" },
        { status: 400 }
      );
    }

    if (!["male", "female"].includes(body.gender)) {
      return NextResponse.json(
        { error: "gender must be 'male' or 'female'" },
        { status: 400 }
      );
    }

    // ── Generate names ──
    const { names, baziResult } = await generateNames({
      englishName: body.english_name,
      gender: body.gender,
      birthDate: body.birth_date,
      birthTime: body.birth_time,
      latitude: body.latitude,
      longitude: body.longitude,
      profession: body.profession || "other",
      personality: body.personality || [],
      preferredStyle: body.preferred_style || "balanced",
      purpose: body.purpose || "study",
    });

    // ── Free tier: 2 names, only #1 fully visible ──
    const freeNames = names.slice(0, 2).map((name, index) => ({
      ...name,
      is_locked: index > 0,
    }));

    // ── Build response ──
    return NextResponse.json({
      names: freeNames,
      bazi_summary: baziResult
        ? {
            missing_elements: baziResult.missing_elements,
            hint: `Your name may benefit from characters with ${baziResult.missing_elements.join(" or ") || "balanced"} element energy.`,
          }
        : null,
      total_names: names.length,
      locked_count: names.length - 1,
    });
  } catch (error) {
    console.error("[API] Name generation failed:", error);

    const message =
      error instanceof Error ? error.message : "Failed to generate names";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
