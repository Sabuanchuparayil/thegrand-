# Port Configuration Fix

## Issue
The application was hardcoded to use port 3011, but Railway provides a `PORT` environment variable that should be used in production.

## Fix Applied
Updated `package.json` start script to use Railway's `PORT` environment variable automatically:

```json
"start": "next start"
```

This means:
- **Production (Railway)**: Next.js automatically uses the `PORT` environment variable provided by Railway
- **Local Development**: Next.js defaults to port 3000 (use `npm run dev` which uses port 3011)

## Next Steps
1. **Commit and push** this change:
   ```bash
   git add package.json
   git commit -m "Fix: Use Railway PORT environment variable"
   git push
   ```

2. **Railway will automatically redeploy** when you push

3. **Verify the fix**:
   - Check Railway deployment logs
   - Visit your live URL
   - The 502 error should be resolved

## Why This Happened
- Railway automatically sets a `PORT` environment variable
- Your app needs to listen on that port for Railway's proxy to work
- The hardcoded port 3011 was causing a mismatch

## Status
✅ **Fixed** - Ready to deploy

