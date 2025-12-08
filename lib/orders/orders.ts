// Order management utilities

import { client } from "@/lib/sanity/client";
import { sendOrderConfirmationWhatsApp, sendOrderStatusUpdateWhatsApp } from "@/lib/whatsapp/whatsapp";
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from "@/lib/email/email";

export interface Order {
  _id: string;
  orderNumber: string;
  user?: any;
  items: any[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: any;
  billingAddress: any;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  status?: string; // Alias for orderStatus for backward compatibility
  trackingNumber?: string;
  shippingCarrier?: string;
  createdAt: string;
  _createdAt?: string; // Sanity timestamp
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const order = await client.fetch(
      `*[_type == "order" && _id == $orderId][0]`,
      { orderId }
    );
    if (!order) return null;
    // Map Sanity document to Order interface
    return {
      _id: order._id || "",
      orderNumber: order.orderNumber || "",
      user: order.user,
      items: order.items || [],
      subtotal: order.subtotal || 0,
      shippingCost: order.shippingCost || 0,
      tax: order.tax || 0,
      total: order.total || 0,
      currency: order.currency || "GBP",
      shippingAddress: order.shippingAddress || {},
      billingAddress: order.billingAddress || {},
      paymentMethod: order.paymentMethod || "",
      paymentStatus: order.paymentStatus || "pending",
      orderStatus: order.orderStatus || "pending",
      status: order.orderStatus || order.status || "pending",
      trackingNumber: order.trackingNumber,
      shippingCarrier: order.shippingCarrier,
      createdAt: order.createdAt || order._createdAt || new Date().toISOString(),
      _createdAt: order._createdAt,
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    const order = await client.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]`,
      { orderNumber }
    );
    if (!order) return null;
    // Map Sanity document to Order interface
    return {
      _id: order._id || "",
      orderNumber: order.orderNumber || "",
      user: order.user,
      items: order.items || [],
      subtotal: order.subtotal || 0,
      shippingCost: order.shippingCost || 0,
      tax: order.tax || 0,
      total: order.total || 0,
      currency: order.currency || "GBP",
      shippingAddress: order.shippingAddress || {},
      billingAddress: order.billingAddress || {},
      paymentMethod: order.paymentMethod || "",
      paymentStatus: order.paymentStatus || "pending",
      orderStatus: order.orderStatus || "pending",
      status: order.orderStatus || order.status || "pending",
      trackingNumber: order.trackingNumber,
      shippingCarrier: order.shippingCarrier,
      createdAt: order.createdAt || order._createdAt || new Date().toISOString(),
      _createdAt: order._createdAt,
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

/**
 * Get orders for a user
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const orders = await client.fetch(
      `*[_type == "order" && user._ref == $userId] | order(_createdAt desc)`,
      { userId }
    );
    if (!orders || !Array.isArray(orders)) return [];
    // Map Sanity documents to Order interface
    return orders.map((order: any) => ({
      _id: order._id || "",
      orderNumber: order.orderNumber || "",
      user: order.user,
      items: order.items || [],
      subtotal: order.subtotal || 0,
      shippingCost: order.shippingCost || 0,
      tax: order.tax || 0,
      total: order.total || 0,
      currency: order.currency || "GBP",
      shippingAddress: order.shippingAddress || {},
      billingAddress: order.billingAddress || {},
      paymentMethod: order.paymentMethod || "",
      paymentStatus: order.paymentStatus || "pending",
      orderStatus: order.orderStatus || "pending",
      status: order.orderStatus || order.status || "pending",
      trackingNumber: order.trackingNumber,
      shippingCarrier: order.shippingCarrier,
      createdAt: order.createdAt || order._createdAt || new Date().toISOString(),
      _createdAt: order._createdAt,
    }));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string,
  shippingCarrier?: string
): Promise<Order | null> {
  try {
    const updates: any = { orderStatus: status };
    
    if (trackingNumber) {
      updates.trackingNumber = trackingNumber;
    }
    
    if (shippingCarrier) {
      updates.shippingCarrier = shippingCarrier;
    }

    const updatedOrder = await client
      .patch(orderId)
      .set(updates)
      .commit();

    // Map to Order interface
    const order: Order = {
      _id: updatedOrder._id || "",
      orderNumber: updatedOrder.orderNumber || "",
      user: updatedOrder.user,
      items: updatedOrder.items || [],
      subtotal: updatedOrder.subtotal || 0,
      shippingCost: updatedOrder.shippingCost || 0,
      tax: updatedOrder.tax || 0,
      total: updatedOrder.total || 0,
      currency: updatedOrder.currency || "GBP",
      shippingAddress: updatedOrder.shippingAddress || {},
      billingAddress: updatedOrder.billingAddress || {},
      paymentMethod: updatedOrder.paymentMethod || "",
      paymentStatus: updatedOrder.paymentStatus || "pending",
      orderStatus: updatedOrder.orderStatus || status,
      status: updatedOrder.orderStatus || status,
      trackingNumber: updatedOrder.trackingNumber || trackingNumber,
      shippingCarrier: updatedOrder.shippingCarrier || shippingCarrier,
      createdAt: updatedOrder.createdAt || updatedOrder._createdAt || new Date().toISOString(),
      _createdAt: updatedOrder._createdAt,
    };

    // Send notifications
    if (order.shippingAddress?.phone) {
      await sendOrderStatusUpdateWhatsApp(
        order.shippingAddress.phone,
        order.orderNumber,
        status,
        trackingNumber
      );
    }
    
    // Send email notification if email available
    if (order.user?.email) {
      await sendOrderStatusUpdateEmail(
        order.user.email,
        order.orderNumber,
        status,
        trackingNumber
      );
    }

    return order;
  } catch (error) {
    console.error("Error updating order status:", error);
    return null;
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: string
): Promise<Order | null> {
  try {
    const updatedOrder = await client
      .patch(orderId)
      .set({ paymentStatus })
      .commit();

    // Map to Order interface
    const order: Order = {
      _id: updatedOrder._id || "",
      orderNumber: updatedOrder.orderNumber || "",
      user: updatedOrder.user,
      items: updatedOrder.items || [],
      subtotal: updatedOrder.subtotal || 0,
      shippingCost: updatedOrder.shippingCost || 0,
      tax: updatedOrder.tax || 0,
      total: updatedOrder.total || 0,
      currency: updatedOrder.currency || "GBP",
      shippingAddress: updatedOrder.shippingAddress || {},
      billingAddress: updatedOrder.billingAddress || {},
      paymentMethod: updatedOrder.paymentMethod || "",
      paymentStatus: updatedOrder.paymentStatus || paymentStatus,
      orderStatus: updatedOrder.orderStatus || "pending",
      status: updatedOrder.orderStatus || "pending",
      trackingNumber: updatedOrder.trackingNumber,
      shippingCarrier: updatedOrder.shippingCarrier,
      createdAt: updatedOrder.createdAt || updatedOrder._createdAt || new Date().toISOString(),
      _createdAt: updatedOrder._createdAt,
    };

    // If payment successful, send confirmations
    if (paymentStatus === "paid") {
      if (order.shippingAddress?.phone) {
        await sendOrderConfirmationWhatsApp(
          order.shippingAddress.phone,
          order.orderNumber,
          order.total
        );
      }
      
      if (order.user?.email) {
        await sendOrderConfirmationEmail(
          order.user.email,
          order.orderNumber,
          order.total,
          order.items
        );
      }
    }

    return order;
  } catch (error) {
    console.error("Error updating payment status:", error);
    return null;
  }
}

/**
 * Get all orders (for admin)
 */
export async function getAllOrders(limit: number = 50): Promise<Order[]> {
  try {
    const orders = await client.fetch(
      `*[_type == "order"] | order(_createdAt desc) [0...$limit]`,
      { limit }
    );
    if (!orders || !Array.isArray(orders)) return [];
    // Map Sanity documents to Order interface
    return orders.map((order: any) => ({
      _id: order._id || "",
      orderNumber: order.orderNumber || "",
      user: order.user,
      items: order.items || [],
      subtotal: order.subtotal || 0,
      shippingCost: order.shippingCost || 0,
      tax: order.tax || 0,
      total: order.total || 0,
      currency: order.currency || "GBP",
      shippingAddress: order.shippingAddress || {},
      billingAddress: order.billingAddress || {},
      paymentMethod: order.paymentMethod || "",
      paymentStatus: order.paymentStatus || "pending",
      orderStatus: order.orderStatus || "pending",
      status: order.orderStatus || order.status || "pending",
      trackingNumber: order.trackingNumber,
      shippingCarrier: order.shippingCarrier,
      createdAt: order.createdAt || order._createdAt || new Date().toISOString(),
      _createdAt: order._createdAt,
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

