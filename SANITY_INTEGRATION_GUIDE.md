# Sanity CMS Integration Guide

## Overview

This Next.js application uses **Sanity CMS** as a headless content management system to store and manage all product data, collections, homepage content, and orders. This document explains how the application integrates with Sanity and how they work together.

---

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Next.js App    │────────▶│  Sanity CMS      │────────▶│  Sanity Studio  │
│  (Frontend)     │  Fetch  │  (Backend)       │  Edit   │  (Admin UI)     │
│                 │◀────────│                  │◀────────│                 │
└─────────────────┘  Write  └──────────────────┘  Manage └─────────────────┘
```

### Components:
1. **Next.js Application** - React frontend that reads/writes data
2. **Sanity CMS** - Content backend (hosted on Sanity.io)
3. **Sanity Studio** - Admin interface for content management (embedded in app at `/sanity-studio`)

---

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=m215e86r
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token_here
```

### Client Initialization

**File**: `lib/sanity/client.ts`

```typescript
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production", // Uses CDN in production
});
```

**Key Features**:
- Uses CDN for faster reads in production
- Falls back to placeholder during build if projectId is missing
- API version pinned for stability

---

## Data Flow

### 1. Reading Data (Fetch Operations)

#### Process Flow:
```
Page Component → Data Fetcher → Sanity Client → GROQ Query → Sanity API → Processed Data → Component
```

#### Key Files:
- **Queries**: `lib/sanity/queries.ts` - GROQ query strings
- **Fetcher**: `lib/sanity/data-fetcher.ts` - Functions that execute queries
- **Client**: `lib/sanity/client.ts` - Sanity client instance

#### Example: Fetching Products

```typescript
// 1. Query Definition (queries.ts)
export const productQuery = `*[_type == "product"] | order(_createdAt desc) {
  _id,
  name,
  slug,
  description,
  price,
  images,
  category,
  cultural_tags,
  ...
}`;

// 2. Fetch Function (data-fetcher.ts)
export async function fetchProducts() {
  const products = await client.fetch(productQuery);
  // Process images, sanitize references, enrich with prices
  return enrichProductsWithDynamicPrices(products);
}

// 3. Usage in Component
const products = await fetchProducts();
```

#### Data Processing Pipeline:

1. **Fetch from Sanity** - Raw data with Sanity image objects
2. **Sanitize References** - Remove unresolved reference objects
3. **Process Images** - Convert Sanity image objects to URLs
4. **Enrich with Prices** - Add calculated dynamic prices (if applicable)
5. **Return to Component** - Clean, usable data

---

## Content Types (Schemas)

### Product Schema
**File**: `sanity/schemas/product.ts`

**Fields**:
- Basic: `name`, `slug`, `description`, `price`
- Pricing: `pricing_model` (fixed/dynamic), `gold_weight`, `labor_cost`, `stones`
- Media: `images[]`, `ar_2d_overlay`, `ar_3d_model`, `video_360`
- Metadata: `category`, `cultural_tags[]`, `material_type`, `featured`
- Relations: `collection` (reference)

### Collection Schema
**File**: `sanity/schemas/collection.ts`

**Fields**:
- `title`, `slug`, `description`
- `hero_image`
- `cultural_audience`
- `display_priority`

### Homepage Schema
**File**: `sanity/schemas/homepage.ts`

**Fields**:
- `hero_banner` (headline, subheadline, image, video)
- `featured_collections[]` (references)
- `cultural_sections[]`
- `ar_tryon_highlight`
- `inauguration_event`

### Order Schema
**File**: `sanity/schemas/order.ts`

**Fields**:
- Order details: `orderNumber`, `items[]`, `totals`
- Customer: `shippingAddress`, `billingAddress`
- Payment: `paymentMethod`, `paymentStatus`, `orderStatus`

---

## Writing Data (Create/Update Operations)

### 1. Creating Products

**Endpoint**: `POST /api/products/create`
**File**: `app/api/products/create/route.ts`

```typescript
const productData = {
  _type: "product",
  name,
  slug: { _type: "slug", current: slug },
  description,
  price: parseFloat(price),
  category,
  // ... other fields
};

const product = await client.create(productData);
```

**Authentication**: Requires admin or manager role

### 2. Creating Orders

**Endpoint**: `POST /api/orders/create`
**File**: `app/api/orders/create/route.ts`

```typescript
const orderData = {
  _type: "order",
  orderNumber,
  items: items.map(item => ({
    product: { _type: "reference", _ref: item.productId },
    quantity: item.quantity,
    price: item.price,
  })),
  // ... other fields
};

const order = await client.create(orderData);
```

### 3. Updating Product Prices (Dynamic Pricing)

**File**: `lib/gold-price/product-price-updater.ts`

