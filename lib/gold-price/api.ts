// Metals.Dev API integration for fetching gold prices
// API Documentation: https://metals.dev/docs
// Free tier: 100 requests/month | Paid: $1.79/month for 2,000 requests
// Note: This service now prefers stored prices (from scheduled jobs) to minimize API calls

// Note: price-storage is server-only, import dynamically when needed

interface GoldPriceResponse {
  success: boolean;
  timestamp: number;
  date: string;
  base: string;
  rates: {
    GBP: number;
    XAU: number; // Gold price per troy ounce
  };
}

interface CachedPrice {
  price: number;
  timestamp: number;
  purity: string;
}

// In-memory cache (in production, consider using Redis)
const priceCache = new Map<string, CachedPrice>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds (extended for daily updates)

// Purity multipliers for gold
const PURITY_MULTIPLIERS: Record<string, number> = {
  "24k": 1.0,
  "22k": 0.9167,
  "18k": 0.75,
  "Platinum": 1.0, // Will use separate endpoint
};

// Convert troy ounce to grams (1 troy ounce = 31.1035 grams)
const TROY_OUNCE_TO_GRAM = 31.1035;

/**
 * Fetch current gold price from Metals-API
 * @param currency Currency code (default: GBP)
 * @returns Gold price per gram in specified currency
 */
