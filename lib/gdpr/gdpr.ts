// GDPR Compliance Utilities

import { client } from "@/lib/sanity/client";

/**
 * GDPR Data Subject Rights
 */
export enum GDPRRight {
  ACCESS = "access", // Right to access personal data
  RECTIFICATION = "rectification", // Right to rectification
  ERASURE = "erasure", // Right to erasure (deletion)
  RESTRICTION = "restriction", // Right to restriction of processing
  PORTABILITY = "portability", // Right to data portability
  OBJECTION = "objection", // Right to object to processing
}

/**
 * Export user data in GDPR-compliant format
 */
export async function exportUserData(userId: string): Promise<{
  user: any;
  orders: any[];
  addresses: any[];
  preferences: any;
  metadata: {
    exportDate: string;
    userId: string;
    format: "json";
  };
}> {
  try {
    // Fetch user data
    const user = await client.fetch(
      `*[_type == "user" && _id == $userId][0]`,
      { userId }
    );

    if (!user) {
      throw new Error("User not found");
    }

    // Fetch user orders
    const orders = await client.fetch(
      `*[_type == "order" && user._ref == $userId] | order(_createdAt desc)`,
      { userId }
    );

    // Extract addresses
    const addresses = user.addresses || [];

    // Extract preferences
    const preferences = user.preferences || {};

    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        whatsapp: user.whatsapp,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        createdAt: user._createdAt,
        lastLogin: user.lastLogin,
      },
      orders: orders.map((order: any) => ({
        orderNumber: order.orderNumber,
        items: order.items,
        total: order.total,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        createdAt: order._createdAt,
      })),
      addresses,
      preferences,
      metadata: {
        exportDate: new Date().toISOString(),
        userId: user._id,
        format: "json",
      },
    };
  } catch (error) {
    console.error("Error exporting user data:", error);
    throw error;
  }
}

/**
 * Delete user data (Right to Erasure)
 */
export async function deleteUserData(userId: string): Promise<{
  success: boolean;
  deleted: {
    user: boolean;
    orders: number;
    anonymized: boolean;
  };
}> {
  try {
    // Anonymize or delete user data
    // Note: We may need to keep some data for legal/compliance reasons (e.g., orders for tax records)
    // In that case, we anonymize instead of deleting

    // Fetch user orders
    const orders = await client.fetch(
      `*[_type == "order" && user._ref == $userId]`,
      { userId }
    );

    // Anonymize user data instead of deleting (for legal compliance)
    await client
      .patch(userId)
      .set({
        email: `deleted_${Date.now()}@deleted.local`,
        name: "Deleted User",
        phone: "",
        whatsapp: "",
        isActive: false,
        // Keep order references but anonymize personal data
      })
      .commit();

    // Anonymize order data
    for (const order of orders) {
      await client
        .patch(order._id)
        .set({
          "shippingAddress.name": "Deleted User",
          "shippingAddress.phone": "",
          "billingAddress.name": "Deleted User",
          "billingAddress.phone": "",
        })
        .commit();
    }

    return {
      success: true,
      deleted: {
        user: true,
        orders: orders.length,
        anonymized: true,
      },
    };
  } catch (error) {
    console.error("Error deleting user data:", error);
    throw error;
  }
}

/**
 * Update user data (Right to Rectification)
 */
export async function updateUserData(
  userId: string,
  updates: {
    name?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    addresses?: any[];
    preferences?: any;
  }
): Promise<boolean> {
  try {
    await client.patch(userId).set(updates).commit();
    return true;
  } catch (error) {
    console.error("Error updating user data:", error);
    return false;
  }
}

/**
 * Restrict user data processing
 */
export async function restrictUserDataProcessing(
  userId: string,
  restrictions: string[]
): Promise<boolean> {
  try {
    await client
      .patch(userId)
      .set({
        "preferences.dataProcessingRestrictions": restrictions,
        isActive: false, // Deactivate account if processing is restricted
      })
      .commit();
    return true;
  } catch (error) {
    console.error("Error restricting data processing:", error);
    return false;
  }
}

/**
 * Log GDPR request
 */
export async function logGDPRRequest(
  userId: string,
  right: GDPRRight,
  status: "pending" | "completed" | "rejected",
  details?: string
): Promise<void> {
  try {
    // In production, you would store this in a separate GDPR requests table
    console.log("GDPR Request:", {
      userId,
      right,
      status,
      details,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging GDPR request:", error);
  }
}

