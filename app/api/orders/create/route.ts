import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { client } from "@/lib/sanity/client";
import Stripe from "stripe";
import { sendOrderConfirmationWhatsApp } from "@/lib/whatsapp/whatsapp";
import { sendOrderConfirmationEmail } from "@/lib/email/email";

// Initialize Stripe only if API key is available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-11-17.clover" as any, // Use latest API version
    })
  : null;

/**
 * Generate order number
 */
function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

/**
 * POST /api/orders/create
 * Create a new order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingStreet,
      shippingCity,
      shippingState,
      shippingPostalCode,
      shippingCountry,
      billingName,
      billingEmail,
      billingPhone,
      billingStreet,
      billingCity,
      billingState,
      billingPostalCode,
      billingCountry,
      billingSameAsShipping,
      paymentMethod,
      customerNotes,
      totals,
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Calculate totals if not provided
    const orderTotals = totals || {
      subtotal: items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
      shipping: 15,
      tax: 0,
      total: 0,
    };
    orderTotals.tax = orderTotals.subtotal * 0.20; // 20% VAT
    orderTotals.total = orderTotals.subtotal + orderTotals.shipping + orderTotals.tax;

    // Create order in Sanity
    const orderData = {
      _type: "order",
      orderNumber,
      items: items.map((item: any) => ({
        product: {
          _type: "reference",
          _ref: item.productId,
        },
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
      subtotal: orderTotals.subtotal,
      shippingCost: orderTotals.shipping,
      tax: orderTotals.tax,
      total: orderTotals.total,
      currency: "GBP",
      shippingAddress: {
        name: shippingName,
        email: shippingEmail,
        phone: shippingPhone,
        street: shippingStreet,
        city: shippingCity,
        state: shippingState,
        postalCode: shippingPostalCode,
        country: shippingCountry,
      },
      billingAddress: billingSameAsShipping
        ? {
            name: shippingName,
            phone: shippingPhone,
            street: shippingStreet,
            city: shippingCity,
            state: shippingState,
            postalCode: shippingPostalCode,
            country: shippingCountry,
          }
        : {
            name: billingName,
            phone: billingPhone,
            street: billingStreet,
            city: billingCity,
            state: billingState,
            postalCode: billingPostalCode,
            country: billingCountry,
          },
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      customerNotes,
    };

    // TODO: Get user from session
    // For now, create order without user reference
    const order = await client.create(orderData);

    // Create Stripe Payment Intent if using Stripe
    let paymentIntentId = null;
    if (paymentMethod === "stripe" && stripe) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(orderTotals.total * 100), // Convert to pence
          currency: "gbp",
          metadata: {
            orderId: order._id,
            orderNumber,
          },
        });

        paymentIntentId = paymentIntent.id;

        // Update order with payment intent ID
        await client
          .patch(order._id)
          .set({ paymentIntentId })
          .commit();
      } catch (error) {
        console.error("Stripe error:", error);
        // Continue without Stripe if it fails
      }
    }

    // Send order confirmation notifications
    try {
      // Get user email from session or shipping address
      const session = await getServerSession();
      const userEmail = session?.user?.email || shippingEmail;
      
      // Send email confirmation
      if (userEmail) {
        try {
          await sendOrderConfirmationEmail(
            userEmail,
            orderNumber,
            orderTotals.total,
            items.map((item: any) => ({
              productName: item.productName || "Product",
              quantity: item.quantity,
              price: item.price,
            }))
          );
        } catch (emailError) {
          console.error("Error sending email notification:", emailError);
        }
      }

      // Send WhatsApp confirmation
      if (shippingPhone) {
        try {
          await sendOrderConfirmationWhatsApp(
            shippingPhone,
            orderNumber,
            orderTotals.total
          );
        } catch (whatsappError) {
          console.error("Error sending WhatsApp notification:", whatsappError);
        }
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
      // Don't fail order creation if notifications fail
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order._id,
        orderNumber,
        paymentIntentId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

