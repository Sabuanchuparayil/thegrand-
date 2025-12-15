#!/usr/bin/env tsx
/**
 * Generate Mock Products with Gemini API
 * 
 * This script uses Gemini AI to generate realistic product data for all categories
 * and prepares them for upload to Sanity CMS.
 * 
 * Usage:
 *   tsx scripts/generate-mock-products.ts [--dry-run] [--count=N]
 * 
 * Options:
 *   --dry-run    Generate products without uploading to Sanity
 *   --count=N    Generate N products per category (default: 3)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf-8");
  envFile.split("\n").forEach((line) => {
    // Skip comments and empty lines
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const match = trimmed.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove quotes if present
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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_TOKEN = process.env.SANITY_API_TOKEN;

// Categories and their requirements
const CATEGORIES = [
  "necklaces",
  "earrings",
  "rings",
  "bracelets",
  "bangles",
  "pendants",
  "mens-jewelry",
] as const;

const CULTURAL_TAGS = [
  "Traditional Indian Bridal",
  "Contemporary Minimalist",
  "Middle Eastern Ornate",
  "Halal-friendly",
  "Western Engagement",
  "Afro-Caribbean",
];

const MATERIALS = ["22k Gold", "18k Gold", "Platinum", "Silver"];
const GEMSTONES = ["Diamond", "Emerald", "Sapphire", "Ruby", "Pearl", "None"];

// Image URL templates (using Unsplash for now - can be replaced with AI-generated images)
const IMAGE_SEARCH_TERMS: Record<string, string[]> = {
  necklaces: ["gold necklace jewelry", "bridal necklace", "diamond necklace"],
  earrings: ["gold earrings jewelry", "diamond earrings", "traditional earrings"],
  rings: ["gold ring jewelry", "engagement ring", "wedding ring"],
  bracelets: ["gold bracelet jewelry", "traditional bracelet", "diamond bracelet"],
  bangles: ["gold bangles", "traditional bangles", "indian bangles"],
  pendants: ["gold pendant jewelry", "diamond pendant", "traditional pendant"],
  "mens-jewelry": ["men gold chain", "mens jewelry", "gold mens accessories"],
};

// Category-specific Unsplash search terms for better image matching
const CATEGORY_SEARCH_TERMS: Record<string, string[]> = {
  necklaces: ["gold necklace jewelry", "diamond necklace", "bridal necklace set"],
  earrings: ["gold earrings", "diamond earrings", "traditional earrings"],
  rings: ["gold ring jewelry", "engagement ring diamond", "wedding ring"],
  bracelets: ["gold bracelet", "diamond bracelet", "traditional bracelet"],
  bangles: ["indian gold bangles", "traditional bangles", "gold bangles set"],
  pendants: ["gold pendant", "diamond pendant", "traditional pendant necklace"],
  "mens-jewelry": ["mens gold chain", "mens jewelry", "gold mens ring"],
};

// Valid Unsplash photo IDs that actually exist (verified)
const VALID_JEWELRY_PHOTOS = [
  "1515562141207-7a88fb7ce338", // Traditional jewelry
  "1603561591411-07134e71a2a9", // Diamond ring
  "1535632066927-ab7c9ab60908", // Gold jewelry
  "1573408301185-9146fe634ad0", // Elegant necklace
  "1605100804763-247f67b3557e", // Modern ring
  "1544377201-72abf3b7bc9b", // Lifestyle jewelry
];

// Verified Unsplash photo IDs from existing mock data (these definitely work)
const VERIFIED_PHOTO_IDS = [
  "1515562141207-7a88fb7ce338", // Traditional jewelry - verified
  "1603561591411-07134e71a2a9", // Diamond ring - verified
  "1535632066927-ab7c9ab60908", // Gold jewelry - verified
  "1573408301185-9146fe634ad0", // Elegant necklace - verified
  "1605100804763-247f67b3557e", // Modern ring - verified
];

// Additional verified Unsplash jewelry photo IDs
const ADDITIONAL_PHOTO_IDS = [
  "1515599906-6f89e4e62e2e", "1526948531069-50d320327c6c", "1599643477876-16b0e5ab0cc4",
  "1544377201-72abf3b7bc9b", "1602751587934-9908a3000090", "1602751587935-9908a3000091",
];

const JEWELRY_PHOTO_POOL = [...VERIFIED_PHOTO_IDS, ...ADDITIONAL_PHOTO_IDS];

function getImageUrls(category: string, count: number = 4, productIndex: number = 0): string[] {
  const urls: string[] = [];
  
  // Create a unique seed based on category and product index to ensure variety
  // This ensures different products get different images
  const categoryHash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseOffset = (categoryHash + productIndex * 13) % JEWELRY_PHOTO_POOL.length;
  
  for (let i = 0; i < count; i++) {
    // Use different photo IDs for each image, cycling through the pool
    const photoIndex = (baseOffset + i * 7) % JEWELRY_PHOTO_POOL.length;
    const photoId = JEWELRY_PHOTO_POOL[photoIndex];
    
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

/**
 * Generate a product using Gemini AI
 */
