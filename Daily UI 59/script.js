/**
 * Daily UI 59 - Generative Glassmorphic Environment
 * A dynamic, interactive background system with parallax depth, theme interpolation,
 * and mouse tracking using Canvas API for optimal performance.
 */

class GenerativeBackground {
  constructor() {
    // Canvas references
    this.canvases = {
      layer1: document.getElementById('canvas-layer-1'),
      layer2: document.getElementById('canvas-layer-2'),
      layer3: document.getElementById('canvas-layer-3')
    };
    
    this.ctx = {
      layer1: this.canvases.layer1.getContext('2d'),
      layer2: this.canvases.layer2.getContext('2d'),
      layer3: this.canvases.layer3.getContext('2d')
    };
    
    // Animation state
    this.animationFrame = null;
    this.isAnimating = false;
    this.time = 0;
    this.lastTime = performance.now();
    
    // Mouse tracking
    this.mouseX = 0;
    this.mouseY = 0;
    this.smoothMouseX = 0;
    this.smoothMouseY = 0;
    
    // Scroll tracking
    this.scrollY = 0;
    this.maxScroll = 0;
    
    // Theme state
    this.currentTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Reduced motion preference
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Procedural generation seed
    this.seed = this.generateSeed();
    
    // Layer configurations
    this.layers = {
      layer1: {
        spacing: 60,
        speed: 0.3,  // Slowest - background layer
        particleSize: 2,
        colorIndex: 1,
        waveAmplitude: 8,
        waveFrequency: 0.0015
      },
      layer2: {
        spacing: 40,
        speed: 0.6,  // Medium speed
        particleSize: 1.5,
        colorIndex: 2,
        waveAmplitude: 12,
        waveFrequency: 0.002
      },
      layer3: {
        spacing: 30,
        speed: 1.0,  // Fastest - foreground layer
        particleSize: 1,
        colorIndex: 3,
        waveAmplitude: 15,
        waveFrequency: 0.0025
      }
    };
    
    this.init();
  }
  
  /**
   * Generate a seed based on date and random factor
   */
  generateSeed() {
    const date = new Date();
    const dateSeed = date.getDate() + date.getMonth() * 31 + date.getFullYear() * 365;
    const randomSeed = Math.floor(Math.random() * 1000);
    return dateSeed + randomSeed;
  }
  
  /**
   * Seeded random number generator
   */
  seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  
  /**
   * Initialize the background system
   */
  init() {
    this.setupCanvas();
    this.setupEventListeners();
    this.setupTheme();
    this.calculateMaxScroll();
    
    // Start animation if motion is not reduced
    if (!this.reducedMotion) {
      this.startAnimation();
    } else {
      this.renderStatic();
    }
    
    // Remove loading class
    document.body.classList.remove('loading');
  }
  
  /**
   * Setup canvas dimensions and pixel ratio
   */
  setupCanvas() {
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      Object.keys(this.canvases).forEach(layerKey => {
        const canvas = this.canvases[layerKey];
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        this.ctx[layerKey].scale(dpr, dpr);
      });
      
      this.calculateMaxScroll();
    };
    