When metal prices are fetched, all products with `pricing_model: "dynamic"` are updated:

```typescript
const updated = await client
  .patch(product._id)
  .set({ price: calculatedPrice })
  .commit();
```

**Automation**: Runs twice daily via scheduled cron jobs

---

## Image Handling

### Image Storage

Images are stored in Sanity's CDN and referenced in documents as image objects:

```typescript
{
  _type: "image",
  asset: {
    _ref: "image-abc123",
    _type: "reference"
  }
}
```

### Image URL Generation

**File**: `lib/sanity/image.ts`

```typescript
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

export function urlForImage(source, width?, height?): string {
  let imageBuilder = builder.image(source);
  if (width) imageBuilder = imageBuilder.width(width);
  if (height) imageBuilder = imageBuilder.height(height);
  return imageBuilder.url();
}
```

**Features**:
- Automatic CDN URLs
- On-the-fly image transformations (resize, crop, format)
- Fallback handling for string URLs or invalid objects

### Image Processing in Data Fetcher

All fetched products have their images processed:

```typescript
function processProductImages(product) {
  // Convert Sanity image objects to URLs
  if (product.images) {
    product.images = product.images.map(img => 
      urlForImage(img)
    );
  }
  return product;
}
```

---

## GROQ Queries

### What is GROQ?

GROQ (Graph-Relational Object Queries) is Sanity's query language, similar to GraphQL but optimized for JSON documents.

### Query Examples

#### Fetch All Products
```groq
*[_type == "product"] | order(_createdAt desc) {
  _id,
  name,
  slug,
  price,
  images
}
```

#### Fetch Product by Slug
```groq
*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  ...
}
```

#### Fetch Products with References
```groq
*[_type == "product"] {
  _id,
  name,
  "collection": collection->{title, "slug": slug.current}
}
```

The `->` operator dereferences document references.

#### Filter Products by Category
```groq
*[_type == "product" && category == $category] | order(_createdAt desc)
```

#### Fetch Related Products
```groq
*[_type == "product" && references(^._id)] {
  _id,
  name,
  ...
}
```

The `^` refers to the parent document in the query.

---

## Data Relationships

### Product → Collection (Many-to-One)

```typescript
// In product schema
defineField({
  name: "collection",
  type: "reference",
  to: [{ type: "collection" }]
})

// In query
"collection": collection->{title, "slug": slug.current}
```

### Collection → Products (One-to-Many)

```groq
// In collection query
"products": *[_type == "product" && references(^._id)] {
  _id,
  name,
  ...
}
```

### Order → Product (Many-to-Many via Items)

```typescript
// Order items contain product references
items: [{
  product: { _type: "reference", _ref: productId },
  quantity: 2,
  price: 1000
}]
```

---

## Fallback System

### Mock Data Fallback

**File**: `lib/sanity/data-fetcher.ts`

If Sanity is unavailable or `NEXT_PUBLIC_USE_MOCK_DATA=true`:

```typescript
const USE_MOCK_DATA = 
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || 
  !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export async function fetchProducts() {
  if (USE_MOCK_DATA) {
    return mockProducts; // Fallback to mock data
  }
  
  try {
    return await client.fetch(productQuery);
  } catch (error) {
    console.error("Error fetching products, using mock data:", error);
    return mockProducts; // Fallback on error
  }
}
```

**Benefits**:
- App continues working during Sanity outages
- Development possible without Sanity connection
- Graceful degradation

---

## Dynamic Pricing Integration

### How It Works

1. **Product Setup**: Product has `pricing_model: "dynamic"` and `gold_weight`
2. **Price Fetching**: Scheduled job fetches metal prices from Metals.Dev API
3. **Price Calculation**: `(Gold Price × Weight × Purity) + Stones + Labor`
4. **Update Sanity**: Product `price` field is updated in Sanity
5. **Display**: Frontend shows calculated price

### Update Process

**File**: `lib/gold-price/product-price-updater.ts`

```typescript
export async function updateAllProductPrices() {
  const products = await client.fetch(productQuery);
  const storedPrices = await getAllStoredPrices();
  
  for (const product of products) {
    if (product.pricing_model === "dynamic") {
      const calculatedPrice = calculateTotalPrice(product, storedPrices);
      
      await client
        .patch(product._id)
        .set({ price: calculatedPrice })
        .commit();
    }
  }
}
```

**Schedule**: Runs twice daily (8 AM & 5 PM UTC) via cron jobs

---

## Sanity Studio Integration

### Access

- **Local**: `http://localhost:3011/sanity-studio`
- **Production**: `https://thegrand-production.up.railway.app/sanity-studio`

### Features

- Visual content editing
- Image upload and management
- Real-time collaboration
- Version history
- Field validation

### Configuration

**File**: `sanity/schemas/index.ts`

