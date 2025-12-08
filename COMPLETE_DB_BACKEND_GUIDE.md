# Complete Database & Backend Setup Guide

## 🎯 Overview

Your application uses:
- **Database**: Sanity CMS (Headless CMS)
- **Backend**: Next.js API Routes (Serverless Functions)

## 📊 Database: Sanity CMS

### What is Sanity?
Sanity is a headless CMS (Content Management System) that stores your data in the cloud. It's perfect for:
- Product catalog management
- User accounts
- Order tracking
- Content management (homepage, collections, etc.)

### Your Sanity Setup

**Project Details:**
- **Project ID**: `se74u26p`
- **Dataset**: `production`
- **Organization**: Sabu J
- **Studio URL**: `http://localhost:3000/sanity-studio` (local) or `https://your-domain.up.railway.app/sanity-studio` (production)

### Data Models (Schemas)

Your database has 5 main content types:

#### 1. **Product** (`product`)
Stores all jewelry products:
- Basic info: name, description, price, slug
- Media: images, AR overlay images, 3D models
- Metadata: category, tags, cultural tags
- Pricing: base price, weight, purity
- SEO: meta title, description

**Location**: `sanity/schemas/product.ts`

#### 2. **Collection** (`collection`)
Groups products into collections:
- Name and description
- Hero image
- Featured products

**Location**: `sanity/schemas/collection.ts`

#### 3. **Homepage** (`homepage`)
Manages homepage content:
- Hero banner (video/image)
- Featured collections
- Brand values
- Testimonials

**Location**: `sanity/schemas/homepage.ts`

#### 4. **User** (`user`)
Customer and admin accounts:
- Email, name, phone, WhatsApp
- Role (customer, admin, manager, staff)
- Permissions array
- Addresses
- Preferences

**Location**: `sanity/schemas/user.ts`

#### 5. **Order** (`order`)
Customer orders:
- Order number
- User reference
- Items array
- Pricing breakdown
- Shipping/billing addresses
- Payment and order status
- Tracking information

**Location**: `sanity/schemas/order.ts`

### Accessing Your Database

#### Option 1: Sanity Studio (Web UI)
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/sanity-studio`
3. Log in with your Sanity account
4. Manage all content visually

#### Option 2: Sanity Client (Code)
Your app uses the Sanity client to query data:

```typescript
// lib/sanity/client.ts
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: true,
});
```

**Usage in your app:**
- `lib/sanity/data-fetcher.ts` - Fetches products, collections, etc.
- `lib/sanity/queries.ts` - GROQ queries for data
- `lib/auth/auth.ts` - User management
- `lib/orders/orders.ts` - Order management

## 🔧 Backend: Next.js API Routes

### What are API Routes?
Next.js API Routes are serverless functions that handle:
- Authentication
- Order processing
- Payment integration
- Email/WhatsApp notifications
- Gold price fetching
- User management

### Your API Endpoints

#### Authentication (`/app/api/auth/`)
- **`/api/auth/[...nextauth]`** - NextAuth.js authentication
  - Google, Facebook, Apple OAuth
  - Credentials (email/password)
  - Session management

- **`/api/auth/signup`** - User registration
  - Creates new user in Sanity
  - Returns user data

#### Users (`/app/api/users/`)
- **`/api/users/me`** - Get current user
  - Returns logged-in user data from Sanity

- **`/api/users/update`** - Update user profile
  - Updates user data in Sanity

#### Orders (`/app/api/orders/`)
- **`/api/orders/create`** - Create new order
  - Creates Stripe Payment Intent
  - Saves order to Sanity
  - Sends confirmation emails/WhatsApp

#### Gold Pricing (`/app/api/gold-price/`)
- **`/api/gold-price`** - Get current gold price
  - Fetches from Metals.Dev API
  - Returns current gold price per gram

- **`/api/gold-price/monitoring`** - System health check
  - Returns pricing system status

- **`/api/gold-price/scheduled`** - Scheduled price updates
  - Cron job endpoint
  - Updates gold prices periodically

#### WhatsApp (`/app/api/whatsapp/`)
- **`/api/whatsapp/send`** - Send WhatsApp message
  - Sends notifications via WhatsApp Business API

#### GDPR (`/app/api/gdpr/`)
- **`/api/gdpr/export`** - Export user data
  - Returns all user data in JSON format

- **`/api/gdpr/delete`** - Delete user account
  - Removes user data from Sanity

#### Inquiry (`/app/api/inquiry/`)
- **`/api/inquiry`** - Handle contact form submissions
  - Saves inquiries to Sanity
  - Sends email notifications

### How API Routes Work

1. **Request comes in** → Next.js routes to appropriate API route
2. **API route executes** → Server-side code runs
3. **Database operations** → Queries/updates Sanity via client
4. **External services** → Calls Stripe, Resend, WhatsApp API
5. **Response sent** → Returns JSON or redirects

### Example: Creating an Order

```typescript
// app/api/orders/create/route.ts
export async function POST(request: Request) {
  // 1. Get order data from request
  const body = await request.json();
  
  // 2. Create Stripe Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({...});
  
  // 3. Save order to Sanity
  const order = await client.create({
    _type: "order",
    orderNumber: generateOrderNumber(),
    items: body.items,
    // ... more fields
  });
  
  // 4. Send confirmation email
  await sendOrderConfirmationEmail(order);
  
  // 5. Return response
  return Response.json({ order, paymentIntent });
}
```

## 🔄 Data Flow

### Example: User Views Product

1. **User visits** `/products/gold-necklace`
2. **Page component** (`app/products/[slug]/page.tsx`) loads
3. **Fetches product** from Sanity via `lib/sanity/data-fetcher.ts`
4. **Sanity client** queries database using GROQ
5. **Product data** returned and displayed
6. **Dynamic pricing** calculated using current gold price

### Example: User Places Order

1. **User clicks** "Add to Cart" → Cart stored in browser/localStorage
2. **User proceeds** to checkout → `/checkout`
3. **User fills** shipping/billing info
4. **User clicks** "Pay Now" → `/checkout/payment`
5. **Payment page** calls `/api/orders/create`
6. **API route**:
   - Creates Stripe Payment Intent
   - Saves order to Sanity
   - Sends confirmation email/WhatsApp
7. **User redirected** to order confirmation page

## 🔐 Environment Variables

### Required for Database (Sanity)
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=se74u26p
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token
```

