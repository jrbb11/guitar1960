-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
-- Stores individual line items for each order

CREATE TABLE public.order_items (
  id bigserial NOT NULL,
  order_id bigint NOT NULL,
  product_id integer NULL,
  variant_id integer NULL,
  product_name text NOT NULL,
  sku text NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10, 2) NOT NULL,
  subtotal numeric(10, 2) NOT NULL,
  total numeric(10, 2) NOT NULL,
  attributes jsonb NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id),
  CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES variants (id)
) TABLESPACE pg_default;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id 
  ON public.order_items USING btree (order_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_order_items_product_id 
  ON public.order_items USING btree (product_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_order_items_variant_id 
  ON public.order_items USING btree (variant_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_order_items_sku 
  ON public.order_items USING btree (sku) TABLESPACE pg_default;
