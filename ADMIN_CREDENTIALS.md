# Admin User Credentials

## Current Admin Authentication Setup

The application uses **email-based authentication** with automatic user creation and role assignment.

---

## Admin Email Addresses

The following email addresses are automatically assigned the **"admin"** role when logging in:

1. **`admin@thegrand.com`** ✅ (Primary)
2. **`admin@thegrand.co.uk`** ✅
3. **`admin@thegrand.luxury`** ✅
4. **Custom email** (via `ADMIN_EMAIL` environment variable)

---

## Login Credentials

### For Credentials-Based Login:

**Email:** `admin@thegrand.com` (or any admin email listed above)  
**Password:** Any password (currently accepted)

> ⚠️ **Important Note:** The current implementation accepts any password for credentials-based login. This is a development/demo feature. In production, you should implement proper password hashing and verification.

### Login Steps:

1. Navigate to `/auth/signin`
2. Enter email: `admin@thegrand.com`
3. Enter any password
4. Click "Sign In"
5. You will be automatically assigned the "admin" role
6. You will have access to `/admin` dashboard

---

## Alternative Login Methods

### OAuth Login (Google, Facebook, Apple)

If you log in using OAuth with an admin email address, you will be assigned the "customer" role by default. To make an OAuth user an admin:

1. Log in with OAuth
2. Go to Sanity Studio at `/sanity-studio`
3. Find your user in the "Users" section
4. Change the role to "admin"
5. Save the changes

---

## Setting Custom Admin Email

You can set a custom admin email using the `ADMIN_EMAIL` environment variable:

```bash
# In your .env.local or Railway environment variables
ADMIN_EMAIL=your-custom-admin@email.com
```

Then log in with that email address to get admin access.

---

## Admin Dashboard Access

Once logged in as admin, you can access:

- **Dashboard:** `/admin`
- **Products Management:** `/admin/products`
- **Orders Management:** `/admin/orders`
- **Users Management:** `/admin/users`
- **Analytics:** `/admin/analytics`
- **Pricing Management:** `/admin/pricing`
- **Marketing:** `/admin/marketing`
- **Settings:** `/admin/settings`
- **Themes:** `/admin/themes`

---

## Role-Based Access Control

The application supports the following roles:

- **`admin`** - Full system access
- **`manager`** - Can manage products, users, analytics, marketing
- **`staff`** - Can view/edit orders, customer support
- **`customer`** - Default role for regular users

---

## Security Recommendations

### For Production:

1. **Implement Password Hashing:**
   - Currently, passwords are not hashed or verified
   - You should implement bcrypt password hashing
   - Store hashed passwords in the user schema

2. **Add Password Verification:**
   - Update the `authorize` function in `app/api/auth/[...nextauth]/route.ts`
   - Verify password hash against stored hash

3. **Set Strong Passwords:**
   - Use a password manager
   - Use unique, strong passwords for admin accounts

4. **Enable 2FA (Optional):**
   - Consider adding two-factor authentication for admin accounts

5. **Restrict Admin Email Domains:**
   - Consider restricting admin emails to specific domains
   - Use environment variables for admin emails

---

## Quick Start Guide

### To Log In as Admin:

1. **Go to:** `https://your-domain.com/auth/signin`
2. **Email:** `admin@thegrand.com`
3. **Password:** `admin123` (or any password)
4. **Click:** "Sign In"
5. **Access:** `/admin` dashboard

---

## Troubleshooting

### Can't Access Admin Dashboard?

1. **Check Email:** Make sure you're using one of the admin emails
2. **Check Role:** Verify your user role in Sanity Studio (`/sanity-studio`)
3. **Check Session:** Try logging out and logging back in
4. **Check Environment:** Ensure `ADMIN_EMAIL` is set if using custom email

### User Created as Customer Instead of Admin?

1. Go to Sanity Studio: `/sanity-studio`
2. Navigate to "Users"
3. Find your user
4. Change "Role" to "admin"
5. Save changes
6. Log out and log back in

---

## Current Implementation Details

**File:** `app/api/auth/[...nextauth]/route.ts`

The authentication system:
- Auto-creates users if they don't exist
- Assigns "admin" role based on email address
- Currently accepts any password (development mode)
- Supports OAuth providers (Google, Facebook, Apple)

---

## Summary

**Default Admin Credentials:**
- **Email:** `admin@thegrand.com`
- **Password:** Any password (currently)
- **Access:** Full admin dashboard at `/admin`

**Note:** This is a development/demo setup. For production, implement proper password hashing and verification.

---

**Last Updated:** $(date)

