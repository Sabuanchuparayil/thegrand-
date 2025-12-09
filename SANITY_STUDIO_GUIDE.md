# 🎨 Sanity Studio Management Guide

## 📍 Accessing Sanity Studio

### Local Development
```bash
npm run dev
```
Then visit: `http://localhost:3011/sanity-studio`

### Production (Railway)
Visit: `https://your-app-name.up.railway.app/sanity-studio`

---

## 🗂️ Content Types Available

Your Sanity Studio is configured to manage the following content types:

### 1. **Products** 📦
Manage all jewelry products with:
- Product name, description, and pricing
- Fixed or dynamic (gold-based) pricing
- Gold/metal weight (for dynamic pricing)
- Stone details (type, size, weight, quantity)
- Labor/markup costs
- Product images (multiple images supported)
- AR 2D overlay (PNG for virtual try-on)
- AR 3D model (GLB/USDZ files)
- 360° product videos
- Collection assignment
- Category (Necklaces, Earrings, Rings, etc.)
- Cultural tags
- Gemstone and material types
- Featured product flag

**Location in Studio**: Content → Products

### 2. **Collections** 🎨
Manage product collections with:
- Collection title and description
- Hero image (required)
- Cultural audience tags
- Display priority (for homepage ordering)

**Location in Studio**: Content → Collections

### 3. **Homepage** 🏠
Manage homepage content with:
- Hero banner (video or image)
- Headline and subheadline
- Featured collections
- AR try-on highlight section
- Inauguration event details

**Location in Studio**: Content → Homepage

### 4. **Orders** 📋
View and manage customer orders:
- Order details
- Customer information
- Order status
- Payment information

**Location in Studio**: Content → Orders

### 5. **Users** 👥
Manage user accounts:
- User profiles
- Account information
- User roles

**Location in Studio**: Content → Users

---

## 🚀 Getting Started

### Step 1: Create Your First Collection

1. Go to **Content → Collections**
2. Click **Create new**
3. Fill in:
   - **Title**: e.g., "Bridal Collection"
   - **Slug**: Auto-generated from title
   - **Hero Image**: Upload a high-quality image (1200x800px recommended)
   - **Description**: Describe the collection
   - **Cultural Audience**: Select relevant tags
   - **Display Priority**: Higher numbers appear first
4. Click **Publish**

### Step 2: Create Your First Product

1. Go to **Content → Products**
2. Click **Create new**
3. Fill in required fields:
   - **Product Name**: e.g., "Traditional Gold Necklace"
   - **Slug**: Auto-generated
   - **Category**: Select from dropdown
   - **Images**: Upload at least one product image
4. Configure pricing:
   - **Pricing Model**: Choose "Fixed Price" or "Dynamic (Gold-based)"
   - If dynamic: Enter **Gold Weight** in grams
   - Enter **Price** (for fixed) or **Labor Cost** (for dynamic)
5. Add product details:
   - **Description**
   - **Collection**: Link to a collection
   - **Cultural Tags**: Select relevant tags
   - **Material Type**: e.g., "22k Gold"
   - **Gemstone Type**: If applicable
6. Add AR content (optional):
   - **AR 2D Overlay**: Upload PNG with transparent background
   - **AR 3D Model**: Upload GLB or USDZ file
   - **360° Product Video**: Add video URL
7. Click **Publish**

### Step 3: Configure Homepage

1. Go to **Content → Homepage**
2. Click **Create new** (or edit existing)
3. Configure:
   - **Hero Banner**: Upload video or image
   - **Headline** and **Subheadline**
   - **Featured Collections**: Link to collections
   - **AR Try-On Highlight**: Add promotional content
   - **Inauguration Event**: Add event details if applicable
4. Click **Publish**

---

## 💡 Best Practices

### Product Images
- **Recommended size**: 800x800px minimum
- **Format**: JPG or PNG
- **First image**: Will be the main product image
- **Alt text**: Required for SEO and accessibility

### AR Content
- **2D Overlay**: PNG format, transparent background, 800x800px
- **3D Model**: GLB or USDZ format
- **360° Video**: MP4 format, max 20 seconds recommended

### Collections
- **Hero Image**: 1200x800px, high quality
- **Display Priority**: Use to control homepage ordering

### Dynamic Pricing
- **Gold Weight**: Required in grams for dynamic pricing
- **Labor Cost**: Base cost added to gold value
- System calculates final price based on current gold market rates

---

## 🔍 Searching and Filtering

- Use the search bar at the top to find content
- Filter by document type using the sidebar
- Sort by creation date (newest first by default)

---

## 📤 Publishing Workflow

1. **Draft**: Content is saved but not visible on the site
2. **Publish**: Content becomes live on the website
3. **Unpublish**: Remove content from the site (keeps in Sanity)

---

## 🔐 Permissions

- **Editor**: Can create, edit, and publish content
- **Viewer**: Can view but not edit content
- **Admin**: Full access to all features

---

## 🆘 Troubleshooting

### Can't see Sanity Studio
- Check that environment variables are set correctly
- Verify project ID: `m215e86r`
- Check Railway logs for errors

### Images not uploading
- Check file size (max 10MB recommended)
- Verify file format (JPG, PNG for images)
- Check internet connection

### Changes not appearing on site
- Ensure content is **Published** (not just saved as draft)
- Check that the frontend is fetching from the correct dataset
- Verify API token has read permissions

### AR content not working
- Verify file formats (PNG for 2D, GLB/USDZ for 3D)
- Check file sizes (keep under 5MB for 3D models)
- Ensure URLs are accessible (for 360° videos)

---

## 📚 Additional Resources

- **Sanity Documentation**: https://www.sanity.io/docs
- **Sanity Studio Guide**: https://www.sanity.io/docs/studio
- **Project Dashboard**: https://www.sanity.io/manage/project/m215e86r

---

## ✅ Quick Checklist

Before going live:
- [ ] At least one collection created and published
- [ ] At least one product created and published
- [ ] Homepage content configured
- [ ] Product images uploaded
- [ ] Collections have hero images
- [ ] All content is published (not drafts)

---

**Happy Content Managing! 🎉**

