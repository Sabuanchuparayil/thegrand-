# Gemini AI (Sabuji) Setup Guide

## Issue
The Gemini AI assistant (Sabuji) is not responding properly, showing error messages instead of helpful responses.

## Solution

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey) or [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new API key for Gemini AI
4. Copy the API key (starts with `AIza...`)

### Step 2: Set the API Key in Railway

#### Option A: Via Railway Dashboard (Recommended)

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project: **Grand Luxe** (or **thegrand-**)
3. Select your service: **thegrand-**
4. Click on **Variables** tab
5. Click **+ New Variable**
6. Add:
   - **Variable Name:** `GEMINI_API_KEY`
   - **Value:** Your Gemini API key (paste it here)
7. Click **Add**
8. Railway will automatically redeploy your service

#### Option B: Via Railway CLI

```bash
# Make sure you're logged in
railway login

# Link to your project (if not already linked)
railway link

# Set the environment variable
railway variables set GEMINI_API_KEY=your_api_key_here

# Verify it was set
railway variables
```

### Step 3: Verify the Setup

1. Wait for Railway to redeploy (usually takes 1-2 minutes)
2. Go to your website
3. Click the chat icon (Sabuji) in the bottom right corner
4. Ask a question like "What products do you have?"
5. You should receive a helpful response from Sabuji

### Step 4: Test the API Endpoint

You can also test directly:
```bash
curl -X POST https://thegrand-production.up.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, what products do you have?"}'
```

## Troubleshooting

### Error: "I'm having trouble processing your request"
- **Cause:** The GEMINI_API_KEY is not set or invalid
- **Fix:** 
  1. Verify the variable name is exactly `GEMINI_API_KEY` (case-sensitive)
  2. Make sure you clicked "Add" after entering the value
  3. Wait for Railway to redeploy
  4. Check Railway logs for specific error messages

### Error: "API_KEY not configured"
- **Cause:** The environment variable is not loaded
- **Fix:** 
  1. Double-check the variable is set in Railway
  2. Redeploy the service manually if needed
  3. Check Railway deployment logs

### Error: "Quota exceeded" or "Rate limit"
- **Cause:** API quota exceeded
- **Fix:** 
  1. Check your Google AI Studio quota
  2. Wait for quota to reset (usually daily)
  3. Upgrade your Google Cloud plan if needed

### Empty Responses
- **Cause:** API key might be invalid or model error
- **Fix:**
  1. Verify API key is correct
  2. Check Railway logs for detailed errors
  3. Try regenerating the API key

## Current Configuration

- **Model:** `gemini-1.5-flash` (fast and efficient)
- **Alternative:** Can use `gemini-1.5-pro` for better quality (slower)
- **API Endpoint:** `/api/chat`
- **Assistant Name:** Sabuji
- **Knowledge Base:** Pre-configured with The Grand product information

## Free Tier Limits

- Google AI Studio free tier: 15 requests per minute
- For production, consider upgrading if you expect high traffic
- The system handles rate limits gracefully

## Additional Notes

- The assistant has a comprehensive knowledge base about The Grand products
- It can answer questions about products, services, policies, and more
- Cultural sensitivity is built into the responses
- AR Try-On and other features are mentioned when relevant

## Support

If you continue to have issues:
1. Check Railway deployment logs
2. Verify the API key in Railway variables
3. Test the Gemini API directly with your key at [Google AI Studio](https://makersuite.google.com/)
4. Contact support if needed

---

**Last Updated:** December 9, 2024

