# 🚨 CRITICAL: Railway Environment Variables Setup

## ⚠️ Build Failed - Missing Environment Variables

The build is failing because **Sanity environment variables are not set in Railway**.

**Error**: `Configuration must contain 'projectId'`

---

## 🔧 Quick Fix: Set Environment Variables in Railway

### **Method 1: Using Railway Dashboard (Easiest)**

1. **Go to Railway Dashboard**: https://railway.app/dashboard
2. **Select your project**
3. **Click on "Variables" tab** (or "Settings" → "Variables")
4. **Add these REQUIRED variables:**

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=se74u26p
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skcVtCTd4nTlk1bFaB0Lnw1BYg3O6iUJMFp8T0RSv6i46tT8fH3lmDlQxU2nSiSjN5EKX3q52CTgsV5piEc4H3FvxlmoXfxdWcjpRNWSUJuUXyQdZ7ypVQY58TA4n5lR6RnJK2VMe9ljFNlcOacXNPt4wQ7wVhZwlAdy0g8CpTyBz2pCAlp3
NEXT_PUBLIC_SITE_URL=https://your-app-name.up.railway.app
```

**Note**: Replace `https://your-app-name.up.railway.app` with your actual Railway URL after first deployment.

5. **Click "Add" or "Save"** for each variable
6. **Redeploy** - Railway will automatically rebuild

---

### **Method 2: Using Railway CLI**

```bash
# Make sure you're logged in and linked
railway login
railway link

# Set required variables
railway variables set NEXT_PUBLIC_SANITY_PROJECT_ID=se74u26p
railway variables set NEXT_PUBLIC_SANITY_DATASET=production
railway variables set SANITY_API_TOKEN=skcVtCTd4nTlk1bFaB0Lnw1BYg3O6iUJMFp8T0RSv6i46tT8fH3lmDlQxU2nSiSjN5EKX3q52CTgsV5piEc4H3FvxlmoXfxdWcjpRNWSUJuUXyQdZ7ypVQY58TA4n5lR6RnJK2VMe9ljFNlcOacXNPt4wQ7wVhZwlAdy0g8CpTyBz2pCAlp3

# Get your Railway URL first, then set:
railway variables set NEXT_PUBLIC_SITE_URL=https://your-app-name.up.railway.app
```

---

## 📋 Complete Environment Variables List

### **Required (Must Set Before Build):**

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=se74u26p
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skcVtCTd4nTlk1bFaB0Lnw1BYg3O6iUJMFp8T0RSv6i46tT8fH3lmDlQxU2nSiSjN5EKX3q52CTgsV5piEc4H3FvxlmoXfxdWcjpRNWSUJuUXyQdZ7ypVQY58TA4n5lR6RnJK2VMe9ljFNlcOacXNPt4wQ7wVhZwlAdy0g8CpTyBz2pCAlp3
NEXT_PUBLIC_SITE_URL=https://your-app-name.up.railway.app
```

### **Recommended:**

```env
NEXTAUTH_SECRET=<generate_with_openssl_rand_base64_32>
NEXTAUTH_URL=https://your-app-name.up.railway.app
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### **Optional (for full features):**

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

## 🚀 Step-by-Step Setup

### **Step 1: Get Your Railway URL**

1. Go to Railway Dashboard
2. Click on your project
3. Go to **Settings** → **Networking**
4. Copy your Railway URL (e.g., `https://your-app-name.up.railway.app`)

### **Step 2: Set Environment Variables**

**In Railway Dashboard:**
1. Go to **Variables** tab
2. Click **"New Variable"**
3. Add each variable one by one:

| Variable Name | Value |
|--------------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `se74u26p` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | `skcVtCTd4nTlk1bFaB0Lnw1BYg3O6iUJMFp8T0RSv6i46tT8fH3lmDlQxU2nSiSjN5EKX3q52CTgsV5piEc4H3FvxlmoXfxdWcjpRNWSUJuUXyQdZ7ypVQY58TA4n5lR6RnJK2VMe9ljFNlcOacXNPt4wQ7wVhZwlAdy0g8CpTyBz2pCAlp3` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app-name.up.railway.app` |

### **Step 3: Trigger Redeploy**

After setting variables, Railway will automatically redeploy. Or manually:

1. Go to **Deployments** tab
2. Click **"Redeploy"** or **"Deploy"**

---

## ✅ Verification

After setting variables and redeploying:

1. **Check build logs** - Should show "Build successful"
2. **Visit your Railway URL** - App should load
3. **Check for errors** in Railway logs

---

## 🐛 Troubleshooting

### **Build Still Fails**

1. **Verify variables are set:**
   - Go to Variables tab
   - Make sure all required variables are there
   - Check for typos in variable names

2. **Check variable values:**
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` should be `se74u26p`
   - No extra spaces or quotes

3. **Redeploy:**
   - Go to Deployments
   - Click "Redeploy"

### **Variables Not Showing in Build**

- Make sure variables are set in the **correct project**
- Variables starting with `NEXT_PUBLIC_` are available at build time
- Regular variables are only available at runtime

### **Still Getting "projectId" Error**

- Double-check `NEXT_PUBLIC_SANITY_PROJECT_ID` is set correctly
- Make sure there are no extra spaces
- Try redeploying after setting variables

---

## 📝 Quick Reference

**Your Sanity Credentials:**
- Project ID: `se74u26p`
- Dataset: `production`
- API Token: `skcVtCTd4nTlk1bFaB0Lnw1BYg3O6iUJMFp8T0RSv6i46tT8fH3lmDlQxU2nSiSjN5EKX3q52CTgsV5piEc4H3FvxlmoXfxdWcjpRNWSUJuUXyQdZ7ypVQY58TA4n5lR6RnJK2VMe9ljFNlcOacXNPt4wQ7wVhZwlAdy0g8CpTyBz2pCAlp3`

**Railway Dashboard**: https://railway.app/dashboard

---

## 🎯 After Setting Variables

Once you set the environment variables:

1. ✅ Railway will automatically rebuild
2. ✅ Build should succeed
3. ✅ App will be accessible at your Railway URL
4. ✅ Sanity CMS will be connected

**The build will succeed once these variables are set!**


