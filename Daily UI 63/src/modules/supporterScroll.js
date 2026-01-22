/**
 * Supporter Scroll Module
 * 
 * Implements infinite horizontal scroll for brand logos with pause on interaction
 */

export class SupporterScroll {
    constructor(logosContainer, supporterCountElement) {
        this.container = logosContainer;
        this.supporterCount = supporterCountElement;
        this.isPaused = false;
        this.animationDuration = 20; // seconds
        this.scrollPosition = 0;
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.warn('SupporterScroll: Missing container element');
            return;
        }
        
        // Duplicate logos for seamless infinite scroll
        this.duplicateLogos();
        
        // Setup pause on interaction
        this.setupPauseHandlers();
        
        // Start animation
        this.startAnimation();
    }
    
    /**
     * Duplicate logos for infinite scroll effect
     */
    duplicateLogos() {
        if (!this.container) return;
        
        const logos = Array.from(this.container.children);
        const totalWidth = logos.reduce((sum, logo) => {
            return sum + logo.offsetWidth + parseInt(getComputedStyle(logo).marginRight || 0);
        }, 0);
        
        // Clone all logos
        logos.forEach(logo => {
            const clone = logo.cloneNode(true);
            this.container.appendChild(clone);
        });
        
        // Set container width to accommodate both sets
        this.container.style.width = `${totalWidth * 2}px`;
    }
    
    /**
     * Setup pause handlers for supporter count interaction
     */
    setupPauseHandlers() {
        if (!this.supporterCount) return;
        
        // Pause on hover
        this.supporterCount.addEventListener('mouseenter', () => {
            this.pause();
        });
        
        this.supporterCount.addEventListener('mouseleave', () => {
            this.resume();
        });
        
        // Pause on touch (mobile)
        this.supporterCount.addEventListener('touchstart', () => {
            this.pause();
        }, { passive: true });
        
        this.supporterCount.addEventListener('touchend', () => {
            // Resume after a delay
            setTimeout(() => this.resume(), 1000);
        });
        
        // Pause on click
        this.supporterCount.addEventListener('click', () => {
            this.pause();
            setTimeout(() => this.resume(), 2000);
        });
    }
    
    /**
     * Start CSS animation
     */
    startAnimation() {
        if (!this.container) return;
        
        // Use CSS animation for smooth performance
        // Animation is already defined in CSS, just ensure it's running
        this.container.style.animation = `scrollLogos ${this.animationDuration}s linear infinite`;
    }
    
    /**
     * Pause animation
     */
    pause() {
        if (this.isPaused) return;
        
        this.isPaused = true;
        this.container.classList.add('paused');
        this.container.style.animationPlayState = 'paused';
    }
    
    /**
     * Resume animation
     */
    resume() {
        if (!this.isPaused) return;
        
        this.isPaused = false;
        this.container.classList.remove('paused');
        this.container.style.animationPlayState = 'running';
    }
    
    /**
     * Toggle pause state
     */
    togglePause() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }
    
    /**
     * Update animation duration
     */
    setDuration(seconds) {
        this.animationDuration = seconds;
        if (!this.isPaused) {
            this.startAnimation();
        }
    }
}

