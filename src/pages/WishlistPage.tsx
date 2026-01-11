import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/products/ProductCard';
import { Button } from '../components/common/Button';
import { Heart } from 'lucide-react';

export const WishlistPage = () => {
    const { wishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-gray-100 p-6 rounded-full">
                        <Heart size={48} className="text-gray-400" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Seems like you haven't added any items to your wishlist yet.
                    Browse our products and click the heart icon to save them for later!
                </p>
                <Link to="/shop">
                    <Button size="lg" className="bg-gray-900 hover:bg-black text-white font-semibold">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlist.length})</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};
