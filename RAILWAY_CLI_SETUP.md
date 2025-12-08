# 🚂 Railway CLI Setup & Configuration Guide

## ✅ Node.js Version Issue Fixed

I've fixed the Node.js version issue by:
- ✅ Added `.nvmrc` file (Node.js 20)
- ✅ Added `nixpacks.toml` configuration
- ✅ Updated `package.json` with engines field
- ✅ Updated `railway.json` configuration

**Changes have been pushed to GitHub. Railway will automatically redeploy.**

---

## 🛠️ Railway CLI Installation & Setup

### **Step 1: Install Railway CLI**

**macOS:**
```bash
brew install railway
```

**Linux/Windows (via npm):**
```bash
npm install -g @railway/cli
```

**Or download directly:**
- Visit: https://railway.app/cli
- Download for your OS

### **Step 2: Login to Railway**

```bash
railway login
```

This will open your browser to authenticate with Railway.

### **Step 3: Link Your Project**

Navigate to your project directory:
```bash
cd "/Users/apple/Desktop/Grand Gold/The grand -Sabu"
```

Link to your Railway project:
```bash
railway link
```

Select your project from the list, or create a new one.

### **Step 4: Set Environment Variables via CLI**

#### **Required Variables:**

```bash
# Sanity CMS
railway variables set NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
railway variables set NEXT_PUBLIC_SANITY_DATASET=production
railway variables set SANITY_API_TOKEN=your_sanity_api_token

# Site URL (get from Railway dashboard after first deploy)
railway variables set NEXT_PUBLIC_SITE_URL=https://your-app.up.railway.app
```

#### **Recommended Variables:**

```bash
# Generate NEXTAUTH_SECRET first
openssl rand -base64 32

# Then set it
railway variables set NEXTAUTH_SECRET=your_generated_secret
railway variables set NEXTAUTH_URL=https://your-app.up.railway.app

# Optional: Metals API for dynamic pricing
railway variables set METALS_API_KEY=your_metals_api_key
```

#### **Optional Variables (for full features):**

```bash
# Stripe
railway variables set STRIPE_SECRET_KEY=sk_live_...
railway variables set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email (Resend)
railway variables set RESEND_API_KEY=re_...
railway variables set EMAIL_FROM="THE GRAND <noreply@yourdomain.com>"

# WhatsApp
railway variables set WHATSAPP_API_KEY=...
railway variables set WHATSAPP_PHONE_NUMBER_ID=...

# OAuth Providers
railway variables set GOOGLE_CLIENT_ID=...
railway variables set GOOGLE_CLIENT_SECRET=...
railway variables set FACEBOOK_CLIENT_ID=...
railway variables set FACEBOOK_CLIENT_SECRET=...

# Cron Secret
railway variables set CRON_SECRET=your_random_secret
```

### **Step 5: View All Variables**

```bash
railway variables
```

### **Step 6: Deploy via CLI**

```bash
railway up
```

This will:
1. Build your application
2. Deploy to Railway
3. Show deployment logs

### **Step 7: View Logs**

```bash
railway logs
```

Or follow logs in real-time:
```bash
railway logs --follow
```

---

## 🔑 Using Railway Tokens (Alternative Method)

### **Step 1: Generate Railway Token**

