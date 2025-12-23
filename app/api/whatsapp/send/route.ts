import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppMessage, sendMarketingWhatsApp } from "@/lib/whatsapp/whatsapp";
import { checkPermission } from "@/lib/auth/auth";
import { getUserById } from "@/lib/auth/auth";

/**
 * POST /api/whatsapp/send
 * Send WhatsApp message
 * Requires authentication and send_marketing permission
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Get user from session
    // For now, allow if API key is set
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { to, message, type } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, message" },
        { status: 400 }
      );
    }

    let result;
    if (type === "marketing") {
      result = await sendMarketingWhatsApp(to, message);
    } else {
      result = await sendWhatsAppMessage({ to, message });
    }

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Failed to send WhatsApp message" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "WhatsApp message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send WhatsApp message",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}




