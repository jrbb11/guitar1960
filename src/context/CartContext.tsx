import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Cart, CartItem, Product, ProductVariant } from '../types';
import { useAuth } from './AuthContext';
import * as cartService from '../services/cart';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string, variantId?: string) => boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from database or localStorage
  const refreshCart = async () => {
    if (isAuthenticated) {
      try {
        const items = await cartService.getCart();
        const mappedItems: CartItem[] = items.map((item: any) => ({
          id: item.id,
          product_id: item.product_id.toString(),
          variant_id: item.variant_id?.toString(),
          quantity: item.quantity,
          added_at: item.added_at,
          product: item.products ? {
            ...item.products,
            id: item.products.id.toString(),
            base_price: item.products.price || item.products.regular_price || 0,
            category_id: '',
            brand: '',
            images: item.products.gallery_urls || [item.products.image_url],
            stock: item.products.stock_quantity || 0,
            is_active: item.products.stock_status === 'instock',
            created_at: '',
          } : undefined,
          variant: item.variants ? {
            ...item.variants,
            id: item.variants.id.toString(),
            product_id: item.product_id.toString(),
            size: '',
            color: '',
          } : undefined,
        }));

        setCart(prev => ({ ...prev, items: mappedItems }));
      } catch (error) {
        console.error('Error loading cart from database:', error);
        // Fallback to localStorage
        loadCartFromLocalStorage();
      }
    } else {
      loadCartFromLocalStorage();
    }
  };

  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  // Load cart on mount and when user changes
  useEffect(() => {
    const initCart = async () => {
      // If user logs in and there's a guest cart, sync it
      if (isAuthenticated) {
        const guestCart = localStorage.getItem('cart');
        if (guestCart) {
          try {
            const parsed = JSON.parse(guestCart);
            if (parsed.items && parsed.items.length > 0) {
              await cartService.syncGuestCart(parsed.items);
              localStorage.removeItem('cart');
            }
          } catch (error) {
            console.error('Error syncing guest cart:', error);
          }
        }
      }
      refreshCart();
    };

    initCart();
  }, [user]);

  // Save cart to localStorage whenever it changes (for guest users)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  // Calculate totals whenever items change
  useEffect(() => {
    const total = cart.items.reduce((sum, item) => {
      const price = item.variant?.price || item.product?.base_price || 0;
      return sum + (price * item.quantity);
    }, 0);

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    setCart(prev => ({ ...prev, total, itemCount }));
  }, [cart.items]);

  const addToCart = async (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    if (isAuthenticated) {
      try {
        await cartService.addToCart(
          parseInt(product.id),
          variant ? parseInt(variant.id) : undefined,
          quantity
        );
        await refreshCart();
      } catch (error) {
        console.error('Error adding to cart:', error);
        // Fallback to local cart
        addToLocalCart(product, variant, quantity);
      }
    } else {
      addToLocalCart(product, variant, quantity);
    }
  };

  const addToLocalCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    setCart(prev => {
      const existingItemIndex = prev.items.findIndex(
        item => item.product_id === product.id && item.variant_id === variant?.id
      );

      if (existingItemIndex > -1) {
        const newItems = [...prev.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
        return { ...prev, items: newItems };
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${variant?.id || 'default'}-${Date.now()}`,
          product_id: product.id,
          variant_id: variant?.id,
          quantity,
          added_at: new Date().toISOString(),
          product,
          variant,
        };
        return { ...prev, items: [...prev.items, newItem] };
      }
    });
  };

  const removeFromCart = async (itemId: string) => {
    if (isAuthenticated) {
      try {
        await cartService.removeFromCart(itemId);
        await refreshCart();
      } catch (error) {
        console.error('Error removing from cart:', error);
        removeFromLocalCart(itemId);
      }
    } else {
      removeFromLocalCart(itemId);
    }
  };

  const removeFromLocalCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    if (isAuthenticated) {
      try {
        await cartService.updateCartQuantity(itemId, quantity);
        await refreshCart();
      } catch (error) {
        console.error('Error updating quantity:', error);
        updateLocalQuantity(itemId, quantity);
      }
    } else {
      updateLocalQuantity(itemId, quantity);
    }
  };

  const updateLocalQuantity = (itemId: string, quantity: number) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        setCart({ items: [], total: 0, itemCount: 0 });
      } catch (error) {
        console.error('Error clearing cart:', error);
        setCart({ items: [], total: 0, itemCount: 0 });
      }
    } else {
      setCart({ items: [], total: 0, itemCount: 0 });
    }
  };

  const isInCart = (productId: string, variantId?: string) => {
    return cart.items.some(
      item => item.product_id === productId && item.variant_id === variantId
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
