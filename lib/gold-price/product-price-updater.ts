// Product price updater - applies stored metal prices to all products with dynamic pricing
// This is called after fetching metal prices to update all product prices

import { getAllStoredPrices, getStoredMetalPrice, StoredMetalPrices } from "./price-storage";
import {
  calculateGoldValue,
  calculateStoneValue,
  Product,
} from "./calculator";
// Import client and query directly to avoid circular dependency
import { client } from "@/lib/sanity/client";
import { productQuery } from "@/lib/sanity/queries";
import { mockProducts } from "@/lib/mock-data";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

interface PriceUpdateResult {
  productId: string;
  productName: string;
  oldPrice?: number;
  newPrice: number;
  materialType: string;
  goldWeight?: number;
}

interface BatchUpdateResult {
  totalProducts: number;
  updatedProducts: number;
  skippedProducts: number;
  results: PriceUpdateResult[];
  errors: Array<{ productId: string; error: string }>;
}

/**
 * Calculate price for a single product using stored metal prices
 */
export async function calculateProductPriceWithStoredPrices(
  product: Product,
  storedGoldPrice?: number,
  storedPlatinumPrice?: number
): Promise<number> {
  // If pricing model is fixed, return base price
  if (product.pricing_model === "fixed" || !product.pricing_model) {
    return product.price || 0;
  }

  // Validate required fields
  if (!product.material_type || !product.gold_weight) {
    return product.price || 0;
  }

  try {
    // Get stored price for the material type
    let metalPricePerGram: number | null = null;

    if (storedGoldPrice && storedPlatinumPrice) {
      // Use provided prices
      if (product.material_type === "Platinum") {
        metalPricePerGram = storedPlatinumPrice;
      } else {
        metalPricePerGram = storedGoldPrice;
      }
    } else {
      // Fetch from storage
      metalPricePerGram = await getStoredMetalPrice(
        product.material_type,
        "GBP"
      );
    }

    if (!metalPricePerGram) {
      console.warn(
        `No stored price found for ${product.material_type}, using base price`
      );
      return product.price || 0;
    }

    // Apply purity multiplier for gold
    if (product.material_type !== "Platinum") {
      const purityMatch = product.material_type.match(/(\d+k)/i);
      const purity = purityMatch ? purityMatch[1] : "24k";
      const purityMultipliers: Record<string, number> = {
        "24k": 1.0,
        "22k": 0.9167,
        "18k": 0.75,
      };
      const multiplier = purityMultipliers[purity] || 1.0;
      metalPricePerGram = metalPricePerGram * multiplier;
    }

    // Calculate gold value
    const goldValue = calculateGoldValue(
      product.gold_weight,
      product.material_type,
      metalPricePerGram
    );

    // Calculate stone value
    const stoneValue = calculateStoneValue(product.stones);

    // Calculate labor cost
    const laborCost = product.labor_cost || 0;

    // Total price
    const totalPrice = goldValue + stoneValue + laborCost;

    return Math.round(totalPrice * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error(`Error calculating price for product ${product._id}:`, error);
    return product.price || 0;
  }
}

/**
 * Update prices for all products with dynamic pricing
 * Uses stored metal prices (no API calls)
 */
export async function updateAllProductPrices(): Promise<BatchUpdateResult> {
  const result: BatchUpdateResult = {
    totalProducts: 0,
    updatedProducts: 0,
    skippedProducts: 0,
    results: [],
    errors: [],
  };

  try {
    console.log("Fetching all products...");
    
    // Fetch all products directly (avoid circular dependency)
    let products;
    if (USE_MOCK_DATA) {
      products = mockProducts;
    } else {
      try {
        products = await client.fetch(productQuery);
        products = products || [];
      } catch (error) {
        console.error("Error fetching products, using mock data:", error);
        products = mockProducts;
      }
    }
    result.totalProducts = products.length;

    // Get stored metal prices
    const storedPrices = await getAllStoredPrices();
    if (!storedPrices) {
      throw new Error("No stored metal prices found. Please run scheduled price fetch first.");
    }

    console.log(`Processing ${products.length} products with stored prices:`, {
      gold: `${storedPrices.gold.price} GBP/g`,
      platinum: `${storedPrices.platinum.price} GBP/g`,
    });

    // Process each product
    for (const product of products) {
      try {
        // Skip products without dynamic pricing
        if (product.pricing_model !== "dynamic") {
          result.skippedProducts++;
          continue;
        }

        // Calculate new price using stored prices
        const newPrice = await calculateProductPriceWithStoredPrices(
          product as Product,
          storedPrices.gold.price,
          storedPrices.platinum.price
        );

        const oldPrice = product.price;

        result.results.push({
          productId: product._id || "unknown",
          productName: product.name || "Unknown",
          oldPrice,
          newPrice,
          materialType: product.material_type || "Unknown",
          goldWeight: product.gold_weight,
        });

        result.updatedProducts++;
      } catch (error) {
        result.errors.push({
          productId: product._id || "unknown",
          error: error instanceof Error ? error.message : "Unknown error",
        });
        console.error(`Error processing product ${product._id}:`, error);
      }
    }

    console.log(`Price update complete:`, {
      total: result.totalProducts,
      updated: result.updatedProducts,
      skipped: result.skippedProducts,
      errors: result.errors.length,
    });

    return result;
  } catch (error) {
    console.error("Error updating product prices:", error);
    result.errors.push({
      productId: "batch",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return result;
  }
}

/**
 * Get price update summary (for display/monitoring)
 */
export async function getPriceUpdateSummary(): Promise<{
  storedPrices: StoredMetalPrices | null;
  productCount: number;
  dynamicProductCount: number;
}> {
  const storedPrices = await getAllStoredPrices();
  
  // Fetch products directly (avoid circular dependency)
  let products;
  if (USE_MOCK_DATA) {
    products = mockProducts;
  } else {
    try {
      products = await client.fetch(productQuery);
      products = products || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      products = mockProducts;
    }
  }
  
  const dynamicProducts = products.filter(
    (p: any) => p.pricing_model === "dynamic"
  );

  return {
    storedPrices,
    productCount: products.length,
    dynamicProductCount: dynamicProducts.length,
  };
}

