// Email notification system for orders and marketing

import { Resend } from "resend";

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email using Resend
 */
export async function sendEmail(options: EmailOptions): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, email not sent");
    return {
      success: false,
      error: "Email service not configured",
    };
  }

  if (!resend) {
    console.warn("RESEND_API_KEY not set, email not sent");
    return {
      success: false,
      error: "Email service not configured",
    };
  }

  try {
    const result = await resend.emails.send({
      from: options.from || process.env.EMAIL_FROM || "THE GRAND <noreply@thegrand.com>",
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
    });

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  orderTotal: number,
  orderItems: any[]
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #D4AF37, #8B7355); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>THE GRAND</h1>
            <p>Order Confirmation</p>
          </div>
          <div class="content">
            <h2>Thank you for your order!</h2>
            <p>Your order <strong>#${orderNumber}</strong> has been confirmed.</p>
            
            <div class="order-details">
              <h3>Order Summary</h3>
              ${orderItems.map(item => `
                <p>${item.productName} × ${item.quantity} - £${(item.price * item.quantity).toFixed(2)}</p>
              `).join('')}
              <hr>
              <p><strong>Total: £${orderTotal.toFixed(2)}</strong></p>
            </div>
            
            <p>We'll send you updates on your order status. Thank you for shopping with THE GRAND!</p>
          </div>
          <div class="footer">
            <p>THE GRAND GOLD & DIAMONDS</p>
            <p>Luxury Jewelry House</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const result = await sendEmail({
    to: email,
    subject: `Order Confirmation - #${orderNumber}`,
    html,
  });

  return result.success;
}

/**
 * Send order status update email
 */
export async function sendOrderStatusUpdateEmail(
  email: string,
  orderNumber: string,
  status: string,
  trackingNumber?: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #D4AF37, #8B7355); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>THE GRAND</h1>
            <p>Order Update</p>
          </div>
          <div class="content">
            <h2>Order Status Update</h2>
            <p>Your order <strong>#${orderNumber}</strong> status has been updated to: <strong>${status.toUpperCase()}</strong></p>
            ${trackingNumber ? `<p>Tracking Number: <strong>${trackingNumber}</strong></p>` : ''}
            <p>Thank you for shopping with THE GRAND!</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const result = await sendEmail({
    to: email,
    subject: `Order Update - #${orderNumber}`,
    html,
  });

  return result.success;
}

/**
 * Send marketing email
 */
export async function sendMarketingEmail(
  email: string,
  subject: string,
  content: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #D4AF37, #8B7355); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>THE GRAND</h1>
          </div>
          <div class="content">
            ${content}
          </div>
        </div>
      </body>
    </html>
  `;

  const result = await sendEmail({
    to: email,
    subject,
    html,
  });

  return result.success;
}

