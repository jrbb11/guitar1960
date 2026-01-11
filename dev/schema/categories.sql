-- ============================================
-- CATEGORIES TABLE
-- ============================================
-- Stores product categories with hierarchical structure

CREATE TABLE public.categories (
  id text NOT NULL,
  term_id bigint NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text NULL,
  parent text NULL,
  created_at timestamp without time zone NULL DEFAULT now(),
  updated_at timestamp without time zone NULL DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_slug_key UNIQUE (slug),
  CONSTRAINT categories_term_id_key UNIQUE (term_id)
) TABLESPACE pg_default;

-- Indexes
  ON public.categories USING btree (slug) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create Policy for Public Read Access
CREATE POLICY "Enable read access for all users" ON public.categories
    FOR SELECT
    TO public
    USING (true);

-- Grant access to public (anon) and authenticated users
GRANT SELECT ON public.categories TO anon, authenticated;
