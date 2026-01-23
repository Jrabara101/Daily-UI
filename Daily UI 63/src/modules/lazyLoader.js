/**
 * Lazy Loader Module
 * 
 * Implements lazy loading with Intersection Observer and blur-up placeholder technique
 */

export class LazyLoader {
    constructor(options = {}) {
        this.options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01,
            blurUp: true,
            ...options
        };
        
        this.observer = null;
        this.images = [];
        
        this.init();
    }
    
    init() {
        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: load all images immediately
            this.loadAllImages();
            return;
        }
        
        // Create observer
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.options
        );
        
        // Find all images with data-src attribute
        this.images = Array.from(document.querySelectorAll('img[data-src]'));
        
        // Observe each image
        this.images.forEach(img => {
            // Load low-res placeholder first if blur-up is enabled
            if (this.options.blurUp && img.dataset.srcSmall) {
                this.loadPlaceholder(img);
            }
            
            this.observer.observe(img);
        });
    }
    
    /**
     * Load low-res placeholder for blur-up effect
     */
    loadPlaceholder(img) {
        const placeholder = new Image();
        placeholder.onload = () => {
            img.src = placeholder.src;
            img.classList.add('blur-placeholder');
        };
        placeholder.src = img.dataset.srcSmall;
    }
    
    /**
     * Handle intersection observer callbacks
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    /**
     * Load full-resolution image
     */
    loadImage(img) {
        const fullSrc = img.dataset.src;
        if (!fullSrc) return;
        
        // Simulate API delay (optional, for demo purposes)
        const delay = img.dataset.delay ? parseInt(img.dataset.delay) : 0;
        
        setTimeout(() => {
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
                // Fade in the full-res image
                img.src = fullSrc;
                img.classList.remove('blur-placeholder');
                img.classList.add('loaded');
                
                // Remove data attributes
                img.removeAttribute('data-src');
                img.removeAttribute('data-src-small');
            };
            
            imageLoader.onerror = () => {
                console.warn('LazyLoader: Failed to load image', fullSrc);
                img.classList.add('error');
            };
            
            imageLoader.src = fullSrc;
        }, delay);
    }
    
    /**
     * Fallback: load all images immediately
     */
    loadAllImages() {
        this.images.forEach(img => {
            const src = img.dataset.src || img.src;
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
        });
    }
    
    /**
     * Manually trigger loading of an image
     */
    loadImageNow(img) {
        if (this.observer) {
            this.observer.unobserve(img);
        }
        this.loadImage(img);
    }
    
    /**
     * Destroy observer and cleanup
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.images = [];
    }
}


