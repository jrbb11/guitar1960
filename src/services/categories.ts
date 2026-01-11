import { supabase } from '../lib/supabase'

export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    parent?: string
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<any[]> {
    const { data, error } = await supabase
        .from('categories')
        .select(`
            *,
            product_categories (count)
        `)
        .order('name')

    if (error) throw error

    // Transform to include product_count property
    return (data || []).map((cat: any) => ({
        ...cat,
        product_count: cat.product_categories?.[0]?.count || 0
    }))
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching category:', error)
        return null
    }

    return data
}

/**
 * Get top-level categories (no parent)
 */
export async function getTopLevelCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .is('parent', null)
        .order('name')

    if (error) throw error
    return data || []
}

/**
 * Get child categories of a parent
 */
export async function getChildCategories(parentId: string): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('parent', parentId)
        .order('name')

    if (error) throw error
    return data || []
}
