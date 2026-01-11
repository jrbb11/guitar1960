import { supabase } from '../lib/supabase'
import type { Product } from '../types'

export interface ProductFilters {
    categoryIds?: string[]
    search?: string
    minPrice?: number
    maxPrice?: number
    stockStatus?: string
    isFeatured?: boolean
    sortBy?: 'name' | 'price_asc' | 'price_desc' | 'newest'
    limit?: number
    offset?: number
}

/**
 * Get products with optional filters
 */
export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    let query = supabase
        .from('products_with_category')
        .select(`
      id,
      name,
      slug,
      sku,
      description,
      short_description,
      price,
      regular_price,
      sale_price,
      stock_quantity,
      stock_status,
      image_url,
      gallery_urls,
      is_featured,
      type,
      status,
      created_at,
      categories,
      variant_min_price,
      variant_max_price,
      size_chart
    `)
        .eq('status', 'published')

    // Apply filters
    if (filters.categoryIds && filters.categoryIds.length > 0) {
        // Filter where categories JSON array contains any of the selected IDs
        // We use the @> (contains) operator logic here using Supabase .or() with .cs.
        // Format: categories.cs.[{"id":"cat_id"}]
        const orFilter = filters.categoryIds
            .map(id => `categories.cs.[{"id":"${id}"}]`)
            .join(',')

        query = query.or(orFilter)
    }

    if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice)
    }

    if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice)
    }

    if (filters.stockStatus) {
        query = query.eq('stock_status', filters.stockStatus)
    }

    if (filters.isFeatured !== undefined) {
        query = query.eq('is_featured', filters.isFeatured)
    }

    // Sorting
    switch (filters.sortBy) {
        case 'name':
            query = query.order('name', { ascending: true })
            break
        case 'price_asc':
            query = query.order('price', { ascending: true })
            break
        case 'price_desc':
            query = query.order('price', { ascending: false })
            break
        case 'newest':
            query = query.order('created_at', { ascending: false })
            break
        default:
            query = query.order('created_at', { ascending: false })
    }

    // Pagination
    if (filters.limit) {
        query = query.limit(filters.limit)
    }

    if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching products:', error)
        throw error
    }

    // Map the data to match Product type
    return (data || []) as any[]
}

/**
 * Get single product by ID or slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select(`
      id,
      name,
      slug,
      sku,
      description,
      short_description,
      price,
      regular_price,
      sale_price,
      stock_quantity,
      stock_status,
      image_url,
      gallery_urls,
      is_featured,
      type,
      status,
      weight,
      length,
      width,
      height,
      height,
      created_at,
      size_chart,
      product_categories (
        categories (
          id,
          name,
          slug
        )
      ),
      variants (
        id,
        sku,
        price,
        regular_price,
        sale_price,
        stock_quantity,
        stock_status,
        attributes,
        images,
        compare_at_price
      )
    `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

    if (error) {
        console.error('Error fetching product:', error)
        return null
    }

    return data as any
}

/**
 * Get product by ID
 */
export async function getProductById(id: string | number): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select(`
      id,
      name,
      slug,
      sku,
      description,
      short_description,
      price,
      regular_price,
      sale_price,
      stock_quantity,
      stock_status,
      image_url,
      gallery_urls,
      is_featured,
      type,
      status,
      created_at,
      size_chart,
      variants (
        id,
        sku,
        price,
        regular_price,
        sale_price,
        stock_quantity,
        stock_status,
        attributes,
        images
      )
    `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching product:', error)
        return null
    }

    return data as any
}

/**
 * Get featured products for homepage
 */
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    return getProducts({
        isFeatured: true,
        limit,
        sortBy: 'newest'
    })
}

/**
 * Search products by query string
 */
export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
    return getProducts({
        search: query,
        limit
    })
}

/**
 * Get total count of products (for pagination)
 */
export async function getProductsCount(filters: ProductFilters = {}): Promise<number> {
    let query = supabase
        .from('products_with_category')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')

    // Apply same filters as getProducts
    if (filters.categoryIds && filters.categoryIds.length > 0) {
        const orFilter = filters.categoryIds
            .map(id => `categories.cs.[{"id":"${id}"}]`)
            .join(',')
        query = query.or(orFilter)
    }

    if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice)
    }

    if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice)
    }

    if (filters.isFeatured !== undefined) {
        query = query.eq('is_featured', filters.isFeatured)
    }

    const { count, error } = await query

    if (error) {
        console.error('Error counting products:', error)
        return 0
    }

    return count || 0
}
