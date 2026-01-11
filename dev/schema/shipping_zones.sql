-- ============================================
-- SHIPPING ZONES TABLE
-- ============================================
-- Defines shipping zones (Metro Manila, Rest of Philippines, etc.)

CREATE TABLE public.shipping_zones (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL,
  enabled boolean NULL DEFAULT true,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT shipping_zones_pkey PRIMARY KEY (id),
  CONSTRAINT shipping_zones_name_key UNIQUE (name)
) TABLESPACE pg_default;
