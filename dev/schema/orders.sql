-- ============================================
-- ORDERS TABLE
-- ============================================
-- Stores customer orders with full WooCommerce-style structure

CREATE TABLE public.orders (
  id bigserial NOT NULL,
  order_number text NOT NULL,
  woo_order_id text NULL,
  order_date timestamp with time zone NOT NULL,
  paid_date timestamp with time zone NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  customer_id integer NULL,
  customer_email text NULL,
  customer_note text NULL,
  billing_first_name text NULL,
  billing_last_name text NULL,
  billing_company text NULL,
  billing_email text NULL,
  billing_phone text NULL,
  billing_address_1 text NULL,
  billing_address_2 text NULL,
  billing_postcode text NULL,
  billing_city text NULL,
  billing_state text NULL,
  billing_country text NULL DEFAULT 'PH'::text,
  shipping_first_name text NULL,
  shipping_last_name text NULL,
  shipping_company text NULL,
  shipping_phone text NULL,
  shipping_address_1 text NULL,
  shipping_address_2 text NULL,
  shipping_postcode text NULL,
  shipping_city text NULL,
  shipping_state text NULL,
  shipping_country text NULL DEFAULT 'PH'::text,
  shipping_method text NULL,
  order_subtotal numeric(10, 2) NULL DEFAULT 0,
  shipping_total numeric(10, 2) NULL DEFAULT 0,
  tax_total numeric(10, 2) NULL DEFAULT 0,
  discount_total numeric(10, 2) NULL DEFAULT 0,
  order_total numeric(10, 2) NOT NULL,
  order_currency text NULL DEFAULT 'PHP'::text,
  payment_method text NULL,
  payment_method_title text NULL,
  transaction_id text NULL,
  customer_ip_address text NULL,
  customer_user_agent text NULL,
  order_key text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_order_number_key UNIQUE (order_number)
) TABLESPACE pg_default;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_order_number 
  ON public.orders USING btree (order_number) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_orders_status 
  ON public.orders USING btree (status) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_orders_customer_email 
  ON public.orders USING btree (customer_email) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_orders_order_date 
  ON public.orders USING btree (order_date DESC) TABLESPACE pg_default;
