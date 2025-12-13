import React, { useState, useEffect } from 'react';
import { ShoppingBag, Droplets, RotateCcw, Type, Sparkles } from 'lucide-react';

const SodaCustomizer = () => {
  // State for customization
  const [flavor, setFlavor] = useState('strawberry');
  const [customText, setCustomText] = useState('SODA');
  const [tagline, setTagline] = useState('Exxxxxxtra Refreshing');
  const [showCondensation, setShowCondensation] = useState(true);
  const [rotation, setRotation] = useState(15);

  // Configuration for different themes based on the image style
  const themes = {
    strawberry: {
      name: 'Strawberry',
      mainColor: '#FF4D4D', // Bright Red
      accentColor: '#FFCCCC', // Light Pink
      textColor: '#FFFFFF',
      bgGradient: 'from-red-500 to-red-600',
      fruit: '🍓',
      description: 'Savor the bold flavors of summer, perfectly balanced with a refreshing fizz.',
      canTopColor: '#e0e0e0',
      labelGradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5253 100%)'
    },
    lemon: {
      name: 'Lemon Zest',
      mainColor: '#FFD93D', // Yellow
      accentColor: '#FFF4BD', // Light Yellow
      textColor: '#333333', // Dark text for contrast
      bgGradient: 'from-yellow-400 to-yellow-500',
      fruit: '🍋',
      description: 'A zesty explosion of citrus sunshine to brighten your day.',
      canTopColor: '#e0e0e0',
      labelGradient: 'linear-gradient(135deg, #f6e58d 0%, #f9ca24 100%)'
    },
    blueberry: {
      name: 'Blue Raspberry',
      mainColor: '#4834d4', // Deep Blue
      accentColor: '#dff9fb', // Ice Blue
      textColor: '#FFFFFF',
      bgGradient: 'from-blue-600 to-blue-700',
      fruit: '🫐',
      description: 'Cool, electric blue flavor that shocks your senses in the best way.',
      canTopColor: '#e0e0e0',
      labelGradient: 'linear-gradient(135deg, #686de0 0%, #4834d4 100%)'
    },
    grape: {
      name: 'Midnight Grape',
      mainColor: '#6c5ce7', // Purple
      accentColor: '#e0dcfc', // Light Purple
      textColor: '#FFFFFF',
      bgGradient: 'from-purple-600 to-purple-700',
      fruit: '🍇',
      description: 'Deep, rich grape taste for the mysterious soul.',
      canTopColor: '#e0e0e0',
      labelGradient: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)'
    }
  };

  const currentTheme = themes[flavor];

  // Auto-rotate effect for the can
  useEffect(() => {
    const interval = setInterval(() => {
        // Subtle breathing rotation
       // setRotation(r => r + 0.1); 
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans overflow-hidden transition-colors duration-700 ease-in-out"
         style={{ backgroundColor: '#F9F5F1' }}> {/* Cream background from image */}
      
      {/* LEFT SECTION: THE PRODUCT STAGE */}
      <div className="relative w-full md:w-1/2 h-[50vh] md:h-screen flex items-center justify-center overflow-hidden">
        
        {/* Dynamic Background Panel behind can */}
        <div 
            className="absolute top-0 right-0 w-full h-full md:w-4/5 md:h-[90%] bg-opacity-100 transition-all duration-700 ease-in-out transform md:translate-x-12 md:translate-y-12 rounded-bl-[100px]"
            style={{ backgroundColor: currentTheme.mainColor }}
        ></div>

        {/* Floating Fruit Particles (Simulated) */}
        <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
                <div key={i} 
                     className="absolute text-6xl opacity-80 animate-bounce transition-all duration-1000"
                     style={{
                         top: `${20 + Math.random() * 60}%`,
                         left: `${10 + Math.random() * 80}%`,
                         animationDuration: `${2 + Math.random() * 3}s`,
                         animationDelay: `${Math.random()}s`,
                         transform: `rotate(${Math.random() * 360}deg)`
                     }}>
                    {currentTheme.fruit}
                </div>
            ))}
        </div>

        {/* 3D CAN IMPLEMENTATION */}
        <div 
            className="relative z-10 transition-transform duration-500 ease-out hover:scale-105"
            style={{ 
                width: '240px', 
                height: '420px',
                transform: `rotate(${rotation}deg)` 
            }}
        >
            {/* Can Body */}
            <div className="w-full h-full relative rounded-[30px] shadow-2xl overflow-hidden"
                 style={{
                     background: currentTheme.labelGradient,
                     boxShadow: '20px 20px 60px rgba(0,0,0,0.3), inset -10px -10px 20px rgba(0,0,0,0.1)'
                 }}
            >
                {/* Metallic Top Rim (CSS Simulation) */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-400 z-20 border-b-4 border-gray-300 rounded-t-[10px]"></div>
                <div className="absolute top-2 left-4 right-4 h-8 bg-gradient-to-b from-gray-400 to-gray-200 rounded-[50%] opacity-50 z-20"></div>

                {/* Blue Strip at Top (from Image) */}
                <div className="absolute top-12 left-0 right-0 h-16 bg-blue-700 z-10 flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold tracking-widest uppercase italic transform -skew-x-12 opacity-90">
                        {tagline}
                    </span>
                </div>

                {/* Main Label Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-20">
                    {/* Big Curved Text Effect */}
                    <h1 className="text-8xl font-black text-white leading-none tracking-tighter transform scale-y-110 drop-shadow-lg text-center break-all px-2"
                        style={{ 
                            fontFamily: 'Impact, sans-serif',
                            textShadow: '0px 4px 10px rgba(0,0,0,0.2)'
                        }}
                    >
                        {customText.substring(0, 4)}<br/>
                        {customText.substring(4, 8)}
                    </h1>
                </div>

                {/* Condensation Droplets */}
                {showCondensation && (
                    <div className="absolute inset-0 z-20 opacity-60 pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <div key={i}
                                className="absolute bg-white rounded-full shadow-sm"
                                style={{
                                    width: `${Math.random() * 6 + 2}px`,
                                    height: `${Math.random() * 8 + 4}px`,
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    opacity: Math.random() * 0.8
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Lighting/Reflection Overlay for Cylindrical Look */}
                <div className="absolute inset-0 z-30 pointer-events-none"
                     style={{
                         background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 20%, rgba(0,0,0,0.1) 50%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.3) 100%)'
                     }}
                ></div>

                {/* Bottom Rim */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-400 z-10 rounded-b-[30px] opacity-80 bg-gradient-to-t from-gray-600 to-gray-300"></div>
            </div>
        </div>
      </div>

      {/* RIGHT SECTION: CONTROLS & COPY */}
      <div className="relative w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center z-10">
        
        {/* Brand Header */}
        <div className="absolute top-8 right-8 text-right hidden md:block">
            <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400">Paucek<br/>and<br/>Lage</h3>
        </div>

        <div className="max-w-md mx-auto md:mx-0">
            {/* Dynamic Headline */}
            <h2 className="text-6xl md:text-8xl font-bold uppercase leading-[0.85] mb-4 tracking-tighter"
                style={{ 
                    fontFamily: 'Oswald, sans-serif',
                    color: currentTheme.textColor === '#FFFFFF' && currentTheme.mainColor !== '#F5F0E6' ? currentTheme.mainColor : '#333' 
                }}
            >
                POP OF <br/>
                <span className="text-transparent bg-clip-text" 
                      style={{ 
                          backgroundImage: currentTheme.labelGradient,
                          filter: 'brightness(1.2)'
                      }}>
                    {currentTheme.name.split(' ')[0]}
                </span>
            </h2>

            <p className="text-gray-500 font-medium mb-12 leading-relaxed border-l-4 pl-4" style={{ borderColor: currentTheme.mainColor }}>
                {currentTheme.description} A combo made to satisfy—comfort meets cool in every bite and sip.
            </p>

            {/* Customization Controls */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8 backdrop-blur-sm bg-opacity-90">
                <div className="mb-6">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Choose Flavor</label>
                    <div className="flex gap-3">
                        {Object.keys(themes).map((key) => (
                            <button
                                key={key}
                                onClick={() => setFlavor(key)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 transform hover:scale-110 ${flavor === key ? 'ring-4 ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                                style={{ 
                                    backgroundColor: themes[key].mainColor,
                                    borderColor: themes[key].mainColor
                                }}
                                title={themes[key].name}
                            >
                                {themes[key].fruit}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                            <Type size={14} /> Can Text
                        </label>
                        <input 
                            type="text" 
                            maxLength={8}
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-2 font-black text-gray-700 focus:outline-none focus:border-gray-400 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                            <Sparkles size={14} /> Tagline
                        </label>
                        <input 
                            type="text" 
                            maxLength={20}
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 focus:outline-none focus:border-gray-400 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => setShowCondensation(!showCondensation)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${showCondensation ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
                    >
                        <Droplets size={16} /> {showCondensation ? 'Wet' : 'Dry'}
                    </button>

                    <button 
                        onClick={() => {
                            setFlavor('strawberry');
                            setCustomText('SODA');
                            setTagline('Exxxxxxtra Refreshing');
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Reset"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            {/* CTA Button */}
            <button 
                className="group relative w-full md:w-auto overflow-hidden rounded-full px-12 py-4 text-white font-bold tracking-widest shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                style={{ backgroundColor: currentTheme.mainColor }}
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                    ORDER CUSTOM PACK <ShoppingBag size={20} />
                </span>
            </button>
            
            <p className="mt-4 text-xs text-gray-400 font-medium text-center md:text-left">
                * Ships within 24 hours. Custom flavors available.
            </p>
        </div>
      </div>
    </div>
  );
};

export default SodaCustomizer;



