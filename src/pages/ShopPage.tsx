import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/products/ProductCard';
import type { Product } from '../types';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts, getProductsCount } from '../services/products';
import { getCategories } from '../services/categories';
import { SEO } from '../components/common/SEO';
import { ProductCardSkeleton } from '../components/common/Skeleton';

const PRODUCTS_PER_PAGE = 12;

export const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc' | 'newest'>('name');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  // Load categories and handle initial selection from URL
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);

        // Check for category and subcategory in URL
        const categorySlug = searchParams.get('category');
        const subcategorySlug = searchParams.get('subcategory');

        if (categorySlug) {
          let targetCatIds: string[] = [];

          if (subcategorySlug) {
            // Find categories that could match the parent category slug
            // Handle common synonyms
            const parentSlugs = [categorySlug];
            if (categorySlug === 'men') parentSlugs.push('mens');
            if (categorySlug === 'mens') parentSlugs.push('men');
            if (categorySlug === 'ladies') parentSlugs.push('woman');
            if (categorySlug === 'woman') parentSlugs.push('ladies');

            // 1. Try to find a subcategory that specifically belongs to the parent category
            const subCat = cats.find(c => {
              const slug = c.slug.toLowerCase();
              const matchesSubslug = slug === subcategorySlug ||
                parentSlugs.some(ps => slug === `${ps.toLowerCase()}-${subcategorySlug?.toLowerCase()}` || slug === `${subcategorySlug?.toLowerCase()}-${ps.toLowerCase()}`) ||
                slug === `${subcategorySlug}-${categorySlug === 'men' ? 'man' : 'woman'}`;

              if (matchesSubslug) {
                const parentId = c.parent;
                if (parentId) {
                  const parent = cats.find(p => p.id === parentId);
                  // If it has a parent, check if parent matches our category slug or any synonym
                  if (parent) {
                    return parentSlugs.some(ps => parent.slug.toLowerCase() === ps.toLowerCase());
                  }
                }
                // If no parent, but slug is specific (like 'mens-apparel'), it's a good match
                return parentSlugs.some(ps => slug.includes(ps.toLowerCase()));
              }
              return false;
            });

            if (subCat) {
              targetCatIds = [subCat.id];
            } else {
              // 2. Special case: Main Categories like "Denims" where children are "For Men's" / "For Ladies"
              const subcategoryParent = cats.find(c => c.slug.toLowerCase() === subcategorySlug?.toLowerCase());
              if (subcategoryParent) {
                const specificChild = cats.find(c =>
                  c.parent === subcategoryParent.id &&
                  (c.name.toLowerCase().includes(categorySlug.toLowerCase()) ||
                    (categorySlug === 'men' && c.name.toLowerCase().includes('mens')) ||
                    (categorySlug === 'ladies' && c.name.toLowerCase().includes('woman')))
                );

                if (specificChild) {
                  targetCatIds = [specificChild.id];
                } else {
                  // Fallback to just the subcategory parent if no specific child found
                  targetCatIds = [subcategoryParent.id];
                }
              }
            }
          }

          // If no specific subcategory found, fallback to the main category slug matching
          if (targetCatIds.length === 0) {
            const foundCat = cats.find((c: any) =>
              c.slug.toLowerCase() === categorySlug.toLowerCase() ||
              (categorySlug === 'men' && c.slug.toLowerCase() === 'mens') ||
              (categorySlug === 'ladies' && c.slug.toLowerCase() === 'woman')
            );
            if (foundCat) {
              targetCatIds = [foundCat.id];
            }
          }

          if (targetCatIds.length > 0) {
            setSelectedCategories(targetCatIds);
          }
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, [searchParams]); // Re-run when searchParams change

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, minPrice, maxPrice, sortBy]);

  // Load products with pagination
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const filters = {
          minPrice,
          maxPrice: maxPrice > 0 ? maxPrice : undefined,
          sortBy,
          categoryIds: selectedCategories,
          limit: PRODUCTS_PER_PAGE,
          offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
        };

        const [data, count] = await Promise.all([
          getProducts(filters),
          getProductsCount(filters)
        ]);

        setProducts(data);
        setTotalProducts(count);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategories, minPrice, maxPrice, sortBy, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <SEO
          title={selectedCategories.length > 0 ? 'Shop Categories' : 'Shop All'}
          description="Browse our complete collection of high-quality apparel. Filter by category, price, and more to find exactly what you're looking for."
        />
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Shop Full Collection</h1>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg"
          >
            <SlidersHorizontal size={20} />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h3 className="font-bold text-lg mb-4">Filters</h3>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Category</h4>
                  <div className="space-y-2">
                    {/* Deduplicate categories by name for display AND filter empty ones */}
                    {Array.from(new Set(
                      categories
                        .filter(c => c.product_count > 0) // Only show categories with products
                        .map(c => c.name)
                    )).sort().map((name) => {
                      // Find all IDs associated with this category name
                      const categoryIds = categories
                        .filter(c => c.name === name)
                        .map(c => c.id);

                      const isChecked = categoryIds.some(id => selectedCategories.includes(id));

                      return (
                        <label key={name} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Add all IDs for this name
                                const newIds = [...selectedCategories, ...categoryIds];
                                // Unique IDs only
                                setSelectedCategories([...new Set(newIds)]);
                              } else {
                                // Remove all IDs for this name
                                setSelectedCategories(selectedCategories.filter(id => !categoryIds.includes(id)));
                              }
                            }}
                          />
                          <span className="text-sm">{name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="number"
                      placeholder="Min"
                      aria-label="Minimum price"
                      value={minPrice || ''}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      aria-label="Maximum price"
                      value={maxPrice || ''}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setMinPrice(0);
                  setMaxPrice(1000);
                }}
                className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 text-sm md:text-base">
                {totalProducts} products found
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
              <select
                className="px-3 md:px-4 py-2 border rounded-lg outline-none text-sm md:text-base"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="newest">Sort by: Newest</option>
                <option value="name">Name: A-Z</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                {error}
              </div>
            )}

            {/* Products */}
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No products found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first, last, current, and adjacent pages
                      return page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1;
                    })
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {/* Show ellipsis if there's a gap */}
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page
                            ? 'bg-gray-900 text-white'
                            : 'hover:bg-gray-100'
                            }`}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
