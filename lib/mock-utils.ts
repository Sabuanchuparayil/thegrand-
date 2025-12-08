// Utility functions for using mock data when Sanity is not available

import { mockProducts, mockCollections, mockHomepage } from "./mock-data";

export { mockProducts, mockCollections, mockHomepage };

export function getMockProductBySlug(slug: string) {
  return mockProducts.find((p) => p.slug.current === slug) || null;
}

export function getMockProductsByCategory(category: string) {
  return mockProducts.filter((p) => p.category === category);
}

export function getMockCollectionBySlug(slug: string) {
  // First, check if it's a dynamic collection that needs to be created
  const dynamicCollections: Record<string, { title: string; filter: (p: any) => boolean }> = {
    "traditional-indian": {
      title: "Traditional Indian Bridal",
      filter: (p) => 
        p.cultural_tags?.some((tag: string) => 
          tag.includes("Traditional Indian") || tag.includes("Bridal")
        ),
    },
    "western-engagement": {
      title: "Western Engagement",
      filter: (p) => 
        p.cultural_tags?.some((tag: string) => 
          tag.includes("Western") || tag.includes("Engagement")
        ),
    },
    "afro-caribbean": {
      title: "Afro-Caribbean",
      filter: (p) => 
        p.cultural_tags?.some((tag: string) => 
          tag.includes("Afro-Caribbean")
        ),
    },
  };
  
  // If it's a dynamic collection, create it
  if (dynamicCollections[slug]) {
    const config = dynamicCollections[slug];
    const products = mockProducts.filter(config.filter);
    
    return {
      _id: `mock-col-${slug}`,
      title: config.title,
      slug: { current: slug },
      hero_image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=800&fit=crop",
      description: `Exquisite ${config.title} jewelry collection.`,
      cultural_audience: [],
      display_priority: 0,
      products: products.length > 0 ? products : mockProducts.slice(0, 4),
    };
  }
  
  // Otherwise, try to find an existing collection
  const collection = mockCollections.find((c) => c.slug.current === slug);
  if (!collection) {
    // If not found, return a default collection with some products
    return {
      _id: `mock-col-${slug}`,
      title: slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
      slug: { current: slug },
      hero_image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=800&fit=crop",
      description: `Exquisite jewelry collection.`,
      cultural_audience: [],
      display_priority: 0,
      products: mockProducts.slice(0, 4),
    };
  }
  
  // Add products to collection based on cultural tags
  let products: any[] = [];
  
  switch (slug) {
    case "bridal-wedding":
      products = mockProducts.filter((p) => 
        p.cultural_tags?.some((tag: string) => 
          tag.includes("Bridal") || tag.includes("Wedding")
        )
      );
      break;
    case "contemporary":
      products = mockProducts.filter((p) => 
        p.cultural_tags?.some((tag: string) => 
          tag.includes("Contemporary") || tag.includes("Minimalist")
        )
      );
      break;
    case "heritage-classics":
      products = mockProducts.filter((p) => 
        p.cultural_tags?.some((tag: string) => 
          tag.includes("Traditional") || tag.includes("Heritage")
        )
      );
      break;
    case "middle-eastern":
      products = mockProducts.filter((p) => 
        p.cultural_tags?.some((tag: string) => 
          tag.includes("Middle Eastern")
        )
      );
      break;
    case "minimalist-western":
      products = mockProducts.filter((p) => 
        p.cultural_tags?.some((tag: string) => 
          tag.includes("Western") || tag.includes("Minimalist")
        )
      );
      break;
    default:
      products = mockProducts.slice(0, 4);
  }
  
  return {
    ...collection,
    products: products.length > 0 ? products : mockProducts.slice(0, 4),
  };
}

export function getMockFeaturedProducts() {
  return mockProducts.filter((p) => p.featured);
}

