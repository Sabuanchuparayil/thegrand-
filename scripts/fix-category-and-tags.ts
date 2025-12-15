#!/usr/bin/env tsx
/**
 * Fix Category and Cultural Tags Script
 * 
 * Fixes:
 * 1. Products with broken category field ([object Object])
 * 2. Products missing cultural_tags
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

const VALID_CATEGORIES = [
  "necklaces",
  "earrings", 
  "rings",
  "bracelets",
  "bangles",
  "pendants",
  "mens-jewelry"
];

const CULTURAL_TAGS = [
  "Traditional Indian Bridal",
  "Contemporary Minimalist",
  "Middle Eastern Ornate",
  "Halal-friendly",
  "Western Engagement",
  "Afro-Caribbean",
];

// Map gemstone types to likely cultural tags
function inferCulturalTags(product: any): string[] {
  const tags: string[] = [];
  
  // Use existing tags if present
  if (product.cultural_tags && Array.isArray(product.cultural_tags) && product.cultural_tags.length > 0) {
    return product.cultural_tags.filter((tag: any) => typeof tag === 'string');
  }
  
  // Infer from product name
  const name = (product.name || '').toLowerCase();
  if (name.includes('bridal') || name.includes('traditional') || name.includes('indian')) {
    tags.push('Traditional Indian Bridal');
  } else if (name.includes('minimalist') || name.includes('contemporary') || name.includes('modern')) {
    tags.push('Contemporary Minimalist');
  } else if (name.includes('middle eastern') || name.includes('ornate')) {
    tags.push('Middle Eastern Ornate');
  } else if (name.includes('western') || name.includes('engagement')) {
    tags.push('Western Engagement');
  } else {
    // Default based on material/gemstone
    if (product.material_type && product.material_type.includes('22k')) {
      tags.push('Traditional Indian Bridal');
    } else {
      tags.push('Contemporary Minimalist');
    }
  }
  
  return tags.length > 0 ? tags : ['Contemporary Minimalist'];
}

// Fix category field
function fixCategory(category: any, productName?: string): string {
  if (typeof category === 'string' && VALID_CATEGORIES.includes(category)) {
    return category;
  }
  
  // If it's an object, try to extract string value
  if (typeof category === 'object' && category !== null) {
    if (category.current && VALID_CATEGORIES.includes(category.current)) return category.current;
    if (category.value && VALID_CATEGORIES.includes(category.value)) return category.value;
    if (category.title) {
      const normalized = category.title.toLowerCase().replace(/\s+/g, '-');
      if (VALID_CATEGORIES.includes(normalized)) return normalized;
    }
  }
  
  // Infer from product name
  const name = (productName || '').toLowerCase();
  if (name.includes('ring') || name.includes('solitaire')) return 'rings';
  if (name.includes('earring')) return 'earrings';
  if (name.includes('bangle')) return 'bangles';
  if (name.includes('bracelet')) return 'bracelets';
  if (name.includes('pendant')) return 'pendants';
  if (name.includes('necklace') || name.includes('choker') || name.includes('set')) return 'necklaces';
  if (name.includes('men') || name.includes('signet') || name.includes('band')) return 'mens-jewelry';
  
  // Default fallback
  return 'necklaces';
}

async function fixCategoriesAndTags() {
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

  console.log("Fetching all products...\n");
  const products = await client.fetch(`*[_type == "product"] {
    _id,
    name,
    category,
    cultural_tags,
    material_type,
    gemstone_type
  }`);

  console.log(`Found ${products.length} products to check\n`);
  console.log("=".repeat(60));

  let fixedCategory = 0;
  let fixedTags = 0;
  let errors = 0;

  for (const product of products) {
    try {
      const fixedCategoryValue = fixCategory(product.category, product.name);
      const fixedTagsValue = inferCulturalTags(product);
      
      const updates: any = {};
      let needsUpdate = false;
      
      // Check if category needs fixing
      if (fixedCategoryValue !== product.category || typeof product.category !== 'string') {
        updates.category = fixedCategoryValue;
        needsUpdate = true;
        fixedCategory++;
      }
      
      // Check if tags need fixing
      const currentTags = product.cultural_tags || [];
      const currentTagsStr = currentTags.filter((t: any) => typeof t === 'string');
      if (currentTagsStr.length === 0 || 
          JSON.stringify(currentTagsStr.sort()) !== JSON.stringify(fixedTagsValue.sort())) {
        updates.cultural_tags = fixedTagsValue;
        needsUpdate = true;
        fixedTags++;
      }
      
      if (needsUpdate) {
        await client
          .patch(product._id)
          .set(updates)
          .commit();
        
        console.log(`✓ Fixed ${product.name}`);
        if (updates.category) console.log(`  Category: ${product.category} → ${updates.category}`);
        if (updates.cultural_tags) console.log(`  Tags: ${currentTagsStr.join(', ') || 'none'} → ${updates.cultural_tags.join(', ')}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error(`❌ Error fixing ${product.name}:`, error.message || error);
      errors++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`  ✅ Fixed categories: ${fixedCategory}`);
  console.log(`  ✅ Fixed tags: ${fixedTags}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log(`  📦 Total checked: ${products.length}`);
  console.log("\n✅ All categories and tags fixed!");
}

fixCategoriesAndTags().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

