-- ============================================
-- PH REGIONS TABLE
-- ============================================
-- Stores Philippine regions with shipping zone mapping

CREATE TABLE public.ph_regions (
  code text NOT NULL,
  name text NOT NULL,
  zone_id uuid NULL,
  CONSTRAINT ph_regions_pkey PRIMARY KEY (code),
  CONSTRAINT ph_regions_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES shipping_zones (id)
) TABLESPACE pg_default;
