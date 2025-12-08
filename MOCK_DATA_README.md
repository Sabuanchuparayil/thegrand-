# Mock Data Setup

This project includes mock data with placeholder images for development and testing purposes.

## Mock Data Features

- **8 Sample Products** across different categories (necklaces, rings, earrings, bracelets, bangles, pendants, men's jewelry)
- **4 Sample Collections** with hero images
- **Homepage Content** including hero banner, AR teaser, and inauguration event
- **Placeholder Images** from Unsplash (jewelry-themed)

## Using Mock Data

The project automatically falls back to mock data when:
1. Sanity project ID is not configured
2. `NEXT_PUBLIC_USE_MOCK_DATA=true` is set in `.env.local`

## Mock Data Files

- `/lib/mock-data.ts` - Contains all mock product, collection, and homepage data
- `/lib/mock-utils.ts` - Utility functions for accessing mock data
- `/lib/sanity/data-fetcher.ts` - Smart data fetcher that uses Sanity or falls back to mock data

## Placeholder Images

The mock data uses Unsplash images with jewelry-related searches. These are:
- High quality
- Free to use
- Automatically loaded
- Can be replaced with your own images

### Image Sources Used:
- Jewelry photography from Unsplash
- All images are 800x800px for products, 1200x800px for collections
- Hero images are 1920x1080px

## Replacing Mock Images

To use your own images:

1. **Add images to `/public/images/`**:
   ```bash
   /public/images/
     /products/
       product-1.jpg
       product-2.jpg
     /collections/
       collection-1.jpg
   ```

2. **Update mock data** in `/lib/mock-data.ts`:
   ```typescript
   images: [
     "/images/products/product-1.jpg",
     "/images/products/product-2.jpg",
   ]
   ```

## Video Placeholders

For hero videos, you can:
1. Use placeholder video services
2. Add your own videos to `/public/videos/`
3. Use video URLs from services like Pexels Videos

Example video URL structure:
```typescript
video: "/videos/hero-video.mp4"
// or
video: "https://videos.pexels.com/video-files/your-video.mp4"
```

## Testing with Mock Data

1. **Enable mock data mode**:
   ```bash
   # In .env.local
   NEXT_PUBLIC_USE_MOCK_DATA=true
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **View the site** - All pages will show mock data with placeholder images

## Sample Products Included

1. Traditional Indian Bridal Necklace Set - £12,500
2. Contemporary Minimalist Gold Ring - £850
3. Middle Eastern Ornate Earrings - £2,200
4. Western Engagement Diamond Ring - £3,500
5. Traditional Gold Bangles Set - £1,800
6. Afro-Caribbean Gold Pendant - £950
7. Men's Gold Chain - £1,200
8. Pearl and Gold Bracelet - £1,500

## Sample Collections Included

1. Bridal & Wedding Collection
2. Contemporary Minimalist
3. Heritage Classics
4. Middle Eastern Ornate

All collections include:
- Hero images
- Descriptions
- Cultural audience tags
- Display priorities

## Next Steps

Once you have real content in Sanity:
1. Remove `NEXT_PUBLIC_USE_MOCK_DATA=true` from `.env.local`
2. The site will automatically use Sanity data
3. Mock data will only be used as a fallback if Sanity fails


