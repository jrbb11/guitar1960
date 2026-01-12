import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Mobile: Compact 2-column layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* About - Full width on mobile */}
          <div className="col-span-2 md:col-span-1 text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-white text-lg font-bold mb-3">Guitar1960</h3>
            <p className="text-sm mb-4 hidden md:block">
              Quality apparel for men, women, and kids. Established in 1960, serving Filipinos with comfortable and affordable clothing.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                <Facebook size={20} />
              </a>

              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                <Instagram size={20} />
              </a>
              <a href="https://www.youtube.com/@GuitarApparel1960" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white text-sm md:text-lg font-bold mb-3">Shop</h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><Link to="/shop?category=men" className="hover:text-white">Men's</Link></li>
              <li><Link to="/shop?category=ladies" className="hover:text-white">Ladies'</Link></li>
              <li><Link to="/shop?category=kids" className="hover:text-white">Kids'</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-white text-sm md:text-lg font-bold mb-3">Help</h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><Link to="/account/orders" className="hover:text-white">My Orders</Link></li>
              <li><Link to="/account" className="hover:text-white">Account</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-white">Shipping</Link></li>
            </ul>
          </div>

          {/* Contact - Full width on mobile */}
          <div className="col-span-2 md:col-span-1 text-center md:text-left border-t md:border-t-0 border-gray-800 pt-4 md:pt-0 mt-2 md:mt-0">
            <h3 className="text-white text-sm md:text-lg font-bold mb-3">Contact Us</h3>
            <div className="flex flex-col md:flex-col items-center md:items-start gap-2 text-xs md:text-sm">
              <a href="tel:+639176846868" className="flex items-center gap-2 hover:text-white">
                <Phone size={14} />
                +63 917-684-6868
              </a>
              <a href="mailto:guitarcorp_1960@yahoo.com" className="flex items-center gap-2 hover:text-white">
                <Mail size={14} />
                guitarcorp_1960@yahoo.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-4 md:pt-8 text-xs md:text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Guitar1960. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
