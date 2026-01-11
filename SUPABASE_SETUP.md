# Customer Shop Supabase Setup Guide

> **Project:** guitar1960 (Customer-Facing E-commerce Shop)  
> **Shared Supabase:** Same project as guitar1960-admin

## Overview

This guide sets up Supabase for the customer shop, sharing the database with the admin panel while keeping customer-specific features separate.

---

## Step 1: Install Dependencies

```bash
cd "D:\Dev Systems\guitar1960"
npm install @supabase/supabase-js
```

---

## Step 2: Environment Variables

Create [.env](file:///d:/Dev%20Systems/guitar1960-admin/.env) in the root:

```env
VITE_SUPABASE_URL=https://hwnmzusivhupyoafxvfc.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ **Important:** Copy the same credentials from your admin project's [.env](file:///d:/Dev%20Systems/guitar1960-admin/.env)

---

## Step 3: Create Supabase Client

**File:** [src/lib/supabase.ts](file:///d:/Dev%20Systems/guitar1960-admin/src/lib/supabase.ts)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
```

---

## Step 4: Database Migrations

Run these SQL scripts in **Supabase Dashboard → SQL Editor**:

### Migration 1: Customer Tables

```sql
-- Customer profiles (separate from admin users)
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer addresses (multiple per customer)
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customer_profiles(id) ON DELETE CASCADE,
  label TEXT, -- e.g., "Home", "Office"
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  street_address TEXT NOT NULL,
  barangay TEXT,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  region TEXT NOT NULL,
  postal_code TEXT,
  is_default BOOLEAN DEFAULT false,
  shipping_zone_id UUID REFERENCES shipping_zones(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shopping cart
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customer_profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL, -- References products table
  variant_id UUID, -- Optional: if using product variants
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, product_id, variant_id)
);

-- RLS Policies
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Customers can only access their own data
CREATE POLICY "Customers can view own profile"
  ON customer_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Customers can update own profile"
  ON customer_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Customers can view own addresses"
  ON customer_addresses FOR ALL
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can manage own cart"
  ON cart_items FOR ALL
  USING (customer_id = auth.uid());
```

### Migration 2: Order Tables (if not exists)

```sql
-- Orders table (if not created yet)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customer_profiles(id),
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  
  -- Shipping details
  shipping_address JSONB NOT NULL,
  shipping_zone_id UUID REFERENCES shipping_zones(id),
  shipping_fee DECIMAL(10,2) NOT NULL,
  
  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  
  -- Payment
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  variant_name TEXT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can view own order items"
  ON order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );
```

---

## Step 5: Customer Auth Context

**File:** [src/context/AuthContext.tsx](file:///d:/Dev%20Systems/guitar1960-admin/src/context/AuthContext.tsx)

```typescript
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })

    if (error) throw error

    // Create customer profile
    if (data.user) {
      await supabase.from('customer_profiles').insert({
        id: data.user.id,
        email,
        full_name: fullName
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

---

## Step 6: Shopping Features

### Cart Service

**File:** `src/services/cart.ts`

```typescript
import { supabase } from '../lib/supabase'

export async function addToCart(productId: string, quantity: number = 1) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Must be logged in')

  const { error } = await supabase
    .from('cart_items')
    .upsert({
      customer_id: user.id,
      product_id: productId,
      quantity
    }, {
      onConflict: 'customer_id,product_id,variant_id'
    })

  if (error) throw error
}

export async function getCart() {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      products (
        id,
        name,
        price,
        image_url
      )
    `)

  if (error) throw error
  return data
}

export async function updateCartQuantity(itemId: string, quantity: number) {
  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)

  if (error) throw error
}

export async function removeFromCart(itemId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)

  if (error) throw error
}
```

---

## Step 7: Shipping Integration

Import the shipping service from admin:

```typescript
import { supabase } from '../lib/supabase'

export async function getShippingRate(cityName: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_shipping_rate', {
    city_name: cityName
  })

  if (error) {
    console.error('Error getting shipping rate:', error)
    return 450.00 // Default to Rest of Philippines
  }

  return data || 450.00
}
```

---

## Next Steps

1. ✅ Run all SQL migrations in Supabase Dashboard
2. ✅ Copy [.env](file:///d:/Dev%20Systems/guitar1960-admin/.env) credentials from admin project
3. ✅ Create [src/lib/supabase.ts](file:///d:/Dev%20Systems/guitar1960-admin/src/lib/supabase.ts)
4. ✅ Implement [AuthContext](file:///d:/Dev%20Systems/guitar1960-admin/src/context/AuthContext.tsx#11-16) for customer auth
5. ⏳ Build shopping cart UI
6. ⏳ Build checkout flow with shipping calculation
7. ⏳ Build order tracking page

---

## Shared Tables (Already in Database)

These tables are used by both admin and customer apps:
- ✅ `products`
- ✅ `categories`
- ✅ `shipping_zones`
- ✅ `shipping_rates`
- ✅ `metro_manila_cities`

Customer app can read these tables directly (RLS allows public SELECT).
