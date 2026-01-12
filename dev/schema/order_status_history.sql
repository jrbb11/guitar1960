-- ============================================
-- ORDER STATUS HISTORY TABLE
-- ============================================
-- Tracks status changes for each order

CREATE TABLE public.order_status_history (
  id bigserial PRIMARY KEY,
  order_id bigint NOT NULL,
  old_status text NULL,
  new_status text NOT NULL,
  changed_at timestamp with time zone NOT NULL DEFAULT now(),
  changed_by uuid NULL, -- user/admin who changed status
  note text NULL,
  CONSTRAINT order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id 
  ON public.order_status_history USING btree (order_id) TABLESPACE pg_default;
