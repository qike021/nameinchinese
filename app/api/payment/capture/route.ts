/**
 * POST /api/payment/capture
 *
 * Captures a PayPal order after user approval (client-side flow).
 * Marks the order as paid in the database and returns the order record.
 *
 * This is triggered by the payment success page after PayPal redirects back.
 * The webhook (server-to-server) also handles this, but the capture endpoint
 * provides immediate confirmation for the client.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/db/schema";
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

    // ── Capture the PayPal order ──
    let captureResult;
    try {
      captureResult = await capturePayPalOrder(body.order_id);
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

    // ── Insert or update the order record ──
    const [order] = await db
      .insert(orders)
      .values({
        id: body.order_id,
        tier,
        amount: amountCents,
        currency: "usd",
        status: "paid",
        paymentMethod: "paypal",
        paymentId: captureResult.id,
      })
      .onConflictDoUpdate({
        target: orders.id,
        set: { status: "paid", paymentId: captureResult.id },
      })
      .returning();

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
