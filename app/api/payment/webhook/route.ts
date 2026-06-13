/**
 * POST /api/payment/webhook
 *
 * Receives PayPal webhook events. Verifies a shared webhook secret
 * before processing (defense against forged webhook calls).
 *
 * PayPal production signature verification (PAYPAL-AUTH-ALGO header)
 * should be added when moving to production. This shared-secret approach
 * covers the MVP sandbox phase.
 */
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSetting } from "@/lib/config/settings";

/** Verify the webhook secret from headers or query param */
async function verifyWebhookSecret(request: NextRequest): Promise<boolean> {
  // Read shared secret from DB (env fallback)
  const expected = await getSetting("webhook_secret");
  if (!expected) {
    // No secret configured — allow but warn
    console.warn("[Webhook] No webhook_secret configured. Skipping verification.");
    return true;
  }

  // Check header first, then query param
  const header = request.headers.get("x-webhook-secret");
  if (header === expected) return true;

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("secret");
  if (query === expected) return true;

  return false;
}

export async function POST(request: NextRequest) {
  try {
    // ── Verify webhook secret ──
    const valid = await verifyWebhookSecret(request);
    if (!valid) {
      console.warn("[Webhook] Invalid webhook secret");
      return NextResponse.json({ received: true }); // Don't leak info
    }

    const body = await request.json();

    if (body.event_type === "CHECKOUT.ORDER.APPROVED") {
      const resource = body.resource;
      const orderId = resource.id;
      const purchaseUnit = resource.purchase_units?.[0];
      const amountCents = Math.round(
        parseFloat(purchaseUnit?.amount?.value || "0") * 100
      );
      const description = purchaseUnit?.description || "";

      const tier = description.includes("Premium")
        ? "premium"
        : description.includes("Professional")
        ? "pro"
        : "basic";

      // ── Upsert via Supabase Admin (REST API) ──
      const adminClient = createAdminClient();

      // Check if already recorded
      const { data: existing } = await adminClient
        .from("orders")
        .select("id,status")
        .eq("id", orderId)
        .maybeSingle();

      if (existing?.status === "paid" || existing?.status === "completed") {
        return NextResponse.json({ received: true, deduplicated: true });
      }

      const { error } = await adminClient.from("orders").upsert({
        id: orderId,
        tier,
        amount: amountCents,
        currency: "usd",
        status: "paid",
        payment_method: "paypal",
        payment_id: orderId,
      });

      if (error) {
        console.error("[Webhook] Failed to upsert order:", error);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Handler error:", error);
    // Always return 200 to PayPal to prevent retries
    return NextResponse.json({ received: true });
  }
}
