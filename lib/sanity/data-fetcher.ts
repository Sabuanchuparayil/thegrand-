// Data fetcher with fallback to mock data
import { client } from "./client";
import { urlForImage } from "./image";
import {
  productQuery,
  productBySlugQuery,
  productsByCategoryQuery,
  collectionQuery,
  collectionBySlugQuery,
  homepageQuery,
  featuredProductsQuery,
} from "./queries";
import {
  mockProducts,
  mockCollections,
  mockHomepage,
} from "../mock-data";
import {
  getMockProductBySlug,
  getMockProductsByCategory,
  getMockCollectionBySlug,
  getMockFeaturedProducts,
} from "../mock-utils";
import {
  calculateTotalPrice,
  calculatePricesForProducts,
  Product,
} from "../gold-price/calculator";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

/**
 * Recursively remove unresolved Sanity reference objects from data
 * Reference objects have {_ref, _type} but no actual data
 * 
 * Bug Fix 1: Preserves legitimate null values while removing unresolved references
 * Bug Fix 2: Returns a special marker for objects that became empty after sanitization
 */
const EMPTY_OBJECT_MARKER = { __isEmpty: true };

function sanitizeReferences(obj: any, isRoot: boolean = false): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // If it's a reference object (has _ref and _type but no other meaningful data)
  if (typeof obj === 'object' && obj._ref && obj._type && Object.keys(obj).length === 2) {
    // Return marker for root level, null for nested (to be filtered from arrays)
    return isRoot ? EMPTY_OBJECT_MARKER : null;
  }
  
  if (Array.isArray(obj)) {
    const sanitized = obj.map(item => sanitizeReferences(item, false)).filter(item => item !== null);
    return sanitized;
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    let hasValidProperties = false;
    
    for (const [key, value] of Object.entries(obj)) {
      // Store original value to distinguish legitimate nulls from unresolved references
      const originalValue = value;
      const sanitizedValue = sanitizeReferences(value, false);
      
      // Bug Fix 1: Preserve legitimate null values
      // Only skip if sanitizedValue is null AND originalValue was not null (unresolved reference)
      // If originalValue was null, preserve it
      if (sanitizedValue !== null || originalValue === null) {
        sanitized[key] = sanitizedValue;
        hasValidProperties = true;
      }
    }
    
    // Bug Fix 2: Return marker if object became empty after sanitization (only at root level)
    if (!hasValidProperties && isRoot) {
      return EMPTY_OBJECT_MARKER;
    }
    
    return hasValidProperties ? sanitized : (isRoot ? EMPTY_OBJECT_MARKER : {});
  }
  
  return obj;
}

/**
 * Check if an object is the empty marker (all properties were unresolved references)
 * Bug Fix 2: Properly detects empty objects that should fallback to mock data
 */
function isEmptyObject(obj: any): boolean {
  return obj && typeof obj === 'object' && obj.__isEmpty === true;
}

/**
 * Convert Sanity image objects to URLs
 * Handles both single images and arrays of images
 */
function processImages(images: any): any {
  if (!images) {
    return images;
  }
  
  if (Array.isArray(images)) {
    return images.map((img: any) => {
      if (typeof img === 'string') {
        return img;
      }
      if (img && typeof img === 'object') {
        // Check if it's a valid Sanity image object
        if (img._type === 'image' || img.asset || img._ref) {
          try {
            const url = urlForImage(img);
            return url || null;
          } catch (error) {
            console.error('Error processing image:', error);
            return null;
          }
        }
        // If it's not a valid image object, return null
        return null;
      }
      return null;
    }).filter((img: any) => img !== null && img !== '');
  }
  
  if (typeof images === 'object') {
    // Check if it's a valid Sanity image object
    if (images._type === 'image' || images.asset || images._ref) {
      try {
        const url = urlForImage(images);
        return url || null;
      } catch (error) {
        console.error('Error processing image:', error);
        return null;
      }
    }
    // If it's not a valid image object, return null
    return null;
  }
  
  return images;
}

/**
 * Process product images to convert Sanity image objects to URLs
 */
function processProductImages(product: any): any {
  if (!product) {
    return product;
  }
  
  const processed = { ...product };
  
  // Process main images
  if (processed.images) {
    processed.images = processImages(processed.images);
  }
  
  // Process AR overlay image
  if (processed.ar_2d_overlay) {
    try {
      processed.ar_2d_overlay = processImages(processed.ar_2d_overlay);
    } catch (error) {
      console.error('Error processing AR overlay:', error);
      processed.ar_2d_overlay = null;
    }
  }
  
  return processed;
}

/**
 * Process multiple products' images
 */
function processProductsImages(products: any[]): any[] {
  if (!products || !Array.isArray(products)) {
    return products || [];
  }
  
  return products.map(product => processProductImages(product));
}

export async function fetchProducts() {
  let products;
  
  if (USE_MOCK_DATA) {
    products = mockProducts;
  } else {
    try {
      products = await client.fetch(productQuery);
      products = products || [];
      // Sanitize any unresolved references
      products = sanitizeReferences(products, false);
      // Process images to URLs
      products = processProductsImages(products);
    } catch (error) {
      console.error("Error fetching products, using mock data:", error);
      products = mockProducts;
    }
  }

  // Enrich with dynamic prices
  return enrichProductsWithDynamicPrices(products);
}

