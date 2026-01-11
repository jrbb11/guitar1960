# Supabase Setup - Customer Shop Integration 🎸

## Quick Start

### 1. Install Dependencies ✅
```bash
npm install @supabase/supabase-js
```

### 2. Configure Environment ✅
Update your `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Where to find these:**
> - Go to your Supabase project dashboard
> - Navigate to **Settings** → **API**
> - Copy the **URL** and **anon/public** key

### 3. Run Database Migration 🗃️
1. Go to your Supabase Dashboard → **SQL Editor**
2. Run the migration file: `dev/migrations/01_customer_cart_tables.sql`
3. Verify the tables were created successfully

### 4. Test the Integration ✅
Your app should now:
- ✅ Allow user signup/login
- ✅ Persist cart to Supabase for logged-in users
- ✅ Use localStorage for guest users
- ✅ Auto-sync guest cart when user logs in
- ✅ Fetch products from database
- ✅ Calculate shipping rates based on city

---

## What's Been Implemented

### Core Files Created
- ✅ `src/lib/supabase.ts` - Supabase client configuration
- ✅ `src/services/cart.ts` - Cart database operations
- ✅ `src/services/products.ts` - Product queries
- ✅ `src/services/shipping.ts` - Shipping rate calculations
- ✅ `src/services/orders.ts` - Order creation & management
- ✅ `src/services/categories.ts` - Category queries

### Updated Context Providers
- ✅ `src/context/AuthContext.tsx` - Real Supabase authentication
- ✅ `src/context/CartContext.tsx` - Hybrid cart (DB + localStorage)

### Database Tables
- ✅ `cart_items` - Shopping cart persistence
- ✅ RLS policies for secure data access

---

## Features

### 🔐 Authentication
- **Signup**: Creates user account with Supabase Auth
- **Login**: Session persistence with auto-refresh
- **Logout**: Clears session
- **Profile Update**: Updates user metadata

### 🛒 Shopping Cart
- **Guest Users**: Cart stored in localStorage
- **Logged-in Users**: Cart synced to Supabase database
- **Auto-sync**: Guest cart migrates to database on login
- **Real-time**: Cart changes immediately reflected

### 🚚 Shipping
- **Zone Detection**: Automatically detects shipping zone from city
- **Rate Calculation**: Metro Manila (₱200) vs Rest of PH (₱450)
- **Integration**: Uses your existing `shipping_zones` and `ph_cities` tables

### 📦 Products
- **Filtering**: By category, price, stock status
- **Search**: Full-text search on name and description
- **Variants**: Support for product variants with attributes
- **Images**: Multiple images via `gallery_urls`

### 📝 Orders
- **Creation**: Generates unique order numbers
- **History**: View past orders
- **Details**: Full shipping info, items, totals
- **Integration**: Uses existing WooCommerce-style `orders` table

---

## Next Steps

### 1. Add Your Credentials
Edit `.env` and replace the placeholder values:
```env
VITE_SUPABASE_URL=https://hwnmzusivhupyoafxvfc.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-key-here
```

### 2. Run the Migration
Execute `dev/migrations/01_customer_cart_tables.sql` in Supabase SQL Editor

### 3. Test Signup/Login
Try creating an account and logging in. Check your Supabase Dashboard → Authentication → Users to see the new user.

### 4. Test Cart
- Add items to cart as guest → items in localStorage
- Login → cart should sync to database
- Check Supabase → Database → `cart_items` table

### 5. Optional: Enable Email Confirmation
In Supabase Dashboard → Authentication → Email Templates:
- Customize the confirmation email template
- Toggle "Enable email confirmations"

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: Make sure `.env` file exists in project root with correct variables

### Issue: Cart not syncing
**Solution**: 
1. Check browser console for errors
2. Verify user is logged in: `console.log(user)` in AuthContext
3. Check RLS policies in Supabase Dashboard

### Issue: Products not loading
**Solution**:
1. Verify products exist in database
2. Check product `status` field is set to `'publish'`
3. Ensure `product_categories` join table has entries

### Issue: Shipping rate always 450
**Solution**:
1. Check if city exists in `ph_cities` or `metro_manila_cities`
2. Verify city has `zone_id` assigned
3. Check `shipping_rates` table has rates for that zone

---

## Database Schema

### Cart Items
```sql
cart_items
  - id (UUID, PK)
  - customer_id (UUID, FK → auth.users)
  - product_id (bigint)
  - variant_id (bigint, nullable)
  - quantity (integer)
  - added_at (timestamptz)
```

### Existing Tables (Already in DB)
- `products` - Product catalog
- `variants` - Product variants
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Order line items
- `shipping_zones` - Shipping zones
- `shipping_rates` - Shipping rates
- `ph_cities` - Philippine cities
- `metro_manila_cities` - Metro Manila cities

---

## Support

For questions about this setup, check:
1. [Supabase Documentation](https://supabase.com/docs)
2. [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
3. [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

Happy coding! 🎸
