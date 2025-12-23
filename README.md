# THE GRAND GOLD & DIAMONDS - Luxury Jewelry Website

A luxury jewelry e-commerce website built with Next.js 15, featuring culturally inclusive design, AR try-on capabilities, and Sanity CMS integration.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Custom components with Framer Motion
- **CMS**: Sanity
- **AR**: MediaPipe FaceMesh (2D) + Google Model Viewer (3D)
- **Deployment**: Railway

## Features

- 🎨 Luxury design with cultural inclusivity
- 📱 Mobile-first responsive design
- 🎭 AR Try-On (2D face tracking + 3D model viewing)
- 🌍 Multicultural collections and filtering
- ⚡ Optimized performance with Next.js Image
- 🎬 Smooth animations with Framer Motion
- 📊 Sanity CMS for content management
- 💰 Dynamic gold-based pricing with real-time market rates

## Getting Started

### Prerequisites

- Node.js 20+ (or use the version specified in `.nvmrc` if available)
- npm or yarn
- Sanity project ID and dataset

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Sanity credentials and Metals.Dev API key:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_api_token
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   
   # Metals.Dev for dynamic gold pricing (optional)
   METALS_API_KEY=your_metals_dev_api_key
   METALS_API_BASE_URL=https://api.metals.dev/v1
   
   # Optional: Secret for scheduled price updates (cron job)
   CRON_SECRET=your_random_secret_string
   ```
   
   **Note**: 
   - If `METALS_API_KEY` is not set, the system will use fallback gold prices.
   - Get your free API key from [Metals.Dev](https://metals.dev/) (100 requests/month free, $1.79/month for 2,000 requests).
   - The `CRON_SECRET` is optional but recommended for securing the scheduled price update endpoint.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app
  /api          # API routes
  /ar-try-on    # AR try-on page
  /collections  # Collection pages
  /products     # Product pages
  /shop         # Category pages
  /our-story    # About page
  /store        # Store & contact page
  layout.tsx    # Root layout
  page.tsx      # Homepage
  globals.css   # Global styles

/components
  # Layout components
  Navigation.tsx
  Footer.tsx
  
  # Homepage components
  HeroSection.tsx
  BrandValuesSection.tsx
  CulturalBanner.tsx
  CollectionSection.tsx
  FeaturedCollections.tsx
  ARTeaser.tsx
  InaugurationAnnouncement.tsx
  Testimonials.tsx
  
  # Product components
  ProductCard.tsx
  ProductGrid.tsx
  ProductFilters.tsx
  CategoryCarousel.tsx
  
  # AR components
  ARViewer2D.tsx
  ARViewer3D.tsx
  ARPlacementUI.tsx
  ProductARButton.tsx

/lib
  /sanity       # Sanity client and queries
  /ar           # AR utilities
  utils.ts      # Utility functions

/sanity
  /schemas      # Sanity content schemas
```

## Sanity Setup

1. Create a new Sanity project or use an existing one
2. Install Sanity CLI:
   ```bash
   npm install -g @sanity/cli
   ```

3. Initialize Sanity in the project:
   ```bash
   sanity init
   ```

4. Import the schemas from `/sanity/schemas` into your Sanity studio

## AR Features

### 2D AR (Face Tracking)
- Uses MediaPipe FaceMesh for real-time face tracking
- Supports necklaces and earrings
- Works in browser with camera access

### 3D AR (Model Viewer)
- Uses Google Model Viewer for 3D model display
- Supports WebXR, Scene Viewer, and Quick Look
- Works on iOS and Android devices

## Dynamic Pricing

The application supports dynamic pricing based on real-time gold market prices:

- **Metals.Dev API Integration**: Fetches current gold prices from Metals.Dev (free tier: 100 requests/month, paid: $1.79/month for 2,000 requests)
- **Automatic Calculation**: Prices calculated as (Gold Price × Weight × Purity) + Stone Value + Labor Cost
- **Pricing Models**: Products can use "fixed" or "dynamic" pricing
- **Product Fields**: 
  - `gold_weight`: Weight in grams
  - `stones`: Array of stone details (type, size, weight, quantity)
  - `labor_cost`: Base labor/markup cost
  - `pricing_model`: "dynamic" or "fixed"
- **Caching Strategy**: 
  - In-memory cache: 1 hour
  - Persistent file cache: 12 hours (updated twice daily via scheduled jobs)
  - Prices fetched twice daily (8 AM and 5 PM British time) to minimize API calls
  - **Total API calls: ~62/month** (2 calls/day × 31 days)
- **Fallback**: Uses base price if API is unavailable
- **Product Price Updates**: After fetching metal prices, all products with dynamic pricing are automatically updated using stored prices (no additional API calls)

### Scheduled Price Updates

The system is configured to fetch metal prices **twice daily** at **8 AM and 5 PM British time**:

**🚨 IMPORTANT: Cron Setup Depends on Deployment Platform**

**For Vercel Deployments:**
- Already configured in `vercel.json`
- Runs automatically at 8:00 UTC and 17:00 UTC
- No additional setup required

**For Railway Deployments (Current Setup):**
- **Railway does NOT support `vercel.json` cron configuration**
- **You MUST use an external cron service** (see below)
- See `RAILWAY_CRON_SETUP.md` for detailed setup instructions

