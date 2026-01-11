-- Insert top-level categories
INSERT INTO public.categories (id, name, slug, description)
VALUES 
    ('cat_men', 'Men''s Apparel', 'men', 'Clothing and accessories for men'),
    ('cat_ladies', 'Ladies'' Collection', 'ladies', 'Fashion and styles for women'),
    ('cat_kids', 'Kids', 'kids', 'Clothing for children'),
    ('cat_accessories', 'Accessories', 'accessories', 'Bags, belts, and other essentials')
ON CONFLICT (slug) DO NOTHING;
