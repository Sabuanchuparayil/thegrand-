import { NextRequest, NextResponse } from "next/server";
import { fetchCollections } from "@/lib/sanity/data-fetcher";

/**
 * GET /api/collections
 * Fetch all collections for navigation
 */
export async function GET(request: NextRequest) {
  try {
    const collections = await fetchCollections();
    
    return NextResponse.json(
      {
        success: true,
        collections: collections.map((collection: any) => ({
          _id: collection._id,
          title: collection.title,
          slug: typeof collection.slug === 'string' 
            ? collection.slug 
            : (collection.slug?.current || collection.slug),
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      {
        success: false,
        collections: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

