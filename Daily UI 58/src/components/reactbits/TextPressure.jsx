import { useRef, useEffect, memo, useState } from 'react';

const TextPressure = memo(({ 
  children, 
  intensity = 0.3,
  className = '',
  style = {}
}) => {
  const textRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePos({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const transformStyle = isHovering && !prefersReducedMotion
    ? {
        transform: `perspective(1000px) rotateX(${mousePos.y * intensity * 10}deg) rotateY(${mousePos.x * intensity * 10}deg) scale3d(${1 + intensity * 0.1}, ${1 + intensity * 0.1}, 1)`,
        textShadow: `
          ${mousePos.x * intensity * 20}px ${mousePos.y * intensity * 20}px 0 rgba(255, 107, 53, 0.3),
          ${mousePos.x * intensity * -15}px ${mousePos.y * intensity * -15}px 0 rgba(0, 78, 137, 0.3)
        `,
        transition: 'transform 0.1s ease-out, text-shadow 0.1s ease-out'
      }
    : {
        transition: 'transform 0.3s ease-out, text-shadow 0.3s ease-out'
      };

  return (
    <span
      ref={textRef}
      className={className}
      style={{
        display: 'inline-block',
        cursor: 'pointer',
        ...transformStyle,
        ...style
      }}
    >
      {children}
    </span>
  );
});

TextPressure.displayName = 'TextPressure';

export default TextPressure;
