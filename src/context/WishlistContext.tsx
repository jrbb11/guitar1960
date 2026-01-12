import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, WishlistItem } from '../types';
import { getWishlist, addToWishlist as addToWishlistAPI, removeFromWishlist as removeFromWishlistAPI } from '../services/wishlist';
import { useAuth } from './AuthContext';

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (product: Product) => Promise<void>;
    removeFromWishlist: (productId: string, variantId?: string) => Promise<void>;
    isInWishlist: (productId: string, variantId?: string) => boolean;
    clearWishlist: () => Promise<void>;
    wishlistCount: number;
    loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Load wishlist from Supabase on mount or when user changes
    useEffect(() => {
        if (!user) {
            setWishlist([]);
            return;
        }
        setLoading(true);
        getWishlist(user.id)
            .then((items) => setWishlist(items))
            .finally(() => setLoading(false));
    }, [user]);

    const addToWishlist = useCallback(async (product: Product) => {
        if (!user) return;
        await addToWishlistAPI(user.id, String(product.id));
        // Refetch wishlist
        const items = await getWishlist(user.id);
        setWishlist(items);
    }, [user]);

    const removeFromWishlist = useCallback(async (productId: string, variantId?: string) => {
        if (!user) return;
        await removeFromWishlistAPI(user.id, productId, variantId);
        // Refetch wishlist
        const items = await getWishlist(user.id);
        setWishlist(items);
    }, [user]);

    const isInWishlist = (productId: string, variantId?: string) => {
        return wishlist.some((item) => item.product_id === productId && (!variantId || item.variant_id === variantId));
    };

    const clearWishlist = useCallback(async () => {
        if (!user) return;
        // Remove all wishlist items for the user
        const promises = wishlist.map(item => removeFromWishlistAPI(user.id, item.product_id, item.variant_id));
        await Promise.all(promises);
        setWishlist([]);
    }, [user, wishlist]);

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                clearWishlist,
                wishlistCount: wishlist.length,
                loading,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
