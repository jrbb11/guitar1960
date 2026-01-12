import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const mainImage = product.image_url || product.gallery_urls?.[0] || '/placeholder-product.jpg';

  // Use price from database, fallback to regular_price or 0
  const productPrice = product.price || product.regular_price || 0;

  const isVariable = product.type === 'variable' || (product.variants && product.variants.length > 0) || (product.variant_min_price !== undefined && product.variant_max_price !== undefined);

  const minPrice = product.variant_min_price ||
    (product.variants && product.variants.length > 0
      ? Math.min(...product.variants.map(v => v.price || v.regular_price || 0))
      : productPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, undefined, 1);
  };

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden flex-shrink-0">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-72 object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
        {typeof product.stock_quantity === 'number' && product.stock_quantity < 10 && product.stock_quantity > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            Only {product.stock_quantity} left
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="font-medium text-base hover:text-brand-darkGray line-clamp-2 h-12 leading-6" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* Spacer to push content down if needed, or just let flex-grow handle it */}
        <div className="flex-grow">
          {product.categories && product.categories.length > 0 && (
            <p className="text-xs text-gray-500 mb-2">{product.categories[0].name}</p>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-bold text-brand-darkGray">
              {product.variant_min_price !== undefined && product.variant_max_price !== undefined && product.variant_min_price !== product.variant_max_price ? (
                <span>{formatPrice(product.variant_min_price)} - {formatPrice(product.variant_max_price)}</span>
              ) : product.variants && product.variants.length > 0 ? (
                <span>{formatPrice(minPrice)}+</span>
              ) : (
                <span>{formatPrice(productPrice)}</span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {isVariable ? (
              <Link
                to={`/product/${product.id}`}
                className="flex-1 bg-gray-900 text-white py-2 md:py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm font-medium"
              >
                <ShoppingCart size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Select Options</span>
                <span className="sm:hidden">Options</span>
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-900 text-white py-2 md:py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 md:gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm font-medium"
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                if (isInWishlist(String(product.id))) {
                  removeFromWishlist(String(product.id));
                } else {
                  addToWishlist(product);
                }
              }}
              className={`p-2 md:p-2.5 border-2 rounded-lg transition-colors ${isInWishlist(String(product.id))
                ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                : 'border-gray-900 hover:bg-gray-900 hover:text-white'
                } ${wishlistLoading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <Heart size={16} className="md:w-[18px] md:h-[18px]" fill={isInWishlist(String(product.id)) ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