### Required for Backend Services
```env
# Authentication
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# Payments
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com

# WhatsApp (optional)
WHATSAPP_API_KEY=your_whatsapp_key
WHATSAPP_PHONE_NUMBER_ID=your_phone_id

# Gold Pricing (optional)
METALS_API_KEY=your_metals_key
```

## 🚀 Deployment

### Railway Setup
All environment variables are already set in Railway:
- ✅ `NEXT_PUBLIC_SANITY_PROJECT_ID=se74u26p`
- ✅ `NEXT_PUBLIC_SANITY_DATASET=production`
- ✅ `SANITY_API_TOKEN=...` (set)
- ✅ `NEXTAUTH_SECRET=...` (set)

### Database Access in Production
- Sanity Studio: `https://your-domain.up.railway.app/sanity-studio`
- API Routes: `https://your-domain.up.railway.app/api/*`
- Same Sanity project, same data

## 📝 Next Steps

### 1. Add Content via Sanity Studio
1. Visit `http://localhost:3000/sanity-studio`
2. Add products, collections, homepage content
3. Content appears immediately on your site

### 2. Test API Routes
- Test authentication: Sign up/login
- Test orders: Add to cart → Checkout → Pay
- Test gold pricing: Check product prices update

### 3. Monitor Your Database
- Use Sanity Studio to view all data
- Check order status
- Manage users
- Update content

## 🎓 Key Concepts

### Headless CMS
- Content stored separately from frontend
- Access via API (REST or GraphQL)
- Sanity uses GROQ (Graph-Relational Object Queries)

### Serverless Functions
- API routes run on-demand
- Auto-scales with traffic
- No server management needed

### Real-time Updates
- Sanity supports real-time subscriptions
- Changes reflect immediately
- Perfect for live content updates

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [NextAuth.js](https://next-auth.js.org/)

## ✅ Summary

**Database**: ✅ Sanity CMS configured and ready
**Backend**: ✅ Next.js API routes implemented
**Studio**: ✅ Sanity Studio accessible at `/sanity-studio`
**Deployment**: ✅ Railway configured with all environment variables

**You're ready to start building!** 🎉


