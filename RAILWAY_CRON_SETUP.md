# 🕐 Railway Cron Job Setup Guide

## Problem

Railway does **not** support `vercel.json` cron configuration. The `vercel.json` file only works on Vercel deployments. Since you're deploying to Railway, you need to set up cron jobs using an external service.

## Solution: Use External Cron Service (Recommended)

The best approach for Railway is to use an external cron service like [cron-job.org](https://cron-job.org) (free) or [EasyCron](https://www.easycron.com).

### Step 1: Set CRON_SECRET Environment Variable

1. Go to Railway Dashboard → Your Project → **Variables**
2. Add a new variable:
   - **Name**: `CRON_SECRET`
   - **Value**: Generate a random secret (e.g., `openssl rand -hex 32`)
3. Save the variable

### Step 2: Get Your Railway URL

Your Railway URL should be: `https://thegrand-production.up.railway.app`

### Step 3: Set Up Cron Jobs on cron-job.org

1. **Sign up** at [https://cron-job.org](https://cron-job.org) (free account)

2. **Create First Cron Job** (Morning Update - 8:00 UTC / 8:00 AM GMT):
   - **Title**: "Gold Price Update - Morning"
   - **URL**: `https://thegrand-production.up.railway.app/api/gold-price/scheduled`
   - **Method**: `POST`
   - **Request Body**: Leave empty
   - **Headers**: 
     - Key: `Authorization`
     - Value: `Bearer YOUR_CRON_SECRET_VALUE` (replace with your actual CRON_SECRET)
   - **Schedule**: `0 8 * * *` (8:00 AM UTC daily)
   - **Save**

3. **Create Second Cron Job** (Evening Update - 17:00 UTC / 5:00 PM GMT):
   - **Title**: "Gold Price Update - Evening"
   - **URL**: `https://thegrand-production.up.railway.app/api/gold-price/scheduled`
   - **Method**: `POST`
   - **Request Body**: Leave empty
   - **Headers**: 
     - Key: `Authorization`
     - Value: `Bearer YOUR_CRON_SECRET_VALUE` (same as above)
   - **Schedule**: `0 17 * * *` (5:00 PM UTC daily)
   - **Save**

### Schedule Times (UTC)

- **Morning**: `0 8 * * *` = 8:00 AM UTC (9:00 AM BST, 8:00 AM GMT)
- **Evening**: `0 17 * * *` = 5:00 PM UTC (6:00 PM BST, 5:00 PM GMT)

To convert to other timezones:
- UTC = GMT (no offset)
- BST = UTC + 1 hour (British Summer Time, March-October)
- GMT = UTC (British Winter Time, November-February)

## Alternative: Railway Cron Service (If Available)

Railway may offer a Cron service in their Pro plan. To use it:

1. Go to Railway Dashboard → Your Project
2. Click **"New"** → **"Cron"** (if available)
3. Configure:
   - **Schedule**: `0 8,17 * * *` (runs at 8:00 AM and 5:00 PM UTC)
   - **Command**: `curl -X POST https://thegrand-production.up.railway.app/api/gold-price/scheduled -H "Authorization: Bearer $CRON_SECRET"`
   - Railway will automatically inject `$CRON_SECRET` from your environment variables

## Testing Your Cron Setup

### Manual Test (Verify Endpoint Works)

```bash
# Replace YOUR_CRON_SECRET with your actual secret
curl -X POST https://thegrand-production.up.railway.app/api/gold-price/scheduled \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "success": true,
  "message": "Prices fetched and products updated successfully",
  "timestamp": "2025-12-23T08:39:22.222Z",
  "prices": {
    "gold": { "price": 106.8527, "currency": "GBP" },
    "platinum": { "price": 51.6547, "currency": "GBP" }
  },
  "productUpdates": {
    "totalProducts": 35,
    "updatedProducts": 17,
    "skippedProducts": 18,
    "errors": 0
  }
}
```

### Monitor Cron Jobs

Check if cron jobs are running:

```bash
# Check monitoring endpoint (no auth required)
curl https://thegrand-production.up.railway.app/api/gold-price/monitoring?logs=true&limit=10
```

This shows recent price updates and their timestamps.

## Troubleshooting

### Error: "Unauthorized"

- Check that `CRON_SECRET` is set in Railway environment variables
- Verify the `Authorization: Bearer YOUR_CRON_SECRET` header matches exactly
- Ensure there are no extra spaces in the header value

### Cron Jobs Not Running

1. **Check cron-job.org logs**: Look at the execution history to see if requests are being sent
2. **Check Railway logs**: Go to Railway Dashboard → Your Project → Deployments → View Logs
3. **Verify URL**: Make sure the URL is correct and the service is accessible
4. **Test manually**: Run the curl command above to verify the endpoint works

### Prices Not Updating

1. Check that `METALS_API_KEY` is set in Railway environment variables
2. Verify products have `pricing_model: "dynamic"` in Sanity
3. Check monitoring endpoint for error logs: `/api/gold-price/monitoring?logs=true`

## Current Status

Based on your successful manual test response, the endpoint is working correctly:
- ✅ Endpoint is accessible
- ✅ Authentication is working (when tested manually)
- ✅ Price fetching is working
- ✅ Product updates are working (17 products updated)
- ❌ **Missing**: Automated scheduling (cron jobs not configured)

## Next Steps

1. ✅ Set `CRON_SECRET` in Railway environment variables (if not already set)
2. ✅ Sign up for cron-job.org or similar service
3. ✅ Configure two cron jobs as described above
4. ✅ Test the cron jobs manually first
5. ✅ Monitor the first few automated runs
6. ✅ Verify prices are updating twice daily

## Notes

- The endpoint requires either `CRON_SECRET` authentication OR admin session authentication
- If `CRON_SECRET` is not set, the endpoint will still work but requires admin login
- For automated cron jobs, you **must** set `CRON_SECRET` and include it in the Authorization header
- Price updates happen twice daily (morning and evening) to capture market fluctuations