export async function fetchProductBySlug(slug: string) {
  let product;
  
  if (USE_MOCK_DATA) {
    product = getMockProductBySlug(slug);
  } else {
    try {
      product = await client.fetch(productBySlugQuery, { slug });
      product = product || null;
      // Sanitize any unresolved references
      if (product) {
        product = sanitizeReferences(product, false);
        // Process images to URLs
        product = processProductImages(product);
      }
    } catch (error) {
      console.error("Error fetching product, using mock data:", error);
      product = getMockProductBySlug(slug);
    }
  }

  if (!product) {
    return null;
  }

  // Enrich with dynamic price
  return enrichProductWithDynamicPrice(product);
}

export async function fetchProductsByCategory(category: string) {
  let products;
  
  if (USE_MOCK_DATA) {
    products = getMockProductsByCategory(category);
  } else {
    try {
      products = await client.fetch(productsByCategoryQuery, { category });
      products = products || [];
      // Sanitize any unresolved references
      products = sanitizeReferences(products, false);
      // Process images to URLs
      products = processProductsImages(products);
    } catch (error) {
      console.error("Error fetching products by category, using mock data:", error);
      products = getMockProductsByCategory(category);
    }
  }

  // Enrich with dynamic prices
  return enrichProductsWithDynamicPrices(products);
}

export async function fetchCollections() {
  if (USE_MOCK_DATA) {
    return mockCollections;
  }

  try {
    const collections = await client.fetch(collectionQuery);
    let sanitized = sanitizeReferences(collections || [], false);
    // Process hero images
    sanitized = sanitized.map((collection: any) => {
      if (collection.hero_image) {
        try {
          collection.hero_image = processImages(collection.hero_image);
        } catch (error) {
          console.error('Error processing collection hero image:', error);
        }
      }
      return collection;
    });
    return sanitized;
  } catch (error) {
    console.error("Error fetching collections, using mock data:", error);
    return mockCollections;
  }
}

export async function fetchCollectionBySlug(slug: string) {
  let collection;
  
  if (USE_MOCK_DATA) {
    collection = getMockCollectionBySlug(slug);
  } else {
    try {
        collection = await client.fetch(collectionBySlugQuery, { slug });
        collection = collection || null;
        // Sanitize any unresolved references
        if (collection) {
          collection = sanitizeReferences(collection, false);
          // Process hero image
        if (collection.hero_image) {
          try {
            collection.hero_image = processImages(collection.hero_image);
          } catch (error) {
            console.error('Error processing collection hero image:', error);
          }
        }
        // Process product images
        if (collection.products && Array.isArray(collection.products)) {
          collection.products = processProductsImages(collection.products);
        }
      }
    } catch (error) {
      console.error("Error fetching collection, using mock data:", error);
      collection = getMockCollectionBySlug(slug);
    }
  }

  if (!collection) {
    return null;
  }

  // Enrich products with dynamic prices
  if (collection.products && collection.products.length > 0) {
    collection.products = await enrichProductsWithDynamicPrices(
      collection.products
    );
  }

  return collection;
}

export async function fetchHomepage() {
  if (USE_MOCK_DATA) {
    return mockHomepage;
  }

  try {
    const homepage = await client.fetch(homepageQuery);
    if (!homepage) {
      return mockHomepage;
    }
    
    const sanitized = sanitizeReferences(homepage, true);
    // Check if sanitization resulted in an empty object (all properties were unresolved references)
    if (isEmptyObject(sanitized)) {
      return mockHomepage;
    }
    
    return sanitized;
  } catch (error) {
    console.error("Error fetching homepage, using mock data:", error);
    return mockHomepage;
  }
}

export async function fetchFeaturedProducts() {
  let products;
  
  if (USE_MOCK_DATA) {
    products = getMockFeaturedProducts();
  } else {
    try {
      products = await client.fetch(featuredProductsQuery);
      products = products || [];
      // Sanitize any unresolved references
      products = sanitizeReferences(products, false);
      // Process images to URLs
      products = processProductsImages(products);
    } catch (error) {
      console.error("Error fetching featured products, using mock data:", error);
      products = getMockFeaturedProducts();
    }
  }

  // Enrich with dynamic prices
  return enrichProductsWithDynamicPrices(products);
}

/**
 * Enrich a single product with calculated dynamic price
 * @param product Product object
 * @returns Product with calculatedPrice field if dynamic pricing is enabled
 */
export async function enrichProductWithDynamicPrice(
  product: any
): Promise<any> {
  if (!product || product.pricing_model !== "dynamic") {
    return product;
  }

  try {
    const calculatedPrice = await calculateTotalPrice(product as Product);
    return {
      ...product,
      calculatedPrice,
      displayPrice: calculatedPrice || product.price,
    };
  } catch (error) {
    console.error(
      `Error calculating price for product ${product._id}:`,
      error
    );
    return {
      ...product,
      displayPrice: product.price,
    };
  }
}

/**
 * Enrich multiple products with calculated dynamic prices
 * Uses batch processing for efficiency
 * @param products Array of product objects
 * @returns Array of products with calculatedPrice fields
 */
export async function enrichProductsWithDynamicPrices(
  products: any[]
): Promise<any[]> {
  if (!products || products.length === 0) {
    return products;
  }

  try {
    const enrichedProducts = await calculatePricesForProducts(
      products as Product[]
    );

    return enrichedProducts.map((product) => ({
      ...product,
      displayPrice:
        product.calculatedPrice !== undefined
          ? product.calculatedPrice
          : product.price,
    }));
  } catch (error) {
    console.error("Error enriching products with dynamic prices:", error);
    // Return products with base prices as fallback
    return products.map((product) => ({
      ...product,
      displayPrice: product.price,
    }));
  }
}

