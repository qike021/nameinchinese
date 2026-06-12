/**
 * POST /api/name/unlock
 *
 * Paid tier endpoint — generates the full 5-name result for a user
 * who has completed payment. Verifies the order is paid, generates
 * names via the naming engine, persists the result, and returns it.
 */
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, generatedNames } from "@/db/schema";
import { generateNames } from "@/lib/naming/engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Validate required fields ──
    if (!body.order_id) {
      return NextResponse.json(
        { error: "order_id is required" },
        { status: 400 }
      );
    }

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

    // ── Verify the order is paid ──
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, body.order_id))
      .limit(1);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status !== "paid") {
      return NextResponse.json(
        { error: "Order is not paid. Status: " + order.status },
        { status: 402 }
      );
    }

    // ── Generate the full set of names ──
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

    // ── Persist to generated_names table ──
    const [record] = await db
      .insert(generatedNames)
      .values({
        orderId: body.order_id,
        englishName: body.english_name,
        inputProfile: {
          gender: body.gender,
          birth_date: body.birth_date || null,
          birth_time: body.birth_time || null,
          profession: body.profession || "other",
          personality: body.personality || [],
          preferred_style: body.preferred_style || "balanced",
          purpose: body.purpose || "study",
        },
        baziResult: baziResult,
        names: names,
      })
      .returning();

    // ── Return the full results ──
    return NextResponse.json({
      id: record.id,
      names: names,
      bazi: baziResult,
      total_names: names.length,
    });
  } catch (error) {
    console.error("[API] Name unlock failed:", error);

    const message =
      error instanceof Error ? error.message : "Failed to unlock names";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
