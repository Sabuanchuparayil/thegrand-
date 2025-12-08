# 🗄️ Database & Backend Setup Guide

## 📊 Architecture Overview

Your application uses:
- **Database**: **Sanity CMS** (Headless CMS - NoSQL database)
- **Backend**: **Next.js API Routes** (Serverless functions)
- **No traditional database needed** - Sanity handles all data storage

---

## 🎯 What's Already Configured

✅ **Sanity CMS** - Connected and configured  
✅ **API Routes** - All backend endpoints created  
✅ **Schemas** - Database schemas defined  
✅ **Environment Variables** - Set in Railway  

**You just need to set up Sanity Studio (admin interface) to manage content!**

---

## 🗄️ Database Setup (Sanity CMS)

### **What is Sanity CMS?**

Sanity is your database and content management system. It stores:
- Products
- Collections
- Users
- Orders
- Homepage content

**No SQL database needed** - Sanity handles everything!

---

## 📋 Step 1: Install Sanity CLI

```bash
npm install -g @sanity/cli
```

Verify installation:
```bash
sanity --version
```

---

## 📋 Step 2: Initialize Sanity Studio

**Option A: Initialize in your project (Recommended)**

```bash
cd "/Users/apple/Desktop/Grand Gold/The grand -Sabu"

# Initialize Sanity Studio
sanity init --env
```

When prompted:
- **Select**: "Create new project" or "Use existing project"
- **Project ID**: `se74u26p` (your existing project)
- **Dataset**: `production`
- **Output path**: `./sanity-studio` (or press Enter for default)
- **Template**: Choose "Clean project with no predefined schemas"

**Option B: Use Sanity Studio Online**

You can also manage content directly in Sanity Studio online:
- Visit: https://se74u26p.sanity.studio
- Login with your Sanity account
- Start adding content

---

## 📋 Step 3: Import Schemas to Sanity Studio

After initializing Sanity Studio, you need to import your schemas:

### **If you initialized Sanity Studio locally:**

1. **Copy schemas to Sanity Studio:**
   ```bash
   # If Sanity Studio is in ./sanity-studio
   cp -r sanity/schemas sanity-studio/schemas/
   ```

2. **Update `sanity-studio/schemas/index.ts`:**
   ```typescript
   import collection from "./collection";
   import homepage from "./homepage";
   import product from "./product";
   import user from "./user";
   import order from "./order";

   export const schemaTypes = [product, collection, homepage, user, order];
   ```

3. **Update `sanity-studio/sanity.config.ts`:**
   ```typescript
   import {defineConfig} from 'sanity'
   import {deskTool} from 'sanity/desk'
   import {schemaTypes} from './schemas'

   export default defineConfig({
     name: 'the-grand',
     title: 'THE GRAND GOLD & DIAMONDS',
     projectId: 'se74u26p',
     dataset: 'production',
     plugins: [deskTool()],
     schema: {
       types: schemaTypes,
     },
   })
   ```

4. **Run Sanity Studio:**
   ```bash
   cd sanity-studio
   npm install
   npm run dev
   ```

5. **Access Studio**: http://localhost:3333

---

## 📋 Step 4: Add Content to Sanity

Once Sanity Studio is running:

### **Add Products:**
1. Go to "Products" in Sanity Studio
2. Click "Create new"
3. Fill in:
   - Name, description, slug
   - Images
   - Category, price
   - Gold weight, stones (for dynamic pricing)
   - AR overlays/models (optional)
4. Save and publish

### **Add Collections:**
1. Go to "Collections"
2. Create collections like:
   - Bridal & Wedding
   - Contemporary
   - Heritage Classics
   - etc.

### **Add Homepage Content:**
1. Go to "Homepage"
2. Add hero banner content
3. Set featured collections
4. Configure homepage sections

### **Users & Orders:**
- Users are created automatically when they sign up
- Orders are created automatically during checkout
- You can view/manage them in Sanity Studio

---

## 🔧 Backend API Routes (Already Set Up)

Your backend consists of **Next.js API Routes** - all already created:

### **Authentication API:**
- `/api/auth/[...nextauth]` - NextAuth.js authentication
- `/api/auth/signup` - User registration

### **User Management:**
- `/api/users/me` - Get current user
- `/api/users/update` - Update user profile

### **Orders:**
- `/api/orders/create` - Create new order

### **Gold Pricing:**
- `/api/gold-price/route` - Get current gold prices
- `/api/gold-price/scheduled` - Scheduled price updates
- `/api/gold-price/monitoring` - System health monitoring

### **GDPR:**
- `/api/gdpr/export` - Export user data
- `/api/gdpr/delete` - Delete user account

### **WhatsApp:**
- `/api/whatsapp/send` - Send WhatsApp messages

### **Inquiry:**
- `/api/inquiry` - Contact form submissions

