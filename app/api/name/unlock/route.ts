/**
 * POST /api/name/unlock
 *
 * Paid tier endpoint — generates the full 5-name result after payment.
 * Verifies: (1) user is authenticated, (2) order exists + is paid.
 * Persists via Supabase REST API.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateNames } from "@/lib/naming/engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Auth check ──
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // ── Validate + sanitize required fields ──
    if (!body.order_id) {
      return NextResponse.json({ error: "order_id is required" }, { status: 400 });
    }
    if (!body.english_name || !body.gender) {
      return NextResponse.json({ error: "english_name and gender are required" }, { status: 400 });
    }
    if (!["male", "female"].includes(body.gender)) {
      return NextResponse.json({ error: "gender must be 'male' or 'female'" }, { status: 400 });
    }

    // Sanitize name input
    const englishName = String(body.english_name).trim().slice(0, 100);

    // ── Verify the order is paid (via Supabase REST) ──
    const adminClient = createAdminClient();
    const { data: order, error: orderError } = await adminClient
      .from("orders")
      .select("id,status")
      .eq("id", body.order_id)
      .maybeSingle();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.status !== "paid" && order.status !== "completed") {
      return NextResponse.json(
        { error: `Order is not paid. Status: ${order.status}` },
        { status: 402 }
      );
    }

    // ── Idempotency: check if already generated ──
    const { data: existing } = await adminClient
      .from("generated_names")
      .select("id")
      .eq("order_id", body.order_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        id: existing.id,
        already_generated: true,
      });
    }

    // ── Generate the full set of names ──
    const { names, baziResult } = await generateNames({
      englishName,
      gender: body.gender,
      birthDate: body.birth_date,
      birthTime: body.birth_time,
      latitude: body.latitude,
      longitude: body.longitude,
      profession: String(body.profession || "other").slice(0, 50),
      personality: Array.isArray(body.personality) ? body.personality : [],
      preferredStyle: ["traditional", "balanced", "modern"].includes(body.preferred_style)
        ? body.preferred_style
        : "balanced",
      purpose: String(body.purpose || "study").slice(0, 50),
    });

    // ── Persist via Supabase REST ──
    const { data: record, error: insertError } = await adminClient
      .from("generated_names")
      .insert({
        order_id: body.order_id,
        user_id: user.id,
        english_name: englishName,
        input_profile: {
          gender: body.gender,
          birth_date: body.birth_date || null,
          birth_time: body.birth_time || null,
          profession: body.profession || "other",
          personality: body.personality || [],
          preferred_style: body.preferred_style || "balanced",
          purpose: body.purpose || "study",
        },
        bazi_result: baziResult,
        names,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      id: record.id,
      names,
      bazi: baziResult,
      total_names: names.length,
    });
  } catch (error) {
    console.error("[API] Name unlock failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to unlock names" },
      { status: 500 }
    );
  }
}
