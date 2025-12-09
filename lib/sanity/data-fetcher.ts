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
 */
function sanitizeReferences(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // If it's a reference object (has _ref and _type but no other meaningful data)
  if (typeof obj === 'object' && obj._ref && obj._type && Object.keys(obj).length === 2) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeReferences(item)).filter(item => item !== null);
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedValue = sanitizeReferences(value);
      if (sanitizedValue !== null) {
        sanitized[key] = sanitizedValue;
      }
    }
    return sanitized;
  }
  
  return obj;
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
      products = sanitizeReferences(products);
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
        product = sanitizeReferences(product);
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
      products = sanitizeReferences(products);
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
    let sanitized = sanitizeReferences(collections || []);
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
        collection = sanitizeReferences(collection);
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
    const sanitized = homepage ? sanitizeReferences(homepage) : mockHomepage;
    return sanitized || mockHomepage;
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
      products = sanitizeReferences(products);
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

