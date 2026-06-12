/**
 * GET /api/admin/stats
 *
 * Returns admin dashboard statistics:
 * - Total orders count
 * - Recent 10 orders
 * - Total tattoo reviews count
 *
 * Protected — requires valid session cookie from Supabase auth.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, tattooReviews } from "@/db/schema";
import { count, desc } from "drizzle-orm";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(_request: NextRequest) {
  try {
    // ── Auth check ──
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized — authentication required" },
        { status: 401 }
      );
    }

    // ── Total orders count ──
    const [ordersCountResult] = await db
      .select({ count: count() })
      .from(orders);

    // ── Recent 10 orders ──
    const recentOrders = await db
      .select({
        id: orders.id,
        tier: orders.tier,
        amount: orders.amount,
        currency: orders.currency,
        status: orders.status,
        paymentMethod: orders.paymentMethod,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(10);

    // ── Total tattoo reviews count ──
    const [reviewsCountResult] = await db
      .select({ count: count() })
      .from(tattooReviews);

    // ── Build response ──
    return NextResponse.json({
      totalOrders: Number(ordersCountResult?.count ?? 0),
      recentOrders,
      totalTattooReviews: Number(reviewsCountResult?.count ?? 0),
    });
  } catch (error) {
    console.error("[API] Admin stats failed:", error);

    const message =
      error instanceof Error ? error.message : "Failed to fetch admin stats";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