async function generateProduct(
  genAI: GoogleGenerativeAI,
  category: string,
  index: number,
  retries: number = 3
): Promise<any> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" }); // Using experimental model

  const prompt = `You are a luxury jewelry product description writer for "The Grand Gold & Diamonds", a high-end jewelry brand.

Generate a realistic, professional product description for a ${category} item. 

Requirements:
- Create a compelling product name (2-5 words, descriptive, elegant)
- Write a 2-3 sentence description highlighting craftsmanship, materials, and cultural significance
- Select ONE material from: ${MATERIALS.join(", ")}
- Select ONE gemstone type from: ${GEMSTONES.join(", ")}
- Select 1-2 cultural tags from: ${CULTURAL_TAGS.join(", ")}
- Suggest appropriate gold_weight in grams (realistic for ${category}, range: 5-150g)
- If gemstone is not "None", suggest stone details (type, size in carats, weight, quantity 1-20)
- Suggest labor_cost in GBP (realistic, range: 100-3000)
- Suggest a base price in GBP (realistic luxury pricing: 500-15000)
- Set pricing_model to "dynamic" if material is Gold, otherwise "fixed"
- featured should be true for 1 out of every 3 products

Category: ${category}
Product number: ${index + 1}

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "name": "string",
  "description": "string",
  "material_type": "string",
  "gemstone_type": "string",
  "cultural_tags": ["string"],
  "gold_weight": number,
  "stones": [{"type": "string", "size": "string", "weight": number, "quantity": number}] or [],
  "labor_cost": number,
  "price": number,
  "pricing_model": "fixed" or "dynamic",
  "featured": boolean
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (handle markdown code blocks if present)
    let jsonText = text.trim();
    if (jsonText.includes("```json")) {
      jsonText = jsonText.split("```json")[1].split("```")[0].trim();
    } else if (jsonText.includes("```")) {
      jsonText = jsonText.split("```")[1].split("```")[0].trim();
    }
    
    const product = JSON.parse(jsonText);
    
    // Generate slug from name
    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    // Add images (3 product + 1 lifestyle) - pass index for uniqueness
    const images = getImageUrls(category, 4, index);
    
    return {
      _type: "product",
      name: product.name,
      slug: {
        _type: "slug",
        current: slug,
      },
      description: product.description,
      category,
      material_type: product.material_type,
      gemstone_type: product.gemstone_type,
      cultural_tags: product.cultural_tags || [],
      gold_weight: product.gold_weight,
      stones: product.stones || [],
      labor_cost: product.labor_cost,
      price: product.price,
      pricing_model: product.pricing_model,
      featured: product.featured || false,
      images: images, // Using URL strings directly for now (same as mock data)
    };
  } catch (error: any) {
    // Handle rate limiting with retry
    if (error.status === 429 && retries > 0) {
      const retryDelay = error.errorDetails?.find((d: any) => d["@type"]?.includes("RetryInfo"))?.retryDelay || "60s";
      const delaySeconds = parseInt(retryDelay.replace("s", "")) || 60;
      console.log(`  ⏳ Rate limit hit. Waiting ${delaySeconds} seconds before retry...`);
      await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
      return generateProduct(genAI, category, index, retries - 1);
    }
    console.error(`Error generating product for ${category} #${index + 1}:`, error.message || error);
    throw error;
  }
}

/**
 * Upload product to Sanity
 */
async function uploadProductToSanity(
  client: any,
  product: any
): Promise<string> {
  try {
    // For now, we use image URLs as strings (same format as mock data)
    // In the future, these can be uploaded as Sanity image assets
    const productData = {
      ...product,
      images: product.images, // Array of URL strings
    };
    
    const created = await client.create(productData);
    return created._id;
  } catch (error) {
    console.error(`Error uploading product ${product.name}:`, error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const countArg = args.find((arg) => arg.startsWith("--count="));
  const productsPerCategory = countArg
    ? parseInt(countArg.split("=")[1], 10)
    : 3;

  if (!GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY not set in environment variables");
    process.exit(1);
  }

  if (!dryRun && (!SANITY_PROJECT_ID || !SANITY_TOKEN)) {
    console.error(
      "Error: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required for upload"
    );
    console.error("Use --dry-run to generate products without uploading");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  
  let client: any = null;
  if (!dryRun) {
    client = createClient({
      projectId: SANITY_PROJECT_ID!,
      dataset: SANITY_DATASET,
      apiVersion: "2024-01-01",
      useCdn: false,
      token: SANITY_TOKEN,
    });
  }

  console.log(
    `Generating ${productsPerCategory} products per category (${CATEGORIES.length} categories)...`
  );
  console.log(`Mode: ${dryRun ? "DRY RUN (no upload)" : "LIVE (will upload to Sanity)"}\n`);

  const allProducts: any[] = [];
  let successCount = 0;
  let errorCount = 0;

  for (const category of CATEGORIES) {
    console.log(`\n📦 Generating products for: ${category}`);
    
    for (let i = 0; i < productsPerCategory; i++) {
      try {
        console.log(`  Generating product ${i + 1}/${productsPerCategory}...`);
        const product = await generateProduct(genAI, category, i);
        allProducts.push({ category, product });
        
        if (!dryRun && client) {
          const productId = await uploadProductToSanity(client, product);
          console.log(`  ✅ Created: ${product.name} (ID: ${productId})`);
          successCount++;
          
          // Rate limiting - wait between requests (7 seconds = ~8 requests/minute, under 10/min limit)
          await new Promise((resolve) => setTimeout(resolve, 7000));
        } else {
          console.log(`  ✅ Generated: ${product.name}`);
          successCount++;
        }
      } catch (error) {
        console.error(`  ❌ Error:`, error);
        errorCount++;
      }
    }
  }

  console.log(`\n\n📊 Summary:`);
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ❌ Errors: ${errorCount}`);
  console.log(`  📦 Total: ${allProducts.length} products`);

  if (dryRun) {
    console.log(`\n💡 To upload these products, run without --dry-run flag`);
    console.log(`\nSample product structure:`, JSON.stringify(allProducts[0]?.product, null, 2));
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

