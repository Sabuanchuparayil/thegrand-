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
railway variables --set "NEXT_PUBLIC_SANITY_PROJECT_ID=se74u26p"
railway variables --set "NEXT_PUBLIC_SANITY_DATASET=production"
railway variables --set "SANITY_API_TOKEN=skcVtCTd4nTlk1bFaB0Lnw1BYg3O6iUJMFp8T0RSv6i46tT8fH3lmDlQxU2nSiSjN5EKX3q52CTgsV5piEc4H3FvxlmoXfxdWcjpRNWSUJuUXyQdZ7ypVQY58TA4n5lR6RnJK2VMe9ljFNlcOacXNPt4wQ7wVhZwlAdy0g8CpTyBz2pCAlp3"

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

