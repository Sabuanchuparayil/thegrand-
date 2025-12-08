// Price calculator for dynamic gold-based pricing

import { getMetalPrice } from "./api";
// Note: price-storage is server-only, import dynamically when needed

export interface Stone {
  type: string;
  size?: string;
  weight?: number; // in carats
  quantity?: number;
}

export interface Product {
  _id?: string;
  material_type?: string;
  gold_weight?: number; // in grams
  stones?: Stone[];
  labor_cost?: number; // in GBP
  pricing_model?: string;
  price?: number; // base/fallback price
}

// Approximate stone prices per carat (in GBP)
// These are rough estimates and should be adjusted based on actual market prices
const STONE_PRICES_PER_CARAT: Record<string, number> = {
  Diamond: 500, // Varies greatly by quality (cut, color, clarity)
  Emerald: 200,
  Sapphire: 150,
  Ruby: 250,
  Pearl: 50, // Per pearl, not per carat
  Other: 100,
};

/**
 * Calculate gold value based on weight and current market price
 * @param weight Weight in grams
 * @param materialType Material type (e.g., "22k Gold", "Platinum")
 * @param currentPricePerGram Current market price per gram
 * @returns Gold value in GBP
 * 
 * This is a pure function that can be used in both client and server components
 */
export function calculateGoldValue(
  weight: number,
  materialType: string,
  currentPricePerGram: number
): number {
  if (!weight || weight <= 0) {
    return 0;
  }

  return weight * currentPricePerGram;
}

/**
 * Calculate stone value based on stone details
 * @param stones Array of stone objects
 * @returns Total stone value in GBP
 */
export function calculateStoneValue(stones: Stone[] = []): number {
  if (!stones || stones.length === 0) {
    return 0;
  }

  let totalValue = 0;

  for (const stone of stones) {
    const quantity = stone.quantity || 1;
    let stoneValue = 0;

    if (stone.type === "Pearl") {
      // Pearls are priced per piece, not per carat
      const pricePerPearl = STONE_PRICES_PER_CARAT.Pearl;
      stoneValue = pricePerPearl * quantity;
    } else if (stone.weight) {
      // Other stones priced per carat
      const pricePerCarat =
        STONE_PRICES_PER_CARAT[stone.type] ||
        STONE_PRICES_PER_CARAT.Other;
      stoneValue = pricePerCarat * stone.weight * quantity;
    }

    totalValue += stoneValue;
  }

  return totalValue;
}

/**
 * Calculate total product price dynamically
 * @param product Product object with gold weight, stones, and labor cost
 * @param currentGoldPrice Current gold price per gram (optional, will fetch if not provided)
 * @returns Calculated total price in GBP
 */
