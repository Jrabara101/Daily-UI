/**
 * Scroll Header Morph Module
 * 
 * Handles the transformation of the profile header into a sticky navigation bar
 * as the user scrolls down the page.
 */

export class ScrollHeaderMorph {
    constructor(headerElement, stickyNavElement) {
        this.header = headerElement;
        this.stickyNav = stickyNavElement;
        this.scrollThreshold = 100; // Pixels to scroll before morphing starts
        this.maxScroll = 300; // Pixels to scroll for full morph
        this.isScrolling = false;
        
        this.init();
    }
    
    init() {
        if (!this.header || !this.stickyNav) {
            console.warn('ScrollHeaderMorph: Missing required elements');
            return;
        }
        
        // Throttle scroll events using requestAnimationFrame
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateScrollState();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', () => this.updateScrollState(), { passive: true });
        
        // Initial state
        this.updateScrollState();
    }
    
    updateScrollState() {
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollProgress = Math.min(
            Math.max((scrollY - this.scrollThreshold) / this.maxScroll, 0),
            1
        );
        
        // Update header height (400px → 60px)
        const headerHeight = 400 - (scrollProgress * 340);
        this.header.style.setProperty('--header-height', `${headerHeight}px`);
        
        // Update blur intensity (0px → 10px)
        const blur = scrollProgress * 10;
        this.header.style.setProperty('--header-blur', `${blur}px`);
        
        // Update opacity (1 → 0.3)
        const opacity = 1 - (scrollProgress * 0.7);
        this.header.style.setProperty('--header-opacity', opacity);
        
        // Update scale (1 → 0.8)
        const scale = 1 - (scrollProgress * 0.2);
        this.header.style.setProperty('--header-scale', scale);
        
        // Show/hide sticky nav
        if (scrollProgress > 0.3) {
            this.stickyNav.classList.add('visible');
        } else {
            this.stickyNav.classList.remove('visible');
        }
        
        // Update sticky nav avatar from profile avatar
        const profileAvatar = document.getElementById('profileAvatar');
        const stickyNavAvatar = document.getElementById('stickyNavAvatar');
        if (profileAvatar && stickyNavAvatar && scrollProgress > 0.3) {
            stickyNavAvatar.src = profileAvatar.src;
        }
    }
    
    /**
     * Get current scroll progress (0-1)
     */
    getScrollProgress() {
        const scrollY = window.scrollY || window.pageYOffset;
        return Math.min(
            Math.max((scrollY - this.scrollThreshold) / this.maxScroll, 0),
            1
        );
    }
}


