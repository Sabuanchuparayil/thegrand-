import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-11-17.clover",
    })
  : null;

/**
 * GET /api/orders/[orderId]/payment-secret
 * Get payment intent client secret for an order
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    
    // Fetch order from Sanity
    const order = await client.fetch(
      `*[_type == "order" && _id == $orderId][0]`,
      { orderId }
    );

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const paymentIntentId = order.paymentIntentId;
    
    if (!paymentIntentId || !stripe) {
      return NextResponse.json(
        { error: "Payment intent not found or Stripe not configured" },
        { status: 400 }
      );
    }

    // Retrieve payment intent from Stripe to get client secret
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json(
      {
        success: true,
        clientSecret: paymentIntent.client_secret,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching payment secret:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

