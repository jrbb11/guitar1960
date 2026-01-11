-- ============================================
-- VARIANTS TABLE
-- ============================================
-- Stores product variants with attributes (size, color, etc.)

CREATE TABLE public.variants (
  id bigint NOT NULL,
  product_id bigint NOT NULL,
  sku text NULL,
  price numeric(10, 2) NULL,
  regular_price numeric(10, 2) NULL,
  sale_price numeric(10, 2) NULL,
  stock_quantity integer NULL DEFAULT 0,
  stock_status text NULL,
  attributes jsonb NULL,
  created_at timestamp without time zone NULL DEFAULT now(),
  updated_at timestamp without time zone NULL DEFAULT now(),
  compare_at_price numeric NULL,
  images text[] NULL DEFAULT array[]::text[],
  sale_starts_at timestamp with time zone NULL,
  sale_ends_at timestamp with time zone NULL,
  weight numeric(10, 2) NULL,
  length numeric(10, 2) NULL,
  width numeric(10, 2) NULL,
  height numeric(10, 2) NULL,
  CONSTRAINT variants_pkey PRIMARY KEY (id),
  CONSTRAINT variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_variants_product_id 
  ON public.variants USING btree (product_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_variants_sku 
  ON public.variants USING btree (sku) TABLESPACE pg_default;
