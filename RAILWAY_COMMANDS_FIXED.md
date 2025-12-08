# 🚂 Railway CLI Commands (Corrected for v4.12.0)

## ⚠️ Important: Railway CLI v4.12.0 Syntax Change

The Railway CLI v4.12.0 uses `--set` flag instead of `set` subcommand.

---

## ✅ Correct Commands (Ready to Copy)

### **Step 1: Link Your Project**

```bash
railway link
```

Select your project from the list.

### **Step 2: Set Required Sanity Variables**

```bash
railway variables --set "NEXT_PUBLIC_SANITY_PROJECT_ID=se74u26p"
railway variables --set "NEXT_PUBLIC_SANITY_DATASET=production"
railway variables --set "SANITY_API_TOKEN=skcVtCTd4nTlk1bFaB0Lnw1BYg3O6iUJMFp8T0RSv6i46tT8fH3lmDlQxU2nSiSjN5EKX3q52CTgsV5piEc4H3FvxlmoXfxdWcjpRNWSUJuUXyQdZ7ypVQY58TA4n5lR6RnJK2VMe9ljFNlcOacXNPt4wQ7wVhZwlAdy0g8CpTyBz2pCAlp3"
```

### **Step 3: Generate and Set NEXTAUTH_SECRET**

```bash
NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables --set "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
```

### **Step 4: Set Site URLs (After First Deployment)**

After Railway deploys and gives you a URL:

```bash
railway variables --set "NEXT_PUBLIC_SITE_URL=https://your-app-name.up.railway.app"
railway variables --set "NEXTAUTH_URL=https://your-app-name.up.railway.app"
```

---

## 📋 All Commands in One Block

```bash
# Step 1: Link project
railway link

# Step 2: Set Sanity variables
railway variables --set "NEXT_PUBLIC_SANITY_PROJECT_ID=se74u26p"
railway variables --set "NEXT_PUBLIC_SANITY_DATASET=production"
railway variables --set "SANITY_API_TOKEN=skcVtCTd4nTlk1bFaB0Lnw1BYg3O6iUJMFp8T0RSv6i46tT8fH3lmDlQxU2nSiSjN5EKX3q52CTgsV5piEc4H3FvxlmoXfxdWcjpRNWSUJuUXyQdZ7ypVQY58TA4n5lR6RnJK2VMe9ljFNlcOacXNPt4wQ7wVhZwlAdy0g8CpTyBz2pCAlp3"

# Step 3: Generate and set NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables --set "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"

# Step 4: After first deployment (replace with your Railway URL):
# railway variables --set "NEXT_PUBLIC_SITE_URL=https://your-app-name.up.railway.app"
# railway variables --set "NEXTAUTH_URL=https://your-app-name.up.railway.app"
```

---

## 🔍 Verify Variables

```bash
railway variables
```

---

## 🚀 What Happens Next

1. Railway will automatically redeploy after setting variables
2. Build should succeed (Node.js 20 + environment variables set)
3. App will be accessible at your Railway URL
4. Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` after first deployment

---

## 📝 Key Differences in v4.12.0

**Old syntax (doesn't work):**
```bash
railway variables set KEY=value
```

**New syntax (correct):**
```bash
railway variables --set "KEY=value"
```

**Note**: Use quotes around `"KEY=value"` to handle special characters properly.

---

## ✅ Quick Start (Copy All)

```bash
railway link
railway variables --set "NEXT_PUBLIC_SANITY_PROJECT_ID=se74u26p"
railway variables --set "NEXT_PUBLIC_SANITY_DATASET=production"
railway variables --set "SANITY_API_TOKEN=skcVtCTd4nTlk1bFaB0Lnw1BYg3O6iUJMFp8T0RSv6i46tT8fH3lmDlQxU2nSiSjN5EKX3q52CTgsV5piEc4H3FvxlmoXfxdWcjpRNWSUJuUXyQdZ7ypVQY58TA4n5lR6RnJK2VMe9ljFNlcOacXNPt4wQ7wVhZwlAdy0g8CpTyBz2pCAlp3"
NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables --set "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
```


