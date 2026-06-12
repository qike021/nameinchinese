/**
 * POST /api/payment/create
 *
 * Creates a PayPal order and returns the approval URL.
 * The client redirects the user to PayPal for payment.
 */
import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/payment/paypal";

export async function POST(request: NextRequest) {
  try {
    const { tier } = await request.json();

    if (!tier || !["basic", "pro", "premium"].includes(tier)) {
      return NextResponse.json(
        { error: "Invalid tier. Must be: basic, pro, or premium." },
        { status: 400 }
      );
    }

    const order = await createPayPalOrder(tier);

    // Extract the approval URL for client redirect
    const approveLink = order.links?.find(
      (link: { rel: string; href: string }) => link.rel === "approve"
    );

    return NextResponse.json({
      orderId: order.id,
      approveUrl: approveLink?.href || null,
      status: order.status,
    });
  } catch (error) {
    console.error("[Payment] Order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create payment order." },
      { status: 500 }
    );
  }
}
