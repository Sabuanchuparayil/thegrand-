# 🏠 Homepage Content Setup Guide

## Overview

This guide explains how to set up and manage homepage content in Sanity Studio. The homepage displays hero banners, cultural sections, featured collections, AR highlights, and inauguration events.

## Accessing Homepage Content

1. **Open Sanity Studio**: Navigate to `https://thegrand-production.up.railway.app/sanity-studio`
2. **Find Homepage**: In the left sidebar, click on **"Homepage"** under Content
3. **Create Homepage Document**: If you see "No documents of this type", click the **"+"** button to create a new homepage document

## Setting Up Homepage Sections

### 1. Hero Banner

The hero banner appears at the top of your homepage.

**Fields to Fill:**
- **Headline**: Main headline text (e.g., "Timeless Elegance, Cultural Heritage")
- **Subheadline**: Supporting text (e.g., "Discover our exquisite collection...")
- **Hero Video** (Optional): Upload a video file for the hero section
- **Hero Image** (Fallback): Upload an image that displays if video is not available
  - Recommended size: 1920x1080px
  - Format: JPG or PNG
  - **Alt Text**: Describe the image for SEO and accessibility

### 2. Cultural Sections with Icons ✨

This is a new feature that allows you to add cultural highlights with icons to your homepage.

**How to Add Cultural Sections:**

1. Click **"Add item"** in the Cultural Sections field
2. Fill in the following fields:

   **Required Fields:**
   - **Title**: Name of the cultural collection (e.g., "Diwali Collection", "Eid Collection")
   - **Description**: Brief description of the collection or event
   - **Icon**: Choose an emoji icon from the dropdown:
     - 🪔 Diwali Lamp
     - 🌙 Crescent Moon (for Eid)
     - 💍 Ring (for weddings)
     - 🎄 Christmas Tree
     - 👑 Crown
     - ⭐ Star
     - ✨ Sparkles
     - 💎 Gem
     - 🏛️ Temple
     - 🎆 Fireworks
     - 🎁 Gift
     - ❤️ Heart

   **Optional Fields:**
   - **Background Image**: Upload a background image for the section
     - Recommended: 1920x1080px
     - Format: JPG or PNG
   - **Season**: When this section is most relevant (All Year, Spring, Summer, Autumn, Winter)
   - **Link**: Optional link to a collection, category, or custom URL
     - **Collection**: Link to a specific collection
     - **Category**: Link to a product category (Necklaces, Earrings, etc.)
     - **Custom URL**: Link to any URL

**Example Cultural Sections:**
- **Diwali Collection** 🪔 - "Celebrate the Festival of Lights with our exquisite gold jewelry"
- **Eid Collection** 🌙 - "Elegant pieces for your special celebrations"
- **Wedding Season** 💍 - "Bridal jewelry that honors tradition and modern elegance"
- **Christmas Collection** 🎄 - "Luxury pieces for the holiday season"

**Best Practices:**
- Limit to 4-6 cultural sections for best user experience
- Use high-quality images
- Write clear, engaging descriptions
- Link to relevant collections when possible

### 3. Featured Collections

Select collections to feature on the homepage.

1. Click **"Add item"** in the Featured Collections field
2. Search and select a collection from your existing collections
3. The collection will appear on the homepage with its hero image and description

### 4. AR Try-On Highlight

Promote your AR try-on feature.

**Fields:**
- **Title**: (e.g., "Try Before You Buy")
- **Description**: Explain the AR feature
- **Image**: Upload an image showcasing AR try-on
  - Recommended: 1200x800px

### 5. Inauguration Event

Promote special events or store openings.

**Fields:**
- **Title**: Event name
- **Description**: Event details
- **Date**: Event date and time
- **Location**: Event location
- **Image**: Event image
  - Recommended: 1200x800px

## Publishing Your Changes

1. **Review**: Check all fields are filled correctly
2. **Publish**: Click the **"Publish"** button in the top right
3. **Verify**: Visit your homepage to see the changes
   - Changes may take up to 60 seconds to appear (due to revalidation)

## Troubleshooting

### Homepage Not Showing Content

**Issue**: Homepage shows default/fallback content instead of Sanity data.

**Solutions:**
1. **Check if Homepage Document Exists**:
   - Go to Sanity Studio → Homepage
   - If you see "No documents of this type", create a new homepage document

2. **Verify Document is Published**:
   - Make sure the document status is "Published" (green dot), not "Draft"

3. **Check Environment Variables**:
   - Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is set correctly
   - Verify `SANITY_API_TOKEN` has read permissions
   - Verify `NEXT_PUBLIC_SANITY_DATASET` is set to "production"

4. **Check API Permissions**:
   - Ensure your Sanity API token has read access to the dataset
   - If you see a 401 error, you may need to grant `sanity.project/read` permission

### Cultural Sections Not Appearing

**Issue**: Cultural sections don't show on the homepage.

**Solutions:**
1. **Check if Sections are Added**:
   - In Sanity Studio, verify cultural sections are added to the homepage document
   - Each section needs at least a title, description, and icon

2. **Verify Publishing**:
   - Make sure the homepage document is published (not draft)

3. **Check Fallback**:
   - If no Sanity data is available, the component will show fallback cultural highlights
   - This is expected behavior when no data is configured

### Images Not Loading

**Issue**: Images in cultural sections or hero banner don't display.

**Solutions:**
1. **Verify Image Upload**:
   - Check that images are uploaded in Sanity Studio
   - Ensure images have alt text

2. **Check Image Processing**:
   - Images are processed server-side
   - Check server logs for image processing errors

3. **Image Format**:
   - Use JPG or PNG format
   - Recommended sizes are provided in field descriptions

## Quick Start Checklist

- [ ] Create homepage document in Sanity Studio
- [ ] Add hero banner (headline, subheadline, image)
- [ ] Add at least 2-4 cultural sections with icons
- [ ] Select featured collections
- [ ] Add AR try-on highlight (optional)
- [ ] Add inauguration event (optional)
- [ ] Publish the homepage document
- [ ] Verify changes on the live site

## Need Help?

- **Sanity Studio**: `https://thegrand-production.up.railway.app/sanity-studio`
- **Documentation**: See `SANITY_STUDIO_GUIDE.md` for more details
- **Support**: Contact support@thegrand.co.uk

---

**Last Updated**: After adding cultural sections feature with icons

