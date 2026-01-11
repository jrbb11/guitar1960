import { supabase } from '../lib/supabase'

export interface CreateOrderData {
    shippingAddress: {
        first_name: string
        last_name: string
        phone: string
        address_1: string
        address_2?: string
        city: string
        state: string
        postcode: string
        country: string
    }
    items: {
        product_id: number
        variant_id?: number
        product_name: string
        sku?: string
        quantity: number
        unit_price: number
    }[]
    paymentMethod: string
    customerNote?: string
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `ORD-${timestamp}-${random}`
}

/**
 * Create a new order
 */
export async function createOrder(orderData: CreateOrderData) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Must be logged in to create order')

    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => {
        return sum + (item.unit_price * item.quantity)
    }, 0)

    // Get shipping rate from the address
    const { getShippingRate } = await import('./shipping')
    const shippingFee = await getShippingRate(orderData.shippingAddress.city)

    const total = subtotal + shippingFee

    // Create order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            order_number: generateOrderNumber(),
            order_date: new Date().toISOString(),
            status: 'pending',
            customer_email: user.email,
            customer_note: orderData.customerNote,

            // Shipping address
            shipping_first_name: orderData.shippingAddress.first_name,
            shipping_last_name: orderData.shippingAddress.last_name,
            shipping_phone: orderData.shippingAddress.phone,
            shipping_address_1: orderData.shippingAddress.address_1,
            shipping_address_2: orderData.shippingAddress.address_2,
            shipping_city: orderData.shippingAddress.city,
            shipping_state: orderData.shippingAddress.state,
            shipping_postcode: orderData.shippingAddress.postcode,
            shipping_country: orderData.shippingAddress.country,

            // Billing (same as shipping for now)
            billing_first_name: orderData.shippingAddress.first_name,
            billing_last_name: orderData.shippingAddress.last_name,
            billing_phone: orderData.shippingAddress.phone,
            billing_email: user.email,
            billing_address_1: orderData.shippingAddress.address_1,
            billing_address_2: orderData.shippingAddress.address_2,
            billing_city: orderData.shippingAddress.city,
            billing_state: orderData.shippingAddress.state,
            billing_postcode: orderData.shippingAddress.postcode,
            billing_country: orderData.shippingAddress.country,

            // Totals
            order_subtotal: subtotal,
            shipping_total: shippingFee,
            order_total: total,

            // Payment
            payment_method: orderData.paymentMethod,
            order_currency: 'PHP',
        })
        .select()
        .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.product_name,
        sku: item.sku,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.unit_price * item.quantity,
        total: item.unit_price * item.quantity,
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (itemsError) throw itemsError

    // Clear cart after successful order
    const { clearCart } = await import('./cart')
    await clearCart()

    return order
}

/**
 * Get orders for current user
 */
export async function getOrders() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('orders')
        .select(`
      id,
      order_number,
      order_date,
      status,
      order_total,
      shipping_total,
      order_subtotal,
      payment_method,
      shipping_city,
      shipping_state,
      created_at,
      order_items (
        id,
        product_name,
        quantity,
        unit_price,
        total
      )
    `)
        .eq('customer_email', user.email)
        .order('order_date', { ascending: false })

    if (error) throw error
    return data || []
}

/**
 * Get single order by ID
 */
export async function getOrderById(orderId: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Must be logged in')

    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      order_items (
        id,
        product_id,
        variant_id,
        product_name,
        sku,
        quantity,
        unit_price,
        subtotal,
        total,
        attributes
      ),
      order_notes (
        id,
        note_content,
        note_type,
        added_by,
        created_at
      )
    `)
        .eq('id', orderId)
        .eq('customer_email', user.email)
        .single()

    if (error) throw error
    return data
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Must be logged in')

    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      order_items (
        id,
        product_name,
        sku,
        quantity,
        unit_price,
        total
      )
    `)
        .eq('order_number', orderNumber)
        .eq('customer_email', user.email)
        .single()

    if (error) throw error
    return data
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Must be logged in')

    // First check if order is pending
    const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .eq('customer_email', user.email)
        .single()

    if (fetchError) throw fetchError
    if (order.status !== 'pending') {
        throw new Error('Only pending orders can be cancelled')
    }

    // Update status to cancelled
    const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('customer_email', user.email)

    if (updateError) throw updateError
}
