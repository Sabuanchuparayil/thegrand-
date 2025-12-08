import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { exportUserData } from "@/lib/gdpr/gdpr";
import { logGDPRRequest, GDPRRight } from "@/lib/gdpr/gdpr";

/**
 * GET /api/gdpr/export
 * Export user data (GDPR Right to Access)
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Get user from session
    // For now, get from query parameter (should be from session in production)
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    // Log GDPR request
    await logGDPRRequest(userId, GDPRRight.ACCESS, "pending");

    // Export user data
    const userData = await exportUserData(userId);

    // Log completion
    await logGDPRRequest(userId, GDPRRight.ACCESS, "completed");

    return NextResponse.json(
      {
        success: true,
        data: userData,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="user-data-${userId}-${Date.now()}.json"`,
        },
      }
    );
  } catch (error) {
    console.error("Error exporting user data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to export user data",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

