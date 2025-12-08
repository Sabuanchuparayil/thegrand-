import { NextRequest, NextResponse } from "next/server";
import { fetchAndCachePrices, isApiKeyMissingError } from "@/lib/gold-price/scheduled-fetcher";
import { updateAllProductPrices } from "@/lib/gold-price/product-price-updater";
import { logPriceUpdate } from "@/lib/gold-price/monitoring";

export const dynamic = "force-dynamic";

/**
 * POST /api/gold-price/scheduled
 * Scheduled endpoint for fetching and caching gold prices
 * Should be called by a cron job (daily or twice daily)
 * 
 * Requires authentication via CRON_SECRET environment variable
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication - allow either CRON_SECRET or admin session
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    // Check for CRON_SECRET authentication (for scheduled jobs)
    if (cronSecret) {
      if (authHeader && authHeader === `Bearer ${cronSecret}`) {
        // Authenticated via CRON_SECRET, proceed
      } else {
        // If CRON_SECRET is set but not provided, check for admin session
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
            { error: "Unauthorized - Admin access required" },
            { status: 403 }
          );
        }
        // Admin authenticated, proceed
      }
    }

    // Get currency from query params or body
    const searchParams = request.nextUrl.searchParams;
    const currency = searchParams.get("currency") || "GBP";
    const skipProductUpdate = searchParams.get("skipProducts") === "true";

    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] Starting scheduled price update...`);

    // Step 1: Fetch and cache metal prices (single API call)
    const prices = await fetchAndCachePrices(currency, "scheduled");

    // Step 2: Update all products with dynamic pricing using stored prices
    let productUpdateResult = null;
    if (!skipProductUpdate) {
      console.log("Updating product prices...");
      productUpdateResult = await updateAllProductPrices();
    }

    const duration = Date.now() - startTime;

    // Log the update
    await logPriceUpdate({
      timestamp: new Date().toISOString(),
      success: true,
      goldPrice: prices.gold.price,
      platinumPrice: prices.platinum.price,
      currency: prices.currency,
      productsUpdated: productUpdateResult?.updatedProducts,
      productsTotal: productUpdateResult?.totalProducts,
      errors: productUpdateResult?.errors.map((e) => `${e.productId}: ${e.error}`),
      duration,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Prices fetched and products updated successfully",
        timestamp: new Date().toISOString(),
        prices: {
          gold: {
            price: prices.gold.price,
            currency: prices.currency,
            timestamp: new Date(prices.gold.timestamp).toISOString(),
          },
          platinum: {
            price: prices.platinum.price,
            currency: prices.currency,
            timestamp: new Date(prices.platinum.timestamp).toISOString(),
          },
        },
        productUpdates: productUpdateResult
          ? {
              totalProducts: productUpdateResult.totalProducts,
              updatedProducts: productUpdateResult.updatedProducts,
              skippedProducts: productUpdateResult.skippedProducts,
              errors: productUpdateResult.errors.length,
            }
          : null,
        duration: `${(duration / 1000).toFixed(2)}s`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in scheduled price fetch:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    // Use the type guard instead of unsafe casting
    const isApiKeyMissing = isApiKeyMissingError(error);

    // Log the error
    await logPriceUpdate({
      timestamp: new Date().toISOString(),
      success: false,
      errors: [errorMessage],
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch and cache prices",
        message: errorMessage,
        ...(isApiKeyMissing && {
          help: "To fix this issue, set the METALS_API_KEY environment variable in Railway. Go to Railway Dashboard > Your Project > Variables, and add METALS_API_KEY with your Metals.Dev API key. Get your API key at https://metals.dev/",
        }),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/gold-price/scheduled
 * Health check endpoint (can be used to manually trigger update)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret) {
      if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    const searchParams = request.nextUrl.searchParams;
    const currency = searchParams.get("currency") || "GBP";
    const action = searchParams.get("action");

    if (action === "update") {
      // Manually trigger update
      const prices = await fetchAndCachePrices(currency, "manual");
      const productUpdateResult = await updateAllProductPrices();
      
      return NextResponse.json(
        {
          success: true,
          message: "Prices and products updated successfully",
          prices: {
            gold: {
              price: prices.gold.price,
              currency: prices.currency,
              timestamp: new Date(prices.gold.timestamp).toISOString(),
            },
            platinum: {
              price: prices.platinum.price,
              currency: prices.currency,
              timestamp: new Date(prices.platinum.timestamp).toISOString(),
            },
          },
          productUpdates: {
            totalProducts: productUpdateResult.totalProducts,
            updatedProducts: productUpdateResult.updatedProducts,
            skippedProducts: productUpdateResult.skippedProducts,
            errors: productUpdateResult.errors.length,
          },
        },
        { status: 200 }
      );
    }

    // Return status
    return NextResponse.json(
      {
        success: true,
        message: "Scheduled price fetcher is active",
        endpoint: "/api/gold-price/scheduled",
        usage: "Call with ?action=update to manually update prices",
        authentication: cronSecret ? "Required (Bearer token)" : "Not configured",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in scheduled price endpoint:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