All schemas are exported here and registered with Sanity Studio.

---

## Error Handling

### Reference Sanitization

Unresolved references (broken links) are automatically removed:

```typescript
function sanitizeReferences(obj) {
  // If it's a reference object with only _ref and _type
  if (obj._ref && obj._type && Object.keys(obj).length === 2) {
    return null; // Remove unresolved reference
  }
  // Recursively process nested objects
  ...
}
```

### Image Error Handling

```typescript
try {
  return urlForImage(image);
} catch (error) {
  console.error('Error processing image:', error);
  return null; // Fallback to null
}
```

### Fallback Strategy

1. Try Sanity fetch
2. If error → Log error
3. Return mock data or empty array
4. App continues functioning

---

## Performance Optimizations

### 1. CDN Usage

```typescript
useCdn: process.env.NODE_ENV === "production"
```

- Production: Uses Sanity CDN (faster, cached)
- Development: Direct API (always fresh)

### 2. Image Optimization

- Images served from Sanity CDN
- Automatic format optimization (WebP when supported)
- On-the-fly resizing

### 3. Query Optimization

- Fetch only required fields
- Use projections to limit data transfer
- Leverage GROQ's efficiency

### 4. Caching Strategy

- Next.js server-side caching
- Sanity CDN caching (production)
- Image CDN caching

---

## Security

### API Token

- Stored in environment variables (never in code)
- Required for write operations (`create`, `patch`, `delete`)
- Read operations work without token (public)

### Authentication

Write operations (create/update) require:
- Admin or Manager role (via NextAuth session)
- Valid API token in environment

### Field Validation

Sanity schemas enforce:
- Required fields
- Type validation
- Custom validation rules

---

## Key Integration Points

### 1. Product Pages
- `/shop/[category]` - Fetches products by category
- `/products/[slug]` - Fetches single product
- `/shop` - Fetches all products

### 2. Collection Pages
- `/collections` - Lists all collections
- `/collections/[slug]` - Shows collection with products

### 3. Homepage
- `/` - Fetches homepage content, featured collections, featured products

### 4. Admin Panel
- `/admin/products` - Lists products (reads from Sanity)
- `/admin/products/new` - Creates new product (writes to Sanity)

### 5. Orders
- `/api/orders/create` - Creates order in Sanity
- `/orders` - Lists orders (reads from Sanity)

### 6. Dynamic Pricing
- `/api/gold-price/scheduled` - Updates product prices in Sanity

---

## Common Patterns

### Pattern 1: Fetch with Fallback

```typescript
export async function fetchData() {
  if (USE_MOCK_DATA) return mockData;
  
  try {
    const data = await client.fetch(query);
    return processData(data);
  } catch (error) {
    console.error("Error:", error);
    return mockData; // Fallback
  }
}
```

### Pattern 2: Create Document

```typescript
const document = await client.create({
  _type: "product",
  name: "Product Name",
  // ... fields
});
```

### Pattern 3: Update Document

```typescript
await client
  .patch(documentId)
  .set({ price: newPrice })
  .commit();
```

### Pattern 4: Delete Document

```typescript
await client.delete(documentId);
```

---

## Troubleshooting

### Issue: "Cannot find module '@sanity/client'"

**Solution**: `npm install @sanity/client`

### Issue: Products not showing

**Check**:
1. `NEXT_PUBLIC_SANITY_PROJECT_ID` is set
2. Products exist in Sanity Studio
3. Query is correct
4. Check browser console for errors

### Issue: Images not loading

**Check**:
1. Image field is populated in Sanity
2. Image asset exists
3. `urlForImage()` is being called correctly
4. CDN is accessible

### Issue: Cannot create products

**Check**:
1. User is authenticated (admin/manager)
2. `SANITY_API_TOKEN` is set
3. Token has write permissions
4. All required fields are provided

---

## Summary

**Sanity CMS serves as:**
1. ✅ **Content Backend** - Stores all product, collection, and homepage data
2. ✅ **Image Hosting** - CDN for product images and media
3. ✅ **Order Storage** - Persists order data
4. ✅ **Content Management** - Provides admin UI via Sanity Studio

**The Next.js app:**
1. ✅ **Reads** content via GROQ queries
2. ✅ **Writes** content via API routes (products, orders)
3. ✅ **Processes** data (images, prices, references)
4. ✅ **Displays** content in React components
5. ✅ **Falls back** to mock data if Sanity is unavailable

**Key Benefits:**
- 🔄 Real-time content updates (no rebuild needed)
- 📸 Built-in image optimization
- 🔐 Secure content management
- ⚡ Fast CDN delivery
- 🔗 Relationship management (references)
- 💰 Cost-effective (generous free tier)

---

**Last Updated**: 2025-12-23
**Sanity Project ID**: m215e86r
**Dataset**: production

