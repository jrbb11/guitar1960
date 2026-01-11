-- ============================================
-- USER ROLES TABLE
-- ============================================
-- Stores user role assignments (admin, shop_manager)

CREATE TABLE public.user_roles (
  id serial NOT NULL,
  user_id uuid NULL,
  role text NOT NULL,
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT user_roles_user_id_profile_fkey FOREIGN KEY (user_id) REFERENCES user_profile (id) ON DELETE CASCADE,
  CONSTRAINT user_roles_role_check CHECK (
    (role = ANY (ARRAY['admin'::text, 'shop_manager'::text]))
  )
) TABLESPACE pg_default;
