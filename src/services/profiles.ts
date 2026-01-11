import { supabase } from '../lib/supabase'

export interface CustomerProfile {
    id: string
    email: string
    full_name?: string
    phone?: string
    avatar_url?: string
    created_at: string
    updated_at: string
}

export interface CustomerAddress {
    id: string
    customer_id: string
    label?: string
    full_name: string
    phone: string
    street_address: string
    barangay?: string
    city: string
    province: string
    region?: string
    postal_code?: string
    is_default: boolean
    zone_id?: string
    created_at: string
    updated_at: string
}

/**
 * Get current user's profile
 */
export async function getProfile(): Promise<CustomerProfile | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return null
    }

    return data
}

/**
 * Update current user's profile
 */
export async function updateProfile(updates: Partial<CustomerProfile>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Must be logged in')

    const { error } = await supabase
        .from('customer_profiles')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) throw error

    // Also update auth user metadata
    if (updates.full_name || updates.phone) {
        await supabase.auth.updateUser({
            data: {
                full_name: updates.full_name,
                phone: updates.phone,
            },
        })
    }
}

/**
 * Get user's saved addresses
 */
export async function getAddresses(): Promise<CustomerAddress[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('customer_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
}

/**
 * Get single address by ID
 */
export async function getAddressById(id: string): Promise<CustomerAddress | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('id', id)
        .eq('customer_id', user.id)
        .single()

    if (error) {
        console.error('Error fetching address:', error)
        return null
    }

    return data
}

/**
 * Create new address
 */
export async function createAddress(address: Omit<CustomerAddress, 'id' | 'customer_id' | 'created_at' | 'updated_at'>): Promise<CustomerAddress> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Must be logged in')

    // If this is set as default, unset other defaults first
    if (address.is_default) {
        await supabase
            .from('customer_addresses')
            .update({ is_default: false })
            .eq('customer_id', user.id)
    }

    const { data, error } = await supabase
        .from('customer_addresses')
        .insert({
            ...address,
            customer_id: user.id,
        })
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Update existing address
 */
export async function updateAddress(id: string, updates: Partial<CustomerAddress>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Must be logged in')

    // If this is set as default, unset other defaults first
    if (updates.is_default) {
        await supabase
            .from('customer_addresses')
            .update({ is_default: false })
            .eq('customer_id', user.id)
            .neq('id', id)
    }

    const { error } = await supabase
        .from('customer_addresses')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('customer_id', user.id)

    if (error) throw error
}

/**
 * Delete address
 */
export async function deleteAddress(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Must be logged in')

    const { error } = await supabase
        .from('customer_addresses')
        .delete()
        .eq('id', id)
        .eq('customer_id', user.id)

    if (error) throw error
}

/**
 * Get default address
 */
export async function getDefaultAddress(): Promise<CustomerAddress | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('customer_id', user.id)
        .eq('is_default', true)
        .single()

    if (error) {
        // If no default found, return first address
        const addresses = await getAddresses()
        return addresses[0] || null
    }

    return data
}

/**
 * Set address as default
 */
export async function setDefaultAddress(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Must be logged in')

    // Unset all defaults
    await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('customer_id', user.id)

    // Set this one as default
    const { error } = await supabase
        .from('customer_addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('customer_id', user.id)

    if (error) throw error
}
