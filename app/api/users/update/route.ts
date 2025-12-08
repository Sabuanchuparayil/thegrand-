import { getServerSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, updateUser } from "@/lib/auth/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const user = await getUserByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const updated = await updateUser(user._id, body);
    
    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    // Remove sensitive data
    const { password, ...safeUser } = updated as any;
    
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

