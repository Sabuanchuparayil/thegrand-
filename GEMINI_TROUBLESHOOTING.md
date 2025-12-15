# 🔧 Gemini Assistant Troubleshooting Guide

## Issue: Gemini Assistant Not Responding

If the Gemini assistant is showing error messages or not responding to queries, follow these steps:

## Step 1: Verify API Key is Set

1. **Check Railway Variables**:
   ```bash
   railway variables | grep GEMINI
   ```

2. **Verify the Key**:
   - Should see: `GEMINI_API_KEY` with a value
   - If missing, set it: `railway variables --set "GEMINI_API_KEY=YOUR_KEY"`

3. **Get Your API Key**:
   - Go to: https://aistudio.google.com/app/apikey
   - Create or copy your API key
   - Make sure it's active and has quota available

## Step 2: Check Server Logs

1. **View Railway Logs**:
   ```bash
   railway logs
   ```

2. **Look for Gemini Errors**:
   - Search for: "Gemini API error"
   - Look for specific error messages:
     - "Invalid API key" - API key is wrong
     - "Quota exceeded" - API quota limit reached
     - "Safety filters" - Content blocked by safety filters
     - "Network error" - Connection issues

## Step 3: Test the API Directly

Test if the API key works:

```bash
curl -X POST https://thegrand-production.up.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, what products do you have?"}'
```

Expected response:
```json
{
  "success": true,
  "response": "...",
  "category": "product"
}
```

## Step 4: Common Issues and Solutions

### Issue 1: "AI service is not properly configured"

**Cause**: GEMINI_API_KEY not set or invalid

**Solution**:
1. Verify key in Railway: `railway variables`
2. If missing, set it: `railway variables --set "GEMINI_API_KEY=YOUR_KEY"`
3. Redeploy if needed
4. Get new key from: https://aistudio.google.com/app/apikey

### Issue 2: "High demand" or Rate Limit Error

**Cause**: API quota exceeded

**Solution**:
1. Check your Google AI Studio quota: https://aistudio.google.com/app/apikey
2. Free tier has rate limits
3. Wait a few minutes and try again
4. Consider upgrading if you need higher limits

### Issue 3: "Content safety filters"

**Cause**: Query triggered safety filters

**Solution**:
1. Rephrase the question
2. Avoid sensitive topics
3. Use more specific product-related questions
4. Example: Instead of "whatsup?", try "What jewelry products do you have?"

### Issue 4: "Network error" or Connection Issues

**Cause**: Network connectivity or API endpoint issues

**Solution**:
1. Check Railway status: https://status.railway.app
2. Check Google AI status
3. Wait a few minutes and retry
4. Check Railway logs for connection errors

### Issue 5: Empty or No Response

**Cause**: API returned empty response

**Solution**:
1. Check server logs for "Empty response from Gemini API"
2. Try a different question
3. Verify API key is valid
4. Check if API quota is available

## Step 5: Verify API Key Validity

Test your API key directly:

```bash
# Replace YOUR_API_KEY with your actual key
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Say hello"
      }]
    }]
  }'
```

If this fails, your API key is invalid or expired.

## Step 6: Check Product Context

The assistant fetches products from Sanity for context. If this fails:

1. **Check Sanity Connection**:
   - Verify `SANITY_API_TOKEN` is set
   - Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is set
   - Check if products exist in Sanity

2. **Check Logs**:
   - Look for "Error fetching products for context"
   - This won't break the assistant, but it won't have product info

## Debugging Tips

1. **Enable Detailed Logging**:
   - Check Railway logs for detailed error messages
   - Look for "Gemini API error:" entries
   - Check for "Detailed Gemini error:" logs

2. **Test with Simple Queries**:
   - Start with: "What products do you have?"
   - Then try: "Tell me about your jewelry"
   - Avoid ambiguous queries like "whatsup?"

3. **Check Response Times**:
   - Gemini API can take 2-5 seconds
   - If timeout, check network connectivity

## Quick Fix Checklist

- [ ] GEMINI_API_KEY is set in Railway
- [ ] API key is valid (test with curl)
- [ ] API key has available quota
- [ ] No errors in Railway logs
- [ ] Network connectivity is working
- [ ] Query is clear and product-related
- [ ] Sanity connection is working (for product context)

## Still Not Working?

1. **Check Railway Logs**:
   ```bash
   railway logs --tail 100
   ```

2. **Verify API Key**:
   - Go to: https://aistudio.google.com/app/apikey
   - Check if key is active
   - Check quota/usage

3. **Test API Endpoint**:
   ```bash
   curl -X POST https://thegrand-production.up.railway.app/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello"}'
   ```

4. **Contact Support**:
   - Check error messages in logs
   - Share specific error with support team

---

**Note**: The assistant requires a valid GEMINI_API_KEY to function. All error details are logged server-side for debugging, but users see safe, generic error messages.


