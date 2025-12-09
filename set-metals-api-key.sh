#!/bin/bash

# Script to set METALS_API_KEY in Railway
# Usage: ./set-metals-api-key.sh YOUR_API_KEY
# Example: ./set-metals-api-key.sh FQHZW3O4SJ8R57KX3QBP714KX3QBP
#
# Make sure Railway CLI is installed: npm install -g @railway/cli
# Make sure you're logged in: railway login

# Check if API key is provided
if [ -z "$1" ]; then
    echo "❌ Error: API key is required"
    echo ""
    echo "Usage: $0 YOUR_API_KEY"
    echo "Example: $0 FQHZW3O4SJ8R57KX3QBP714KX3QBP"
    echo ""
    echo "Get your API key from: https://metals.dev/"
    exit 1
fi

API_KEY="$1"

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

# Set the API key (don't exit on error, we want to show the result)
echo "Setting METALS_API_KEY..."
if railway variables --set "METALS_API_KEY=${API_KEY}" 2>&1; then
    echo ""
    echo "✅ METALS_API_KEY has been set!"
    echo ""
    echo "Verifying..."
    if railway variables 2>/dev/null | grep -q "METALS_API_KEY"; then
        echo "✅ Verification successful - METALS_API_KEY is in the variable list"
    else
        echo "⚠️  Warning: METALS_API_KEY not found in variable list (may need a moment to sync)"
    fi
    
    echo ""
    echo "🎉 Done! The variable should be available after the next deployment."
    echo ""
    echo "To test, visit: https://thegrand-production.up.railway.app/admin/pricing"
    echo "And click 'Update Prices Now'"
    exit 0
else
    echo ""
    echo "❌ Failed to set METALS_API_KEY"
    echo ""
    echo "Troubleshooting:"
    echo "1. Make sure you're logged in: railway login"
    echo "2. Make sure you're linked to the project: railway link"
    echo "3. Check your Railway permissions"
    echo "4. See RAILWAY_VARIABLE_UPDATE_GUIDE.md for more help"
    exit 1
fi

