-- ============================================
-- PH CITIES TABLE
-- ============================================
-- Stores all Philippine cities with shipping zone mapping

CREATE TABLE public.ph_cities (
  code text NOT NULL,
  name text NOT NULL,
  province_code text NULL,
  zone_id uuid NULL,
  CONSTRAINT ph_cities_pkey PRIMARY KEY (code),
  CONSTRAINT ph_cities_province_code_fkey FOREIGN KEY (province_code) REFERENCES ph_provinces (code),
  CONSTRAINT ph_cities_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES shipping_zones (id)
) TABLESPACE pg_default;
