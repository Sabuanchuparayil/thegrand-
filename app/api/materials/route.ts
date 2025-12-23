import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { client } from "@/lib/sanity/client";

// GET - Fetch all materials
export async function GET(request: NextRequest) {
  try {
    const materials = await client.fetch(`*[_type == "material"] | order(sortOrder asc, name asc) {
      _id,
      name,
      "slug": slug.current,
      description,
      karat,
      isActive,
      sortOrder
    }`);

    return NextResponse.json({ materials });
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json(
      { error: "Failed to fetch materials" },
      { status: 500 }
    );
  }
}

// POST - Create new material
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
    const { name, description, karat, isActive, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Material name is required" },
        { status: 400 }
      );
    }

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const materialData: any = {
      _type: "material",
      name,
      slug: {
        _type: "slug",
        current: slug,
      },
      description: description || "",
      karat: karat ? parseInt(karat) : undefined,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0,
    };

    const material = await client.create(materialData);

    return NextResponse.json(
      {
        success: true,
        material: {
          _id: material._id,
          name: material.name,
          slug: material.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating material:", error);
    return NextResponse.json(
      {
        error: "Failed to create material",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

