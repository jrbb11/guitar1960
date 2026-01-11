-- ============================================
-- CUSTOMER ADDRESSES TABLE
-- ============================================
-- Stores saved shipping addresses for customers

CREATE TABLE public.customer_addresses (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  customer_id uuid NULL,
  label text NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  street_address text NOT NULL,
  barangay text NULL,
  city text NOT NULL,
  province text NOT NULL,
  region text NULL,
  postal_code text NULL,
  is_default boolean NULL DEFAULT false,
  zone_id uuid NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT customer_addresses_pkey PRIMARY KEY (id),
  CONSTRAINT customer_addresses_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT customer_addresses_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES shipping_zones (id)
) TABLESPACE pg_default;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id 
  ON public.customer_addresses USING btree (customer_id) TABLESPACE pg_default;
