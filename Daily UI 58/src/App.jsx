import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import LandingHero from './components/LandingHero';
import ProductGrid from './components/ProductGrid';
import ProductCustomizer from './components/ProductCustomizer';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import SignUp from './components/SignUp';
import ThankYou from './components/ThankYou';
import { products } from './data/products';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleShopClick = () => {
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCustomize = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseCustomizer = () => {
    setSelectedProduct(null);
  };

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleCheckout = () => {
    setCurrentPage('checkout');
    setIsCartOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteOrder = () => {
    setCurrentPage('thankyou');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToShop = () => {
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <LandingHero onShopClick={handleShopClick} />
            <ProductGrid onCustomize={handleCustomize} />
          </>
        );
      case 'shop':
        return (
          <>
            <section className="py-20 px-6 bg-gradient-to-b from-dark via-dark/95 to-dark">
              <div className="container mx-auto text-center">
                <h1 className="text-6xl md:text-8xl font-display font-black mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  SHOP
                </h1>
                <p className="text-xl text-white/60">High-Octane Streetwear Collection</p>
              </div>
            </section>
            <ProductGrid onCustomize={handleCustomize} />
          </>
        );
      case 'signup':
        return <SignUp onBack={() => setCurrentPage('home')} />;
      case 'checkout':
        return (
          <Checkout 
            onComplete={handleCompleteOrder}
            onBack={() => {
              setCurrentPage('shop');
              setIsCartOpen(true);
            }}
          />
        );
      case 'thankyou':
        return <ThankYou onBackToShop={handleBackToShop} />;
      default:
        return (
          <>
            <LandingHero onShopClick={handleShopClick} />
            <ProductGrid onCustomize={handleCustomize} />
          </>
        );
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-dark text-white relative">
        <Navbar 
          onCartClick={handleCartClick}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        
        <main className="pt-20">
          {renderPage()}
        </main>

        {selectedProduct && (
          <ProductCustomizer
            product={selectedProduct}
            onClose={handleCloseCustomizer}
          />
        )}

        <CartDrawer
          isOpen={isCartOpen}
          onClose={handleCloseCart}
          onCheckout={handleCheckout}
        />
      </div>
    </CartProvider>
  );
}

export default App;

