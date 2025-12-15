# 🔧 Metals.Dev API Troubleshooting Guide

## Issue: "Unauthorized" Error

If you're seeing `"Metals.Dev API error: Unauthorized"` when trying to update prices, follow these steps:

## Step 1: Verify API Key is Set in Railway

1. **Go to Railway Dashboard**: https://railway.app
2. **Select Your Project**: "thegrand-production" or your project name
3. **Go to Variables**: Click on "Variables" in the left sidebar
4. **Check for METALS_API_KEY**: 
   - Look for `METALS_API_KEY` in the list
   - If it's missing, you need to add it (see Step 2)
   - If it exists, verify it's not empty or corrupted

## Step 2: Get Your Metals.Dev API Key

1. **Sign up/Login**: Go to https://metals.dev/
2. **Navigate to API Keys**: 
   - Go to your dashboard
   - Find "API Keys" or "Settings" section
3. **Copy Your API Key**: 
   - Copy the full API key (it should be a long string)
   - Make sure you copy the entire key without any spaces

## Step 3: Add API Key to Railway

1. **In Railway Variables**:
   - Click "New Variable"
   - **Name**: `METALS_API_KEY`
   - **Value**: Paste your API key from Metals.Dev
   - Click "Add"

2. **Verify the Variable**:
   - Make sure there are no extra spaces
   - Make sure the variable name is exactly `METALS_API_KEY` (case-sensitive)
   - The value should be your full API key

3. **Redeploy** (if needed):
   - Railway should automatically redeploy when you add variables
   - If not, trigger a manual redeploy

## Step 4: Test the API Key

### Option A: Test via Admin Panel

1. Go to: `https://thegrand-production.up.railway.app/admin/pricing`
2. Click "Update Prices Now"
3. Check if prices update successfully

### Option B: Test via API Directly

1. Open browser console or use curl:
   ```bash
   curl https://thegrand-production.up.railway.app/api/gold-price/scheduled?action=update
   ```

2. If you get a 401 error, the API key is still not working
3. If you get prices back, it's working!

## Step 5: Check API Key Permissions

1. **Verify API Key Status**:
   - Go to Metals.Dev dashboard
   - Check if your API key is active
   - Check if you have available quota (free tier: 100 requests/month)

2. **Check Subscription**:
   - Free tier: 100 requests/month
   - Paid tier: $1.79/month for 2,000 requests
   - If you've exceeded quota, you'll get rate limit errors

## Common Issues and Solutions

### Issue 1: API Key Not Set
**Error**: `"METALS_API_KEY not set, using fallback price"`

**Solution**: 
- Add `METALS_API_KEY` to Railway environment variables
- Redeploy the application

### Issue 2: Invalid API Key
**Error**: `"Metals.Dev API error: Unauthorized"`

**Solutions**:
- Verify the API key is correct in Railway
- Make sure there are no extra spaces or characters
- Regenerate the API key in Metals.Dev and update it in Railway
- Check that you're using the correct API key (not a test key if you have multiple)

### Issue 3: API Quota Exceeded
**Error**: `"Metals.Dev API error: Rate limit exceeded"`

**Solutions**:
- Check your usage in Metals.Dev dashboard
- Wait until next month (free tier resets monthly)
- Upgrade to paid tier for more requests ($1.79/month for 2,000 requests)

### Issue 4: API Key Expired or Revoked
**Error**: `"Metals.Dev API error: Unauthorized"`

**Solutions**:
- Check Metals.Dev dashboard to see if key is still active
- Regenerate API key if needed
- Update the key in Railway variables

## Verification Checklist

- [ ] `METALS_API_KEY` is set in Railway variables
- [ ] API key value is correct (no spaces, full key)
- [ ] API key is active in Metals.Dev dashboard
- [ ] You have available API quota
- [ ] Application has been redeployed after adding the key
- [ ] Tested the API endpoint and got prices back

## Still Not Working?

1. **Check Railway Logs**:
   - Go to Railway Dashboard → Your Project → Deployments
   - Click on latest deployment → View Logs
   - Look for error messages related to Metals.Dev API

2. **Check Server Logs**:
   - Look for console.error messages about Metals.Dev
   - Check for specific error codes or messages

3. **Contact Support**:
   - Metals.Dev Support: Check their documentation or support channels
   - Railway Support: If it's a deployment/variable issue

## Quick Fix Command

If you have Railway CLI installed:

```bash
# Set the API key
railway variables set METALS_API_KEY=your_api_key_here

# Verify it's set
railway variables
```

## Expected Behavior

When working correctly:
- ✅ Admin panel shows current gold and platinum prices
- ✅ "Update Prices Now" button updates prices successfully
- ✅ System Status shows "Success" instead of "Error"
- ✅ Last Update shows a recent timestamp
- ✅ Products with dynamic pricing update automatically

---

**Last Updated**: After fixing authentication method to support both header and query parameter methods


