-- ============================================
-- METRO MANILA CITIES TABLE
-- ============================================
-- Stores cities within Metro Manila for shipping zone detection

CREATE TABLE public.metro_manila_cities (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  name text NOT NULL,
  zone_id uuid NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT metro_manila_cities_pkey PRIMARY KEY (id),
  CONSTRAINT metro_manila_cities_name_key UNIQUE (name),
  CONSTRAINT metro_manila_cities_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES shipping_zones (id)
) TABLESPACE pg_default;
