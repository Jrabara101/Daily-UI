import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, ChevronRight, Copy, Check, X, Gift, Clock, ArrowRight } from 'lucide-react';

/**
 * Xbox Store - Special Offers with Promo Code
 * Refactored to match Xbox store UI/UX design
 */

// --- Mock Data ---
const GAMES = [
  {
    id: 1,
    title: "Monster Hunter World: Premium Edition",
    originalPrice: 39.99,
    price: 19.99,
    discount: 50,
    image: "https://monstervine.com/wp-content/uploads/2019/09/Monster-Hunter-World_-Iceborne_20190908102727.jpg"
  },
  {
    id: 2,
    title: "Dragon Age: Inquisition Deluxe Edition",
    originalPrice: 29.99,
    price: 14.99,
    discount: 50,
    image: "https://image.api.playstation.com/cdn/UP0006/CUSA00220_00/eYpFtCkX6xbSibDbEUkRXSdY5fwGOSMC.jpg?w=5000&thumb=false"
  },
  {
    id: 3,
    title: "Elden Ring: Shadow of the Erdtree",
    originalPrice: 59.99,
    price: 39.99,
    discount: 33,
    image: "https://www.gaming.net/wp-content/uploads/2024/02/elden-ring-dlc.jpg"
  },
  {
    id: 4,
    title: "DRAGON BALL Z: KAKAROT",
    originalPrice: 49.99,
    price: 24.99,
    discount: 50,
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202301/0921/AiE5XQ6Yzy2tO7zCn2P0J8lZ.png?w=5000&thumb=false"
  },
  {
    id: 5,
    title: "TEKKEN 8",
    originalPrice: 69.99,
    price: 34.99,
    discount: 50,
    image: "https://assets-prd.ignimgs.com/2022/09/15/tekken8-1663261659390.jpg?crop=1%3A1%2Csmart&format=jpg&auto=webp&quality=80"
  },
  {
    id: 6,
    title: "FINAL FANTASY XIV COMPLETE EDITION",
    originalPrice: 59.99,
    price: 29.99,
    discount: 50,
    image: "https://s.pacn.ws/1/p/t6/final-fantasy-xiv-complete-edition-525435.11.jpg?v=rxxac2"
  },
  {
    id: 7,
    title: "Mortal Kombat 1",
    originalPrice: 69.99,
    price: 41.99,
    discount: 40,
    image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/05/mortal-kombat-1.jpg"
  },
  {
    id: 8,
    title: "Street Fighter 6",
    originalPrice: 59.99,
    price: 29.99,
    discount: 50,
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202510/1507/f421bb44a85a8d77cbf935bd6af28de781b91857d9e7d8c5.png?w=5000&thumb=false"
  }
];

// --- Components ---

