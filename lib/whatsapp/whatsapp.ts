// WhatsApp integration for marketing communications

export interface WhatsAppMessage {
  to: string; // Phone number with country code (e.g., +447123456789)
  message: string;
  template?: string; // Template name for WhatsApp Business API
}

export interface WhatsAppTemplate {
  name: string;
  language: string;
  components?: any[];
}

/**
 * Send WhatsApp message using WhatsApp Business API
 * Supports both direct messages and templates
 */
export async function sendWhatsAppMessage(
  message: WhatsAppMessage
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.WHATSAPP_API_KEY;
  const apiUrl = process.env.WHATSAPP_API_URL || "https://graph.facebook.com/v18.0";
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!apiKey || !phoneNumberId) {
    console.warn("WhatsApp API credentials not configured");
    return {
      success: false,
      error: "WhatsApp API not configured",
    };
  }

  try {
    // Format phone number (ensure it starts with country code)
    let phoneNumber = message.to.replace(/\s+/g, "");
    if (!phoneNumber.startsWith("+")) {
      phoneNumber = `+${phoneNumber}`;
    }

    // Send message via WhatsApp Business API
    const response = await fetch(
      `${apiUrl}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: message.template ? "template" : "text",
          ...(message.template
            ? {
                template: {
                  name: message.template,
                  language: { code: "en" },
                },
              }
            : {
                text: { body: message.message },
              }),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "WhatsApp API error");
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send order confirmation via WhatsApp
 */
export async function sendOrderConfirmationWhatsApp(
  phoneNumber: string,
  orderNumber: string,
  orderTotal: number
): Promise<boolean> {
  const message = `🎉 Order Confirmed!

Your order ${orderNumber} has been confirmed.

Total: £${orderTotal.toFixed(2)}

We'll send you updates on your order status. Thank you for shopping with THE GRAND!`;

  const result = await sendWhatsAppMessage({
    to: phoneNumber,
    message,
  });

  return result.success;
}

/**
 * Send order status update via WhatsApp
 */
export async function sendOrderStatusUpdateWhatsApp(
  phoneNumber: string,
  orderNumber: string,
  status: string,
  trackingNumber?: string
): Promise<boolean> {
  let message = `📦 Order Update

Order ${orderNumber} status: ${status.toUpperCase()}`;

  if (trackingNumber) {
    message += `\n\nTracking Number: ${trackingNumber}`;
  }

  message += `\n\nThank you for shopping with THE GRAND!`;

  const result = await sendWhatsAppMessage({
    to: phoneNumber,
    message,
  });

  return result.success;
}

/**
 * Send marketing message via WhatsApp
 */
export async function sendMarketingWhatsApp(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  const result = await sendWhatsAppMessage({
    to: phoneNumber,
    message,
  });

  return result.success;
}

/**
 * Send bulk marketing messages
 */
export async function sendBulkMarketingWhatsApp(
  phoneNumbers: string[],
  message: string
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  // Send messages with delay to avoid rate limits
  for (const phoneNumber of phoneNumbers) {
    const result = await sendMarketingWhatsApp(phoneNumber, message);
    if (result) {
      success++;
    } else {
      failed++;
    }

    // Delay between messages (WhatsApp rate limit: ~1000 messages/day)
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return { success, failed };
}


