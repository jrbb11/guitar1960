import { supabase } from '../lib/supabase'

export interface CartService {
    addToCart: (productId: number, variantId?: number, quantity?: number) => Promise<void>
    getCart: () => Promise<any[]>
    updateQuantity: (itemId: string, quantity: number) => Promise<void>
    removeFromCart: (itemId: string) => Promise<void>
    clearCart: () => Promise<void>
    syncGuestCart: (guestItems: any[]) => Promise<void>
}

/**
 * Add item to cart (upsert - creates or updates quantity)
 */
export async function addToCart(
    productId: number,
    variantId?: number,
    quantity: number = 1
): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Must be logged in to add to cart')

    const { error } = await supabase
        .from('cart_items')
        .upsert({
            customer_id: user.id,
            product_id: productId,
            variant_id: variantId || null,
            quantity,
        }, {
            onConflict: 'customer_id,product_id,variant_id',
            ignoreDuplicates: false,
        })

    if (error) throw error
}

/**
 * Get current user's cart with product details
 */
export async function getCart(): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('cart_items')
        .select(`
      id,
      quantity,
      product_id,
      variant_id,
      added_at,
      products (
        id,
        name,
        slug,
        price,
        regular_price,
        sale_price,
        image_url,
        gallery_urls,
        stock_status,
        stock_quantity
      ),
      variants (
        id,
        sku,
        price,
        regular_price,
        sale_price,
        stock_status,
        stock_quantity,
        attributes,
        images
      )
    `)
        .eq('customer_id', user.id)
        .order('added_at', { ascending: false })

    if (error) throw error
    return data || []
}

/**
 * Update cart item quantity
 */
export async function updateCartQuantity(itemId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
        return removeFromCart(itemId)
    }

    const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)

    if (error) throw error
}

/**
 * Remove item from cart
 */
export async function removeFromCart(itemId: string): Promise<void> {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

    if (error) throw error
}

/**
 * Clear all cart items for current user
 */
export async function clearCart(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('customer_id', user.id)

    if (error) throw error
}

/**
 * Sync guest cart items to database after login
 */
export async function syncGuestCart(guestItems: any[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Must be logged in to sync cart')

    // Convert guest cart items to database format
    const dbItems = guestItems.map(item => ({
        customer_id: user.id,
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        quantity: item.quantity,
    }))

    // Upsert all items
    const { error } = await supabase
        .from('cart_items')
        .upsert(dbItems, {
            onConflict: 'customer_id,product_id,variant_id',
            ignoreDuplicates: false,
        })

    if (error) throw error
}
