/**
 * Interactive Media Grid Module
 * 
 * Handles 3D lift animation on long-press/hover and context menu display
 */

export class MediaGrid {
    constructor(gridElement, contextMenuElement) {
        this.grid = gridElement;
        this.contextMenu = contextMenuElement;
        this.longPressDelay = 500; // ms
        this.longPressTimer = null;
        this.currentLiftedItem = null;
        this.touchStartTime = 0;
        
        this.init();
    }
    
    init() {
        if (!this.grid) {
            console.warn('MediaGrid: Missing grid element');
            return;
        }
        
        // Add event listeners to all media items
        this.grid.addEventListener('mousedown', (e) => this.handlePressStart(e));
        this.grid.addEventListener('mouseup', (e) => this.handlePressEnd(e));
        this.grid.addEventListener('mouseleave', () => this.handlePressEnd());
        
        // Touch events
        this.grid.addEventListener('touchstart', (e) => this.handlePressStart(e), { passive: true });
        this.grid.addEventListener('touchend', (e) => this.handlePressEnd(e));
        this.grid.addEventListener('touchcancel', () => this.handlePressEnd());
        
        // Hover for desktop
        this.grid.addEventListener('mouseenter', (e) => {
            if (e.target.classList.contains('media-item')) {
                e.target.style.willChange = 'transform';
            }
        }, true);
        
        this.grid.addEventListener('mouseleave', (e) => {
            if (e.target.classList.contains('media-item')) {
                e.target.style.willChange = 'auto';
            }
        }, true);
        
        // Close context menu on click outside
        document.addEventListener('click', (e) => {
            if (!this.contextMenu.contains(e.target) && 
                !e.target.closest('.media-item')) {
                this.hideContextMenu();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideContextMenu();
            }
        });
    }
    
    /**
     * Handle press start (mouse or touch)
     */
    handlePressStart(e) {
        const mediaItem = e.target.closest('.media-item');
        if (!mediaItem) return;
        
        // Prevent default to avoid text selection
        e.preventDefault();
        
        this.touchStartTime = Date.now();
        this.currentLiftedItem = mediaItem;
        
        // Start long-press timer
        this.longPressTimer = setTimeout(() => {
            this.handleLongPress(mediaItem, e);
        }, this.longPressDelay);
        
        // Add visual feedback
        mediaItem.style.willChange = 'transform';
    }
    
    /**
     * Handle press end (mouse or touch)
     */
    handlePressEnd(e) {
        // Clear long-press timer
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
        
        // If it was a short press, trigger normal click
        if (this.currentLiftedItem && Date.now() - this.touchStartTime < this.longPressDelay) {
            this.handleShortPress(this.currentLiftedItem, e);
        }
        
        // Reset lifted state after animation
        if (this.currentLiftedItem) {
            setTimeout(() => {
                if (this.currentLiftedItem) {
                    this.currentLiftedItem.classList.remove('lifted');
                    this.currentLiftedItem.style.willChange = 'auto';
                }
            }, 200);
        }
        
        this.currentLiftedItem = null;
    }
    
    /**
     * Handle long press - show 3D lift and context menu
     */
    handleLongPress(mediaItem, event) {
        // Add lifted class for 3D animation
        mediaItem.classList.add('lifted');
        
        // Show context menu
        this.showContextMenu(mediaItem, event);
    }
    
    /**
     * Handle short press - normal click behavior
     */
    handleShortPress(mediaItem, event) {
        // Could trigger a lightbox or navigation here
        console.log('Short press on media item');
    }
    
    /**
     * Show context menu at event position
     */
    showContextMenu(mediaItem, event) {
        if (!this.contextMenu) return;
        
        // Get position
        const rect = mediaItem.getBoundingClientRect();
        const x = event.clientX || (event.touches && event.touches[0].clientX) || rect.left + rect.width / 2;
        const y = event.clientY || (event.touches && event.touches[0].clientY) || rect.top + rect.height / 2;
        
        // Position menu
        this.contextMenu.style.left = `${x}px`;
        this.contextMenu.style.top = `${y}px`;
        
        // Adjust if menu goes off screen
        const menuRect = this.contextMenu.getBoundingClientRect();
        if (x + menuRect.width > window.innerWidth) {
            this.contextMenu.style.left = `${window.innerWidth - menuRect.width - 10}px`;
        }
        if (y + menuRect.height > window.innerHeight) {
            this.contextMenu.style.top = `${y - menuRect.height - 10}px`;
        }
        
        // Show menu
        this.contextMenu.classList.add('visible');
        this.contextMenu.setAttribute('aria-hidden', 'false');
        
        // Store reference to the item that triggered the menu
        this.contextMenu.dataset.itemId = mediaItem.dataset.id || '';
    }
    
    /**
     * Hide context menu
     */
    hideContextMenu() {
        if (!this.contextMenu) return;
        
        this.contextMenu.classList.remove('visible');
        this.contextMenu.setAttribute('aria-hidden', 'true');
        
        // Remove lifted state from all items
        this.grid.querySelectorAll('.media-item.lifted').forEach(item => {
            item.classList.remove('lifted');
            item.style.willChange = 'auto';
        });
    }
    
    /**
     * Add media items to grid
     */
    addMediaItems(items) {
        if (!this.grid) return;
        
        items.forEach((item, index) => {
            const mediaItem = this.createMediaItem(item, index);
            this.grid.appendChild(mediaItem);
        });
    }
    
    /**
     * Create a media item element
     */
    createMediaItem(item, index) {
        const div = document.createElement('div');
        div.className = 'media-item';
        div.dataset.id = item.id || index;
        
        const img = document.createElement('img');
        img.src = item.placeholder || item.src;
        img.alt = item.alt || `Media item ${index + 1}`;
        img.loading = 'lazy';
        
        // Set up lazy loading
        if (item.src) {
            img.dataset.src = item.src;
            if (item.thumbnail) {
                img.dataset.srcSmall = item.thumbnail;
            }
        }
        
        div.appendChild(img);
        
        // Add overlay icons if specified
        if (item.overlayIcons) {
            const overlay = document.createElement('div');
            overlay.className = 'media-overlay';
            item.overlayIcons.forEach(icon => {
                const iconEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                iconEl.className = 'media-overlay-icon';
                iconEl.setAttribute('viewBox', '0 0 24 24');
                iconEl.setAttribute('fill', 'none');
                iconEl.setAttribute('stroke', 'currentColor');
                iconEl.setAttribute('stroke-width', '2');
                // Add icon path here based on icon type
                overlay.appendChild(iconEl);
            });
            div.appendChild(overlay);
        }
        
        return div;
    }
}

