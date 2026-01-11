-- ============================================
-- CUSTOMER PROFILES TABLE
-- ============================================
-- Stores customer profile information linked to auth.users

CREATE TABLE public.customer_profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  full_name text NULL,
  phone text NULL,
  avatar_url text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT customer_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT customer_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customer_profiles_email 
  ON public.customer_profiles USING btree (email) TABLESPACE pg_default;
