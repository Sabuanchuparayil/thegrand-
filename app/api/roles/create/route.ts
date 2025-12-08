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
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Only admins can create roles" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, permissions, isActive } = body;

    if (!name || !permissions || !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: "Missing required fields: name and permissions" },
        { status: 400 }
      );
    }

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if role with same slug already exists
    const existing = await client.fetch(
      `*[_type == "role" && slug.current == $slug][0]`,
      { slug }
    );

    if (existing) {
      return NextResponse.json(
        { error: "A role with this name already exists" },
        { status: 400 }
      );
    }

    const roleData = {
      _type: "role",
      name,
      slug: {
        _type: "slug",
        current: slug,
      },
      description: description || "",
      permissions: permissions || [],
      isActive: isActive !== false,
    };

    const role = await client.create(roleData);

    return NextResponse.json(
      {
        success: true,
        role: {
          _id: role._id,
          name: role.name,
          slug: role.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      {
        error: "Failed to create role",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

