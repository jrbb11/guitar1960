import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product, ProductVariant } from '../types';
import { getProductById } from '../services/products';
import { formatPrice } from '../utils/currency';
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, Minus, Plus, Star, Shield, ArrowLeft, Ruler } from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { SEO } from '../components/common/SEO';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getProductById(id);

        if (!data) {
          setError('Product not found');
          return;
        }

        setProduct(data);

        // Auto-select variant: Prioritize "White" and Smallest Size
        if (data.variants && data.variants.length > 0) {
          const getVariantAttr = (v: ProductVariant, key: string) =>
            v.attributes?.[key] || v.attributes?.[key.toLowerCase()] || v.attributes?.[key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()];

          // Sort variants to find the best default
          const sortedVariants = [...data.variants].sort((a, b) => {
            const colorA = (getVariantAttr(a, 'Color') || '').toLowerCase();
            const colorB = (getVariantAttr(b, 'Color') || '').toLowerCase();

            // 1. Color Priority: White > Black > Others
            const colorPriority = ['white', 'black'];
            const priorityA = colorPriority.indexOf(colorA);
            const priorityB = colorPriority.indexOf(colorB);

            if (priorityA !== -1 && priorityB === -1) return -1;
            if (priorityA === -1 && priorityB !== -1) return 1;
            if (priorityA !== -1 && priorityB !== -1 && priorityA !== priorityB) {
              return priorityA - priorityB;
            }

            // 2. Sort by size within same color (or if neither is in priority)
            const sizeA = getVariantAttr(a, 'Size') || '';
            const sizeB = getVariantAttr(b, 'Size') || '';

            const numA = parseFloat(sizeA);
            const numB = parseFloat(sizeB);

            if (!isNaN(numA) && !isNaN(numB)) {
              return numA - numB;
            }

            const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL'];
            const indexA = sizeOrder.indexOf(sizeA.toUpperCase());
            const indexB = sizeOrder.indexOf(sizeB.toUpperCase());

            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }

            return sizeA.localeCompare(sizeB);
          });

          const defaultVariant = sortedVariants[0];
          setSelectedVariant(defaultVariant);

          // Initial attribute state
          const colorVal = getVariantAttr(defaultVariant, 'Color');
          const sizeVal = getVariantAttr(defaultVariant, 'Size');

          if (colorVal) setSelectedColor(colorVal);
          if (sizeVal) setSelectedSize(sizeVal);
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Error loading product details');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  // Reset selected image to 0 when the pool of display images changes (e.g., switching variants)
  // We track the first image URL to detect changes in the image set
  const currentFirstImage = selectedVariant?.images?.[0] || product?.image_url;
  useEffect(() => {
    setSelectedImage(0);
  }, [currentFirstImage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-xl text-red-500">{error || 'Product not found'}</div>
        <button
          onClick={() => navigate('/shop')}
          className="text-blue-600 hover:underline"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // Handle images logic
  // Priority: 
  // 1. Variant specific images (if selected)
  // 2. Product main image
  // 3. Product gallery images

  const getDisplayImages = () => {
    const variantImages = selectedVariant?.images || [];
    const mainImageUrl = product.image_url;
    const galleryUrls = product.gallery_urls || [];

    let combined: string[] = [];

    if (variantImages.length > 0) {
      // If we have variant images, prioritize them.
      // We exclude the product's main_image_url from the gallery processing here 
      // because typically the variant-specific image is a duplicate of the main product photo 
      // but provided in a different storage path (e.g., variant-images vs gallery).
      combined = [
        ...variantImages,
        ...galleryUrls.filter(url => url.trim() !== mainImageUrl?.trim())
      ];
    } else {
      // No variant images, use standard product image + gallery
      combined = [
        mainImageUrl,
        ...galleryUrls
      ].filter(Boolean) as string[];
    }

    // Final deduplication for safety
    const seen = new Set<string>();
    const result: string[] = [];

    for (const url of combined) {
      const normalized = url.trim();
      if (normalized && !seen.has(normalized)) {
        seen.add(normalized);
        result.push(normalized);
      }
    }

    return result.length > 0 ? result : ['/placeholder-product.jpg'];
  };

  const displayImages = getDisplayImages();

  // Reset selected image index when variant changes if the new variant has different images
  // (We handle this in useEffect below if needed, or rely on displayImages changing identity)

  // Use current price/stock logic
  // If variable product, use selected variant price, otherwise use product price
  const basePrice = product.price || product.regular_price || 0;
  const currentPrice = selectedVariant?.price || basePrice;
  const currentStock = selectedVariant?.stock_quantity ?? product.stock_quantity ?? 0;

  // Display price range for variable products if no variant selected (though we auto-select)
  const isVariable = product.variants && product.variants.length > 0;


  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SEO
        title={product.name}
        description={product.description || `${product.name} - Shop now at Guitar1960`}
        image={product.image_url}
        type="product"
      />
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={displayImages[selectedImage] || displayImages[0]}
                  alt={product.name}
                  className="w-full h-96 object-contain bg-white"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20"%3EProduct Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              {displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {displayImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-blue-600' : 'border-gray-200'
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-20 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                {product.categories && product.categories.length > 0 && (
                  <p className="text-sm text-gray-500 mb-2">{product.categories[0].name}</p>
                )}
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                  <span className="text-sm text-gray-600">(42 reviews)</span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {formatPrice(currentPrice)}
                </div>
              </div>

              <div className="border-t border-b py-4 mb-6">
                <div
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description || '' }}
                />
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (() => {
                // Helper to get attribute value safely
                const getAttr = (v: ProductVariant, key: string) =>
                  v.attributes?.[key] || v.attributes?.[key.toLowerCase()];

                // 1. Identify available attributes dynamically
                const hasColor = product.variants.some(v => getAttr(v, 'Color'));
                const hasSize = product.variants.some(v => getAttr(v, 'Size'));

                // Get unique colors
                const colors = hasColor
                  ? Array.from(new Set(product.variants.map(v => getAttr(v, 'Color')).filter(Boolean)))
                    .sort((a, b) => {
                      const colorPriority = ['white', 'black'];
                      const priorityA = colorPriority.indexOf(a.toLowerCase());
                      const priorityB = colorPriority.indexOf(b.toLowerCase());

                      if (priorityA !== -1 && priorityB === -1) return -1;
                      if (priorityA === -1 && priorityB !== -1) return 1;
                      if (priorityA !== -1 && priorityB !== -1 && priorityA !== priorityB) {
                        return priorityA - priorityB;
                      }
                      return a.localeCompare(b);
                    })
                  : [];

                // Filter variants based on selected color (if applicable)
                const availableVariants = hasColor && selectedColor
                  ? product.variants.filter(v => getAttr(v, 'Color') === selectedColor)
                  : product.variants;

                // Get unique sizes from VALID variants (filtered by color)
                const sizes = hasSize
                  ? Array.from(new Set(availableVariants.map(v => getAttr(v, 'Size')).filter(Boolean)))
                    .sort((a, b) => {
                      // Try to parse as numbers first
                      const numA = parseFloat(a);
                      const numB = parseFloat(b);

                      // If both are valid numbers, sort numerically
                      if (!isNaN(numA) && !isNaN(numB)) {
                        return numA - numB;
                      }

                      // Otherwise, sort alphabetically (for XS, S, M, L, XL, etc.)
                      const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL'];
                      const indexA = sizeOrder.indexOf(a.toUpperCase());
                      const indexB = sizeOrder.indexOf(b.toUpperCase());

                      if (indexA !== -1 && indexB !== -1) {
                        return indexA - indexB;
                      }

                      // Fall back to string comparison
                      return a.localeCompare(b);
                    })
                  : [];

                return (
                  <div className="space-y-6 mb-6">
                    {/* Color Selector */}
                    {hasColor && (
                      <div>
                        <label className="block font-semibold mb-2">
                          Color: {selectedColor || 'Select option'}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => {
                                setSelectedColor(color);
                                // Reset variant selection to find robust match
                                // Use the first available size for this color if one exists, or reset size
                                // But better UX: Keep size if it exists in new color, otherwise reset
                                const currentSize = selectedSize;
                                const sizeExistsInNewColor = product.variants?.some(v =>
                                  getAttr(v, 'Color') === color && getAttr(v, 'Size') === currentSize
                                );

                                if (!sizeExistsInNewColor) {
                                  setSelectedSize(null);
                                  setSelectedVariant(undefined);
                                } else {
                                  // Update variant with new color but same size
                                  const newVariant = product.variants?.find(v =>
                                    getAttr(v, 'Color') === color && getAttr(v, 'Size') === currentSize
                                  );
                                  setSelectedVariant(newVariant);
                                }
                              }}
                              className={`px-4 py-2 border rounded-lg font-medium transition-all ${selectedColor === color
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-gray-700'
                                }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size Selector */}
                    {hasSize && (
                      <div>
                        <label className="block font-semibold mb-2">
                          Size: {selectedSize || 'Select option'}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {sizes.map((size) => {
                            // Find specific variant for this size (and selected color if applicable)
                            // We need to check if this size is available for the current Color context
                            // The 'sizes' array is already filtered by color above, so these are valid sizes.

                            // Check stock for this specific combo
                            const patternVariant = availableVariants.find(v => getAttr(v, 'Size') === size);
                            const isOutOfStock = patternVariant ? (patternVariant.stock_quantity ?? 0) === 0 : true;

                            const isActive = selectedSize === size;

                            return (
                              <button
                                key={size}
                                onClick={() => {
                                  setSelectedSize(size);
                                  // Update the main selected variant object
                                  const specificVariant = availableVariants.find(v => getAttr(v, 'Size') === size);
                                  if (specificVariant) {
                                    setSelectedVariant(specificVariant);
                                  }
                                }}
                                disabled={isOutOfStock}
                                className={`px-4 py-2 border rounded-lg font-medium transition-all ${isActive
                                  ? 'border-blue-600 bg-blue-600 text-white'
                                  : isOutOfStock
                                    ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                                    : 'border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-gray-700'
                                  }`}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Fallback for variants without attributes (just show list like before but simpler) */}
                    {!hasColor && !hasSize && (
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map(v => (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVariant(v)}
                            className={`px-4 py-2 border rounded-lg font-medium transition-all ${selectedVariant?.id === v.id
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-gray-700'
                              }`}
                          >
                            {v.sku || 'Option'}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Size Chart Button - Show if product has a size chart */}
                    {product.size_chart && (
                      <button
                        onClick={() => setShowSizeChart(true)}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline mt-2"
                      >
                        <Ruler size={16} />
                        View Size Chart
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border rounded-lg border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-50 transition-colors"
                    disabled={currentStock === 0}
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center border rounded-lg py-2"
                    min="1"
                    max={currentStock}
                    disabled={currentStock === 0}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(currentStock || 1, quantity + 1))}
                    className="p-2 border rounded-lg border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-50 transition-colors"
                    disabled={quantity >= currentStock || currentStock === 0}
                  >
                    <Plus size={18} />
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentStock} available
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  fullWidth
                  disabled={currentStock === 0 || (isVariable && !selectedVariant)}
                  className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 text-white font-semibold disabled:bg-gray-400"
                >
                  <ShoppingCart size={20} />
                  {currentStock === 0
                    ? 'Out of Stock'
                    : isInCart(String(product.id), selectedVariant?.id ? String(selectedVariant.id) : undefined)
                      ? 'Update Cart'
                      : 'Add to Cart'}
                </Button>
                <button className="p-3 border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors">
                  <Heart size={24} />
                </button>
              </div>

              {/* Features */}
              <div className="flex">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="text-green-600" size={24} />
                  <div>
                    <p className="font-semibold text-sm">Quality Guarantee</p>
                    <p className="text-xs text-gray-600">100% authentic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="border-t p-8">
            <h3 className="text-xl font-bold mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Brand</p>
                <p className="font-semibold">{product.brand || 'Guitar'}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">SKU</p>
                <p className="font-semibold">{selectedVariant?.sku || product.sku || 'N/A'}</p>
              </div>
              {product.weight && (
                <div>
                  <p className="text-gray-600 mb-1">Weight</p>
                  <p className="font-semibold">{product.weight} kg</p>
                </div>
              )}
              {product.material && (
                <div>
                  <p className="text-gray-600 mb-1">Material</p>
                  <p className="font-semibold">{product.material}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <Modal
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        title="Size Chart"
        width="max-w-4xl"
      >
        <div className="flex justify-center">
          <img
            src={product?.size_chart}
            alt="Size Chart"
            className="max-w-full h-auto rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              toast.error('Could not load size chart image');
            }}
          />
        </div>
      </Modal>
    </div>
  );
};
