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
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

/** Simple hash for caching — same input → same hash → cached result */
function inputHash(obj: Record<string, unknown>): string {
  return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex").slice(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    // ── Rate limiting (by IP) ──
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const { allowed, remaining, resetIn } = await checkRateLimit(`name-gen:${ip}`);

    if (!allowed) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${resetIn} seconds.`, retry_after: resetIn },
        { status: 429, headers: { "Retry-After": String(resetIn) } }
      );
    }

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

    // ── Cache check: same input → reuse result (1 hour TTL) ──
    const hash = inputHash(body);
    const adminClient = createAdminClient();
    const { data: cached } = await adminClient
      .from("generated_names")
      .select("names,bazi_result,created_at")
      .eq("input_hash", hash)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
    if (cached && cached.created_at) {
      const age = Date.now() - new Date(cached.created_at).getTime();
      if (age < CACHE_TTL_MS) {
        const freeNames = (Array.isArray(cached.names) ? cached.names.slice(0, 2) : []).map(
          (name: Record<string, unknown>, index: number) => ({ ...name, is_locked: index > 0 })
        );
        const baziResult = cached.bazi_result;
        return NextResponse.json({
          names: freeNames,
          bazi_summary: baziResult
            ? { missing_elements: (baziResult as Record<string, unknown>).missing_elements, hint: "Cached result" }
            : null,
          total_names: Array.isArray(cached.names) ? (cached.names as unknown[]).length : 5,
          locked_count: Math.max(0, (Array.isArray(cached.names) ? (cached.names as unknown[]).length : 2) - 1),
          cached: true,
        });
      }
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
