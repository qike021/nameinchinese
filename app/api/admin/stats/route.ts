/**
 * GET /api/admin/stats
 *
 * Returns admin dashboard statistics via Supabase REST API (works even
 * when direct PG connection is unavailable — e.g. IPv6-only hosts).
 *
 * Protected — requires valid session cookie from Supabase auth.
 */
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
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

    // ── Query via Supabase Admin client (REST API, not direct PG) ──
    const adminClient = createAdminClient();

    // Total orders
    const { count: totalOrders, error: ordersError } = await adminClient
      .from("orders")
      .select("*", { count: "exact", head: true });

    if (ordersError) throw ordersError;

    // Recent 10 orders
    const { data: recentOrders, error: recentError } = await adminClient
      .from("orders")
      .select("id,tier,amount,currency,status,payment_method,created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (recentError) throw recentError;

    // Total tattoo reviews
    const { count: totalReviews, error: reviewsError } = await adminClient
      .from("tattoo_reviews")
      .select("*", { count: "exact", head: true });

    if (reviewsError) throw reviewsError;

    // ── Map snake_case DB columns → camelCase for frontend ──
    const mapped = (recentOrders || []).map((order: Record<string, unknown>) => ({
      id: order.id,
      tier: order.tier,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      paymentMethod: order.payment_method,
      createdAt: order.created_at,
    }));

    return NextResponse.json({
      totalOrders: totalOrders ?? 0,
      recentOrders: mapped,
      totalTattooReviews: totalReviews ?? 0,
    });
  } catch (error) {
    console.error("[API] Admin stats failed:", error);

    const message =
      error instanceof Error ? error.message : "Failed to fetch admin stats";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
