# ⚡ Quick Sanity Studio Setup

## 🎯 Easiest Method: Use Sanity Studio Online

**No installation needed!**

1. **Visit**: https://se74u26p.sanity.studio
2. **Login** with your Sanity account
3. **Start adding content** immediately!

---

## 🛠️ Alternative: Local Sanity Studio Setup

### **Step 1: Install Sanity CLI**

```bash
npm install -g @sanity/cli
```

### **Step 2: Initialize Studio**

```bash
cd "/Users/apple/Desktop/Grand Gold/The grand -Sabu"
sanity init --env
```

**When prompted:**
- Use existing project: **Yes**
- Project ID: `se74u26p`
- Dataset: `production`
- Output path: `./sanity-studio` (or default)
- Template: "Clean project"

### **Step 3: Copy Schemas**

```bash
# Copy your schemas to the studio
cp -r sanity/schemas sanity-studio/schemas/
```

### **Step 4: Configure Studio**

Edit `sanity-studio/sanity.config.ts`:

```typescript
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'the-grand',
  title: 'THE GRAND GOLD & DIAMONDS',
  projectId: 'se74u26p',
  dataset: 'production',
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
})
```

Edit `sanity-studio/schemas/index.ts`:

```typescript
import collection from "./collection";
import homepage from "./homepage";
import product from "./product";
import user from "./user";
import order from "./order";

export const schemaTypes = [product, collection, homepage, user, order];
```

### **Step 5: Run Studio**

```bash
cd sanity-studio
npm install
npm run dev
```

Access at: http://localhost:3333

---

## ✅ Recommended: Use Online Studio

**Just visit**: https://se74u26p.sanity.studio

**No setup needed - start adding content immediately!**


