import { useRef, useEffect, memo, useState } from 'react';
import { useGSAP } from '../hooks/useGSAP';

const AnimatedContent = memo(({
  children,
  delay = 0,
  duration = 0.8,
  from = { y: 100, opacity: 0 },
  to = { y: 0, opacity: 1 },
  ease = 'back.out(1.7)',
  className = '',
  trigger = true
}) => {
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useGSAP(() => {
    if (!ref.current || !trigger || hasAnimated) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setHasAnimated(true);
      return;
    }

    const { gsap } = window;
    if (!gsap) return;

    gsap.fromTo(ref.current, from, {
      ...to,
      duration,
      delay,
      ease,
      onComplete: () => setHasAnimated(true)
    });
  }, { scope: ref, dependencies: [delay, trigger] });

  return (
    <div ref={ref} className={className} style={hasAnimated ? {} : { opacity: from.opacity || 0 }}>
      {children}
    </div>
  );
});

AnimatedContent.displayName = 'AnimatedContent';

export default AnimatedContent;
