#!/usr/bin/env tsx
/**
 * Comprehensive Fix Script
 * 
 * Fixes:
 * 1. Links products to collections based on cultural_tags
 * 2. Fixes images with better category-specific matching
 * 3. Ensures all collection data is correct
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

// Map cultural tags to collection slugs
const CULTURAL_TAG_TO_COLLECTION: Record<string, string> = {
  "Traditional Indian Bridal": "traditional-indian-bridal",
  "Contemporary Minimalist": "contemporary-minimalist",
  "Middle Eastern Ornate": "middle-eastern-ornate",
  "Western Engagement": "western-engagement",
  "Halal-friendly": "middle-eastern-ornate", // Map to Middle Eastern
  "Afro-Caribbean": "contemporary-minimalist", // Map to Contemporary for now
};

// Better category-specific photo selection - using verified IDs more strategically
const CATEGORY_PHOTOS: Record<string, string[]> = {
  necklaces: [
    "1515562141207-7a88fb7ce338", // Traditional jewelry - works well for necklaces
    "1573408301185-9146fe634ad0", // Elegant necklace - works well
  ],
  earrings: [
    "1603561591411-07134e71a2a9", // Diamond ring/earrings - versatile
    "1535632066927-ab7c9ab60908", // Gold jewelry - works for earrings
  ],
  rings: [
    "1603561591411-07134e71a2a9", // Engagement ring - perfect for rings
    "1605100804763-247f67b3557e", // Modern ring - good for rings
  ],
  bracelets: [
    "1544377201-72abf3b7bc9b", // Gold bracelet/luxury
    "1515562141207-7a88fb7ce338", // Traditional - works for bracelets
  ],
  bangles: [
    "1515562141207-7a88fb7ce338", // Traditional - good for bangles
    "1573408301185-9146fe634ad0", // Elegant - works for bangles
  ],
  pendants: [
    "1573408301185-9146fe634ad0", // Elegant necklace - perfect for pendants
    "1515562141207-7a88fb7ce338", // Traditional - good for pendants
  ],
  "mens-jewelry": [
    "1605100804763-247f67b3557e", // Modern ring - good for men's
    "1515562141207-7a88fb7ce338", // Traditional - versatile
  ],
};

function getCategoryImages(category: string, productIndex: number, count: number = 4): string[] {
  const urls: string[] = [];
  const categoryPhotos = CATEGORY_PHOTOS[category] || ["1515562141207-7a88fb7ce338"];
  
  // Use product index to ensure variety across products
  for (let i = 0; i < count; i++) {
    const photoIndex = (productIndex + i) % categoryPhotos.length;
    const photoId = categoryPhotos[photoIndex];
    
    if (i < 3) {
      // Product images - square format (800x800)
      urls.push(`https://images.unsplash.com/photo-${photoId}?w=800&h=800&fit=crop&q=80`);
    } else {
      // Lifestyle image - wider format (1200x800) - use different photo
      const lifestyleIndex = (photoIndex + 1) % categoryPhotos.length;
      const lifestylePhotoId = categoryPhotos[lifestyleIndex];
      urls.push(`https://images.unsplash.com/photo-${lifestylePhotoId}?w=1200&h=800&fit=crop&q=80`);
    }
  }
  
  return urls;
}

async function linkProductsAndFixImages() {
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

  console.log("🚀 Starting comprehensive fix...\n");
  console.log("=".repeat(60));

  // Step 1: Get all collections and create a map
  console.log("\n📦 Step 1: Fetching collections...\n");
  const collections = await client.fetch(`*[_type == "collection"] {
    _id,
    title,
    "slug": slug.current
  }`);
  
  const collectionMap: Record<string, string> = {};
  collections.forEach((col: any) => {
    if (col.slug) {
      collectionMap[col.slug] = col._id;
    }
  });
  
  console.log(`  ✅ Found ${collections.length} collections`);
  collections.forEach((col: any) => {
    console.log(`    - ${col.title} (${col.slug})`);
  });

  // Step 2: Get all products
  console.log("\n📦 Step 2: Fetching products...\n");
  const products = await client.fetch(`*[_type == "product"] {
    _id,
    name,
    category,
    cultural_tags,
    collection
  } | order(category, name)`);
  
  console.log(`  ✅ Found ${products.length} products\n`);

  // Step 3: Link products to collections and fix images
  console.log("🔗 Step 3: Linking products to collections and fixing images...\n");
  
  let linkedProducts = 0;
  let updatedImages = 0;
  let errors = 0;
  
  const categoryIndexMap: Record<string, number> = {}; // Track index per category for image variety

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    try {
      const category = typeof product.category === 'string' ? product.category : 'necklaces';
      
      // Determine collection based on cultural_tags
      let collectionId: string | null = null;
      if (product.cultural_tags && Array.isArray(product.cultural_tags) && product.cultural_tags.length > 0) {
        const primaryTag = product.cultural_tags[0]; // Use first cultural tag
        const collectionSlug = CULTURAL_TAG_TO_COLLECTION[primaryTag];
        if (collectionSlug && collectionMap[collectionSlug]) {
          collectionId = collectionMap[collectionSlug];
        }
      }
      
      // Get category index for image variety
      categoryIndexMap[category] = (categoryIndexMap[category] || 0) + 1;
      const productIndex = categoryIndexMap[category];
      const newImageUrls = getCategoryImages(category, productIndex, 4);
      
      // Build update object
      const updates: any = {};
      let needsUpdate = false;
      
      // Check if collection link needs updating
      const currentCollectionRef = product.collection?._ref || product.collection?._id || null;
      if (collectionId && currentCollectionRef !== collectionId) {
        updates.collection = {
          _type: "reference",
          _ref: collectionId,
        };
        needsUpdate = true;
      }
      
      // Always update images to ensure they're correct
      updates.images = newImageUrls;
      needsUpdate = true;
      
      if (needsUpdate) {
        await client
          .patch(product._id)
          .set(updates)
          .commit();
        
        if (updates.collection) linkedProducts++;
        updatedImages++;
        
        if ((linkedProducts + updatedImages) % 10 === 0) {
          console.log(`  ✓ Processed ${i + 1}/${products.length} products...`);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error(`  ❌ Error processing ${product.name}:`, error.message || error);
      errors++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n✅ COMPREHENSIVE FIX COMPLETE!");
  console.log(`  ✅ Linked ${linkedProducts} products to collections`);
  console.log(`  ✅ Updated images for ${updatedImages} products`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log(`  📦 Total products processed: ${products.length}`);
}

linkProductsAndFixImages().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});


