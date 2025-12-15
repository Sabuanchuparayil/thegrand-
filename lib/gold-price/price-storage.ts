// Price storage for metal prices fetched via scheduled jobs
// Stores prices persistently to avoid per-product API calls

import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";

export interface StoredMetalPrices {
  gold: {
    price: number;
    timestamp: number;
  };
  platinum: {
    price: number;
    timestamp: number;
  };
  lastUpdated: string; // ISO timestamp
  currency: string;
  source: "scheduled" | "manual";
}

const STORAGE_FILE_PATH = join(process.cwd(), ".cache", "metal-prices.json");
const PRICE_VALIDITY_DURATION = 12 * 60 * 60 * 1000; // 12 hours (prices valid until next scheduled update)

/**
 * Ensure cache directory exists
 */
async function ensureCacheDir(): Promise<void> {
  try {
    const cacheDir = join(process.cwd(), ".cache");
    await mkdir(cacheDir, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

/**
 * Load stored metal prices from file
 */
export async function loadStoredPrices(): Promise<StoredMetalPrices | null> {
  try {
    await ensureCacheDir();
    const data = await readFile(STORAGE_FILE_PATH, "utf-8");
    const stored = JSON.parse(data) as StoredMetalPrices;
    
    // Validate stored prices are still valid (within 12 hours)
    const now = Date.now();
    const goldAge = now - stored.gold.timestamp;
    const platinumAge = now - stored.platinum.timestamp;
    
    if (goldAge < PRICE_VALIDITY_DURATION && platinumAge < PRICE_VALIDITY_DURATION) {
      return stored;
    }
    
    // Prices expired but return them anyway as fallback
    console.warn("Stored prices expired, but returning as fallback");
    return stored;
  } catch (error) {
    // File doesn't exist or is invalid
    return null;
  }
}

/**
 * Save metal prices to storage
 */
export async function saveStoredPrices(
  goldPrice: number,
  platinumPrice: number,
  currency: string = "GBP",
  source: "scheduled" | "manual" = "scheduled"
): Promise<void> {
  try {
    await ensureCacheDir();
    
    const storedPrices: StoredMetalPrices = {
      gold: {
        price: goldPrice,
        timestamp: Date.now(),
      },
      platinum: {
        price: platinumPrice,
        timestamp: Date.now(),
      },
      lastUpdated: new Date().toISOString(),
      currency,
      source,
    };
    
    await writeFile(STORAGE_FILE_PATH, JSON.stringify(storedPrices, null, 2));
    console.log(`Metal prices saved: Gold=${goldPrice} GBP/g, Platinum=${platinumPrice} GBP/g`);
  } catch (error) {
    console.error("Error saving stored prices:", error);
    throw error;
  }
}

/**
 * Get stored gold price
 */
export async function getStoredGoldPrice(currency: string = "GBP"): Promise<number | null> {
  const stored = await loadStoredPrices();
  if (stored && stored.currency === currency) {
    return stored.gold.price;
  }
  return null;
}

/**
 * Get stored platinum price
 */
export async function getStoredPlatinumPrice(currency: string = "GBP"): Promise<number | null> {
  const stored = await loadStoredPrices();
  if (stored && stored.currency === currency) {
    return stored.platinum.price;
  }
  return null;
}

/**
 * Get stored price for a specific metal type
 */
export async function getStoredMetalPrice(
  materialType: string,
  currency: string = "GBP"
): Promise<number | null> {
  const stored = await loadStoredPrices();
  if (!stored || stored.currency !== currency) {
    return null;
  }

  if (materialType === "Platinum") {
    return stored.platinum.price;
  }

  // For gold, we need to apply purity multiplier
  // But we'll return base 24k price and let calculator handle purity
  return stored.gold.price;
}

/**
 * Check if stored prices are valid and recent
 */
export async function areStoredPricesValid(): Promise<boolean> {
  const stored = await loadStoredPrices();
  if (!stored) {
    return false;
  }

  const now = Date.now();
  const goldAge = now - stored.gold.timestamp;
  const platinumAge = now - stored.platinum.timestamp;

  return (
    goldAge < PRICE_VALIDITY_DURATION &&
    platinumAge < PRICE_VALIDITY_DURATION
  );
}

/**
 * Get all stored prices with metadata
 */
export async function getAllStoredPrices(): Promise<StoredMetalPrices | null> {
  return loadStoredPrices();
}



