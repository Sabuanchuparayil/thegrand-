// Scheduled price fetcher for daily price updates
// This utility fetches all metal prices in a single API call and stores them
// Called twice daily (8 AM and 5 PM British time) to minimize API calls

import { saveStoredPrices, loadStoredPrices, StoredMetalPrices } from "./price-storage";

/**
 * Custom error class for API key missing errors
 */
export class ApiKeyMissingError extends Error {
  code = "API_KEY_MISSING" as const;
  
  constructor(message: string) {
    super(message);
    this.name = "ApiKeyMissingError";
  }
}

/**
 * Type guard to check if an error is an ApiKeyMissingError
 */
function isApiKeyMissingError(error: unknown): error is ApiKeyMissingError {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as { code?: string }).code === "API_KEY_MISSING"
  );
}

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
    throw new ApiKeyMissingError(
      "METALS_API_KEY not set. Please configure METALS_API_KEY in Railway environment variables."
    );
  }

  // Single API call to fetch all metals
  // Try both query parameter and header authentication methods
  const url = `${baseUrl}/latest?currency=${currency}&unit=g`;
  
  // Try with API key in header first (preferred method)
  let response = await fetch(url, {
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 0 }, // Don't cache, we want fresh data
  });

  // If header method fails with 401, try query parameter method
  if (!response.ok && response.status === 401) {
    console.log("Header authentication failed, trying query parameter method...");
    response = await fetch(
      `${baseUrl}/latest?api_key=${apiKey}&currency=${currency}&unit=g`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 0 },
      }
    );
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Metals.Dev API error: ${response.statusText}`;
    
    // Provide more specific error messages
    if (response.status === 401) {
      errorMessage = `Metals.Dev API error: Unauthorized. Please verify that METALS_API_KEY is correctly set in Railway environment variables and is a valid API key from https://metals.dev/. The API key should be visible in your Metals.Dev dashboard.`;
    } else if (response.status === 403) {
      errorMessage = `Metals.Dev API error: Forbidden. Your API key may not have permission to access this endpoint, or your subscription may have expired.`;
    } else if (response.status === 429) {
      errorMessage = `Metals.Dev API error: Rate limit exceeded. You may have exceeded your monthly API quota. Check your usage at https://metals.dev/`;
    }
    
    // Try to parse error response for more details
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.message || errorData.error) {
        errorMessage += ` Details: ${errorData.message || errorData.error}`;
      }
    } catch {
      // If JSON parsing fails, include raw response
      if (errorText) {
        errorMessage += ` Response: ${errorText.substring(0, 200)}`;
      }
    }
    
    throw new Error(errorMessage);
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

// Export the type guard for use in API routes
export { isApiKeyMissingError };
