import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const roles = await client.fetch(
      `*[_type == "role" && isActive != false] | order(name asc)`
    );

    return NextResponse.json(
      {
        success: true,
        roles: roles || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch roles",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


