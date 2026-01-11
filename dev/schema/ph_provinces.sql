-- ============================================
-- PH PROVINCES TABLE
-- ============================================
-- Stores Philippine provinces with shipping zone mapping

CREATE TABLE public.ph_provinces (
  code text NOT NULL,
  name text NOT NULL,
  region_code text NULL,
  zone_id uuid NULL,
  CONSTRAINT ph_provinces_pkey PRIMARY KEY (code),
  CONSTRAINT ph_provinces_region_code_fkey FOREIGN KEY (region_code) REFERENCES ph_regions (code),
  CONSTRAINT ph_provinces_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES shipping_zones (id)
) TABLESPACE pg_default;
