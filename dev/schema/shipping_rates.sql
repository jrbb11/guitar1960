-- ============================================
-- SHIPPING RATES TABLE
-- ============================================
-- Stores shipping rates per zone

CREATE TABLE public.shipping_rates (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  zone_id uuid NULL,
  min_order_amount numeric(10, 2) NULL DEFAULT 0,
  rate numeric(10, 2) NOT NULL,
  free_shipping_threshold numeric(10, 2) NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT shipping_rates_pkey PRIMARY KEY (id),
  CONSTRAINT shipping_rates_zone_id_key UNIQUE (zone_id),
  CONSTRAINT shipping_rates_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES shipping_zones (id) ON DELETE CASCADE
) TABLESPACE pg_default;
