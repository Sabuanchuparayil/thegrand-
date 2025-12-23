# 🔧 Cron Job Issue - Investigation & Fix Summary

## Problem Identified

You reported that "real-time price update not running as a cron job" even though the endpoint returns a successful response when called manually.

## Root Cause

**Railway does NOT support `vercel.json` cron configuration.** The `vercel.json` file with cron schedules only works on Vercel deployments. Since you're deploying to Railway (`thegrand-production.up.railway.app`), the cron jobs defined in `vercel.json` are **ignored**.

## What Was Working

✅ The endpoint `/api/gold-price/scheduled` is working correctly:
- Returns successful responses when called manually
- Fetches prices from Metals.Dev API
- Updates product prices in Sanity
- Your test showed: 17 products updated successfully

❌ **Missing**: Automatic scheduling (no cron jobs configured)

## Solution Implemented

### 1. Fixed Authentication Logic

**Issue**: When `CRON_SECRET` was not set, the endpoint had no authentication check (security issue).

**Fix**: Updated authentication to require either:
- `CRON_SECRET` bearer token (for automated cron jobs)
- Admin session (for manual testing)
- If `CRON_SECRET` is not set, requires admin session

### 2. Created Railway Cron Setup Guide

Created `RAILWAY_CRON_SETUP.md` with step-by-step instructions for setting up external cron jobs.

### 3. Created Test Script

Created `scripts/test-cron-endpoint.ts` to test the cron endpoint locally.

### 4. Updated Documentation

Updated `README.md` to clarify:
- Railway does NOT support `vercel.json` cron
- External cron service is required for Railway deployments
- Clear instructions for setup

## Next Steps (Action Required)

To enable automatic price updates, you need to:

### Step 1: Set CRON_SECRET in Railway

1. Go to Railway Dashboard → Your Project → **Variables**
2. Add variable:
   - **Name**: `CRON_SECRET`
   - **Value**: Generate a random secret:
     ```bash
     openssl rand -hex 32
     ```
3. Save

### Step 2: Set Up External Cron Service

**Recommended**: Use [cron-job.org](https://cron-job.org) (free)

1. Sign up at https://cron-job.org
2. Create **First Cron Job**:
   - **Title**: "Gold Price Update - Morning"
   - **URL**: `https://thegrand-production.up.railway.app/api/gold-price/scheduled`
   - **Method**: `POST`
   - **Headers**: 
     - Key: `Authorization`
     - Value: `Bearer YOUR_CRON_SECRET_VALUE`
   - **Schedule**: `0 8 * * *` (8:00 AM UTC daily)
3. Create **Second Cron Job**:
   - **Title**: "Gold Price Update - Evening"
   - Same settings as above
   - **Schedule**: `0 17 * * *` (5:00 PM UTC daily)

### Step 3: Test

Test the endpoint manually:
```bash
curl -X POST https://thegrand-production.up.railway.app/api/gold-price/scheduled \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

Or use the test script (if you have CRON_SECRET in .env.local):
```bash
npx tsx scripts/test-cron-endpoint.ts
```

### Step 4: Monitor

Check if cron jobs are running:
```bash
curl https://thegrand-production.up.railway.app/api/gold-price/monitoring?logs=true&limit=10
```

## Files Changed

1. ✅ `app/api/gold-price/scheduled/route.ts` - Fixed authentication logic
2. ✅ `RAILWAY_CRON_SETUP.md` - New comprehensive setup guide
3. ✅ `scripts/test-cron-endpoint.ts` - New test script
4. ✅ `README.md` - Updated with Railway-specific instructions

## Expected Behavior After Setup

Once cron jobs are configured:
- ✅ Prices update automatically at 8:00 AM UTC (9 AM BST)
- ✅ Prices update automatically at 5:00 PM UTC (6 PM BST)
- ✅ Products with `pricing_model: "dynamic"` are updated
- ✅ Updates are logged and visible in monitoring endpoint

## Verification

After setting up cron jobs, you should see:
- Success responses in cron-job.org execution logs
- Price updates in Railway logs
- Recent updates in `/api/gold-price/monitoring?logs=true`
- Product prices updating twice daily

## Important Notes

- **`vercel.json` cron config is ignored on Railway** - it only works on Vercel
- **External cron service is required** for Railway deployments
- **`CRON_SECRET` must be set** for automated cron jobs to work
- The endpoint still works manually with admin session if `CRON_SECRET` is not set

---

**Status**: ✅ Code fixes complete, ⏳ Action required: Set up external cron service

