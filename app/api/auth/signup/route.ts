import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth/auth";
import bcrypt from "bcryptjs";

/**
 * POST /api/auth/signup
 * Create a new user account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, whatsapp, password } = body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { getUserByEmail } = await import("@/lib/auth/auth");
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser({
      email,
      name,
      phone,
      whatsapp,
      role: "customer",
    });

    // TODO: Store hashed password (you may need to add password field to user schema)
    // For now, we'll just create the user

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        userId: user._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        error: "Failed to create account",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}


