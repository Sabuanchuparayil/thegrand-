# Sanity CMS Setup Instructions

Your Sanity credentials have been configured. Please create a `.env.local` file in the root directory with the following content:

```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=se74u26p
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skcVtCTd4nTlk1bFaB0Lnw1BYg3O6iUJMFp8T0RSv6i46tT8fH3lmDlQxU2nSiSjN5EKX3q52CTgsV5piEc4H3FvxlmoXfxdWcjpRNWSUJuUXyQdZ7ypVQY58TA4n5lR6RnJK2VMe9ljFNlcOacXNPt4wQ7wVhZwlAdy0g8CpTyBz2pCAlp3

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Next Steps

1. **Create the `.env.local` file** with the credentials above
2. **Set up Sanity Studio** to manage your content:
   ```bash
   npm install -g @sanity/cli
   sanity init
   ```
   - Use your existing project ID: `se74u26p`
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

- **Project ID**: se74u26p
- **Organization ID**: oSxp0QOuG
- **Dataset**: production (default)

## Important Notes

- The `.env.local` file is gitignored for security
- Never commit your Sanity API token to version control
- For production deployment, add these environment variables to your Railway (or other hosting) dashboard


