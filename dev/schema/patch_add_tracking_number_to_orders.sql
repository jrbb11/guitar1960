-- ============================================
-- PATCH: Add tracking_number to orders table
-- ============================================
ALTER TABLE public.orders
ADD COLUMN tracking_number text NULL;

-- Optionally, add an index for faster lookup by tracking number
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number 
  ON public.orders USING btree (tracking_number) TABLESPACE pg_default;
