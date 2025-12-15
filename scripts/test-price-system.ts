#!/usr/bin/env tsx
/**
 * Test script for the scheduled price system
 * Run with: npx tsx scripts/test-price-system.ts
 */

import { fetchAndCachePrices } from "../lib/gold-price/scheduled-fetcher";
import { getAllStoredPrices, areStoredPricesValid } from "../lib/gold-price/price-storage";
import { updateAllProductPrices, getPriceUpdateSummary } from "../lib/gold-price/product-price-updater";
import { getStoredGoldPrice, getStoredPlatinumPrice } from "../lib/gold-price/price-storage";

async function testPriceSystem() {
  console.log("🧪 Testing Scheduled Price System\n");
  console.log("=" .repeat(50));

  try {
    // Test 1: Check if stored prices exist
    console.log("\n📊 Test 1: Checking stored prices...");
    const storedPrices = await getAllStoredPrices();
    if (storedPrices) {
      console.log("✅ Stored prices found:");
      console.log(`   Gold: £${storedPrices.gold.price.toFixed(2)}/g (updated: ${new Date(storedPrices.gold.timestamp).toLocaleString()})`);
      console.log(`   Platinum: £${storedPrices.platinum.price.toFixed(2)}/g (updated: ${new Date(storedPrices.platinum.timestamp).toLocaleString()})`);
      console.log(`   Currency: ${storedPrices.currency}`);
      console.log(`   Source: ${storedPrices.source}`);
      console.log(`   Last Updated: ${storedPrices.lastUpdated}`);
      
      const isValid = await areStoredPricesValid();
      console.log(`   Valid: ${isValid ? "✅ Yes" : "⚠️  Expired (but usable as fallback)"}`);
    } else {
      console.log("⚠️  No stored prices found. Prices need to be fetched first.");
    }

    // Test 2: Check price validity
    console.log("\n⏰ Test 2: Checking price validity...");
    const isValid = await areStoredPricesValid();
    if (isValid) {
      console.log("✅ Prices are valid and recent");
    } else {
      console.log("⚠️  Prices are expired (older than 12 hours)");
      console.log("   Recommendation: Run scheduled price fetch");
    }

    // Test 3: Test fetching prices (if API key is set)
    console.log("\n🔄 Test 3: Testing price fetch...");
    const apiKey = process.env.METALS_API_KEY;
    if (apiKey) {
      console.log("✅ API key found, testing fetch...");
      try {
        const prices = await fetchAndCachePrices("GBP", "manual");
        console.log("✅ Price fetch successful:");
        console.log(`   Gold: £${prices.gold.price.toFixed(2)}/g`);
        console.log(`   Platinum: £${prices.platinum.price.toFixed(2)}/g`);
      } catch (error) {
        console.log("❌ Price fetch failed:", error instanceof Error ? error.message : error);
      }
    } else {
      console.log("⚠️  METALS_API_KEY not set. Skipping fetch test.");
      console.log("   Set METALS_API_KEY in .env.local to test API fetch");
    }

    // Test 4: Test getting stored prices
    console.log("\n📥 Test 4: Testing stored price retrieval...");
    const goldPrice = await getStoredGoldPrice("GBP");
    const platinumPrice = await getStoredPlatinumPrice("GBP");
    if (goldPrice && platinumPrice) {
      console.log("✅ Stored prices retrieved successfully:");
      console.log(`   Gold: £${goldPrice.toFixed(2)}/g`);
      console.log(`   Platinum: £${platinumPrice.toFixed(2)}/g`);
    } else {
      console.log("⚠️  Could not retrieve stored prices");
    }

    // Test 5: Test product price update summary
    console.log("\n📦 Test 5: Testing product price update summary...");
    try {
      const summary = await getPriceUpdateSummary();
      console.log("✅ Product summary:");
      console.log(`   Total products: ${summary.productCount}`);
      console.log(`   Dynamic pricing products: ${summary.dynamicProductCount}`);
      if (summary.storedPrices) {
        console.log(`   Stored prices available: ✅`);
      } else {
        console.log(`   Stored prices available: ❌`);
      }
    } catch (error) {
      console.log("❌ Failed to get product summary:", error instanceof Error ? error.message : error);
    }

    // Test 6: Test product price update (dry run)
    console.log("\n🔄 Test 6: Testing product price update (dry run)...");
    try {
      const updateResult = await updateAllProductPrices();
      console.log("✅ Product price update completed:");
      console.log(`   Total products: ${updateResult.totalProducts}`);
      console.log(`   Updated: ${updateResult.updatedProducts}`);
      console.log(`   Skipped: ${updateResult.skippedProducts}`);
      console.log(`   Errors: ${updateResult.errors.length}`);
      
      if (updateResult.results.length > 0) {
        console.log("\n   Sample updates (first 3):");
        updateResult.results.slice(0, 3).forEach((result, index) => {
          console.log(`   ${index + 1}. ${result.productName}`);
          console.log(`      Material: ${result.materialType}, Weight: ${result.goldWeight}g`);
          if (result.oldPrice) {
            console.log(`      Old Price: £${result.oldPrice.toFixed(2)} → New Price: £${result.newPrice.toFixed(2)}`);
          } else {
            console.log(`      New Price: £${result.newPrice.toFixed(2)}`);
          }
        });
      }
      
      if (updateResult.errors.length > 0) {
        console.log("\n   ⚠️  Errors encountered:");
        updateResult.errors.forEach((error) => {
          console.log(`      - ${error.productId}: ${error.error}`);
        });
      }
    } catch (error) {
      console.log("❌ Product price update failed:", error instanceof Error ? error.message : error);
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ All tests completed!\n");

  } catch (error) {
    console.error("\n❌ Test failed with error:", error);
    process.exit(1);
  }
}

// Run tests
testPriceSystem().catch(console.error);



