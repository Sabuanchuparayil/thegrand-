# 🚂 Railway Deployment Guide

## ✅ Code Successfully Pushed to GitHub

Your code is now available at: **https://github.com/Sabuanchuparayil/thegrand-**

---

## 🚀 Step-by-Step Railway Setup

### **Step 1: Create Railway Account**

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"** or **"Login"**
3. Sign up with GitHub (recommended) or email

### **Step 2: Create New Project**

1. Click **"New Project"** in Railway dashboard
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub account
4. Select repository: **`Sabuanchuparayil/thegrand-`**
5. Click **"Deploy Now"**

### **Step 3: Configure Build Settings**

Railway will auto-detect Next.js, but verify these settings:

1. Go to your project → **Settings** → **Build**
2. Verify:
   - **Build Command**: `npm run build` ✅ (auto-detected)
   - **Start Command**: `npm start` ✅ (auto-detected)
   - **Node Version**: `20.x` (Railway will use Node 20 automatically)

### **Step 4: Add Environment Variables** ⚠️ CRITICAL

Go to your project → **Variables** tab and add these:

#### **Required Variables:**

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
NEXT_PUBLIC_SITE_URL=https://your-app-name.up.railway.app
```

#### **Recommended Variables:**

```env
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=https://your-app-name.up.railway.app
METALS_API_KEY=your_metals_dev_api_key
```

#### **Optional (for full features):**

```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
RESEND_API_KEY=re_...
EMAIL_FROM=THE GRAND <noreply@yourdomain.com>
WHATSAPP_API_KEY=...
WHATSAPP_PHONE_NUMBER_ID=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
APPLE_ID=...
APPLE_SECRET=...
CRON_SECRET=random_secret_string
```

**How to generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### **Step 5: Configure Custom Domain (Optional)**

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"** (Railway provides free `.up.railway.app` domain)
3. Or add your custom domain:
   - Click **"Custom Domain"**
   - Enter your domain
   - Follow DNS configuration instructions

### **Step 6: Deploy**

1. Railway will automatically start building when you:
   - Push to the `main` branch, OR
   - Click **"Deploy"** in the Railway dashboard

2. Monitor the build:
   - Go to **Deployments** tab
   - Watch the build logs
   - Wait for "Build successful" message

### **Step 7: Verify Deployment**

1. Once deployed, Railway will provide a URL like:
   - `https://your-app-name.up.railway.app`

2. Visit the URL and test:
   - ✅ Homepage loads
   - ✅ Navigation works
   - ✅ Products display (if Sanity is configured)
   - ✅ Check browser console for errors

---

## 🔧 Railway-Specific Configuration

### **Port Configuration**

Railway automatically sets `PORT` environment variable. Next.js will use it automatically.

### **Build Settings**

Your `railway.json` is already configured:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **Cron Jobs (Scheduled Tasks)**

For scheduled gold price updates, you can use Railway's Cron Jobs:

1. Go to **Settings** → **Cron Jobs**
2. Add cron job:
   - **Schedule**: `0 7 * * *` (7 AM daily)
   - **Command**: `curl https://your-app.up.railway.app/api/gold-price/scheduled?secret=YOUR_CRON_SECRET`

Or use Railway's built-in cron feature (if available in your plan).

---

## 📊 Monitoring & Logs

### **View Logs**

1. Go to your project in Railway dashboard
2. Click **"View Logs"** or **"Deployments"** tab
3. Select a deployment to see build and runtime logs

### **Health Checks**

Railway automatically monitors your app. Check:
- **Deployments** tab for deployment status
- **Metrics** tab for resource usage
- **Logs** for any errors

---

## 🔐 Security Checklist

- [ ] All environment variables are set
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] Sanity API token has proper permissions
- [ ] Stripe keys are production keys (not test)
- [ ] Custom domain has SSL enabled (automatic with Railway)

---

## 🐛 Troubleshooting

### **Build Fails**

1. Check build logs in Railway dashboard
2. Common issues:
   - Missing environment variables
   - Node.js version mismatch (should be 20.x)
   - TypeScript errors (should be none)

### **App Crashes After Deployment**

1. Check runtime logs
2. Verify all required environment variables are set
3. Check `NEXT_PUBLIC_SITE_URL` matches your Railway domain

### **Images Not Loading**

1. Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is set
2. Check Sanity CORS settings allow your Railway domain
3. Verify Sanity project has content

### **Authentication Not Working**

1. Verify `NEXTAUTH_SECRET` is set (32+ characters)
2. Check `NEXTAUTH_URL` matches your Railway domain
3. Verify OAuth provider credentials if using

---

## 📈 Railway Pricing

- **Hobby Plan**: $5/month (includes $5 credit)
- **Pro Plan**: $20/month (includes $20 credit)
- Free tier available for testing

**Note**: Railway charges based on resource usage. Monitor your usage in the dashboard.

---

## 🔄 Continuous Deployment

Railway automatically deploys when you push to the `main` branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Railway will detect the push and automatically:
1. Build your application
2. Run tests (if configured)
3. Deploy to production

---

## 📝 Quick Reference

**Railway Dashboard**: https://railway.app/dashboard  
**Your Repository**: https://github.com/Sabuanchuparayil/thegrand-  
**Railway Docs**: https://docs.railway.app

---

## ✅ Post-Deployment Checklist

- [ ] App is accessible at Railway URL
- [ ] All pages load correctly
- [ ] Environment variables are set
- [ ] Sanity CMS connection works
- [ ] Authentication works (if configured)
- [ ] Custom domain configured (if using)
- [ ] SSL certificate active
- [ ] Monitoring/logging set up

---

## 🎉 You're All Set!

Your application should now be live on Railway! 

**Next Steps:**
1. Configure Sanity CMS with content
2. Test all features
3. Set up custom domain (optional)
4. Configure monitoring and alerts

**Need Help?**
- Railway Support: https://railway.app/help
- Railway Discord: https://discord.gg/railway


