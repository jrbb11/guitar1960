-- ============================================
-- PRODUCT CATEGORIES TABLE
-- ============================================
-- Junction table linking products to categories (many-to-many)

CREATE TABLE public.product_categories (
  product_id bigint NOT NULL,
  category_id text NOT NULL,
  CONSTRAINT product_categories_pkey PRIMARY KEY (product_id, category_id),
  CONSTRAINT product_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,
  CONSTRAINT product_categories_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_categories_category_id 
  ON public.product_categories USING btree (category_id) TABLESPACE pg_default;