1. Go to Railway Dashboard: https://railway.app/account/tokens
2. Click **"New Token"**
3. Give it a name (e.g., "Deployment Token")
4. Copy the token (you'll only see it once!)

### **Step 2: Set Token as Environment Variable**

**macOS/Linux:**
```bash
export RAILWAY_TOKEN=your_token_here
```

**Windows (PowerShell):**
```powershell
$env:RAILWAY_TOKEN="your_token_here"
```

**Windows (CMD):**
```cmd
set RAILWAY_TOKEN=your_token_here
```

### **Step 3: Use Token with CLI**

Now you can use Railway CLI without logging in:
```bash
railway login --token $RAILWAY_TOKEN
```

Or use it directly in commands:
```bash
RAILWAY_TOKEN=your_token railway up
```

---

## 📋 Complete Setup Script

Create a setup script to automate configuration:

**`setup-railway.sh`:**
```bash
#!/bin/bash

echo "🚂 Setting up Railway environment variables..."

# Required
railway variables set NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
railway variables set NEXT_PUBLIC_SANITY_DATASET=production
railway variables set SANITY_API_TOKEN=your_sanity_api_token

# Generate and set NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Get Railway URL (you'll need to set this after first deploy)
echo "⚠️  Don't forget to set NEXT_PUBLIC_SITE_URL and NEXTAUTH_URL after first deployment!"

echo "✅ Environment variables set!"
```

Make it executable:
```bash
chmod +x setup-railway.sh
./setup-railway.sh
```

---

## 🔧 Useful Railway CLI Commands

### **Project Management**
```bash
railway status          # Show project status
railway whoami          # Show current user
railway projects        # List all projects
railway link            # Link to a project
railway unlink          # Unlink from project
```

### **Deployment**
```bash
railway up              # Deploy current directory
railway down            # Stop deployment
railway restart         # Restart service
```

### **Environment Variables**
```bash
railway variables       # List all variables
railway variables set KEY=value    # Set variable
railway variables get KEY          # Get variable value
railway variables delete KEY      # Delete variable
```

### **Logs & Monitoring**
```bash
railway logs            # View logs
railway logs --follow   # Follow logs in real-time
railway metrics         # View metrics
```

### **Database (if using Railway database)**
```bash
railway connect         # Connect to database
railway shell           # Open shell
```

---

## 🚀 Deployment Workflow

### **Initial Setup:**
```bash
# 1. Install CLI
brew install railway

# 2. Login
railway login

# 3. Link project
railway link

# 4. Set environment variables
railway variables set NEXT_PUBLIC_SANITY_PROJECT_ID=...
# ... (set all required variables)

# 5. Deploy
railway up
```

### **Regular Deployment:**
```bash
# After making changes
git add .
git commit -m "Your changes"
git push origin main

# Railway auto-deploys, or manually:
railway up
```

---

## 🐛 Troubleshooting

### **CLI Not Found**
```bash
# Reinstall CLI
brew reinstall railway
# OR
npm install -g @railway/cli
```

### **Authentication Issues**
```bash
# Re-login
railway logout
railway login
```

### **Project Not Linked**
```bash
# Link to project
railway link
# Select your project from the list
```

### **Build Still Fails with Node.js 18**

If Railway still uses Node.js 18 after our fixes:

1. **Check Railway Dashboard:**
   - Go to your project → Settings → Build
   - Verify Node version is set to 20

2. **Force rebuild:**
   ```bash
   railway up --detach
   ```

3. **Or set explicitly in Railway dashboard:**
   - Add environment variable: `NODE_VERSION=20`

---

## 📊 Monitoring Deployment

### **Watch Deployment in Real-Time:**
```bash
railway logs --follow
```

### **Check Deployment Status:**
```bash
railway status
```

### **View in Dashboard:**
Visit: https://railway.app/dashboard

---

## ✅ Verification Checklist

After deployment:

- [ ] Build completes successfully
- [ ] App is accessible at Railway URL
- [ ] All environment variables are set
- [ ] Node.js version is 20.x (check logs)
- [ ] No errors in logs
- [ ] Homepage loads correctly
- [ ] Sanity CMS connection works

---

## 🔗 Quick Links

- **Railway Dashboard**: https://railway.app/dashboard
- **CLI Documentation**: https://docs.railway.app/develop/cli
- **Your Repository**: https://github.com/Sabuanchuparayil/thegrand-
- **Railway Support**: https://railway.app/help

---

## 🎉 Next Steps

1. **Install Railway CLI**: `brew install railway`
2. **Login**: `railway login`
3. **Link Project**: `railway link`
4. **Set Variables**: Use commands above
5. **Deploy**: `railway up`

**The Node.js version issue is now fixed! Railway should automatically redeploy with Node.js 20.**


