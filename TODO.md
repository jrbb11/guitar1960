# Project TODO

1. **Supabase setup**
   - Create project, tables (products, categories, variants, images, users, orders, order_items, addresses, wishlist, reviews) and storage buckets
   - Configure RLS and service role keys in env
   - Wire up Supabase client in the app

2. **Auth flows**
   - Build Login/Signup pages and connect to Supabase Auth
   - Add protected routes (account, checkout)
   - Implement password reset flow

3. **Data fetching layer**
   - Create custom hooks: useAuth, useProducts (list/detail/filter), useCart (persisted), useWishlist, useOrders
   - Replace mock data with Supabase queries

4. **Shop functionality**
   - Implement search (header search box)
   - Add filtering/sorting (category, price range, size, latest)
   - Product detail: better variant selector, image gallery/zoom

5. **Cart & checkout**
   - Cart summary with totals/discounts
   - Checkout page with address form and order placement (write orders/order_items)
   - Order success page showing real order data

6. **Account area**
   - Orders list with status; order detail page
   - Addresses CRUD
   - Wishlist CRUD
   - Profile edit (name/phone)

7. **Reviews**
   - Add product reviews/ratings
   - Display average rating and review list
   - Submit form (auth required)

8. **Newsletter/contact**
   - Connect newsletter form to Supabase (or email service)
   - Add Contact page with form storage/email

9. **Payments (later)**
   - Integrate PayMongo/GCash
   - Capture payment status and update orders

10. **Polish & resilience**
    - Loading/skeleton states and error handling
    - Empty states across pages
    - SEO/meta tags, sitemap, robots
    - Accessibility pass (focus, labels, contrast)