const Header = () => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-14">
        {/* Left: Microsoft/Xbox Branding */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-900">Microsoft</span>
            <span className="text-gray-400">|</span>
            <span className="text-sm font-semibold text-gray-900">Xbox</span>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Games</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Hardware</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Game Pass</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Community</a>
          </nav>
        </div>

        {/* Right: Search & Profile */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <User className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  </header>
);

const HeroSection = () => (
  <section className="bg-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">Xbox Sales & Specials</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Get Xbox Game Pass Ultimate and enjoy hundreds of high-quality games, plus get great deals on games you want to own. 
          Find the best deals on Xbox games and add-ons.
        </p>
      </div>
      <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <img 
          src="https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&q=80&w=1200" 
          alt="Xbox Consoles"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>
    </div>
  </section>
);

const TradeInOffer = () => (
  <section className="bg-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-yellow-400 text-center py-2 mb-6">
        <span className="text-black font-bold text-sm uppercase tracking-wider">LIMITED TIME OFFER</span>
      </div>
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Trade-in and get up to $180 for your used console
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          See how much your Xbox One, Xbox Series X, or Xbox Series S is worth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-[#107C10] hover:bg-[#0e6b0e] text-white font-bold py-3 px-8 rounded transition-colors">
            GET AN ESTIMATE
          </button>
          <button className="bg-transparent border-2 border-[#107C10] text-[#107C10] hover:bg-[#107C10] hover:text-white font-bold py-3 px-8 rounded transition-colors">
            LEARN MORE
          </button>
        </div>
      </div>
    </div>
  </section>
);

const GameCard = ({ game }) => (
  <div className="flex-shrink-0 w-[200px] sm:w-[240px] group cursor-pointer">
    <div className="relative mb-3">
      <img 
        src={game.image} 
        alt={game.title}
        className="w-full h-[270px] object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
      />
      {game.discount > 0 && (
        <div className="absolute top-2 left-2 bg-[#FF6B00] text-white text-xs font-bold px-2 py-1 rounded">
          -{game.discount}%
        </div>
      )}
    </div>
    <h3 className="text-sm font-semibold text-black mb-2 line-clamp-2 group-hover:text-[#107C10] transition-colors">
      {game.title}
    </h3>
    <div className="flex items-center gap-2">
      {game.originalPrice > game.price && (
        <span className="text-sm text-gray-500 line-through">
          ${game.originalPrice}
        </span>
      )}
      <span className="text-lg font-bold text-black">
        ${game.price}
      </span>
    </div>
  </div>
);

const GameCarousel = ({ title, games, showEndsIn = false, daysLeft = 7 }) => (
  <section className="bg-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-black mb-1">{title}</h2>
          {showEndsIn && (
            <p className="text-sm text-gray-600">Ends in {daysLeft} days</p>
          )}
        </div>
        <a href="#" className="text-[#107C10] font-semibold hover:underline flex items-center gap-1">
          SHOP NOW <ChevronRight className="w-4 h-4" />
        </a>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-4">
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

const DigitalGameDeals = () => (
  <section className="bg-[#107C10] py-16 relative overflow-hidden">
    {/* Pattern Background */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }}></div>
    </div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-6">This week's digital game deals</h2>
        <button className="bg-white text-[#107C10] hover:bg-gray-100 font-bold py-3 px-8 rounded transition-colors">
          VIEW ALL GAME DEALS
        </button>
      </div>
      <div className="mt-12 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-4">
          {GAMES.slice(0, 6).map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

const CodeRedemption = ({ onCopyCode }) => {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const promoCode = "HOLIDAY50";

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setShowToast(true);
    if (onCopyCode) onCopyCode();
    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 2000);
  };

  return (
    <>
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            {/* Left: Icon */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-[#107C10] to-[#0e6b0e] rounded-lg flex items-center justify-center">
                <Gift className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Middle: Text */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
                Redeem an Xbox gift card
              </h2>
              <p className="text-gray-700 text-lg">
                Redeem your code to apply it to digital games, subscriptions, and more.
              </p>
            </div>

            {/* Right: Promo Code & Button */}
            <div className="flex-shrink-0 w-full md:w-auto">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                    Special Promo Code
                  </label>
                  <code className="text-2xl font-bold text-black font-mono select-all">
                    {promoCode}
                  </code>
                </div>
                <button
                  onClick={handleCopy}
                  className={`p-3 rounded-lg transition-all ${
                    copied 
                      ? 'bg-[#107C10] text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  title={copied ? 'Copied!' : 'Copy code'}
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <button className="w-full md:w-auto bg-[#107C10] hover:bg-[#0e6b0e] text-white font-bold py-3 px-8 rounded transition-colors flex items-center justify-center gap-2">
                REDEEM CODE <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      <div className={`fixed bottom-8 right-8 z-50 transform transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-gray-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 border-l-4 border-[#107C10]">
          <div className="bg-[#107C10]/20 p-2 rounded-full">
            <Check size={20} className="text-[#107C10]" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Code Copied!</h4>
            <p className="text-xs text-gray-400">Promo code copied to clipboard</p>
          </div>
          <button onClick={() => setShowToast(false)} className="ml-4 text-gray-500 hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

const GamePassSection = () => (
  <section className="bg-gray-800 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#107C10] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">X</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Discover with Game Pass</h3>
            <p className="text-gray-400 text-sm">Play hundreds of games for one low price</p>
          </div>
        </div>
        <a href="#" className="text-white font-semibold hover:underline flex items-center gap-1">
          LEARN MORE <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', icon: '📘' },
    { name: 'Twitter', icon: '🐦' },
    { name: 'YouTube', icon: '📺' },
    { name: 'Instagram', icon: '📷' },
  ];

  const footerLinks = [
    ['Sitemap', 'Contact Us', 'Privacy & Cookies', 'Terms of Use'],
    ['Trademarks', 'About our Ads', 'Legal', 'Accessibility'],
  ];

  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-8">
          {socialLinks.map((social, idx) => (
            <a 
              key={idx}
              href="#" 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-lg"
              title={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
          {footerLinks.flat().map((link, idx) => (
            <a key={idx} href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              {link}
            </a>
          ))}
        </div>

        {/* Language Selector */}
        <div className="flex justify-center mb-6">
          <select className="text-sm text-gray-600 border border-gray-300 rounded px-3 py-2 bg-white">
            <option>English (United States)</option>
            <option>Español</option>
            <option>Français</option>
          </select>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm font-semibold text-gray-900">Microsoft</span>
          </div>
          <p className="text-xs text-gray-500">© 2024 Microsoft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main App Component ---

export default function App() {
  const [cartCount] = useState(0);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      <Header />
      
      <HeroSection />
      
      <TradeInOffer />
      
      <DigitalGameDeals />
      
      <GameCarousel 
        title="Tokyo Game Show Sale" 
        games={GAMES.slice(0, 5)} 
        showEndsIn={true} 
        daysLeft={7}
      />
      
      <GameCarousel 
        title="Bandai Namco Publisher Sale" 
        games={GAMES.slice(2, 7)} 
      />
      
      <GameCarousel 
        title="Fighter Sale" 
        games={GAMES.slice(5, 8)} 
        showEndsIn={true} 
        daysLeft={7}
      />
      
      <GamePassSection />
      
      <CodeRedemption />
      
      <Footer />

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
