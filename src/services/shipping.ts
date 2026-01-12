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

// Metro Manila cities/municipalities for zone detection
const METRO_MANILA_CITIES = [
    'manila',
    'quezon city',
    'caloocan',
    'las piñas', 'las pinas',
    'makati',
    'malabon',
    'mandaluyong',
    'marikina',
    'muntinlupa',
    'navotas',
    'parañaque', 'paranaque',
    'pasay',
    'pasig',
    'pateros',
    'san juan',
    'taguig',
    'valenzuela',
    // Common variants
    'quezon', 'qc',
    'city of manila',
    'city of makati',
    'city of taguig',
    'city of pasig',
];

/**
 * Check if a city is in Metro Manila
 */
function isMetroManila(cityName: string): boolean {
    const normalized = cityName.toLowerCase().trim();
    return METRO_MANILA_CITIES.some(city =>
        normalized.includes(city) || city.includes(normalized)
    );
}

/**
 * Get shipping rate for a city name
 * Metro Manila: ₱120
 * Rest of Philippines: ₱450
 */
export async function getShippingRate(cityName: string): Promise<number> {
    try {
        // Check if Metro Manila first (fast, no DB call)
        if (isMetroManila(cityName)) {
            // Get Metro Manila rate from database
            const { data: zoneData } = await supabase
                .from('shipping_zones')
                .select('id')
                .eq('name', 'Metro Manila')
                .maybeSingle();

            if (zoneData) {
                const { data: rateData } = await supabase
                    .from('shipping_rates')
                    .select('rate')
                    .eq('zone_id', zoneData.id)
                    .maybeSingle();

                return rateData?.rate || 120.00;
            }
            return 120.00; // Fallback Metro Manila rate
        }

        // Not Metro Manila - get Rest of Philippines rate
        const { data: zoneData } = await supabase
            .from('shipping_zones')
            .select('id')
            .eq('name', 'Rest of Philippines')
            .maybeSingle();

        if (zoneData) {
            const { data: rateData } = await supabase
                .from('shipping_rates')
                .select('rate')
                .eq('zone_id', zoneData.id)
                .maybeSingle();

            return rateData?.rate || 450.00;
        }

        return 450.00; // Fallback provincial rate

    } catch (error) {
        console.error('Error getting shipping rate:', error);
        return 450.00; // Default to Rest of Philippines
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
