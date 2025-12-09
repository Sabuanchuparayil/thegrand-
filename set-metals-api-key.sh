#!/bin/bash

# Script to set METALS_API_KEY in Railway
# Make sure Railway CLI is installed: npm install -g @railway/cli
# Make sure you're logged in: railway login

set -e

echo "🚀 Setting METALS_API_KEY in Railway..."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed."
    echo "Install it with: npm install -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway."
    echo "Login with: railway login"
    exit 1
fi

# Set the API key
echo "Setting METALS_API_KEY..."
railway variables set METALS_API_KEY=FQHZW3O4SJ8R57KX3QBP714KX3QBP

echo ""
echo "✅ METALS_API_KEY has been set!"
echo ""
echo "Verifying..."
railway variables | grep METALS_API_KEY || echo "⚠️  Variable not found in list"

echo ""
echo "🎉 Done! The variable should be available after the next deployment."
echo ""
echo "To test, visit: https://thegrand-production.up.railway.app/admin/pricing"
echo "And click 'Update Prices Now'"

