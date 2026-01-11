import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ProductCard } from '../components/products/ProductCard';
import { HeroSlider } from '../components/common/HeroSlider';
import { ShoppingBag, Truck, Shield, Clock } from 'lucide-react';
import { getProducts } from '../services/products';
import type { Product } from '../types';

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        setLoading(true);
        // First try to get products marked as 'is_featured'
        let data = await getProducts({ isFeatured: true, limit: 4 });

        // If no featured products, default to latest products
        if (!data || data.length === 0) {
          data = await getProducts({ limit: 4, sortBy: 'newest' });
        }

        setProducts(data);
      } catch (error) {
        console.error('Failed to load featured products', error);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedProducts();
  }, []);

  // Hero slides
  const heroSlides = [
    {
      image: '/images/banners/Store Cover Banners 2000x1000 Lex A.jpg',
      mobileImage: '/images/banners/Forher-mobile.png',
      title: 'Essentials for Her',
      subtitle: 'Explore our beautiful ladies\' collection',
      link: '/shop?category=ladies'
    },
    {
      image: '/images/banners/Store Cover Banners 2000x1000 Tun B.jpg',
      mobileImage: '/images/banners/Forhim-mobile.png',
      title: 'Essentials for Him',
      subtitle: 'Discover our premium men\'s collection',
      link: '/shop?category=men'
    },
    {
      image: '/images/banners/Store Cover Banners Infants 2000x1000.jpg',
      mobileImage: '/images/banners/Forbaby-mobile.png'
    },
    {
      image: '/images/banners/Store Cover Banners Kids 2000x1000.jpg',
      mobileImage: '/images/banners/Forkids-mobile.png',
      title: 'For the Little Ones',
      subtitle: 'Browse our adorable kids\' collection',
      link: '/shop?category=kids'
    },
  ];

  const categories = [
    { name: "Men's Apparel", slug: 'men', image: '/images/categories/2026 Square Icon - Mens Apparel.jpg', count: 45 },
    { name: "Ladies' Collection", slug: 'ladies', image: '/images/categories/2026 Square Icon - Ladies Apparel.jpg', count: 38 },
  ];

  return (
    <>
      {/* Hero Slider Section - Full Viewport */}
      <HeroSlider slides={heroSlides} autoPlayInterval={5000} />

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="text-blue-600" size={32} />
              </div>
              <h3 className="font-bold mb-2">100+ Products</h3>
              <p className="text-gray-600 text-sm">Wide selection for everyone</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Quick shipping nationwide</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-purple-600" size={32} />
              </div>
              <h3 className="font-bold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600 text-sm">Premium materials</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-orange-600" size={32} />
              </div>
              <h3 className="font-bold mb-2">Since 1960</h3>
              <p className="text-gray-600 text-sm">60+ years of excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/shop?category=${category.slug}`}
                className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity z-10" />
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-12">
              No featured products found.
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/shop">
              <Button size="lg" className="bg-gray-900 hover:bg-blue-600 text-white font-semibold">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8">Subscribe to get special offers and updates</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 outline-none"
            />
            <Button className="bg-gray-900 text-white hover:bg-black border border-transparent">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
