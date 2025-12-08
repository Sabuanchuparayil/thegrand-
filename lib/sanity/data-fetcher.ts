// Data fetcher with fallback to mock data
import { client } from "./client";
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

export async function fetchProducts() {
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
    return collections || [];
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
    return homepage || mockHomepage;
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

