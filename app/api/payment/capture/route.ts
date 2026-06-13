/**
 * POST /api/payment/capture
 *
 * Captures a PayPal order after user approval (client-side flow).
 * Marks the order as paid in the database via Supabase REST API.
 *
 * This is triggered by the payment success page after PayPal redirects back.
 */
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { capturePayPalOrder } from "@/lib/payment/paypal";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.order_id) {
      return NextResponse.json(
        { error: "order_id is required" },
        { status: 400 }
      );
    }

    const orderId = body.order_id;

    // ── Idempotency: check if already captured ──
    const adminClient = createAdminClient();
    const { data: existing } = await adminClient
      .from("orders")
      .select("id,status")
      .eq("id", orderId)
      .maybeSingle();

    if (existing?.status === "paid" || existing?.status === "completed") {
      return NextResponse.json({
        order_id: existing.id,
        status: existing.status,
        already_captured: true,
      });
    }

    // ── Capture the PayPal order ──
    let captureResult;
    try {
      captureResult = await capturePayPalOrder(orderId);
    } catch (error) {
      console.error("[Capture] PayPal capture failed:", error);
      return NextResponse.json(
        { error: "Payment capture failed. The order may not be approved yet." },
        { status: 402 }
      );
    }

    // ── Determine tier from purchase unit description ──
    const purchaseUnit = captureResult.purchase_units?.[0];
    const amountCents = Math.round(
      parseFloat(purchaseUnit?.amount?.value || "0") * 100
    );
    const description = purchaseUnit?.description || "";

    const tier = description.includes("Premium")
      ? "premium"
      : description.includes("Professional")
      ? "pro"
      : "basic";

    const payerEmail = captureResult.payer?.email_address || "unknown";

    // ── Upsert the order record via Supabase REST ──
    const { data: order, error } = await adminClient
      .from("orders")
      .upsert({
        id: orderId,
        tier,
        amount: amountCents,
        currency: "usd",
        status: "paid",
        payment_method: "paypal",
        payment_id: captureResult.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      order_id: order.id,
      status: order.status,
      tier: order.tier,
      amount: order.amount,
      payer_email: payerEmail,
    });
  } catch (error) {
    console.error("[Capture] Handler error:", error);
    return NextResponse.json(
      { error: "Failed to capture payment." },
      { status: 500 }
    );
  }
}
