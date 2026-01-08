import { useRef, useEffect, useMemo, memo } from 'react';

const HyperSpeed = memo(({ 
  speed = 1, 
  color = '#FF6B35',
  opacity = 0.3,
  intensity = 1,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000) * intensity;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width / dpr,
      y: Math.random() * canvas.height / dpr,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
      size: Math.random() * 2 + 1,
      trail: []
    }));

    const animate = (timestamp) => {
      timeRef.current = timestamp;
      const currentSpeed = speed * (1 + intensity * 0.5);
      
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.vx * currentSpeed;
        particle.y += particle.vy * currentSpeed;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width / dpr;
        if (particle.x > canvas.width / dpr) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height / dpr;
        if (particle.y > canvas.height / dpr) particle.y = 0;
        
        // Add to trail
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 10) particle.trail.shift();
        
        // Draw trail
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = particle.size * 0.5;
        
        if (particle.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
          for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          }
          ctx.stroke();
        }
        
        // Draw particle
        ctx.globalAlpha = opacity * 1.5;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [speed, color, opacity, intensity]);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  if (prefersReducedMotion && intensity > 0.3) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
});

HyperSpeed.displayName = 'HyperSpeed';

export default HyperSpeed;
