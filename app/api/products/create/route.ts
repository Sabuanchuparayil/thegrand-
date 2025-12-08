import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { client } from "@/lib/sanity/client";

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
    const {
      name,
      description,
      price,
      category,
      material_type,
      gemstone_type, // Keep for backward compatibility
      stones,
      gold_weight,
      cultural_tags,
      featured,
      pricing_model,
    } = body;

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const productData: any = {
      _type: "product",
      name,
      slug: {
        _type: "slug",
        current: slug,
      },
      description,
      price: parseFloat(price),
      category,
      material_type: material_type || undefined,
      gold_weight: gold_weight ? parseFloat(gold_weight) : undefined,
      cultural_tags: cultural_tags || [],
      featured: featured || false,
      pricing_model: pricing_model || "fixed",
    };

    // Handle stones array (preferred) or legacy gemstone_type
    if (stones && Array.isArray(stones) && stones.length > 0) {
      productData.stones = stones.filter((stone: any) => stone && stone.type);
    } else if (gemstone_type && gemstone_type !== "None") {
      // Backward compatibility: convert single gemstone_type to stones array
      productData.gemstone_type = gemstone_type;
    }

    const product = await client.create(productData);

    return NextResponse.json(
      {
        success: true,
        product: {
          _id: product._id,
          name: product.name,
          slug: product.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        error: "Failed to create product",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

