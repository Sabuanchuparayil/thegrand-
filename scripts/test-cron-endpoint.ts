#!/usr/bin/env node
/**
 * Test script for the scheduled gold price update endpoint
 * 
 * Usage:
 *   npx tsx scripts/test-cron-endpoint.ts
 * 
 * Or with custom URL:
 *   CRON_SECRET=your_secret NEXT_PUBLIC_SITE_URL=https://your-domain.com npx tsx scripts/test-cron-endpoint.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thegrand-production.up.railway.app";
const CRON_SECRET = process.env.CRON_SECRET;
const ENDPOINT = `${SITE_URL}/api/gold-price/scheduled`;

async function testCronEndpoint() {
  console.log("🧪 Testing Cron Endpoint\n");
  console.log(`📍 Endpoint: ${ENDPOINT}`);
  console.log(`🔑 CRON_SECRET: ${CRON_SECRET ? "✅ Set" : "❌ Not set"}\n`);

  if (!CRON_SECRET) {
    console.log("⚠️  WARNING: CRON_SECRET is not set!");
    console.log("   The endpoint will require admin session authentication.");
    console.log("   For automated cron jobs, you must set CRON_SECRET.\n");
  }

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (CRON_SECRET) {
      headers["Authorization"] = `Bearer ${CRON_SECRET}`;
    }

    console.log("📤 Sending POST request...");
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers,
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Success!\n");
      console.log("📊 Response:");
      console.log(JSON.stringify(data, null, 2));

      if (data.prices) {
        console.log("\n💰 Price Summary:");
        console.log(`   Gold: £${data.prices.gold.price.toFixed(2)}/g (${data.prices.gold.currency})`);
        console.log(`   Platinum: £${data.prices.platinum.price.toFixed(2)}/g (${data.prices.platinum.currency})`);
      }

      if (data.productUpdates) {
        console.log("\n📦 Product Updates:");
        console.log(`   Total Products: ${data.productUpdates.totalProducts}`);
        console.log(`   Updated: ${data.productUpdates.updatedProducts}`);
        console.log(`   Skipped: ${data.productUpdates.skippedProducts}`);
        console.log(`   Errors: ${data.productUpdates.errors}`);
      }
    } else {
      console.log(`❌ Error (${response.status}):`);
      console.log(JSON.stringify(data, null, 2));

      if (response.status === 401) {
        console.log("\n💡 Tip: Make sure CRON_SECRET is set correctly in Railway environment variables.");
      }
    }
  } catch (error) {
    console.error("❌ Request failed:", error instanceof Error ? error.message : error);
    console.log("\n💡 Make sure:");
    console.log("   1. The Railway URL is correct");
    console.log("   2. The service is deployed and accessible");
    console.log("   3. CRON_SECRET is set (for automated cron jobs)");
  }
}

// Run the test
testCronEndpoint().catch(console.error);