export async function fetchGoldPrice(
  currency: string = "GBP"
): Promise<number> {
  // First, try to get from stored prices (from scheduled jobs) - server-only
  if (typeof window === 'undefined') {
    try {
      const { getStoredGoldPrice } = await import("./price-storage");
      const storedPrice = await getStoredGoldPrice(currency);
      if (storedPrice) {
        return storedPrice;
      }
    } catch (e) {
      // If stored prices not available, continue to API
    }
  }

  const apiKey = process.env.METALS_API_KEY;
  const baseUrl =
    process.env.METALS_API_BASE_URL || "https://api.metals.dev/v1";

  if (!apiKey) {
    console.warn("METALS_API_KEY not set, using fallback price");
    return getFallbackGoldPrice();
  }

  try {
    // Check in-memory cache
    const cacheKey = `gold-${currency}`;
    const cached = priceCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.price;
    }

    // Fetch from Metals.Dev API
    // Try header authentication first (preferred), then query parameter
    const url = `${baseUrl}/latest?currency=${currency}&unit=g`;
    
    let response = await fetch(url, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    // If header method fails with 401, try query parameter method
    if (!response.ok && response.status === 401) {
      response = await fetch(
        `${baseUrl}/latest?api_key=${apiKey}&currency=${currency}&unit=g`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          next: { revalidate: 3600 },
        }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Metals.Dev API error: ${response.statusText}`;
      
      if (response.status === 401) {
        errorMessage = `Metals.Dev API error: Unauthorized. Please verify METALS_API_KEY is set correctly in Railway.`;
      }
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message || errorData.error) {
          errorMessage += ` ${errorData.message || errorData.error}`;
        }
      } catch {
        // Ignore JSON parse errors
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Handle Metals.Dev API response format
    // Format: { status: "success", metals: { gold: number, platinum: number, ... }, currency: "GBP", unit: "g" }
    let pricePerGram: number;

    if (data.metals && typeof data.metals.gold === "number") {
      // Metals.Dev format: { metals: { gold: number } }
      pricePerGram = data.metals.gold;
    } else if (data.gold && typeof data.gold === "number") {
      // Direct gold price
      pricePerGram = data.gold;
    } else if (data.price) {
      // Direct price per gram
      pricePerGram = data.price;
    } else if (data.rates && data.rates[currency]) {
      // Alternative format: { rates: { GBP: { gold: number } } }
      const currencyData = data.rates[currency];
      if (currencyData.gold) {
        pricePerGram = currencyData.gold;
      } else if (typeof currencyData === "number") {
        pricePerGram = currencyData;
      } else {
        throw new Error("Unexpected API response format for gold price");
      }
    } else {
      throw new Error("Unexpected API response format - no gold price found");
    }

    // Cache the result
    priceCache.set(cacheKey, {
      price: pricePerGram,
      timestamp: Date.now(),
      purity: "24k",
    });

    return pricePerGram;
  } catch (error) {
    console.error("Error fetching gold price:", error);

    // Try to use cached price even if expired
    const cacheKey = `gold-${currency}`;
    const cached = priceCache.get(cacheKey);
    if (cached) {
      console.warn("Using expired cached gold price");
      return cached.price;
    }

    // Fallback to default price
    return getFallbackGoldPrice();
  }
}

/**
 * Fetch gold price for specific purity
 * @param purity Gold purity (18k, 22k, 24k)
 * @param currency Currency code (default: GBP)
 * @returns Gold price per gram adjusted for purity
 */
export async function fetchGoldPriceByPurity(
  purity: string,
  currency: string = "GBP"
): Promise<number> {
  const basePrice = await fetchGoldPrice(currency);
  const multiplier = PURITY_MULTIPLIERS[purity] || 1.0;
  return basePrice * multiplier;
}

/**
 * Fetch platinum price
 * @param currency Currency code (default: GBP)
 * @returns Platinum price per gram
 */
export async function fetchPlatinumPrice(
  currency: string = "GBP"
): Promise<number> {
  // First, try to get from stored prices (from scheduled jobs) - server-only
  if (typeof window === 'undefined') {
    try {
      const { getStoredPlatinumPrice } = await import("./price-storage");
      const storedPrice = await getStoredPlatinumPrice(currency);
      if (storedPrice) {
        return storedPrice;
      }
    } catch (e) {
      // If stored prices not available, continue to API
    }
  }

  const apiKey = process.env.METALS_API_KEY;
  const baseUrl =
    process.env.METALS_API_BASE_URL || "https://api.metals.dev/v1";

  if (!apiKey) {
    console.warn("METALS_API_KEY not set, using fallback platinum price");
    return getFallbackPlatinumPrice();
  }

  try {
    // Check in-memory cache
    const cacheKey = `platinum-${currency}`;
    const cached = priceCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.price;
    }

    // Fetch from Metals.Dev API
    // Try header authentication first (preferred), then query parameter
    const url = `${baseUrl}/latest?currency=${currency}&unit=g`;
    
    let response = await fetch(url, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    // If header method fails with 401, try query parameter method
    if (!response.ok && response.status === 401) {
      response = await fetch(
        `${baseUrl}/latest?api_key=${apiKey}&currency=${currency}&unit=g`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          next: { revalidate: 3600 },
        }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Metals.Dev API error: ${response.statusText}`;
      
      if (response.status === 401) {
        errorMessage = `Metals.Dev API error: Unauthorized. Please verify METALS_API_KEY is set correctly in Railway.`;
      }
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message || errorData.error) {
          errorMessage += ` ${errorData.message || errorData.error}`;
        }
      } catch {
        // Ignore JSON parse errors
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Handle Metals.Dev API response format for platinum
    // Format: { status: "success", metals: { platinum: number, ... }, currency: "GBP", unit: "g" }
    let pricePerGram: number;
    
    if (data.metals && typeof data.metals.platinum === "number") {
      // Metals.Dev format: { metals: { platinum: number } }
      pricePerGram = data.metals.platinum;
    } else if (data.platinum && typeof data.platinum === "number") {
      // Direct platinum price
      pricePerGram = data.platinum;
    } else if (data.price) {
      pricePerGram = data.price;
    } else if (data.rates && data.rates[currency]) {
      // Alternative format: { rates: { GBP: { platinum: number } } }
      const currencyData = data.rates[currency];
      if (currencyData.platinum) {
        pricePerGram = currencyData.platinum;
      } else if (typeof currencyData === "number") {
        pricePerGram = currencyData;
      } else {
        throw new Error("Unexpected API response format for platinum price");
      }
    } else {
      throw new Error("Unexpected API response format - no platinum price found");
    }

    // Cache the result
    priceCache.set(cacheKey, {
      price: pricePerGram,
      timestamp: Date.now(),
      purity: "Platinum",
    });

    return pricePerGram;
  } catch (error) {
    console.error("Error fetching platinum price:", error);

    // Try cached price
    const cacheKey = `platinum-${currency}`;
    const cached = priceCache.get(cacheKey);
    if (cached) {
      return cached.price;
    }

    return getFallbackPlatinumPrice();
  }
}

/**
 * Get fallback gold price (approximate current market price)
 * This is used when API is unavailable
 */
function getFallbackGoldPrice(): number {
  // Approximate gold price per gram in GBP (as of 2024)
  // This should be updated periodically or fetched from a backup source
  return 55.0; // £55 per gram for 24k gold
}

/**
 * Get fallback platinum price
 */
function getFallbackPlatinumPrice(): number {
  // Approximate platinum price per gram in GBP
  return 25.0; // £25 per gram for platinum
}

/**
 * Get price for a specific metal type
 * @param materialType Material type (e.g., "22k Gold", "18k Gold", "Platinum")
 * @param currency Currency code (default: GBP)
 * @returns Price per gram for the specified material
 */
export async function getMetalPrice(
  materialType: string,
  currency: string = "GBP"
): Promise<number> {
  if (materialType === "Platinum") {
    return fetchPlatinumPrice(currency);
  }

  // Extract purity from material type
  const purityMatch = materialType.match(/(\d+k)/i);
  const purity = purityMatch ? purityMatch[1] : "24k";

  return fetchGoldPriceByPurity(purity, currency);
}

/**
 * Clear the price cache (useful for testing or manual refresh)
 */
export function clearPriceCache(): void {
  priceCache.clear();
}

