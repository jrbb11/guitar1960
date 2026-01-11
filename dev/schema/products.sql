-- ============================================
-- PRODUCTS TABLE
-- ============================================
-- Stores main product information

CREATE TABLE public.products (
  id bigint NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  sku text NULL,
  description text NULL,
  price numeric(10, 2) NULL,
  regular_price numeric(10, 2) NULL,
  sale_price numeric(10, 2) NULL,
  stock_quantity integer NULL DEFAULT 0,
  stock_status text NULL,
  manage_stock boolean NULL DEFAULT false,
  image_id bigint NULL,
  image_url text NULL,
  weight numeric(10, 2) NULL,
  length numeric(10, 2) NULL,
  width numeric(10, 2) NULL,
  height numeric(10, 2) NULL,
  created_at timestamp without time zone NULL DEFAULT now(),
  updated_at timestamp without time zone NULL DEFAULT now(),
  type text NULL,
  status text NULL,
  is_featured boolean NULL DEFAULT false,
  visibility text NULL,
  short_description text NULL,
  sale_starts_at timestamp with time zone NULL,
  sale_ends_at timestamp with time zone NULL,
  tax_status text NULL,
  tax_class text NULL,
  allow_reviews boolean NULL DEFAULT true,
  purchase_note text NULL,
  backorders_allowed boolean NULL DEFAULT false,
  sold_individually boolean NULL DEFAULT false,
  shipping_class text NULL,
  gallery_urls text[] NULL DEFAULT array[]::text[],
  size_chart text NULL,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_slug_key UNIQUE (slug)
) TABLESPACE pg_default;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_sku 
  ON public.products USING btree (sku) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_products_slug 
  ON public.products USING btree (slug) TABLESPACE pg_default;
