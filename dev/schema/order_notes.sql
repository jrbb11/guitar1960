-- ============================================
-- ORDER NOTES TABLE
-- ============================================
-- Stores notes and comments for orders

CREATE TABLE public.order_notes (
  id bigserial NOT NULL,
  order_id bigint NOT NULL,
  note_content text NOT NULL,
  note_type text NULL DEFAULT 'customer'::text,
  added_by text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT order_notes_pkey PRIMARY KEY (id),
  CONSTRAINT order_notes_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_notes_order_id 
  ON public.order_notes USING btree (order_id) TABLESPACE pg_default;
