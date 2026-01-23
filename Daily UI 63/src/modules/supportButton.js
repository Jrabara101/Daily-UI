/**
 * Support Button Module
 * 
 * Handles Support button state management (loading → thank you) without layout shift
 */

export class SupportButton {
    constructor(buttonElement) {
        this.button = buttonElement;
        this.isLoading = false;
        this.isSupported = false;
        this.originalText = '';
        
        this.init();
    }
    
    init() {
        if (!this.button) {
            console.warn('SupportButton: Missing button element');
            return;
        }
        
        // Store original text
        const textElement = this.button.querySelector('.btn-text');
        if (textElement) {
            this.originalText = textElement.textContent;
        }
        
        // Handle click
        this.button.addEventListener('click', (e) => this.handleClick(e));
    }
    
    /**
     * Handle button click
     */
    async handleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Don't allow multiple clicks
        if (this.isLoading || this.isSupported) return;
        
        // Set loading state
        this.setLoading(true);
        
        // Simulate API call
        try {
            await this.simulateSupportAction();
            
            // Set success state
            this.setSuccess();
            
            // Update supporter count (increment by 1)
            this.updateSupporterCount();
            
        } catch (error) {
            console.error('SupportButton: Error supporting creator', error);
            this.setError();
        }
    }
    
    /**
     * Simulate async support action
     */
    simulateSupportAction() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1500); // Simulate network delay
        });
    }
    
    /**
     * Set loading state
     */
    setLoading(loading) {
        this.isLoading = loading;
        
        if (loading) {
            this.button.classList.add('loading');
            this.button.disabled = true;
            this.button.setAttribute('aria-busy', 'true');
            
            // Prevent layout shift by maintaining button dimensions
            // The button already has fixed padding, so no shift should occur
        } else {
            this.button.classList.remove('loading');
            this.button.removeAttribute('aria-busy');
        }
    }
    
    /**
     * Set success state
     */
    setSuccess() {
        this.isLoading = false;
        this.isSupported = true;
        
        this.button.classList.remove('loading');
        this.button.classList.add('success');
        this.button.disabled = false;
        this.button.setAttribute('aria-label', 'Thank you for your support!');
        
        // After showing "Thank You" for a few seconds, optionally reset
        setTimeout(() => {
            // Keep the success state, but could reset if needed
            // this.reset();
        }, 3000);
    }
    
    /**
     * Set error state
     */
    setError() {
        this.isLoading = false;
        this.button.classList.remove('loading');
        this.button.disabled = false;
        this.button.removeAttribute('aria-busy');
        
        // Show error message briefly
        const textElement = this.button.querySelector('.btn-text');
        if (textElement) {
            const originalText = textElement.textContent;
            textElement.textContent = 'Error';
            
            setTimeout(() => {
                textElement.textContent = originalText;
            }, 2000);
        }
    }
    
    /**
     * Reset button to initial state
     */
    reset() {
        this.isLoading = false;
        this.isSupported = false;
        this.button.classList.remove('loading', 'success');
        this.button.disabled = false;
        this.button.removeAttribute('aria-busy');
        this.button.setAttribute('aria-label', 'Support this creator');
        
        const textElement = this.button.querySelector('.btn-text');
        if (textElement) {
            textElement.textContent = this.originalText;
        }
    }
    
    /**
     * Update supporter count
     */
    updateSupporterCount() {
        const supporterNumber = document.querySelector('.supporter-number');
        if (supporterNumber) {
            const currentCount = parseInt(supporterNumber.textContent.replace(/,/g, '')) || 0;
            const newCount = currentCount + 1;
            supporterNumber.textContent = newCount.toLocaleString();
        }
    }
}


