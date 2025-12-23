import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { client } from "@/lib/sanity/client";

// GET - Fetch all stones
export async function GET(request: NextRequest) {
  try {
    const stones = await client.fetch(`*[_type == "stone"] | order(sortOrder asc, name asc) {
      _id,
      name,
      "slug": slug.current,
      type,
      description,
      color,
      hardness,
      isActive,
      sortOrder
    }`);

    return NextResponse.json({ stones });
  } catch (error) {
    console.error("Error fetching stones:", error);
    return NextResponse.json(
      { error: "Failed to fetch stones" },
      { status: 500 }
    );
  }
}

// POST - Create new stone
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== "admin" && userRole !== "manager") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, type, description, color, hardness, isActive, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Stone name is required" },
        { status: 400 }
      );
    }

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const stoneData: any = {
      _type: "stone",
      name,
      slug: {
        _type: "slug",
        current: slug,
      },
      type: type || undefined,
      description: description || "",
      color: color || "",
      hardness: hardness ? parseFloat(hardness) : undefined,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0,
    };

    const stone = await client.create(stoneData);

    return NextResponse.json(
      {
        success: true,
        stone: {
          _id: stone._id,
          name: stone.name,
          slug: stone.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating stone:", error);
    return NextResponse.json(
      {
        error: "Failed to create stone",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

