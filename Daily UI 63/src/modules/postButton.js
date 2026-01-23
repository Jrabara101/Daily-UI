/**
 * Post Button Module
 * 
 * Handles the compound Post button shape, click detection, and haptic feedback
 */

import { vibrateShort } from '../utils/haptics.js';

export class PostButton {
    constructor(buttonElement) {
        this.button = buttonElement;
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        if (!this.button) {
            console.warn('PostButton: Missing button element');
            return;
        }
        
        // Handle clicks
        this.button.addEventListener('click', (e) => this.handleClick(e));
        
        // Ensure entire shape is clickable (including clipped areas)
        // The clip-path creates a shape, but we want the full button area clickable
        this.setupClickableArea();
    }
    
    /**
     * Setup clickable area to cover entire button shape
     * Since clip-path doesn't affect hit testing, we need to ensure
     * the button's bounding box covers the entire shape
     */
    setupClickableArea() {
        // The button already has the full rectangular area,
        // clip-path only affects visual appearance, not click detection
        // So we're good! But we can add a visual indicator for the clickable area
        this.button.style.cursor = 'pointer';
    }
    
    /**
     * Handle button click
     */
    handleClick(event) {
        // Prevent default if needed
        event.preventDefault();
        event.stopPropagation();
        
        // Don't trigger if already loading
        if (this.isLoading) return;
        
        // Haptic feedback
        vibrateShort();
        
        // Trigger loading state
        this.setLoading(true);
        
        // Simulate async operation (e.g., opening post creation modal)
        setTimeout(() => {
            this.setLoading(false);
            // Here you would typically open a modal or navigate
            console.log('Post button clicked - open post creation');
        }, 1000);
    }
    
    /**
     * Set loading state
     */
    setLoading(loading) {
        this.isLoading = loading;
        
        if (loading) {
            this.button.classList.add('loading');
            this.button.setAttribute('aria-busy', 'true');
            this.button.disabled = true;
        } else {
            this.button.classList.remove('loading');
            this.button.removeAttribute('aria-busy');
            this.button.disabled = false;
        }
    }
    
    /**
     * Check if button is in loading state
     */
    isLoadingState() {
        return this.isLoading;
    }
}


