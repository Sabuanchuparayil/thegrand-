# Mock Images in Production

## ✅ Status: Mock Images Already Work in Production

The mock images used in development are **already accessible in production** because they use **Unsplash CDN URLs**, which are publicly accessible from anywhere.

## How Mock Images Work

### Current Implementation

1. **Mock Data Location**: `/lib/mock-data.ts`
2. **Image Source**: Unsplash CDN (publicly accessible)
3. **Automatic Fallback**: When Sanity is not configured, the app automatically uses mock data with Unsplash images

### Example Mock Image URLs

```typescript
images: [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
  // ... more images
]
```

These URLs:
- ✅ Work in development
- ✅ Work in production
- ✅ Are publicly accessible
- ✅ Load fast (CDN)
- ✅ Are free to use

## Image Upload Parameters Added

All Sanity image fields now include:

1. **Upload Parameters**:
   - File type restrictions (`accept: "image/*"` or `accept: "image/png"`)
   - Metadata options (blurhash, lqip, palette, exif)
   - Hotspot for responsive cropping

2. **Alt Text Fields**:
   - Required for SEO and accessibility
   - Clear descriptions for each image

3. **Helpful Descriptions**:
   - Recommended dimensions
   - Format suggestions
   - Usage context

### Updated Schemas

- ✅ `sanity/schemas/product.ts` - Product images
- ✅ `sanity/schemas/collection.ts` - Collection hero images
- ✅ `sanity/schemas/homepage.ts` - Hero banner, AR highlight, inauguration images
- ✅ `sanity/schemas/product.ts` - AR 2D overlay images

## Replacing Mock Images with Your Own

### Option 1: Upload to Sanity (Recommended)

1. **Access Sanity Studio**: `https://your-site.com/sanity-studio`
2. **Navigate to Products/Collections**:
   - Go to Products → Select a product
   - Click on "Images" field
   - Click "Upload" or drag & drop images
   - Fill in Alt Text for each image
   - Save

3. **Benefits**:
   - Images stored in Sanity CDN
   - Automatic optimization
   - Easy management through Studio
   - Version control

### Option 2: Replace Mock Data URLs

1. **Host Images Elsewhere**:
   - Upload to your own CDN
   - Use image hosting service
   - Store in `/public/images/` (for static images)

2. **Update Mock Data**:
   ```typescript
   // In /lib/mock-data.ts
   images: [
     "https://your-cdn.com/images/product-1.jpg",
     "https://your-cdn.com/images/product-2.jpg",
   ]
   ```

### Option 3: Use Sanity Asset API

You can programmatically upload images to Sanity:

```typescript
import { client } from "@/lib/sanity/client";

// Upload image from URL
const asset = await client.assets.upload("image", imageBuffer, {
  filename: "product-image.jpg",
});

// Use asset._id in your product
```

## Image Requirements

### Product Images
- **Recommended Size**: 800x800px minimum
- **Format**: JPG or PNG
- **Aspect Ratio**: 1:1 (square) preferred
- **File Size**: Under 2MB per image
- **Quantity**: At least 1, recommended 3-5 images

### Collection Hero Images
- **Recommended Size**: 1200x800px
- **Format**: JPG or PNG
- **Aspect Ratio**: 3:2 or 16:9
- **File Size**: Under 3MB

### Homepage Hero Banner
- **Recommended Size**: 1920x1080px
- **Format**: JPG or PNG
- **Aspect Ratio**: 16:9
- **File Size**: Under 5MB

### AR 2D Overlay
- **Recommended Size**: 800x800px
- **Format**: PNG (with transparency)
- **Aspect Ratio**: 1:1 (square)
- **Background**: Transparent

## Current Production Status

✅ **Mock images are working** - Unsplash URLs are accessible
✅ **Upload parameters added** - All image fields have helpful descriptions
✅ **Alt text fields added** - SEO and accessibility ready
✅ **Sanity Studio ready** - Upload images through the admin interface

## Next Steps

1. **For Live Testing**: Mock images are already working, no action needed
2. **For Production**: Upload your own images through Sanity Studio
3. **For Custom Images**: Replace URLs in `lib/mock-data.ts` or upload to Sanity

## Environment Variables

No additional environment variables needed for mock images. They work out of the box!

For Sanity image uploads, ensure:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` is set
- `SANITY_API_TOKEN` has write permissions

---

**Note**: Mock images from Unsplash are free to use but should be replaced with your own product images for production use.

