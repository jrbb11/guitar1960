import { supabase } from '../lib/supabase';
import type { WishlistItem } from '../types';

export async function getWishlist(userId: string): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*, product:product_id(*)')
    .eq('customer_id', userId)
    .order('added_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addToWishlist(userId: string, productId: string, variantId?: string) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .upsert({ customer_id: userId, product_id: productId, variant_id: variantId });
  if (error) throw error;
  return data;
}

export async function removeFromWishlist(userId: string, productId: string, variantId?: string) {
  const query = supabase
    .from('wishlist_items')
    .delete()
    .eq('customer_id', userId)
    .eq('product_id', productId);
  if (variantId) query.eq('variant_id', variantId);
  const { error } = await query;
  if (error) throw error;
}
