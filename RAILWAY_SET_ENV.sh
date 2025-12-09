#!/bin/bash

# Railway Environment Variables Setup Script
# Run this after: railway login && railway link

echo "🚂 Setting up Railway environment variables..."

# Check if project is linked
if ! railway variables &>/dev/null; then
    echo "❌ No project linked. Please run: railway link"
    exit 1
fi

# Required Sanity CMS variables (Railway CLI v4.12.0 syntax)
railway variables --set "NEXT_PUBLIC_SANITY_PROJECT_ID=m215e86r"
railway variables --set "NEXT_PUBLIC_SANITY_DATASET=production"
railway variables --set "SANITY_API_TOKEN=skCELrzNRFX79kvT6ut5BtRweDNCZgDJGl8n5dOC7GijFgPKz9yMZfed8Di0oFW8spqS6YMyhWxHyKR5KnpVIjDZPtq3ol17x9CM7UnuFFvylORhObdt3uL4nuLqhycNvf4rjbI71YeuqaMJlAlGQAvvDLsaB0Yef4YKRMhuyPDIYtp0b5CO"

# Generate and set NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables --set "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
echo "✅ NEXTAUTH_SECRET generated and set: $NEXTAUTH_SECRET"

# Get Railway URL (you'll need to set this after first deployment)
echo ""
echo "⚠️  IMPORTANT: After first deployment, get your Railway URL and run:"
echo "   railway variables --set \"NEXT_PUBLIC_SITE_URL=https://your-app-name.up.railway.app\""
echo "   railway variables --set \"NEXTAUTH_URL=https://your-app-name.up.railway.app\""
echo ""
echo "✅ Required environment variables set!"
echo "🚀 Railway will automatically redeploy with these variables."

