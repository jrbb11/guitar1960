-- 1. Enable RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy if it exists
DROP POLICY IF EXISTS "Enable read access for all users" ON public.product_categories;

-- 3. Create public read policy
CREATE POLICY "Enable read access for all users" ON public.product_categories
    FOR SELECT
    TO public
    USING (true);

-- 4. Grant explicit permissions to the API roles
GRANT SELECT ON public.product_categories TO anon;
GRANT SELECT ON public.product_categories TO authenticated;
