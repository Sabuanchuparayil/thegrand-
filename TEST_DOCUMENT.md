# THE GRAND GOLD & DIAMONDS - Comprehensive Test Document

## Table of Contents
1. [Test User Credentials](#test-user-credentials)
2. [How to Create Test Users](#how-to-create-test-users)
3. [Testing Procedures](#testing-procedures)
4. [Admin Panel Access](#admin-panel-access)
5. [Test Scenarios](#test-scenarios)
6. [API Testing](#api-testing)
7. [Environment Setup](#environment-setup)

---

## Test User Credentials

### Default Admin Accounts

The following email addresses are automatically assigned the **Admin** role when first logged in:

| Email Address | Password | Role | Permissions |
|--------------|----------|------|-------------|
| `admin@thegrand.com` | Any password* | Admin | Full access |
| `admin@thegrand.co.uk` | Any password* | Admin | Full access |
| `admin@thegrand.luxury` | Any password* | Admin | Full access |
| `admin@example.com` | Any password* | Admin | If set via `ADMIN_EMAIL` env var |

\* *Note: The application currently uses auto-creation for demo purposes. Any password will work, but email-based authentication is used.*

### Recommended Test Users

Create these users through the admin panel at `/admin/users/new` or Sanity Studio:

#### 1. Admin User
```
Email: admin@thegrand.com
Name: Admin User
Phone: +44 20 7946 0958
WhatsApp: +44 20 7946 0958
Role: Admin
Password: (Any - auto-created)
```
**Capabilities:**
- Full access to all features
- Manage products, categories, materials, stones
- Manage users and roles
- View analytics and reports
- Manage pricing
- Send marketing communications
- Delete any content

#### 2. Manager User
```
Email: manager@thegrand.com
Name: Manager User
Phone: +44 20 7946 0959
WhatsApp: +44 20 7946 0959
Role: Manager
Password: (Any - auto-created)
```
**Capabilities:**
- View and edit products
- View and edit orders
- View and edit users
- View analytics
- Send marketing communications
- **Cannot:** Delete products/orders/users, manage pricing

#### 3. Staff User
```
Email: staff@thegrand.com
Name: Staff User
Phone: +44 20 7946 0960
WhatsApp: +44 20 7946 0960
Role: Staff
Password: (Any - auto-created)
```
**Capabilities:**
- View products
- View and edit orders
- **Cannot:** Edit products, manage users, view analytics

#### 4. Customer User (Regular)
```
Email: customer@thegrand.com
Name: John Customer
Phone: +44 20 7946 0961
WhatsApp: +44 20 7946 0961
Role: Customer
Password: (Any - auto-created)
```
**Capabilities:**
- View products
- Add to cart
- Place orders
- View own orders
- Manage profile
- **Cannot:** Access admin panel

#### 5. Test Customer Accounts
```
Email: test.customer1@example.com
Email: test.customer2@example.com
Email: test.customer3@example.com
```
*Use these for testing multiple customer scenarios*

---

## How to Create Test Users

### Method 1: Via Admin Panel (Recommended)

1. **Login as Admin:**
   - Go to `/auth/signin`
   - Email: `admin@thegrand.com`
   - Password: (any)

2. **Navigate to User Management:**
   - Click "Users" in the admin sidebar
   - Click "Add New User" button

3. **Fill in User Details:**
   - Name: User's full name
   - Email: Unique email address
   - Phone: Phone number with country code
   - WhatsApp: (Optional) WhatsApp number
   - Role: Select from dropdown (Customer, Staff, Manager, Admin)
   - Click "Create User"

### Method 2: Via Sanity Studio

1. **Open Sanity Studio:**
   ```bash
   npm run sanity:studio
   # or visit your Sanity Studio URL
   ```

2. **Create New User Document:**
   - Click "Users" in the sidebar
   - Click "Create new"
   - Fill in all required fields
   - Set `role` field appropriately
   - Save

### Method 3: Via API (For Automated Testing)

```bash
# Create a new user
curl -X POST https://your-domain.com/api/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com",
    "phone": "+44 20 7946 0000",
    "whatsapp": "+44 20 7946 0000",
    "role": "customer"
  }'
```

**Note:** Requires admin authentication via session cookie.

### Method 4: Auto-Creation on Login

If a user doesn't exist and they try to log in:
- The system will **auto-create** the user account
- Role is determined by email:
  - Admin emails → `admin` role
  - All other emails → `customer` role

---

## Testing Procedures

### 1. Login/Logout Testing

#### Test Case 1.1: Admin Login
1. Navigate to `/auth/signin`
2. Enter email: `admin@thegrand.com`
3. Enter any password
4. Click "Sign In"
5. **Expected:** Redirected to admin dashboard (`/admin`)
6. **Verify:** Admin sidebar is visible with all menu items

#### Test Case 1.2: Customer Login
1. Navigate to `/auth/signin`
2. Enter email: `customer@thegrand.com`
3. Enter any password
4. Click "Sign In"
5. **Expected:** Redirected to homepage or profile page
6. **Verify:** No admin panel access (403 if accessing `/admin`)

#### Test Case 1.3: Invalid Login
1. Navigate to `/auth/signin`
2. Enter invalid email or leave fields empty
3. Click "Sign In"
4. **Expected:** Error message displayed

#### Test Case 1.4: Logout
1. While logged in, click "Sign Out" in navigation
2. **Expected:** Redirected to homepage, session cleared

### 2. Admin Panel Testing

#### Test Case 2.1: Dashboard Access
1. Login as admin
2. Navigate to `/admin`
3. **Expected:** Dashboard page loads with statistics
4. **Verify:** All widgets and metrics are visible

#### Test Case 2.2: Product Management
1. Navigate to `/admin/products`
2. **Expected:** List of all products
3. Click "Add New Product"
4. **Expected:** Product creation form loads
5. Fill in product details and upload images
6. **Expected:** Product created successfully
7. **Verify:** Product appears in product list

#### Test Case 2.3: Category Management
1. Navigate to `/admin/categories`
2. Click "Add New Category"
3. Enter category name: "Test Category"
4. Set sort order: 1
5. Click "Save Category"
6. **Expected:** Category created and appears in list
7. Test edit and delete functions

#### Test Case 2.4: Material Management
1. Navigate to `/admin/materials`
2. Click "Add New Material"
3. Enter material: "24k Gold"
4. Set karat: 24
5. Click "Save Material"
6. **Expected:** Material created successfully

#### Test Case 2.5: Stone Management
1. Navigate to `/admin/stones`
2. Click "Add New Stone"
3. Enter stone name: "Test Diamond"
4. Set type: "Precious Stone"
5. Set hardness: 10
6. Click "Save Stone"
7. **Expected:** Stone created successfully

#### Test Case 2.6: User Management
1. Navigate to `/admin/users`
2. **Expected:** List of all users with role counts
3. Click "Add New User"
4. Create a test user with manager role
5. **Expected:** User created and appears in list
6. Test role change functionality

#### Test Case 2.7: Order Management
1. Navigate to `/admin/orders`
2. **Expected:** List of all orders
3. Click on an order to view details
4. **Expected:** Order details page loads
5. Test order status updates

### 3. Image Upload Testing

#### Test Case 3.1: Product Image Upload
1. Login as admin
2. Navigate to `/admin/products/new`
3. Fill in basic product information
4. Scroll to "Images" section
5. Click upload area or drag and drop images
6. Select multiple images (JPG, PNG)
7. **Expected:**
   - Images upload immediately
   - Preview thumbnails appear
   - First image marked as "Main Image"
8. Remove an image using trash icon
9. **Expected:** Image removed from preview
10. Submit form
11. **Expected:** Product created with all images attached

#### Test Case 3.2: Image Upload Validation
1. Try uploading non-image file (PDF, DOCX)
2. **Expected:** Error message: "File must be an image"
3. Try uploading very large file (>10MB)
4. **Expected:** Upload fails or error message

### 4. Shopping Cart Testing

#### Test Case 4.1: Add to Cart (Guest)
1. Navigate to any product page
2. Click "Add to Cart"
3. **Expected:** Cart icon shows item count
4. Click cart icon
5. **Expected:** Cart sidebar/dropdown opens
6. **Verify:** Product visible in cart

#### Test Case 4.2: Add to Cart (Logged In)
1. Login as customer
2. Navigate to product page
3. Add multiple products to cart
4. **Expected:** All items accumulate in cart
5. **Verify:** Cart persists across page navigation

#### Test Case 4.3: Update Cart Quantity
1. Open cart
2. Change quantity of an item
3. **Expected:** Total price updates
4. Remove item from cart
5. **Expected:** Item removed, cart updates

### 5. Checkout Testing

#### Test Case 5.1: Guest Checkout
1. Add product to cart (as guest)
2. Click "Checkout"
3. **Expected:** Redirected to sign-in or checkout page
4. Fill in shipping details
5. Select payment method
6. Complete checkout
7. **Expected:** Order confirmation page

#### Test Case 5.2: Registered User Checkout
1. Login as customer
2. Add products to cart
3. Go to checkout
4. **Expected:** Address pre-filled if saved
5. Complete order
6. **Expected:** Order number generated
7. **Verify:** Order visible in `/admin/orders` (admin view)
8. **Verify:** Order visible in user profile (customer view)

### 6. Product Filtering Testing

#### Test Case 6.1: Category Filtering
1. Navigate to `/shop`
2. Click on a category (e.g., "Necklaces")
3. **Expected:** Only products from that category displayed
4. Use search bar to filter further
5. **Expected:** Results update dynamically

#### Test Case 6.2: Cultural Tag Filtering
1. Navigate to `/explore-by-culture`
2. Click on a cultural collection
3. **Expected:** Products filtered by cultural tag
4. **Verify:** Products match the selected culture

#### Test Case 6.3: Material/Stone Filtering
1. Navigate to `/shop/[category]`
2. Use filters for material type (e.g., "22k Gold")
3. **Expected:** Only products with that material shown
4. Filter by stone type
5. **Expected:** Combined filters work correctly

---

## Admin Panel Access

### Admin Dashboard URL
```
Production: https://thegrand-production.up.railway.app/admin
Local: http://localhost:3000/admin
```

### Admin Menu Structure

```
Dashboard (/admin)
├── Products (/admin/products)
│   └── Add New Product (/admin/products/new)
├── Categories (/admin/categories)
├── Materials (/admin/materials)
├── Stones (/admin/stones)
├── Orders (/admin/orders)
├── Users (/admin/users)
│   └── Add New User (/admin/users/new)
├── Roles (/admin/roles)
│   └── Add New Role (/admin/roles/new)
├── Analytics (/admin/analytics)
├── Pricing (/admin/pricing)
├── Marketing (/admin/marketing)
├── Themes (/admin/themes)
└── Settings (/admin/settings)
```

### Permission Matrix

| Feature | Customer | Staff | Manager | Admin |
|---------|----------|-------|---------|-------|
| View Products | ✅ | ✅ | ✅ | ✅ |
| Edit Products | ❌ | ❌ | ✅ | ✅ |
| Delete Products | ❌ | ❌ | ❌ | ✅ |
| View Orders | Own only | ✅ | ✅ | ✅ |
| Edit Orders | ❌ | ✅ | ✅ | ✅ |
| Delete Orders | ❌ | ❌ | ❌ | ✅ |
| View Users | ❌ | ❌ | ✅ | ✅ |
| Edit Users | ❌ | ❌ | ✅ | ✅ |
| Delete Users | ❌ | ❌ | ❌ | ✅ |
| View Analytics | ❌ | ❌ | ✅ | ✅ |
| Manage Pricing | ❌ | ❌ | ❌ | ✅ |
| Send Marketing | ❌ | ❌ | ✅ | ✅ |
| Manage Categories | ❌ | ❌ | ❌ | ✅ |
| Manage Materials | ❌ | ❌ | ❌ | ✅ |
| Manage Stones | ❌ | ❌ | ❌ | ✅ |

---

## Test Scenarios

### Scenario 1: Complete Product Creation Flow

**Objective:** Test the full product creation process with images

**Steps:**
1. Login as admin
2. Navigate to `/admin/products/new`
3. Fill in product information:
   - Name: "Test Gold Necklace"
   - Description: "A beautiful test necklace"
   - Price: 999.99
   - Category: Necklaces
   - Material: 22k Gold
   - Gold Weight: 10.5
   - Add stones: Diamond, 2ct
4. Upload 3 product images
5. Set as featured product
6. Click "Create Product"
7. **Verify:** Product appears in product list
8. Navigate to product page
9. **Verify:** All images display correctly
10. **Verify:** Product details match form input

### Scenario 2: Order Fulfillment Workflow

**Objective:** Test order processing from creation to fulfillment

**Steps:**
1. Login as customer
2. Add 2 products to cart
3. Complete checkout
4. Note order number
5. Login as admin
6. Navigate to `/admin/orders`
7. Find the order by order number
8. View order details
9. Update order status (e.g., "Processing" → "Shipped")
10. **Verify:** Status updates correctly
11. **Verify:** Customer can see updated status in their order history

### Scenario 3: User Role Management

**Objective:** Test role assignment and permission enforcement

**Steps:**
1. Login as admin
2. Create a new user with "Staff" role
3. Logout
4. Login with new staff account
5. Try accessing `/admin/users`
6. **Verify:** Access denied (403) or redirect
7. Try accessing `/admin/orders`
8. **Verify:** Access granted
9. Try editing a product
10. **Verify:** Access denied (only view allowed)
11. Login as admin
12. Change user role to "Manager"
13. Login as manager
14. **Verify:** Can now edit products and view analytics

### Scenario 4: Multi-Image Product Management

**Objective:** Test image upload, preview, and deletion

**Steps:**
1. Login as admin
2. Create new product
3. Upload 5 images simultaneously
4. **Verify:** All upload successfully
5. **Verify:** Preview thumbnails appear
6. **Verify:** First image marked as "Main Image"
7. Delete 2 images using trash icon
8. **Verify:** Only 3 images remain
9. Submit product
10. Navigate to product page
11. **Verify:** Only 3 images display
12. Edit product in Sanity Studio
13. Add 2 more images
14. **Verify:** Total 5 images on product page

---

## API Testing

### Base URLs
```
Production: https://thegrand-production.up.railway.app/api
Local: http://localhost:3000/api
```

### Authentication Required Endpoints

These endpoints require admin/manager authentication (session cookie):

#### 1. Create Product
```bash
POST /api/products/create
Content-Type: application/json

{
  "name": "Test Product",
  "description": "Test description",
  "price": 999.99,
  "category": "necklaces",
  "material_type": "22k Gold",
  "gold_weight": 10.5,
  "stones": [{"type": "Diamond", "quantity": 1}],
  "images": [...],
  "featured": true,
  "pricing_model": "fixed"
}
```

#### 2. Upload Image
```bash
POST /api/upload/image
Content-Type: multipart/form-data

file: [image file]
alt: "Product image description"
```

#### 3. Create Category
```bash
POST /api/categories
Content-Type: application/json

{
  "name": "Test Category",
  "description": "Test category description",
  "icon": "tag",
  "isActive": true,
  "sortOrder": 1
}
```

#### 4. Create Material
```bash
POST /api/materials
Content-Type: application/json

{
  "name": "24k Gold",
  "description": "Pure gold",
  "karat": 24,
  "isActive": true,
  "sortOrder": 1
}
```

#### 5. Create Stone
```bash
POST /api/stones
Content-Type: application/json

{
  "name": "Diamond",
  "type": "precious",
  "description": "Precious stone",
  "color": "Clear",
  "hardness": 10,
  "isActive": true,
  "sortOrder": 1
}
```

#### 6. Create User
```bash
POST /api/users/create
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "+44 20 7946 0000",
  "whatsapp": "+44 20 7946 0000",
  "role": "customer"
}
```

### Public Endpoints (No Authentication)

#### 1. Get Products
```bash
GET /api/collections
```

#### 2. Get Gold Price
```bash
GET /api/gold-price
```

#### 3. Get Collections
```bash
GET /api/collections
```

### Testing with cURL

#### Test Image Upload (with authentication cookie)
```bash
# First, login and get session cookie
curl -c cookies.txt -X POST https://your-domain.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@thegrand.com", "password": "any"}'

# Then upload image
curl -b cookies.txt -X POST https://your-domain.com/api/upload/image \
  -F "file=@/path/to/image.jpg" \
  -F "alt=Test image"
```

---

## Environment Setup

### Required Environment Variables

#### For Local Development (.env.local)
```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=m215e86r
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token_here

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Admin Email (optional)
ADMIN_EMAIL=admin@thegrand.com

# Metals API (optional - for dynamic pricing)
METALS_API_KEY=your_metals_api_key_here
METALS_API_BASE_URL=https://api.metals.dev/v1

# Cron Secret (optional - for scheduled jobs)
CRON_SECRET=your_cron_secret_here

# Stripe (optional - for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

#### For Production (Railway)
Set all the same variables in Railway dashboard under your project's "Variables" tab.

### Test Data Setup

1. **Create Test Categories:**
   - Use `/admin/categories` to create test categories
   - Or use Sanity Studio

2. **Create Test Materials:**
   - Use `/admin/materials` to create test materials
   - Examples: 22k Gold, 18k Gold, Platinum, Silver

3. **Create Test Stones:**
   - Use `/admin/stones` to create test stones
   - Examples: Diamond, Emerald, Sapphire, Ruby, Pearl

4. **Create Test Products:**
   - Use `/admin/products/new` to create products
   - Upload test images for each product
   - Assign categories, materials, and stones

5. **Create Test Collections:**
   - Use Sanity Studio to create collections
   - Assign hero images and cultural tags

---

## Quick Test Checklist

### ✅ Pre-Deployment Testing

- [ ] Admin login works
- [ ] All admin pages accessible
- [ ] Product creation with images works
- [ ] Category/Material/Stone management works
- [ ] User creation and role assignment works
- [ ] Image upload works correctly
- [ ] Shopping cart functions properly
- [ ] Checkout process completes
- [ ] Orders visible in admin panel
- [ ] Role-based permissions enforced
- [ ] Mobile responsive design works
- [ ] All API endpoints respond correctly

### ✅ Post-Deployment Testing

- [ ] Production URL loads correctly
- [ ] SSL certificate valid
- [ ] All images load from Sanity CDN
- [ ] Environment variables configured
- [ ] Cron jobs running (if configured)
- [ ] Email notifications working (if configured)
- [ ] Payment processing works (if configured)
- [ ] Error tracking set up (if configured)

---

## Troubleshooting

### Issue: Cannot Login as Admin
**Solution:**
- Ensure email matches one of the admin emails
- Check that user exists in Sanity (or auto-creation is enabled)
- Verify session cookies are enabled in browser

### Issue: Image Upload Fails
**Solution:**
- Verify `SANITY_API_TOKEN` is set correctly
- Check file size (should be < 10MB)
- Ensure file is valid image format (JPG, PNG)
- Check browser console for errors

### Issue: 403 Forbidden on Admin Pages
**Solution:**
- Verify user role is "admin" or "manager"
- Check user permissions in Sanity
- Ensure `isActive` is true for the user
- Try logging out and back in

### Issue: Products Not Appearing
**Solution:**
- Check product `category` field is set correctly
- Verify product is not filtered out
- Check Sanity dataset is correct
- Verify products exist in Sanity Studio

---

## Additional Resources

- **Sanity Studio:** Access your Sanity Studio to manage content directly
- **Railway Dashboard:** Monitor deployments and logs
- **GitHub Repository:** View code and commit history
- **API Documentation:** See `README.md` for API details

---

## Test Data Templates

### Sample Product Data
```json
{
  "name": "Traditional Gold Necklace",
  "description": "A beautiful traditional Indian bridal necklace",
  "price": 2499.99,
  "category": "necklaces",
  "material_type": "22k Gold",
  "gold_weight": 25.5,
  "cultural_tags": ["Traditional Indian Bridal"],
  "stones": [
    {"type": "Diamond", "quantity": 12, "weight": 2.5},
    {"type": "Emerald", "quantity": 8, "weight": 1.8}
  ],
  "featured": true,
  "pricing_model": "dynamic"
}
```

### Sample User Data
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+44 20 7946 0000",
  "whatsapp": "+44 20 7946 0000",
  "role": "customer"
}
```

---

**Last Updated:** December 2024
**Version:** 1.0
**Maintained By:** Development Team

