import { Link } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search, Menu, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menDropdownOpen, setMenDropdownOpen] = useState(false);
  const [ladiesDropdownOpen, setLadiesDropdownOpen] = useState(false);
  const { cart } = useCart();
  const { wishlistCount } = useWishlist();
  const cartItemCount = cart.itemCount;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo/guitar logo.png" alt="Guitar1960" className="h-12 w-auto" />
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="relative hidden sm:block hover:text-brand-darkGray">
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative hover:text-brand-darkGray">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link to="/account" className="hidden sm:block hover:text-brand-darkGray">
              <User size={24} />
            </Link>
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 py-3 border-t">
          <Link to="/" className="hover:text-brand-darkGray font-medium uppercase">
            HOME
          </Link>
          <Link to="/about" className="hover:text-brand-darkGray font-medium uppercase">
            ABOUT
          </Link>

          {/* Men's Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setMenDropdownOpen(true)}
            onMouseLeave={() => setMenDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-blue-600 font-medium uppercase">
              MEN'S
              <ChevronDown size={16} />
            </button>
            {menDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-50">
                <Link to="/shop?category=men&subcategory=denims" className="block px-4 py-2 hover:bg-gray-100">
                  Denims
                </Link>
                <Link to="/shop?category=men&subcategory=de-hilo" className="block px-4 py-2 hover:bg-gray-100">
                  De Hilo
                </Link>
                <Link to="/shop?category=men&subcategory=underwear" className="block px-4 py-2 hover:bg-gray-100">
                  Men's Underwear
                </Link>
                <Link to="/shop?category=men&subcategory=polo-shirt" className="block px-4 py-2 hover:bg-gray-100">
                  Polo Shirt
                </Link>
                <Link to="/shop?category=men&subcategory=apparel" className="block px-4 py-2 hover:bg-gray-100">
                  Men's Apparel
                </Link>
              </div>
            )}
          </div>

          {/* Ladies Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setLadiesDropdownOpen(true)}
            onMouseLeave={() => setLadiesDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-brand-darkGray font-medium uppercase">
              LADIES
              <ChevronDown size={16} />
            </button>
            {ladiesDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-50">
                <Link to="/shop?category=ladies&subcategory=denims" className="block px-4 py-2 hover:bg-gray-100">
                  Denims
                </Link>
                <Link to="/shop?category=ladies&subcategory=de-hilo" className="block px-4 py-2 hover:bg-gray-100">
                  De Hilo
                </Link>
                <Link to="/shop?category=ladies&subcategory=underwear" className="block px-4 py-2 hover:bg-gray-100">
                  Ladies Underwear
                </Link>
                <Link to="/shop?category=ladies&subcategory=polo-shirt" className="block px-4 py-2 hover:bg-gray-100">
                  Polo Shirt
                </Link>
                <Link to="/shop?category=ladies&subcategory=apparel" className="block px-4 py-2 hover:bg-gray-100">
                  Ladies Apparel
                </Link>
              </div>
            )}
          </div>

          <Link to="/shop?category=kids" className="hover:text-brand-darkGray font-medium uppercase">
            KIDS
          </Link>
          <Link to="/shop" className="hover:text-brand-darkGray font-medium uppercase">
            SHOP
          </Link>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[73px] bg-white z-40 overflow-y-auto">
            <div className="flex flex-col p-4">
              {/* Search */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg pl-10"
                />
                <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
              </div>

              {/* Main Links */}
              <nav className="flex flex-col">
                <Link
                  to="/shop"
                  className="flex items-center gap-3 py-4 border-b border-gray-100 font-medium text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                <Link
                  to="/about"
                  className="flex items-center gap-3 py-4 border-b border-gray-100 font-medium text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/shop?category=men"
                  className="flex items-center gap-3 py-4 border-b border-gray-100 font-medium text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Men's
                </Link>
                <Link
                  to="/shop?category=ladies"
                  className="flex items-center gap-3 py-4 border-b border-gray-100 font-medium text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ladies'
                </Link>
                <Link
                  to="/shop?category=kids"
                  className="flex items-center gap-3 py-4 border-b border-gray-100 font-medium text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Kids
                </Link>
              </nav>

              {/* Account Section */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Account</p>
                <Link
                  to="/account"
                  className="flex items-center gap-3 py-3 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={20} />
                  My Account
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 py-3 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart size={20} />
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center gap-3 py-3 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart size={20} />
                  Cart
                  {cartItemCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