**All API routes are ready to use - no additional setup needed!**

---

## 🔐 Database Schema Overview

Your Sanity database has these schemas:

### **1. Product Schema**
- Product information
- Images, pricing, categories
- Gold weight, stones (for dynamic pricing)
- AR overlays and 3D models

### **2. Collection Schema**
- Collection information
- Hero images
- Featured products

### **3. User Schema**
- User accounts
- Profiles, addresses
- Roles (customer, admin, manager, staff)
- Preferences

### **4. Order Schema**
- Order details
- Items, totals
- Shipping/billing addresses
- Payment status
- Tracking information

### **5. Homepage Schema**
- Homepage content
- Hero banner
- Featured collections
- Marketing content

---

## 🚀 Quick Setup (Simplified)

### **Option 1: Use Sanity Studio Online (Easiest)**

1. **Visit Sanity Studio**: https://se74u26p.sanity.studio
2. **Login** with your Sanity account
3. **Start adding content**:
   - Products
   - Collections
   - Homepage content

**No local setup needed!**

### **Option 2: Local Sanity Studio**

```bash
# Install Sanity CLI
npm install -g @sanity/cli

# Navigate to project
cd "/Users/apple/Desktop/Grand Gold/The grand -Sabu"

# Initialize (use existing project: se74u26p)
sanity init --env

# Follow prompts, then import schemas
# (See detailed steps above)
```

---

## 📊 Database Connection

Your app is already connected to Sanity:

- **Project ID**: `se74u26p`
- **Dataset**: `production`
- **API Token**: Set in Railway environment variables
- **Connection**: Automatic via `lib/sanity/client.ts`

**No additional database connection setup needed!**

---

## 🔄 How Data Flows

```
User Action → Next.js API Route → Sanity CMS → Response → Frontend
```

**Example: Adding to Cart**
1. User clicks "Add to Cart"
2. Frontend stores in localStorage (client-side)
3. On checkout, `/api/orders/create` creates order
4. Order saved to Sanity CMS
5. User sees confirmation

**Example: Viewing Products**
1. User visits `/shop`
2. Next.js fetches from Sanity: `fetchProducts()`
3. Products displayed on page
4. Dynamic pricing calculated if needed

---

## 🛠️ Backend API Endpoints

All endpoints are ready. Here's what they do:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/[...nextauth]` | GET/POST | Authentication |
| `/api/auth/signup` | POST | User registration |
| `/api/users/me` | GET | Get current user |
| `/api/users/update` | PUT | Update user |
| `/api/orders/create` | POST | Create order |
| `/api/gold-price/route` | GET | Get gold prices |
| `/api/gold-price/scheduled` | POST | Update prices (cron) |
| `/api/gdpr/export` | GET | Export user data |
| `/api/gdpr/delete` | POST | Delete account |
| `/api/whatsapp/send` | POST | Send WhatsApp |
| `/api/inquiry` | POST | Contact form |

**All endpoints are functional - no additional backend setup needed!**

---

## ✅ Setup Checklist

### **Database (Sanity CMS):**
- [ ] Install Sanity CLI: `npm install -g @sanity/cli`
- [ ] Access Sanity Studio: https://se74u26p.sanity.studio
- [ ] OR initialize local studio: `sanity init --env`
- [ ] Import schemas (if using local studio)
- [ ] Add products to Sanity
- [ ] Add collections to Sanity
- [ ] Configure homepage content

### **Backend (API Routes):**
- [x] ✅ All API routes created
- [x] ✅ Authentication configured
- [x] ✅ Order management ready
- [x] ✅ User management ready
- [x] ✅ Gold pricing API ready
- [x] ✅ All endpoints functional

### **Environment Variables:**
- [x] ✅ Sanity credentials set in Railway
- [x] ✅ All required variables configured

---

## 🎯 Next Steps

1. **Set up Sanity Studio** (choose one):
   - **Online**: https://se74u26p.sanity.studio (easiest)
   - **Local**: Follow steps above

2. **Add Content**:
   - Products
   - Collections
   - Homepage content

3. **Test Your App**:
   - Visit: https://thegrand-production.up.railway.app
   - Products should display
   - Navigation should work

---

## 📚 Resources

- **Sanity Docs**: https://www.sanity.io/docs
- **Sanity Studio**: https://se74u26p.sanity.studio
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## 💡 Important Notes

1. **No SQL Database Needed**: Sanity CMS handles all data storage
2. **Backend is Ready**: All API routes are functional
3. **Just Add Content**: Set up Sanity Studio and start adding products
4. **Automatic Sync**: Changes in Sanity appear on your website automatically

---

## 🎉 Summary

✅ **Database**: Sanity CMS (configured)  
✅ **Backend**: Next.js API Routes (ready)  
⏳ **Action Needed**: Set up Sanity Studio and add content  

**Your database and backend are already set up - you just need to add content!**


