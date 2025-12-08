# 🚂 Railway CLI Commands with Actual Credentials

## ✅ Ready-to-Use Commands

Copy and paste these commands in your terminal (after `railway login` and `railway link`):

---

## **Step 1: Set Required Sanity Variables**

```bash
railway variables set NEXT_PUBLIC_SANITY_PROJECT_ID=se74u26p
railway variables set NEXT_PUBLIC_SANITY_DATASET=production
railway variables set SANITY_API_TOKEN=skcVtCTd4nTlk1bFaB0Lnw1BYg3O6iUJMFp8T0RSv6i46tT8fH3lmDlQxU2nSiSjN5EKX3q52CTgsV5piEc4H3FvxlmoXfxdWcjpRNWSUJuUXyQdZ7ypVQY58TA4n5lR6RnJK2VMe9ljFNlcOacXNPt4wQ7wVhZwlAdy0g8CpTyBz2pCAlp3
```

---

## **Step 2: Generate and Set NEXTAUTH_SECRET**

```bash
NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set NEXTAUTH_SECRET=$NEXTAUTH_SECRET
```

---

## **Step 3: Set Site URLs (After First Deployment)**

**First, get your Railway URL from the dashboard, then run:**

```bash
# Replace 'your-app-name' with your actual Railway app name
railway variables set NEXT_PUBLIC_SITE_URL=https://your-app-name.up.railway.app
railway variables set NEXTAUTH_URL=https://your-app-name.up.railway.app
```

---

## **Complete Setup (All at Once)**

```bash
# Required Sanity variables
railway variables set NEXT_PUBLIC_SANITY_PROJECT_ID=se74u26p
railway variables set NEXT_PUBLIC_SANITY_DATASET=production
railway variables set SANITY_API_TOKEN=skcVtCTd4nTlk1bFaB0Lnw1BYg3O6iUJMFp8T0RSv6i46tT8fH3lmDlQxU2nSiSjN5EKX3q52CTgsV5piEc4H3FvxlmoXfxdWcjpRNWSUJuUXyQdZ7ypVQY58TA4n5lR6RnJK2VMe9ljFNlcOacXNPt4wQ7wVhZwlAdy0g8CpTyBz2pCAlp3

# Generate and set NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# After first deployment, set these (replace with your actual Railway URL):
# railway variables set NEXT_PUBLIC_SITE_URL=https://your-app-name.up.railway.app
# railway variables set NEXTAUTH_URL=https://your-app-name.up.railway.app
```

---

## **Or Use the Setup Script**

```bash
# Make sure you're in the project directory
cd "/Users/apple/Desktop/Grand Gold/The grand -Sabu"

# Run the setup script
./RAILWAY_SET_ENV.sh
```

---

## **Verify Variables Are Set**

```bash
railway variables
```

You should see all the variables listed.

---

## **After Setting Variables**

Railway will automatically trigger a new deployment. Monitor it:

```bash
railway logs --follow
```

---

## **Your Sanity Credentials**

- **Project ID**: `se74u26p`
- **Dataset**: `production`
- **API Token**: `skcVtCTd4nTlk1bFaB0Lnw1BYg3O6iUJMFp8T0RSv6i46tT8fH3lmDlQxU2nSiSjN5EKX3q52CTgsV5piEc4H3FvxlmoXfxdWcjpRNWSUJuUXyQdZ7ypVQY58TA4n5lR6RnJK2VMe9ljFNlcOacXNPt4wQ7wVhZwlAdy0g8CpTyBz2pCAlp3`

---

## **Quick Start**

1. **Login and link:**
   ```bash
   railway login
   railway link
   ```

2. **Set variables (copy all at once):**
   ```bash
   railway variables set NEXT_PUBLIC_SANITY_PROJECT_ID=se74u26p
   railway variables set NEXT_PUBLIC_SANITY_DATASET=production
   railway variables set SANITY_API_TOKEN=skcVtCTd4nTlk1bFaB0Lnw1BYg3O6iUJMFp8T0RSv6i46tT8fH3lmDlQxU2nSiSjN5EKX3q52CTgsV5piEc4H3FvxlmoXfxdWcjpRNWSUJuUXyQdZ7ypVQY58TA4n5lR6RnJK2VMe9ljFNlcOacXNPt4wQ7wVhZwlAdy0g8CpTyBz2pCAlp3
   NEXTAUTH_SECRET=$(openssl rand -base64 32)
   railway variables set NEXTAUTH_SECRET=$NEXTAUTH_SECRET
   ```

3. **Wait for deployment** (Railway auto-redeploys)

4. **Get your Railway URL** from dashboard and set:
   ```bash
   railway variables set NEXT_PUBLIC_SITE_URL=https://your-app-name.up.railway.app
   railway variables set NEXTAUTH_URL=https://your-app-name.up.railway.app
   ```

---

**That's it! Your app should deploy successfully! 🚀**


