import { NextRequest, NextResponse } from "next/server";
import {
  fetchGoldPrice,
  fetchGoldPriceByPurity,
  fetchPlatinumPrice,
  getMetalPrice,
} from "@/lib/gold-price/api";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour (for daily updates)

/**
 * GET /api/gold-price
 * Fetch current gold price
 * Query parameters:
 * - purity: (optional) Gold purity (18k, 22k, 24k)
 * - material: (optional) Material type (e.g., "22k Gold", "Platinum")
 * - currency: (optional) Currency code (default: GBP)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const purity = searchParams.get("purity");
    const material = searchParams.get("material");
    const currency = searchParams.get("currency") || "GBP";

    let price: number;
    let priceType: string;

    if (material) {
      // Fetch price for specific material type
      price = await getMetalPrice(material, currency);
      priceType = material;
    } else if (purity) {
      // Fetch price for specific purity
      price = await fetchGoldPriceByPurity(purity, currency);
      priceType = `${purity} Gold`;
    } else {
      // Fetch base 24k gold price
      price = await fetchGoldPrice(currency);
      priceType = "24k Gold";
    }

    return NextResponse.json(
      {
        success: true,
        price,
        priceType,
        currency,
        timestamp: new Date().toISOString(),
        unit: "gram",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in gold-price API route:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch gold price",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