    resize();
    window.addEventListener('resize', resize);
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }, { passive: true });
    
    // Scroll tracking
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      this.scrollY = window.pageYOffset || document.documentElement.scrollTop;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => this.calculateMaxScroll(), 100);
    }, { passive: true });
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Reduced motion listener
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      if (this.reducedMotion) {
        this.stopAnimation();
        this.renderStatic();
      } else {
        this.startAnimation();
      }
    });
    
    // System theme change
    const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    themeQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    });
  }
  
  /**
   * Calculate maximum scroll distance
   */
  calculateMaxScroll() {
    this.maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      0
    );
  }
  
  /**
   * Setup initial theme
   */
  setupTheme() {
    this.applyTheme();
  }
  
  /**
   * Apply theme with smooth transition
   */
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }
  
  /**
   * Toggle theme
   */
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
  }
  
  /**
   * Start animation loop
   */
  startAnimation() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.lastTime = performance.now();
    this.animate();
    
    // Activate canvas layers
    Object.values(this.canvases).forEach(canvas => {
      canvas.classList.add('active');
    });
  }
  
  /**
   * Stop animation loop
   */
  stopAnimation() {
    this.isAnimating = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
  
  /**
   * Main animation loop
   */
  animate() {
    if (!this.isAnimating) return;
    
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    // Update time
    this.time += deltaTime * (this.reducedMotion ? 0 : 1);
    
    // Smooth mouse interpolation
    this.smoothMouseX += (this.mouseX - this.smoothMouseX) * 0.1;
    this.smoothMouseY += (this.mouseY - this.smoothMouseY) * 0.1;
    
    // Calculate scroll progress (0 to 1)
    const scrollProgress = this.maxScroll > 0 ? this.scrollY / this.maxScroll : 0;
    
    // Render each layer with parallax
    this.renderLayer('layer1', scrollProgress);
    this.renderLayer('layer2', scrollProgress);
    this.renderLayer('layer3', scrollProgress);
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
  
  /**
   * Render a single layer with parallax effect
   */
  renderLayer(layerKey, scrollProgress) {
    const canvas = this.canvases[layerKey];
    const ctx = this.ctx[layerKey];
    const config = this.layers[layerKey];
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Apply parallax offset based on scroll
    const parallaxOffset = scrollProgress * config.speed * 200;
    
    // Get CSS variables for colors
    const styles = getComputedStyle(document.documentElement);
    const patternColor = styles.getPropertyValue(`--pattern-color-${config.colorIndex}`).trim();
    const strokeColor = styles.getPropertyValue('--pattern-stroke').trim();
    
    // Mouse influence radius
    const mouseInfluenceRadius = 150;
    
    // Render grid pattern
    const spacing = config.spacing;
    const seedOffset = this.seededRandom(this.seed + config.colorIndex * 1000) * 100;
    
    for (let x = -spacing; x < width + spacing * 2; x += spacing) {
      for (let y = -spacing; y < height + spacing * 2; y += spacing) {
        // Base position with parallax
        let baseX = x;
        let baseY = y + parallaxOffset * config.speed;
        
        // Wrap around for infinite scroll
        baseY = ((baseY % (height + spacing * 2)) + (height + spacing * 2)) % (height + spacing * 2);
        
        // Calculate distance from mouse
        const dx = baseX - this.smoothMouseX;
        const dy = baseY - this.smoothMouseY;
        const distanceFromMouse = Math.sqrt(dx * dx + dy * dy);
        
        // Sine wave distortion based on position and time
        const waveX = Math.sin((baseX + seedOffset) * config.waveFrequency + this.time * 0.5) * config.waveAmplitude;
        const waveY = Math.cos((baseY + seedOffset) * config.waveFrequency + this.time * 0.5) * config.waveAmplitude;
        
        // Mouse influence (bend/bloat effect)
        let mouseInfluence = 0;
        if (distanceFromMouse < mouseInfluenceRadius) {
          const influence = 1 - (distanceFromMouse / mouseInfluenceRadius);
          mouseInfluence = influence * influence * 30; // Exponential falloff
          
          // Push particles away from mouse
          const angle = Math.atan2(dy, dx);
          baseX += Math.cos(angle) * mouseInfluence;
          baseY += Math.sin(angle) * mouseInfluence;
        }
        
        // Final position with wave distortion
        const finalX = baseX + waveX;
        const finalY = baseY + waveY;
        
        // Opacity based on mouse proximity (glow effect)
        let opacity = 0.3;
        if (distanceFromMouse < mouseInfluenceRadius) {
          const glow = 1 - (distanceFromMouse / mouseInfluenceRadius);
          opacity = 0.3 + glow * 0.7;
        }
        
        // Draw particle
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = patternColor;
        ctx.beginPath();
        const size = config.particleSize + (mouseInfluence * 0.1);
        ctx.arc(finalX, finalY, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connecting lines (only for layer 1)
        if (layerKey === 'layer1') {
          // Connect to nearby particles
          const connectRadius = spacing * 1.5;
          if (x + spacing < width && y + spacing < height) {
            const nextX = finalX + spacing;
            const nextY = finalY + spacing;
            const distToNext = Math.sqrt(
              Math.pow(nextX - finalX, 2) + Math.pow(nextY - finalY, 2)
            );
            
            if (distToNext < connectRadius) {
              ctx.strokeStyle = strokeColor;
              ctx.globalAlpha = opacity * 0.3;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(finalX, finalY);
              ctx.lineTo(nextX, nextY);
              ctx.stroke();
            }
          }
        }
        
        ctx.restore();
      }
    }
    
    // Draw focal point glow (only for layer 3)
    if (layerKey === 'layer3') {
      const glowSize = 80 + Math.sin(this.time * 2) * 20;
      const gradient = ctx.createRadialGradient(
        this.smoothMouseX,
        this.smoothMouseY,
        0,
        this.smoothMouseX,
        this.smoothMouseY,
        glowSize
      );
      
      gradient.addColorStop(0, patternColor.replace('0.4', '0.6'));
      gradient.addColorStop(0.5, patternColor.replace('0.4', '0.2'));
      gradient.addColorStop(1, patternColor.replace('0.4', '0'));
      
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.smoothMouseX, this.smoothMouseY, glowSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  
  /**
   * Render static composition for reduced motion
   */
  renderStatic() {
    // Render a beautiful static version
    Object.keys(this.canvases).forEach(layerKey => {
      const canvas = this.canvases[layerKey];
      const ctx = this.ctx[layerKey];
      const config = this.layers[layerKey];
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      ctx.clearRect(0, 0, width, height);
      
      const styles = getComputedStyle(document.documentElement);
      const patternColor = styles.getPropertyValue(`--pattern-color-${config.colorIndex}`).trim();
      
      const spacing = config.spacing;
      const seedOffset = this.seededRandom(this.seed + config.colorIndex * 1000) * 100;
      
      // Create a static geometric pattern
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          // Subtle static distortion based on seed
          const staticX = x + Math.sin((x + seedOffset) * 0.01) * 5;
          const staticY = y + Math.cos((y + seedOffset) * 0.01) * 5;
          
          ctx.save();
          ctx.globalAlpha = 0.4;
          ctx.fillStyle = patternColor;
          ctx.beginPath();
          ctx.arc(staticX, staticY, config.particleSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      
      canvas.classList.add('active');
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new GenerativeBackground();
  });
} else {
  new GenerativeBackground();
}

// Add loading class initially
document.body.classList.add('loading');

