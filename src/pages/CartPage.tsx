import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import { Button } from '../components/common/Button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Link to="/shop">
            <Button className="bg-gray-900 hover:bg-black text-white font-semibold">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cart.itemCount} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cart.items.map((item) => {
                const price = item.variant?.price || item.product?.base_price || 0;
                const stock = item.variant?.stock || item.product?.stock || 0;

                return (
                  <div key={item.id} className="border-b last:border-b-0 p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link to={`/product/${item.product_id}`} className="flex-shrink-0">
                        <img
                          src={item.variant?.images?.[0] || item.product?.image_url || item.product?.gallery_urls?.[0] || '/placeholder.jpg'}
                          alt={item.product?.name}
                          className="w-24 h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
                          }}
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1">
                        <Link to={`/product/${item.product_id}`}>
                          <h3 className="font-semibold text-lg hover:text-blue-600 mb-1">
                            {item.product?.name}
                          </h3>
                        </Link>
                        {item.variant && (
                          <div className="text-sm text-gray-600 mb-2">
                            {/* Display Size if available */}
                            {(item.variant.attributes?.Size || item.variant.size) && (
                              <p>Size: {item.variant.attributes?.Size || item.variant.size}</p>
                            )}
                            {/* Display Color if available */}
                            {(item.variant.attributes?.Color || item.variant.color) && (
                              <p>Color: {item.variant.attributes?.Color || item.variant.color}</p>
                            )}
                          </div>
                        )}
                        <p className="text-blue-600 font-bold">
                          {formatPrice(price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-3">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>

                        <div className="flex items-center gap-2 border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 rounded-l-lg"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= stock}
                            className="p-2 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <p className="text-sm font-semibold">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-4">
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart.itemCount} items)</span>
                  <span className="font-semibold">{formatPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-500">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    {formatPrice(cart.total)}
                  </span>
                </div>
              </div>

              <Button
                fullWidth
                size="lg"
                onClick={() => navigate('/checkout')}
                className="mb-3"
              >
                Proceed to Checkout
              </Button>

              <Link to="/shop">
                <Button fullWidth variant="outline">
                  Continue Shopping
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
                <p>✓ Secure checkout</p>
                <p>✓ Easy returns within 7 days</p>
                <p>✓ Quality guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
