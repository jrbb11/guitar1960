-- ============================================
-- USER PROFILE TABLE
-- ============================================
-- Stores admin user profiles (separate from customer_profiles)

CREATE TABLE public.user_profile (
  id uuid NOT NULL,
  full_name text NULL,
  email text NULL,
  phone text NULL,
  avatar_url text NULL,
  created_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_profile_pkey PRIMARY KEY (id),
  CONSTRAINT user_profile_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;
