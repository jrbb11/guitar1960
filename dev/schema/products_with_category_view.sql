-- ============================================
-- PRODUCTS WITH CATEGORY VIEW
-- ============================================
-- Aggregates products with categories and calculates prices from variants

-- Drop existing view to allow column type changes
DROP VIEW IF EXISTS public.products_with_category;

CREATE VIEW public.products_with_category AS
SELECT
  p.id,
  p.name,
  p.slug,
  p.sku,
  p.description,
  -- Use variant prices if product is variable, otherwise use product price
  COALESCE(p.price, v_prices.min_price)::numeric(10,2) AS price,
  COALESCE(p.regular_price, v_prices.min_regular_price)::numeric(10,2) AS regular_price,
  p.sale_price,
  p.stock_quantity,
  p.stock_status,
  p.manage_stock,
  p.image_id,
  p.image_url,
  p.weight,
  p.length,
  p.width,
  p.height,
  p.created_at,
  p.updated_at,
  p.type,
  p.status,
  p.is_featured,
  p.visibility,
  p.short_description,
  p.sale_starts_at,
  p.sale_ends_at,
  p.tax_status,
  p.tax_class,
  p.allow_reviews,
  p.purchase_note,
  p.backorders_allowed,
  p.sold_individually,
  p.shipping_class,
  p.gallery_urls,
  p.size_chart,
  -- Min/Max prices from variants for display
  v_prices.min_price::numeric(10,2) AS variant_min_price,
  v_prices.max_price::numeric(10,2) AS variant_max_price,
  -- Categories as JSONB array for filtering support
  COALESCE(
    jsonb_agg(
      jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug)
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'::jsonb
  ) AS categories
FROM products p
LEFT JOIN product_categories pc ON pc.product_id = p.id
LEFT JOIN categories c ON c.id = pc.category_id
LEFT JOIN LATERAL (
  SELECT 
    MIN(v.price) AS min_price,
    MAX(v.price) AS max_price,
    MIN(v.regular_price) AS min_regular_price,
    MAX(v.regular_price) AS max_regular_price
  FROM variants v
  WHERE v.product_id = p.id
) v_prices ON true
GROUP BY p.id, v_prices.min_price, v_prices.max_price, v_prices.min_regular_price, v_prices.max_regular_price;

-- Grant permissions
GRANT SELECT ON products_with_category TO anon, authenticated;
