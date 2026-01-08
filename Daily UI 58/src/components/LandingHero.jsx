import { memo } from 'react';
import HyperSpeed from './reactbits/HyperSpeed';
import TextPressure from './reactbits/TextPressure';
import AnimatedContent from './reactbits/AnimatedContent';
import ClickSpark from './reactbits/ClickSpark';
import { useCart } from '../context/CartContext';

const LandingHero = memo(({ onShopClick }) => {
  const { cartSpeed } = useCart();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HyperSpeed 
        speed={cartSpeed} 
        color="#FF6B35"
        opacity={0.4}
        intensity={Math.min(cartSpeed / 2, 1.5)}
      />
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <AnimatedContent delay={0.2}>
          <TextPressure intensity={0.5} className="block mb-6">
            <h1 className="text-6xl md:text-8xl font-display font-black mb-4">
              VELOCITY VIBE
            </h1>
          </TextPressure>
        </AnimatedContent>

        <AnimatedContent delay={0.4}>
          <p className="text-xl md:text-2xl mb-8 text-white/80 max-w-2xl mx-auto">
            High-Octane Streetwear for the Modern Maverick
          </p>
        </AnimatedContent>

        <AnimatedContent delay={0.6}>
          <ClickSpark sparkColor="#FF6B35" sparkCount={12}>
            <button
              onClick={onShopClick}
              className="px-8 py-4 bg-primary text-white font-bold text-lg rounded-lg hover:bg-primary/90 transition-colors transform hover:scale-105"
            >
              EXPLORE COLLECTION
            </button>
          </ClickSpark>
        </AnimatedContent>
      </div>
    </section>
  );
});

LandingHero.displayName = 'LandingHero';

export default LandingHero;
