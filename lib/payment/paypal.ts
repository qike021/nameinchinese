/**
 * PayPal REST API Client
 *
 * Handles order creation and capture for NameInChinese.
 * Uses PayPal's v2/checkout/orders API.
 *
 * API credentials (Client ID + Secret) are read from the database
 * platform_settings table, with .env.local as fallback.
 * Configure them in: Admin → Settings → API Configuration.
 */

import { getSetting } from "@/lib/config/settings";

/** Pricing tiers with USD amounts */
const TIER_PRICES: Record<string, { amount: number; name: string }> = {
  basic: { amount: 6.99, name: "Basic — 5 Chinese Names" },
  pro: { amount: 19.99, name: "Professional — 8 Names + Full Report" },
  premium: { amount: 44.99, name: "Premium — Complete Package" },
};

/**
 * Create a PayPal order for the given pricing tier.
 * Returns the order object (client redirects to approval URL).
 */
export async function createPayPalOrder(tier: string) {
  const price = TIER_PRICES[tier];
  if (!price) {
    throw new Error(
      `Invalid tier: ${tier}. Must be one of: ${Object.keys(TIER_PRICES).join(", ")}`
    );
  }

  const accessToken = await getAccessToken();
  const paypalApi = getPayPalApiUrl();

  const res = await fetch(`${paypalApi}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: price.amount.toFixed(2),
          },
          description: price.name,
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/en/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/en/pricing`,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`PayPal order creation failed: ${await res.text()}`);
  }

  return res.json();
}

/**
 * Capture a PayPal order after user approval.
 * Called by the webhook handler or return-page verification.
 */
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getAccessToken();
  const paypalApi = getPayPalApiUrl();

  const res = await fetch(
    `${paypalApi}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`PayPal capture failed: ${await res.text()}`);
  }

  return res.json();
}

/** Use sandbox for development, production for live */
function getPayPalApiUrl(): string {
  return process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

/** Get OAuth2 access token from PayPal (no caching — each call is stateless) */
async function getAccessToken(): Promise<string> {
  // 从数据库读取 PayPal 凭证，env 兜底
  const clientId =
    (await getSetting("paypal_client_id")) ||
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret =
    (await getSetting("paypal_secret")) || process.env.PAYPAL_SECRET;

  if (!clientId || !secret) {
    throw new Error(
      "PayPal credentials not configured. Go to Admin → Settings → API Configuration to set PayPal Client ID and Secret, or set them in .env.local."
    );
  }

  const paypalApi = getPayPalApiUrl();
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${paypalApi}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`PayPal auth failed: ${await res.text()}`);
  }

  const data = await res.json();
  return data.access_token;
}

export { TIER_PRICES };
