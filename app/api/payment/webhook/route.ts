/**
 * POST /api/payment/webhook
 *
 * Receives PayPal webhook events.
 * On CHECKOUT.ORDER.APPROVED: records the paid order in the database.
 *
 * Note: PayPal sandbox webhooks need a public URL (use ngrok for local dev).
 */
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.event_type === "CHECKOUT.ORDER.APPROVED") {
      const resource = body.resource;
      const orderId = resource.id;
      const email = resource.payer?.email_address || "unknown";
      const purchaseUnit = resource.purchase_units?.[0];
      const amountCents = Math.round(
        parseFloat(purchaseUnit?.amount?.value || "0") * 100
      );
      const description = purchaseUnit?.description || "";

      // Determine tier from description
      const tier = description.includes("Premium")
        ? "premium"
        : description.includes("Professional")
        ? "pro"
        : "basic";

      // Record the order
      const supabase = createAdminClient();
      const { error } = await supabase.from("orders").insert({
        tier,
        amount: amountCents,
        currency: "usd",
        status: "paid",
        payment_method: "paypal",
        payment_id: orderId,
      });

      if (error) {
        console.error("[Webhook] Failed to insert order:", error);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Handler error:", error);
    // Always return 200 to PayPal to prevent retries
    return NextResponse.json({ received: true });
  }
}
