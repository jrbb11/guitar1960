import { supabase } from '../lib/supabase'

export interface ShippingZone {
    id: string
    name: string
    type: string
    enabled: boolean
}

export interface ShippingRate {
    id: string
    zone_id: string
    rate: number
    min_order_amount: number | null
    free_shipping_threshold: number | null
}

/**
 * Get shipping rate for a city name
 */
export async function getShippingRate(cityName: string): Promise<number> {
    try {
        // First, try to get the zone from ph_cities table
        const { data: cityData, error: cityError } = await supabase
            .from('ph_cities')
            .select('zone_id')
            .ilike('name', cityName)
            .single()

        if (cityError || !cityData?.zone_id) {
            // Fallback: check metro_manila_cities table
            const { data: metroData, error: metroError } = await supabase
                .from('metro_manila_cities')
                .select('zone_id')
                .ilike('name', cityName)
                .single()

            if (metroError || !metroData?.zone_id) {
                // Default to "Rest of Philippines" rate
                console.warn(`City "${cityName}" not found in database, using default rate`)
                return 450.00
            }

            // Get rate for this zone
            const { data: rateData } = await supabase
                .from('shipping_rates')
                .select('rate')
                .eq('zone_id', metroData.zone_id)
                .single()

            return rateData?.rate || 450.00
        }

        // Get rate for this zone
        const { data: rateData } = await supabase
            .from('shipping_rates')
            .select('rate')
            .eq('zone_id', cityData.zone_id)
            .single()

        return rateData?.rate || 450.00

    } catch (error) {
        console.error('Error getting shipping rate:', error)
        return 450.00 // Default to Rest of Philippines
    }
}

/**
 * Get all shipping zones
 */
export async function getShippingZones(): Promise<ShippingZone[]> {
    const { data, error } = await supabase
        .from('shipping_zones')
        .select('*')
        .eq('enabled', true)
        .order('name')

    if (error) throw error
    return data || []
}

/**
 * Get shipping rates for a zone
 */
export async function getShippingRatesByZone(zoneId: string): Promise<ShippingRate[]> {
    const { data, error } = await supabase
        .from('shipping_rates')
        .select('*')
        .eq('zone_id', zoneId)

    if (error) throw error
    return data || []
}

/**
 * Detect shipping zone from city name
 */
export async function detectShippingZone(cityName: string): Promise<ShippingZone | null> {
    // Try ph_cities first
    const { data: cityData } = await supabase
        .from('ph_cities')
        .select(`
      zone_id,
      shipping_zones (
        id,
        name,
        type,
        enabled
      )
    `)
        .ilike('name', cityName)
        .single()

    if (cityData?.shipping_zones) {
        return cityData.shipping_zones as any
    }

    // Fallback to metro_manila_cities
    const { data: metroData } = await supabase
        .from('metro_manila_cities')
        .select(`
      zone_id,
      shipping_zones (
        id,
        name,
        type,
        enabled
      )
    `)
        .ilike('name', cityName)
        .single()

    if (metroData?.shipping_zones) {
        return metroData.shipping_zones as any
    }

    return null
}
