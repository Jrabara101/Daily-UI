import { useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useGSAP } from '../hooks/useGSAP';

const Navbar = ({ onCartClick, currentPage, setCurrentPage }) => {
  const { totalItems } = useCart();
  const navRef = useRef(null);

  useGSAP(() => {
    if (!navRef.current) return;
    const { gsap } = window;
    if (gsap) {
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }, { scope: navRef });

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            VELOCITY VIBE
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setCurrentPage('home')}
              className={`hover:text-primary transition-colors ${currentPage === 'home' ? 'text-primary' : ''}`}
            >
              HOME
            </button>
            <button
              onClick={() => setCurrentPage('shop')}
              className={`hover:text-primary transition-colors ${currentPage === 'shop' ? 'text-primary' : ''}`}
            >
              SHOP
            </button>
            <button
              onClick={() => setCurrentPage('signup')}
              className={`hover:text-primary transition-colors ${currentPage === 'signup' ? 'text-primary' : ''}`}
            >
              SIGN UP
            </button>
          </div>

          <button
            onClick={onCartClick}
            className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            data-cart-icon
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
