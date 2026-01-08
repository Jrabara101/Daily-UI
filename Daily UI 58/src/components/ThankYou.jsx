import { useRef, useEffect, useState } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';
import TextPressure from './reactbits/TextPressure';
import ClickSpark from './reactbits/ClickSpark';
import AnimatedContent from './reactbits/AnimatedContent';
import HyperSpeed from './reactbits/HyperSpeed';
import { useGSAP } from '../hooks/useGSAP';

const ThankYou = ({ onBackToShop }) => {
  const containerRef = useRef(null);
  const checkRef = useRef(null);
  const [warpComplete, setWarpComplete] = useState(false);

  useEffect(() => {
    // Gradually reduce warp speed to create landing effect
    const timer = setTimeout(() => {
      setWarpComplete(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    if (!containerRef.current || !checkRef.current) return;
    const { gsap } = window;
    if (!gsap) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Scale animation for checkmark
    gsap.from(checkRef.current, {
      scale: 0,
      rotation: -180,
      duration: 1,
      ease: 'back.out(1.7)',
      delay: 1
    });

    // Pulse effect
    gsap.to(checkRef.current, {
      scale: 1.1,
      duration: 0.5,
      repeat: 2,
      yoyo: true,
      ease: 'power2.inOut',
      delay: 2
    });
  }, { scope: containerRef });

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <HyperSpeed 
        speed={warpComplete ? 0.5 : 8} 
        color="#00FF88" 
        opacity={warpComplete ? 0.2 : 0.6} 
        intensity={warpComplete ? 0.5 : 1.5}
      />
      
      <div ref={containerRef} className="relative z-10 text-center px-6">
        <AnimatedContent delay={1.5}>
          <div className="mb-8">
            <div
              ref={checkRef}
              className="mx-auto w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-8"
            >
              <CheckCircle className="w-20 h-20 text-white" strokeWidth={2.5} />
            </div>

            <TextPressure intensity={0.5}>
              <h1 className="text-6xl md:text-8xl font-display font-black mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                ORDER COMPLETE!
              </h1>
            </TextPressure>

            <p className="text-2xl md:text-3xl text-white/80 mb-12 max-w-2xl mx-auto">
              Your high-octane streetwear is on its way!<br />
              Get ready to elevate your style game.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ClickSpark sparkColor="#00FF88" sparkCount={16}>
                <button
                  onClick={onBackToShop}
                  className="px-8 py-4 bg-primary text-white font-bold text-lg rounded-lg hover:bg-primary/90 transition-colors transform hover:scale-105"
                >
                  CONTINUE SHOPPING
                </button>
              </ClickSpark>

              <AnimatedContent delay={2}>
                <div className="flex items-center gap-2 text-white/60">
                  <Sparkles className="w-5 h-5" />
                  <span>You'll receive a confirmation email shortly</span>
                </div>
              </AnimatedContent>
            </div>
          </div>
        </AnimatedContent>

        <AnimatedContent delay={2.5}>
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-white/40 text-sm">
              Thank you for choosing <span className="font-bold text-primary">VELOCITY VIBE</span>
            </p>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
};

export default ThankYou;


