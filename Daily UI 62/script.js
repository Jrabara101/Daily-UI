/**
 * Daily UI 62 - Dynamic Coupon System
 * Senior Front-end Engineering Implementation
 */

class CouponSystem {
    constructor() {
        this.couponCard = document.getElementById('couponCard');
        this.couponCode = document.getElementById('couponCode');
        this.copyIndicator = document.getElementById('copyIndicator');
        this.couponStatus = document.getElementById('couponStatus');
        this.timerValue = document.getElementById('timerValue');
        this.confettiContainer = document.getElementById('confettiContainer');
        
        this.codeText = 'friends-of-pop';
        this.expirationTime = null;
        this.timerInterval = null;
        this.hasBeenCopied = false;
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the coupon system
     */
    init() {
        this.loadState();
        this.setupEventListeners();
        this.startCountdown();
        
        // Check if already claimed
        if (this.hasBeenCopied) {
            this.markAsClaimed();
        }
    }
    
    /**
     * Load state from localStorage
     */
    loadState() {
        const savedState = localStorage.getItem('coupon_state');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.hasBeenCopied = state.copied || false;
            
            // Set expiration time (24 hours from now by default)
            const savedExpiration = state.expirationTime;
            if (savedExpiration && new Date(savedExpiration) > new Date()) {
                this.expirationTime = new Date(savedExpiration);
            } else {
                // Set expiration to 24 hours from now
                this.expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
                this.saveState();
            }
        } else {
            // First time - set expiration to 24 hours from now
            this.expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
            this.saveState();
        }
    }
    
    /**
     * Save state to localStorage
     */
    saveState() {
        const state = {
            copied: this.hasBeenCopied,
            expirationTime: this.expirationTime ? this.expirationTime.toISOString() : null
        };
        localStorage.setItem('coupon_state', JSON.stringify(state));
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Click handler
        this.couponCard.addEventListener('click', () => this.handleCopy());
        
        // Keyboard support (Enter/Space)
        this.couponCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleCopy();
            }
        });
        
        // Hover effects enhancement
        this.couponCard.addEventListener('mouseenter', () => {
            if (!this.hasBeenCopied && !this.isExpired()) {
                this.couponCard.classList.add('hover-active');
            }
        });
        
        this.couponCard.addEventListener('mouseleave', () => {
            this.couponCard.classList.remove('hover-active');
        });
    }
    
    /**
     * Handle copy functionality
     */
    async handleCopy() {
        // Don't allow copying if expired or already claimed
        if (this.isExpired() || this.hasBeenCopied) {
            return;
        }
        
        try {
            // Try modern clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(this.codeText);
                this.handleCopySuccess();
            } else {
                // Fallback for older browsers
                this.fallbackCopy();
            }
        } catch (err) {
            console.error('Failed to copy:', err);
            this.handleCopyError();
        }
    }
    
    /**
     * Fallback copy method for older browsers
     */
    fallbackCopy() {
        const textArea = document.createElement('textarea');
        textArea.value = this.codeText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.handleCopySuccess();
            } else {
                this.handleCopyError();
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.handleCopyError();
        } finally {
            document.body.removeChild(textArea);
        }
    }
    
    /**
     * Handle successful copy
     */
    handleCopySuccess() {
        // Update state
        this.hasBeenCopied = true;
        this.saveState();
        
        // Visual feedback - change code text
        const originalText = this.couponCode.textContent;
        this.couponCode.textContent = 'COPIED!';
        this.couponCode.style.color = 'var(--success-green)';
        
        // Update copy indicator
        this.copyIndicator.textContent = '✓ Code copied to clipboard!';
        this.copyIndicator.classList.add('copied');
        
        // Show success status
        this.couponStatus.textContent = 'Success! Use this code at checkout.';
        this.couponStatus.classList.add('success');
        
        // Trigger confetti burst
        this.createConfettiBurst();
        
        // Restore text after animation
        setTimeout(() => {
            this.couponCode.textContent = originalText;
            this.couponCode.style.color = '';
            
            // Mark as claimed after animation
            setTimeout(() => {
                this.markAsClaimed();
            }, 500);
        }, 2000);
    }
    
    /**
     * Handle copy error
     */
    handleCopyError() {
        this.couponStatus.textContent = 'Unable to copy. Please try again or copy manually.';
        this.couponStatus.style.color = '#dc3545';
        
        // Auto-hide error message
        setTimeout(() => {
            this.couponStatus.textContent = '';
            this.couponStatus.style.color = '';
        }, 3000);
    }
    
    /**
     * Create confetti burst animation
     */
    createConfettiBurst() {
        const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#17a2b8'];
        const particleCount = 30;
        
        // Get coupon card position for relative positioning
        const couponRect = this.couponCard.getBoundingClientRect();
        const containerRect = this.confettiContainer.getBoundingClientRect();
        
        // Clear any existing confetti
        this.confettiContainer.innerHTML = '';
        
        for (let i = 0; i < particleCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            
            // Random color
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            // Random starting position (center of coupon)
            const startX = 50; // Percentage from center
            const startY = 50; // Percentage from center
            const angle = (Math.random() * 360) * Math.PI / 180;
            const velocity = 150 + Math.random() * 150;
            const delay = Math.random() * 0.3;
            const duration = 1.5 + Math.random() * 1;
            
            confetti.style.left = `${startX}%`;
            confetti.style.top = `${startY}%`;
            
            // Random size
            const size = 6 + Math.random() * 6;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            // Calculate end position based on angle and velocity
            const endX = Math.cos(angle) * velocity;
            const endY = Math.sin(angle) * velocity + velocity * 0.5; // Add some downward bias
            
            confetti.style.setProperty('--end-x', `${endX}px`);
            confetti.style.setProperty('--end-y', `${endY}px`);
            confetti.style.animation = `confettiBurst ${duration}s ${delay}s ease-out forwards`;
            
            this.confettiContainer.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, (duration + delay) * 1000);
        }
    }
    
    /**
     * Start countdown timer
     */
    startCountdown() {
        if (!this.expirationTime) return;
        
        this.updateTimer();
        
        this.timerInterval = setInterval(() => {
            if (this.isExpired()) {
                this.handleExpiration();
                clearInterval(this.timerInterval);
            } else {
                this.updateTimer();
            }
        }, 1000);
    }
    
    /**
     * Update timer display
     */
    updateTimer() {
        if (!this.expirationTime) return;
        
        const now = new Date();
        const diff = this.expirationTime - now;
        
        if (diff <= 0) {
            this.timerValue.textContent = '00:00:00';
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const formatTime = (num) => String(num).padStart(2, '0');
        
        this.timerValue.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    }
    
    /**
     * Check if coupon is expired
     */
    isExpired() {
        if (!this.expirationTime) return false;
        return new Date() >= this.expirationTime;
    }
    
    /**
     * Handle expiration
     */
    handleExpiration() {
        this.couponCard.classList.add('expired');
        this.timerValue.textContent = 'Expired';
        this.couponStatus.textContent = 'This offer has expired.';
        this.couponStatus.style.color = 'var(--text-light)';
        
        // Update aria-label
        this.couponCard.setAttribute('aria-label', 'Expired coupon - no longer available');
        this.couponCard.setAttribute('aria-disabled', 'true');
    }
    
    /**
     * Mark coupon as claimed
     */
    markAsClaimed() {
        this.couponCard.classList.add('claimed');
        this.couponCard.setAttribute('aria-label', 'Coupon code already claimed');
        this.couponCard.setAttribute('aria-disabled', 'true');
        this.copyIndicator.textContent = 'Already claimed';
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new CouponSystem();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Any cleanup if needed
});