export async function calculateTotalPrice(
  product: Product,
  currentGoldPrice?: number
): Promise<number> {
  // If pricing model is fixed, return base price
  if (product.pricing_model === "fixed" || !product.pricing_model) {
    return product.price || 0;
  }

  // Validate required fields for dynamic pricing
  if (!product.material_type || !product.gold_weight) {
    console.warn(
      `Product ${product._id} missing required fields for dynamic pricing`
    );
    return product.price || 0;
  }

  try {
    // Get metal price - prefer stored prices to avoid API calls
    let metalPricePerGram = currentGoldPrice;
    if (!metalPricePerGram) {
      // Try to get from stored prices (server-only, dynamic import)
      try {
        // Only import price-storage on server side
        if (typeof window === 'undefined') {
          const { getStoredMetalPrice } = await import("./price-storage");
          const storedPrice = await getStoredMetalPrice(product.material_type);
          if (storedPrice) {
            metalPricePerGram = storedPrice;
            // Apply purity multiplier for gold (stored price is 24k)
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
          }
        }
      } catch (e) {
        // If stored price not available or on client side, fall through to API
      }
      
      // Fallback to API call if no stored price available
      if (!metalPricePerGram) {
        metalPricePerGram = await getMetalPrice(product.material_type);
      }
    }

    // Calculate gold value
    const goldValue = calculateGoldValue(
      product.gold_weight,
      product.material_type,
      metalPricePerGram
    );

    // Calculate stone value
    const stoneValue = calculateStoneValue(product.stones);

    // Calculate labor cost (default to 0 if not specified)
    const laborCost = product.labor_cost || 0;

    // Total price = Gold Value + Stone Value + Labor Cost
    const totalPrice = goldValue + stoneValue + laborCost;

    return Math.round(totalPrice * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error(`Error calculating price for product ${product._id}:`, error);
    // Fallback to base price if calculation fails
    return product.price || 0;
  }
}

/**
 * Calculate price for multiple products efficiently
 * Fetches gold price once and reuses it for all products
 * @param products Array of products
 * @returns Array of products with calculated prices
 */
export async function calculatePricesForProducts(
  products: Product[]
): Promise<Array<Product & { calculatedPrice?: number }>> {
  // First, try to get stored prices (no API calls) - server-only
  let storedGoldPrice: number | null = null;
  let storedPlatinumPrice: number | null = null;
  
  if (typeof window === 'undefined') {
    try {
      const { getStoredMetalPrice } = await import("./price-storage");
      storedGoldPrice = await getStoredMetalPrice("24k Gold");
      storedPlatinumPrice = await getStoredMetalPrice("Platinum");
    } catch (e) {
      // If stored prices not available, continue without them
    }
  }

  // Group products by material type
  const materialGroups = new Map<string, Product[]>();

  for (const product of products) {
    if (
      product.pricing_model === "dynamic" &&
      product.material_type &&
      product.gold_weight
    ) {
      const material = product.material_type;
      if (!materialGroups.has(material)) {
        materialGroups.set(material, []);
      }
      materialGroups.get(material)!.push(product);
    }
  }

  // Get prices for each material type (prefer stored, fallback to API)
  const materialPrices = new Map<string, number>();
  for (const [material] of materialGroups) {
    try {
      let price: number | null = null;
      
      // Try stored prices first
      if (material === "Platinum" && storedPlatinumPrice) {
        price = storedPlatinumPrice;
      } else if (storedGoldPrice) {
        price = storedGoldPrice;
        // Apply purity multiplier
        const purityMatch = material.match(/(\d+k)/i);
        if (purityMatch) {
          const purity = purityMatch[1];
          const purityMultipliers: Record<string, number> = {
            "24k": 1.0,
            "22k": 0.9167,
            "18k": 0.75,
          };
          const multiplier = purityMultipliers[purity] || 1.0;
          price = price * multiplier;
        }
      }
      
      // Fallback to API if no stored price
      if (!price) {
        price = await getMetalPrice(material);
      }
      
      if (price) {
        materialPrices.set(material, price);
      }
    } catch (error) {
      console.error(`Error fetching price for ${material}:`, error);
    }
  }

  // Calculate prices for all products
  const results = await Promise.all(
    products.map(async (product) => {
      if (
        product.pricing_model === "dynamic" &&
        product.material_type &&
        product.gold_weight
      ) {
        const metalPrice = materialPrices.get(product.material_type);
        if (metalPrice) {
          const calculatedPrice = await calculateTotalPrice(
            product,
            metalPrice
          );
          return { ...product, calculatedPrice };
        }
      }
      return product;
    })
  );

  return results;
}

/**
 * Get stone price per carat (for display purposes)
 * @param stoneType Type of stone
 * @returns Price per carat in GBP
 */
export function getStonePricePerCarat(stoneType: string): number {
  return STONE_PRICES_PER_CARAT[stoneType] || STONE_PRICES_PER_CARAT.Other;
}

/**
 * Update stone prices (for admin configuration)
 * @param stoneType Stone type
 * @param pricePerCarat New price per carat
 */
export function updateStonePrice(
  stoneType: string,
  pricePerCarat: number
): void {
  STONE_PRICES_PER_CARAT[stoneType] = pricePerCarat;
}

