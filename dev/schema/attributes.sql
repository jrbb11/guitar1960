-- ============================================
-- ATTRIBUTES TABLE
-- ============================================
-- Stores product attribute types (e.g., Size, Color, Material)

CREATE TABLE public.attributes (
  id text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text NULL,
  created_at timestamp without time zone NULL DEFAULT now(),
  updated_at timestamp without time zone NULL DEFAULT now(),
  CONSTRAINT attributes_pkey PRIMARY KEY (id),
  CONSTRAINT attributes_slug_key UNIQUE (slug)
) TABLESPACE pg_default;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_attributes_slug 
  ON public.attributes USING btree (slug) TABLESPACE pg_default;