**Option 1: External Cron Service (Recommended for Railway)**
- Use services like [cron-job.org](https://cron-job.org) (free) or [EasyCron](https://www.easycron.com)
- Schedule POST requests to: `https://thegrand-production.up.railway.app/api/gold-price/scheduled`
- Include header: `Authorization: Bearer YOUR_CRON_SECRET`
- Schedule 1: `0 8 * * *` (8:00 UTC daily - 9 AM BST / 8 AM GMT)
- Schedule 2: `0 17 * * *` (17:00 UTC daily - 6 PM BST / 5 PM GMT)
- **Before setting up**: Make sure `CRON_SECRET` is set in Railway environment variables

**What Happens During Scheduled Updates:**
1. Single API call to Metals.Dev fetches all metal prices (gold, platinum)
2. Prices stored in persistent cache
3. All products with `pricing_model: "dynamic"` are automatically updated
4. Product prices calculated using stored metal prices (no additional API calls)

**Manual Update**
- Call `GET /api/gold-price/scheduled?action=update` with authentication

**Cron Schedule Times (UTC)**
- **Morning**: `0 8 * * *` = 8:00 UTC (9:00 AM BST / 8:00 AM GMT)
- **Evening**: `0 17 * * *` = 17:00 UTC (6:00 PM BST / 5:00 PM GMT)
- Note: BST (British Summer Time) is UTC+1, GMT is UTC+0. Most of the year (March-October), the UK is on BST.

### Testing the Price System

**Test the price update endpoint:**
```bash
npx tsx scripts/test-cron-endpoint.ts
```

**Test the price calculation system:**
```bash
npm run test:prices
# Or directly:
npx tsx scripts/test-price-system.ts
```

The test script will:
- Check if stored prices exist and are valid
- Test price fetching from Metals.Dev API
- Test product price calculations
- Show summary of all products with dynamic pricing

### Monitoring

Monitor the price system health and recent updates:

**Health Check:**
```bash
curl https://your-domain.com/api/gold-price/monitoring
```

**With Recent Logs:**
```bash
curl https://your-domain.com/api/gold-price/monitoring?logs=true&limit=20
```

The monitoring endpoint provides:
- System health status
- Last update time and validity
- Product counts
- Recent update logs with timestamps and durations

## Deployment

### Railway

1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Railway will automatically detect Next.js and deploy

### Environment Variables for Production

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`
- `NEXT_PUBLIC_SITE_URL`
- `METALS_API_KEY` (optional, for dynamic gold pricing - get from [Metals.Dev](https://metals.dev/))
- `METALS_API_BASE_URL` (optional, defaults to https://api.metals.dev/v1)
- `CRON_SECRET` (optional, for securing scheduled price update endpoint)

## Performance Optimization

- Next.js Image optimization for all assets
- Static generation where possible
- Lazy loading for AR modules
- Sanity CDN for images
- Code splitting for optimal bundle size

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## E-Commerce Features

### User Management
- **User Accounts**: Registration, login, and profile management
- **Roles & Permissions**: 
  - Customer (default)
  - Staff (can view/edit orders)
  - Manager (can manage products, users, analytics)
  - Admin (full access)
- **User Profiles**: Complete user data including addresses, preferences, WhatsApp number
- **Role-Based Access Control**: Permissions system for different user roles

### Shopping Cart
- Add products to cart
- Update quantities
- Remove items
- Persistent cart (localStorage)
- Cart icon in navigation with item count

### Checkout Process
- Shipping address form
- Billing address (can be same as shipping)
- Payment method selection (Stripe, Bank Transfer, Cash on Delivery)
- Order summary with totals
- Customer notes field

### Payment Processing
- **Stripe Integration**: Credit/debit card payments
- Payment Intent creation
- Secure payment processing
- Payment status tracking

### Order Management
- Order creation and storage in Sanity
- Order confirmation pages
- Order history for users
- Order status tracking (pending, confirmed, processing, shipped, delivered, cancelled)
- Payment status tracking (pending, processing, paid, failed, refunded)
- Tracking number support
- Admin order management

### Notifications
- **Email Notifications**: Order confirmations and status updates via Resend
- **WhatsApp Notifications**: Order confirmations and status updates via WhatsApp Business API
- Marketing communications support

### WhatsApp Integration
- WhatsApp Business API integration
- Order confirmation messages
- Order status update messages
- Marketing message support
- Bulk messaging capabilities
- User preferences for WhatsApp marketing

## Environment Variables

### Required
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`
- `NEXT_PUBLIC_SITE_URL`

### Optional
- `METALS_API_KEY` - For dynamic gold pricing
- `METALS_API_BASE_URL` - Defaults to https://api.metals.dev/v1
- `CRON_SECRET` - For securing scheduled price updates
- `STRIPE_SECRET_KEY` - For payment processing
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - For Stripe frontend
- `WHATSAPP_API_KEY` - For WhatsApp Business API
- `WHATSAPP_PHONE_NUMBER_ID` - WhatsApp phone number ID
- `WHATSAPP_API_URL` - Defaults to https://graph.facebook.com/v18.0
- `RESEND_API_KEY` - For email notifications
- `EMAIL_FROM` - Default email sender address
- `NEXTAUTH_SECRET` - For NextAuth.js session encryption
- `NEXTAUTH_URL` - Your application URL

## License

Proprietary - All rights reserved

## Contact

For inquiries, visit the [Store & Contact page](/store) or submit an enquiry through the website.

