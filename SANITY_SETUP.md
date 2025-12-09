# Sanity CMS Setup Instructions

Your Sanity credentials have been configured. The `.env.local` file has been set up with the correct project details.

```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=m215e86r
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<your-token-here>

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Next Steps

1. **The `.env.local` file** has been configured with the correct project details
2. **Set up Sanity Studio** to manage your content:
   ```bash
   npm install -g @sanity/cli
   sanity init
   ```
   - Use your existing project ID: `m215e86r`
   - Choose the dataset: `production`
   
3. **Import the schemas** from `/sanity/schemas/` into your Sanity Studio:
   - `product.ts` - Product schema
   - `collection.ts` - Collection schema  
   - `homepage.ts` - Homepage content schema

4. **Start adding content** in Sanity Studio:
   - Products with images, AR overlays, and cultural tags
   - Collections with hero images
   - Homepage content (hero banner, featured collections, etc.)

5. **Test the connection** by running:
   ```bash
   npm run dev
   ```
   Then visit http://localhost:3000 to see your content

## Sanity Project Details

- **Project ID**: m215e86r
- **Organization ID**: oSxp0Q0uG
- **Dataset**: production (default)

## Important Notes

- The `.env.local` file is gitignored for security
- Never commit your Sanity API token to version control
- For production deployment, add these environment variables to your Railway (or other hosting) dashboard


