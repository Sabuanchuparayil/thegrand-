# 🚂 Railway Deployment Guide - The Grand Project

## ✅ Updated Configuration

Your Railway deployment is now configured with the correct Sanity project:
- **Project ID**: `m215e86r`
- **Dataset**: `production`
- **Project Name**: The Grand

---

## 🚀 Quick Setup Steps

### Step 1: Login to Railway

```bash
railway login
```

### Step 2: Link Your Project

```bash
cd "/Users/apple/Desktop/Grand Gold/The grand -Sabu"
railway link
```

### Step 3: Set Environment Variables

**Option A: Using the Setup Script (Recommended)**

```bash
./RAILWAY_SET_ENV.sh
```

**Option B: Manual Setup via Railway Dashboard**

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project
3. Go to **Variables** tab
4. Add the following variables:

| Variable Name | Value |
|--------------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `m215e86r` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | `skCELrzNRFX79kvT6ut5BtRweDNCZgDJGl8n5dOC7GijFgPKz9yMZfed8Di0oFW8spqS6YMyhWxHyKR5KnpVIjDZPtq3ol17x9CM7UnuFFvylORhObdt3uL4nuLqhycNvf4rjbI71YeuqaMJlAlGQAvvDLsaB0Yef4YKRMhuyPDIYtp0b5CO` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app-name.up.railway.app` |

**Option C: Using Railway CLI**

```bash
railway variables set NEXT_PUBLIC_SANITY_PROJECT_ID=m215e86r
railway variables set NEXT_PUBLIC_SANITY_DATASET=production
railway variables set SANITY_API_TOKEN=skCELrzNRFX79kvT6ut5BtRweDNCZgDJGl8n5dOC7GijFgPKz9yMZfed8Di0oFW8spqS6YMyhWxHyKR5KnpVIjDZPtq3ol17x9CM7UnuFFvylORhObdt3uL4nuLqhycNvf4rjbI71YeuqaMJlAlGQAvvDLsaB0Yef4YKRMhuyPDIYtp0b5CO
```

### Step 4: Get Your Railway URL

After the first deployment:

1. Go to Railway Dashboard → Your Project → **Settings** → **Networking**
2. Copy your Railway URL (e.g., `https://your-app-name.up.railway.app`)
3. Set it as an environment variable:

```bash
railway variables set NEXT_PUBLIC_SITE_URL=https://your-app-name.up.railway.app
railway variables set NEXTAUTH_URL=https://your-app-name.up.railway.app
```

### Step 5: Deploy

Railway will automatically deploy when you push to your connected repository, or you can trigger a manual deployment:

```bash
railway up
```

---

## 📋 Complete Environment Variables List

### Required (Must Set Before Build)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=m215e86r
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skCELrzNRFX79kvT6ut5BtRweDNCZgDJGl8n5dOC7GijFgPKz9yMZfed8Di0oFW8spqS6YMyhWxHyKR5KnpVIjDZPtq3ol17x9CM7UnuFFvylORhObdt3uL4nuLqhycNvf4rjbI71YeuqaMJlAlGQAvvDLsaB0Yef4YKRMhuyPDIYtp0b5CO
NEXT_PUBLIC_SITE_URL=https://your-app-name.up.railway.app
```

### Recommended

```env
NEXTAUTH_SECRET=<generate_with_openssl_rand_base64_32>
NEXTAUTH_URL=https://your-app-name.up.railway.app
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Optional (for full features)

```env
METALS_API_KEY=your_metals_api_key
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
RESEND_API_KEY=re_...
EMAIL_FROM=THE GRAND <noreply@yourdomain.com>
WHATSAPP_API_KEY=...
CRON_SECRET=random_secret
```

---

## 🎯 Sanity Studio Access

After deployment, access Sanity Studio at:
- **Local**: `http://localhost:3011/sanity-studio`
- **Production**: `https://your-app-name.up.railway.app/sanity-studio`

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Build succeeds in Railway logs
- [ ] App loads at Railway URL
- [ ] Sanity Studio accessible at `/sanity-studio`
- [ ] Can create/edit products in Sanity Studio
- [ ] Can create/edit collections in Sanity Studio
- [ ] Environment variables are set correctly
- [ ] No errors in Railway logs

---

## 🐛 Troubleshooting

### Build Fails with "projectId" Error

1. Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is set to `m215e86r`
2. Check for typos in variable names
3. Ensure variables are set in the correct Railway project
4. Redeploy after setting variables

### Sanity Studio Not Loading

1. Check that `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are set
2. Verify `SANITY_API_TOKEN` is correct
3. Check Railway logs for errors
4. Ensure the route `/sanity-studio` is accessible

### Variables Not Working

- Variables starting with `NEXT_PUBLIC_` are available at build time
- Regular variables are only available at runtime
- Make sure variables are set in Railway, not just in `.env.local`

---

## 📝 Quick Reference

**Sanity Project Details:**
- Project ID: `m215e86r`
- Organization ID: `oSxp0Q0uG`
- Dataset: `production`
- Project Name: The Grand

**Railway Dashboard**: https://railway.app/dashboard

**Sanity Dashboard**: https://www.sanity.io/manage/project/m215e86r

---

## 🎉 Next Steps

1. ✅ Environment variables are configured
2. ✅ Railway deployment is ready
3. 🎯 Access Sanity Studio to start managing content
4. 🎯 Add products, collections, and homepage content
5. 🎯 Test the full application flow


