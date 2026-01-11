-- 1. Enable RLS (Security best practice, though often on by default)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy if it exists to avoid errors
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;

-- 3. Create public read policy
CREATE POLICY "Enable read access for all users" ON public.categories
    FOR SELECT
    TO public
    USING (true);

-- 4. Grant explicit permissions to the API roles
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.categories TO authenticated;
