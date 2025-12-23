import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { client } from "@/lib/sanity/client";

// GET - Fetch all categories
export async function GET(request: NextRequest) {
  try {
    const categories = await client.fetch(`*[_type == "category"] | order(sortOrder asc, name asc) {
      _id,
      name,
      "slug": slug.current,
      description,
      icon,
      isActive,
      sortOrder
    }`);

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create new category
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
    const { name, description, icon, isActive, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const categoryData: any = {
      _type: "category",
      name,
      slug: {
        _type: "slug",
        current: slug,
      },
      description: description || "",
      icon: icon || "",
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0,
    };

    const category = await client.create(categoryData);

    return NextResponse.json(
      {
        success: true,
        category: {
          _id: category._id,
          name: category.name,
          slug: category.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      {
        error: "Failed to create category",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

