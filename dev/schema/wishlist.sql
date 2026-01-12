-- ============================================
-- WISHLIST TABLE
-- ============================================
-- Stores wishlist items for authenticated users

CREATE TABLE public.wishlist_items (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  customer_id uuid NOT NULL,
  product_id bigint NOT NULL,
  variant_id bigint NULL,
  added_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT wishlist_items_pkey PRIMARY KEY (id),
  CONSTRAINT wishlist_items_customer_id_product_id_variant_id_key UNIQUE (customer_id, product_id, variant_id),
  CONSTRAINT wishlist_items_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT wishlist_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id),
  CONSTRAINT wishlist_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES variants (id)
) TABLESPACE pg_default;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_items_customer_id 
  ON public.wishlist_items USING btree (customer_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id 
  ON public.wishlist_items USING btree (product_id) TABLESPACE pg_default;
