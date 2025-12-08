// Scheduled price fetcher for daily price updates
// This utility fetches all metal prices in a single API call and stores them
// Called twice daily (8 AM and 5 PM British time) to minimize API calls

import { saveStoredPrices, loadStoredPrices, StoredMetalPrices } from "./price-storage";

/**
 * Fetch all metal prices in a single API call
 * This is the main function called by scheduled jobs
 */
async function fetchAllMetalPrices(currency: string = "GBP"): Promise<{
  gold: number;
  platinum: number;
}> {
  const apiKey = process.env.METALS_API_KEY;
  const baseUrl =
    process.env.METALS_API_BASE_URL || "https://api.metals.dev/v1";

  if (!apiKey) {
    const error = new Error("METALS_API_KEY not set. Please configure METALS_API_KEY in Railway environment variables.");
    (error as any).code = "API_KEY_MISSING";
    throw error;
  }

  // Single API call to fetch all metals
  const response = await fetch(
    `${baseUrl}/latest?api_key=${apiKey}&currency=${currency}&unit=g`,
    {
      next: { revalidate: 0 }, // Don't cache, we want fresh data
    }
  );

  if (!response.ok) {
    throw new Error(`Metals.Dev API error: ${response.statusText}`);
  }

  const data = await response.json();

  // Extract gold and platinum prices
  if (!data.metals || typeof data.metals.gold !== "number" || typeof data.metals.platinum !== "number") {
    throw new Error("Unexpected API response format - missing metal prices");
  }

  return {
    gold: data.metals.gold,
    platinum: data.metals.platinum,
  };
}

/**
 * Fetch and cache all metal prices in a single API call
 * This should be called by a scheduled job (cron) twice daily
 * @param currency Currency code (default: GBP)
 * @param source Source of the update (scheduled or manual)
 * @returns Stored metal prices
 */
export async function fetchAndCachePrices(
  currency: string = "GBP",
  source: "scheduled" | "manual" = "scheduled"
): Promise<StoredMetalPrices> {
  try {
    console.log(`[${new Date().toISOString()}] Fetching all metal prices from Metals.Dev...`);
    
    // Single API call to fetch all metals
    const prices = await fetchAllMetalPrices(currency);
    
    // Save to persistent storage
    await saveStoredPrices(
      prices.gold,
      prices.platinum,
      currency,
      source
    );
    
    const stored: StoredMetalPrices = {
      gold: {
        price: prices.gold,
        timestamp: Date.now(),
      },
      platinum: {
        price: prices.platinum,
        timestamp: Date.now(),
      },
      lastUpdated: new Date().toISOString(),
      currency,
      source,
    };
    
    console.log(`[${new Date().toISOString()}] Prices fetched and cached successfully:`, {
      gold: `${prices.gold} ${currency}/g`,
      platinum: `${prices.platinum} ${currency}/g`,
    });
    
    return stored;
  } catch (error) {
    console.error("Error fetching and caching prices:", error);
    
    // Try to return stored prices as fallback
    const stored = await loadStoredPrices();
    if (stored) {
      console.log("Using stored prices as fallback");
      return stored;
    }
    
    // Last resort: throw error
    throw error;
  }
}

/**
 * Get cached prices (for backward compatibility)
 */
export async function loadCachedPrices(): Promise<StoredMetalPrices | null> {
  return loadStoredPrices();
}

