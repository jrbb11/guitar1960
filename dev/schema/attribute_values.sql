-- ============================================
-- ATTRIBUTE VALUES TABLE
-- ============================================
-- Stores attribute value options (e.g., sizes: S, M, L, XL)

CREATE TABLE public.attribute_values (
  id text NOT NULL,
  attribute_id text NOT NULL,
  value text NOT NULL,
  slug text NOT NULL,
  created_at timestamp without time zone NULL DEFAULT now(),
  updated_at timestamp without time zone NULL DEFAULT now(),
  image_url text NULL,
  CONSTRAINT attribute_values_pkey PRIMARY KEY (id),
  CONSTRAINT attribute_values_unique UNIQUE (attribute_id, value),
  CONSTRAINT attribute_values_attribute_id_fkey FOREIGN KEY (attribute_id) REFERENCES attributes (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_attribute_values_attribute_id 
  ON public.attribute_values USING btree (attribute_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_attribute_values_slug 
  ON public.attribute_values USING btree (slug) TABLESPACE pg_default;
