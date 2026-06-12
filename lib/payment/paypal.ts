/**
 * PayPal REST API Client
 *
 * Handles order creation and capture for NameInChinese.
 * Uses PayPal's v2/checkout/orders API.
 *
 * Environment variables required:
 * - NEXT_PUBLIC_PAYPAL_CLIENT_ID — PayPal app client ID (public)
 * - PAYPAL_SECRET — PayPal app secret (server-only)
 *
 * Switch between sandbox and production:
 * - Sandbox: https://api-m.sandbox.paypal.com
 * - Production: https://api-m.paypal.com
 */

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!;

// Use sandbox for development, production for live
const PAYPAL_API =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

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

  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
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

  const res = await fetch(
    `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
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

/** Get OAuth2 access token from PayPal */
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
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
