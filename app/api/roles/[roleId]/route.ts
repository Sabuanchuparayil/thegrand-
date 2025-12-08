import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  try {
    const { roleId } = await params;
    
    // Try to find by slug first, then by _id
    const role = await client.fetch(
      `*[_type == "role" && (slug.current == $roleId || _id == $roleId)][0]`,
      { roleId }
    );

    if (!role) {
      return NextResponse.json(
        { error: "Role not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        role,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch role",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

