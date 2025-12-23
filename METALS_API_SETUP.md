# Metals.dev API Key Setup Guide

## Issue
The real-time gold price update is not working because the `METALS_API_KEY` environment variable is not configured in Railway.

## Solution

### Step 1: Get Your Metals.dev API Key

1. Go to [https://metals.dev/](https://metals.dev/)
2. Sign up for a free account (100 requests/month) or paid plan ($1.79/month for 2,000 requests)
3. Navigate to your dashboard
4. Copy your API key

### Step 2: Set the API Key in Railway

#### Option A: Via Railway Dashboard (Recommended)

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project: **Grand Luxe** (or **thegrand-**)
3. Select your service: **thegrand-**
4. Click on **Variables** tab
5. Click **+ New Variable**
6. Add:
   - **Variable Name:** `METALS_API_KEY`
   - **Value:** Your Metals.dev API key (paste it here)
7. Click **Add**
8. Railway will automatically redeploy your service

#### Option B: Via Railway CLI

```bash
# Make sure you're logged in
railway login

# Link to your project (if not already linked)
railway link

# Set the environment variable
railway variables set METALS_API_KEY=your_api_key_here

# Verify it was set
railway variables
```

### Step 3: Verify the Setup

1. Wait for Railway to redeploy (usually takes 1-2 minutes)
2. Go to your admin panel: `https://thegrand-production.up.railway.app/admin/pricing`
3. Click **"Update Prices Now"** button
4. You should see:
   - System Status: **Healthy**
   - Gold Price displayed
   - Last Update timestamp

### Step 4: Test the API Endpoint

You can also test directly:
```bash
curl https://thegrand-production.up.railway.app/api/gold-price/scheduled
```

Or visit in browser:
```
https://thegrand-production.up.railway.app/api/gold-price/scheduled?action=update
```

## Troubleshooting

### Error: "METALS_API_KEY not set"
- **Cause:** The environment variable is not set or not loaded
- **Fix:** 
  1. Double-check the variable name is exactly `METALS_API_KEY` (case-sensitive)
  2. Make sure you clicked "Add" after entering the value
  3. Wait for Railway to redeploy
  4. Try redeploying manually if needed

### Error: "Metals.Dev API error: 401"
- **Cause:** Invalid API key
- **Fix:** 
  1. Verify your API key is correct
  2. Check if your Metals.dev account is active
  3. Regenerate the API key if needed

### Error: "Metals.Dev API error: 429"
- **Cause:** Rate limit exceeded
- **Fix:** 
  1. Upgrade to a paid plan if you need more requests
  2. The system is configured to update twice daily to minimize API calls

### Prices Not Updating
- **Cause:** Scheduled job not running or API key not working
- **Fix:**
  1. Check Railway logs for errors
  2. Manually trigger update via admin panel
  3. Verify API key is set correctly

## Current Configuration

- **Update Frequency:** Twice daily (8 AM and 5 PM British time)
- **API Endpoint:** `/api/gold-price/scheduled`
- **Fallback:** System uses cached prices if API is unavailable
- **Currency:** GBP (British Pounds)

## Additional Notes

- The free tier allows 100 requests/month
- For production, consider upgrading to paid plan ($1.79/month)
- Prices are cached to minimize API calls
- System automatically falls back to stored prices if API fails

## Support

If you continue to have issues:
1. Check Railway deployment logs
2. Verify the API key in Railway variables
3. Test the Metals.dev API directly with your key
4. Contact support if needed

---

**Last Updated:** December 9, 2024



