import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Implement actual email sending or database storage
    // For now, we'll just log the inquiry
    console.log("New inquiry received:", {
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString(),
    });

    // In production, you would:
    // 1. Send an email using a service like SendGrid, Resend, or Nodemailer
    // 2. Store the inquiry in a database
    // 3. Send notifications to the team

    return NextResponse.json(
      { message: "Inquiry submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing inquiry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}




