-- ============================================
-- PRODUCTS WITH CATEGORIES VIEW
-- ============================================
-- Create a view that joins products with ALL their categories
-- Uses JSON aggregation to handle multiple categories per product

CREATE OR REPLACE VIEW products_with_category AS
SELECT 
  p.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', c.id,
        'name', c.name,
        'slug', c.slug
      )
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'::json
  ) as categories
FROM products p
LEFT JOIN product_categories pc ON pc.product_id = p.id
LEFT JOIN categories c ON c.id = pc.category_id
GROUP BY p.id;

-- Grant SELECT access to public
GRANT SELECT ON products_with_category TO anon, authenticated;

-- Optional: Create RLS policy for the view
ALTER VIEW products_with_category SET (security_invoker = true);

-- ============================================
-- VERIFICATION
-- ============================================
-- Test the view - should show categories as JSON array
SELECT id, name, status, categories
FROM products_with_category
WHERE status = 'published'
LIMIT 5;
