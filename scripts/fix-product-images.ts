#!/usr/bin/env tsx
/**
 * Fix Product Images Script
 * 
 * This script updates existing products in Sanity to use proper image URLs
 * stored as strings (which the data fetcher can handle)
 */

import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";

// Load environment variables
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf-8");
  envFile.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const match = trimmed.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (key && value && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_TOKEN = process.env.SANITY_API_TOKEN;

// Verified Unsplash photo IDs that definitely work
const VERIFIED_PHOTO_IDS = [
  "1515562141207-7a88fb7ce338", // Traditional jewelry
  "1603561591411-07134e71a2a9", // Diamond ring
  "1535632066927-ab7c9ab60908", // Gold jewelry
  "1573408301185-9146fe634ad0", // Elegant necklace
  "1605100804763-247f67b3557e", // Modern ring
];

function getUniqueImageUrls(productName: string, category: string | null | undefined, count: number = 4): string[] {
  const urls: string[] = [];
  
  // Create hash from product name for consistent but unique image selection
  const nameHash = (productName || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const categoryStr = (typeof category === 'string' ? category : 'jewelry');
  const categoryHash = categoryStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseOffset = (nameHash + categoryHash) % VERIFIED_PHOTO_IDS.length;
  
  for (let i = 0; i < count; i++) {
    // Use different photo IDs, cycling through verified list
    const photoIndex = (baseOffset + i * 3) % VERIFIED_PHOTO_IDS.length;
    const photoId = VERIFIED_PHOTO_IDS[photoIndex];
    
    if (i < 3) {
      // Product images - square format (800x800)
      urls.push(`https://images.unsplash.com/photo-${photoId}?w=800&h=800&fit=crop&q=80`);
    } else {
      // Lifestyle image - wider format (1200x800)
      urls.push(`https://images.unsplash.com/photo-${photoId}?w=1200&h=800&fit=crop&q=80`);
    }
  }
  
  return urls;
}

async function fixProductImages() {
  if (!SANITY_PROJECT_ID || !SANITY_TOKEN) {
    console.error("Error: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required");
    process.exit(1);
  }

  const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
    token: SANITY_TOKEN,
  });

  console.log("Fetching all products...");
  const products = await client.fetch(`*[_type == "product"] {
    _id,
    name,
    category,
    images
  }`);

  console.log(`Found ${products.length} products to update\n`);

  let updated = 0;
  let errors = 0;

  for (const product of products) {
    try {
      const newImageUrls = getUniqueImageUrls(product.name, product.category || "jewelry", 4);
      
      console.log(`Updating ${product.name}...`);
      console.log(`  Old images: ${Array.isArray(product.images) ? product.images.length : 0} items`);
      console.log(`  New images: ${newImageUrls.length} URLs`);
      
      await client
        .patch(product._id)
        .set({
          images: newImageUrls, // Store as array of URL strings
        })
        .commit();
      
      updated++;
      console.log(`  ✅ Updated successfully\n`);
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error: any) {
      console.error(`  ❌ Error updating ${product.name}:`, error.message || error);
      errors++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  ✅ Updated: ${updated}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log(`  📦 Total: ${products.length}`);
}

fixProductImages().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

