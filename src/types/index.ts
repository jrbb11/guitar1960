// User Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
}

// Product Types
export interface Product {
  id: number | string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  short_description?: string;
  price?: number;
  regular_price?: number;
  sale_price?: number;
  stock_quantity?: number;
  stock_status?: string;
  image_url?: string;
  gallery_urls?: string[];
  is_featured?: boolean;
  type?: string;
  status?: string;
  created_at: string;
  updated_at?: string;
  categories?: Category[];
  category?: Category; // For backward compatibility
  variants?: ProductVariant[];
  variant_min_price?: number;
  variant_max_price?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  material?: string; // Optional custom field not in Supabase core schema but used in UI
  // Legacy fields for compatibility
  base_price?: number;
  brand?: string;
  images?: string[];
  stock?: number;
  is_active?: boolean;
  category_id?: string;
  size_chart?: string;
}

export interface ProductVariant {
  id: number | string;
  product_id: number | string;
  sku?: string;
  price?: number;
  regular_price?: number;
  sale_price?: number;
  stock_quantity?: number;
  stock_status?: string;
  attributes?: any;
  images?: string[];
  compare_at_price?: number;
  // Legacy fields
  size?: string;
  color?: string;
  stock?: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: string;
}

// Cart Types
export interface CartItem {
  id: string;
  user_id?: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  added_at: string;
  product?: Product;
  variant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Order Types
export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: Address;
  payment_method: string;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  product?: Product;
  variant?: ProductVariant;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Address Types
export interface Address {
  id?: string;
  user_id?: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  province: string;
  postal_code: string;
  is_default?: boolean;
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  added_at: string;
  product?: Product;
}

// Review Types
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user?: User;
}

// Filter Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  search?: string;
  sortBy?: 'name' | 'price_asc' | 'price_desc' | 'newest';
}
