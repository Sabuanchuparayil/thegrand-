# 🔧 Railway Environment Variable Update Guide

## Issue: "Not Authorized" Error When Updating Variables

If you're getting a "Not Authorized" error when trying to update environment variables in Railway, follow these solutions:

## Solution 1: Use Railway CLI (Recommended)

The Railway CLI is often more reliable than the web dashboard for setting variables.

### Step 1: Install Railway CLI (if not already installed)

```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

This will open your browser to authenticate.

### Step 3: Link to Your Project

```bash
cd "/Users/apple/Desktop/Grand Gold/The grand -Sabu"
railway link
```

Select your project when prompted.

### Step 4: Set the METALS_API_KEY

```bash
railway variables set METALS_API_KEY=FQHZW3O4SJ8R57KX3QBP714KX3QBP
```

### Step 5: Verify the Variable

```bash
railway variables
```

You should see `METALS_API_KEY` in the list.

## Solution 2: Use Railway Dashboard (Alternative)

### Step 1: Check Your Permissions

1. Go to https://railway.app
2. Navigate to your project
3. Check if you're the project owner or have admin permissions
4. If you're a collaborator, you may need owner/admin to add variables

### Step 2: Add Variable via Dashboard

1. Go to your project: https://railway.app/project/[your-project-id]
2. Click on **"Variables"** in the left sidebar
3. Click **"New Variable"**
4. **Name**: `METALS_API_KEY`
5. **Value**: `FQHZW3O4SJ8R57KX3QBP714KX3QBP`
6. Click **"Add"**

### Step 3: If Still Getting "Not Authorized"

- **Check Project Ownership**: Make sure you're the project owner or have admin access
- **Try Different Browser**: Sometimes browser cache can cause issues
- **Clear Browser Cache**: Clear cookies/cache for railway.app
- **Use Incognito Mode**: Try in a private/incognito window

## Solution 3: Update via Railway API (Advanced)

If CLI and dashboard both fail, you can use the Railway API directly.

### Step 1: Get Your Railway Token

1. Go to Railway Dashboard
2. Click on your profile (top right)
3. Go to "Settings" → "Tokens"
4. Create a new token with "Full Access"
5. Copy the token

### Step 2: Get Your Project ID

```bash
railway status
```

Look for the project ID in the output.

### Step 3: Update Variable via API

```bash
# Replace YOUR_TOKEN and YOUR_PROJECT_ID
curl -X POST \
  https://api.railway.app/v1/projects/YOUR_PROJECT_ID/variables \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "METALS_API_KEY",
    "value": "FQHZW3O4SJ8R57KX3QBP714KX3QBP"
  }'
```

## Solution 4: Quick Script to Set All Required Variables

Create a script to set all variables at once:

```bash
#!/bin/bash

# Railway Variables Setup Script
# Make sure you're logged in: railway login

railway variables set METALS_API_KEY=FQHZW3O4SJ8R57KX3QBP714KX3QBP

# Verify
echo "Verifying variables..."
railway variables
```

Save as `set-railway-vars.sh`, make it executable, and run:

```bash
chmod +x set-railway-vars.sh
./set-railway-vars.sh
```

## Common Causes of "Not Authorized" Error

1. **Insufficient Permissions**: You're not the project owner or don't have admin access
2. **Session Expired**: Your Railway session may have expired
3. **Browser Issues**: Cached credentials or cookies causing conflicts
4. **API Rate Limiting**: Too many requests in a short time
5. **Project Access**: You may have lost access to the project

## Verification Steps

After setting the variable:

1. **Check Variable is Set**:
   ```bash
   railway variables
   ```

2. **Trigger a Redeploy** (if needed):
   ```bash
   railway up
   ```

3. **Check Logs**:
   ```bash
   railway logs
   ```

4. **Test the API**:
   - Go to: `https://thegrand-production.up.railway.app/admin/pricing`
   - Click "Update Prices Now"
   - Should work without "Unauthorized" error

## Quick Fix Command

If you have Railway CLI installed and are logged in:

```bash
cd "/Users/apple/Desktop/Grand Gold/The grand -Sabu"
railway link
railway variables set METALS_API_KEY=FQHZW3O4SJ8R57KX3QBP714KX3QBP
railway variables
```

## Still Having Issues?

1. **Check Railway Status**: https://status.railway.app
2. **Contact Railway Support**: support@railway.app
3. **Check Project Settings**: Verify you have the correct permissions
4. **Try Creating a New Project**: If permissions are completely broken, you may need to create a new project and redeploy

## Important Notes

- ⚠️ **Never commit API keys to git** - Always use environment variables
- ✅ **Use Railway CLI** - More reliable than dashboard for variable management
- ✅ **Verify after setting** - Always check that the variable was set correctly
- ✅ **Redeploy if needed** - Some changes require a redeploy to take effect

---

**Your API Key**: `FQHZW3O4SJ8R57KX3QBP714KX3QBP`

**Variable Name**: `METALS_API_KEY`

