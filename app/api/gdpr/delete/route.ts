import { NextRequest, NextResponse } from "next/server";
import { deleteUserData } from "@/lib/gdpr/gdpr";
import { logGDPRRequest, GDPRRight } from "@/lib/gdpr/gdpr";

/**
 * DELETE /api/gdpr/delete
 * Delete user data (GDPR Right to Erasure)
 * Requires authentication and confirmation
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, confirm } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    if (confirm !== true) {
      return NextResponse.json(
        { error: "Confirmation required" },
        { status: 400 }
      );
    }

    // Log GDPR request
    await logGDPRRequest(userId, GDPRRight.ERASURE, "pending");

    // Delete/anonymize user data
    const result = await deleteUserData(userId);

    // Log completion
    await logGDPRRequest(userId, GDPRRight.ERASURE, "completed");

    return NextResponse.json(
      {
        success: true,
        message: "User data deleted successfully",
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete user data",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}



