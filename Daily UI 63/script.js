/**
 * Nova - The Immersive Creator Hub
 * Main JavaScript Entry Point
 * 
 * Integrates all modules and initializes the application
 */

import { ScrollHeaderMorph } from './src/modules/scrollHeader.js';
import { ColorExtraction } from './src/modules/colorExtraction.js';
import { MediaGrid } from './src/modules/mediaGrid.js';
import { SupporterScroll } from './src/modules/supporterScroll.js';
import { LazyLoader } from './src/modules/lazyLoader.js';
import { PostButton } from './src/modules/postButton.js';
import { SupportButton } from './src/modules/supportButton.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    // Get DOM elements
    const profileHeader = document.getElementById('profileHeader');
    const stickyNav = document.getElementById('stickyNav');
    const profileBannerImage = document.getElementById('profileBannerImage');
    const profileText = document.getElementById('profileText');
    const mediaGrid = document.getElementById('mediaGrid');
    const contextMenu = document.getElementById('contextMenu');
    const supporterLogos = document.querySelector('.supporter-logos');
    const supporterCount = document.getElementById('supporterCount');
    const postButton = document.getElementById('postButton');
    const supportButton = document.getElementById('btnSupport');
    
    // Initialize Scroll Header Morph
    if (profileHeader && stickyNav) {
        new ScrollHeaderMorph(profileHeader, stickyNav);
    }
    
    // Initialize Color Extraction
    if (profileBannerImage && profileText) {
        new ColorExtraction(profileBannerImage, profileText);
    }
    
    // Initialize Media Grid
    if (mediaGrid && contextMenu) {
        const mediaGridInstance = new MediaGrid(mediaGrid, contextMenu);
        
        // Add media items with placeholder images
        const mediaItems = generateMediaItems();
        mediaGridInstance.addMediaItems(mediaItems);
    }
    
    // Initialize Supporter Scroll
    if (supporterLogos && supporterCount) {
        new SupporterScroll(supporterLogos, supporterCount);
    }
    
    // Initialize Lazy Loader
    const lazyLoader = new LazyLoader({
        rootMargin: '50px',
        threshold: 0.01,
        blurUp: true
    });
    
    // Initialize Post Button
    if (postButton) {
        new PostButton(postButton);
    }
    
    // Initialize Support Button
    if (supportButton) {
        new SupportButton(supportButton);
    }
    
    // Setup tab navigation
    setupTabNavigation();
    
    // Setup context menu actions
    setupContextMenu(contextMenu);
}

/**
 * Generate media items with placeholder images
 */
function generateMediaItems() {
    const baseUrl = 'https://picsum.photos/seed/';
    const items = [];
    
    // Generate 12 media items
    for (let i = 1; i <= 12; i++) {
        const seed = `nova-${i}`;
        const size = 400;
        
        items.push({
            id: `media-${i}`,
            src: `${baseUrl}${seed}/${size}/${size}`,
            thumbnail: `${baseUrl}${seed}/100/100`, // Low-res for blur-up
            alt: `Creator content ${i}`,
            placeholder: `${baseUrl}${seed}/100/100`,
            overlayIcons: i === 1 ? ['arrow'] : i === 3 ? ['globe'] : [] // Add overlay icons to some items
        });
    }
    
    return items;
}

/**
 * Setup tab navigation
 */
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            
            // Get tab type
            const tabType = button.dataset.tab;
            
            // Filter media grid based on tab (if needed)
            console.log(`Switched to ${tabType} tab`);
            // You could implement filtering logic here
        });
    });
}

/**
 * Setup context menu actions
 */
function setupContextMenu(contextMenu) {
    if (!contextMenu) return;
    
    const menuItems = contextMenu.querySelectorAll('.context-menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const action = item.textContent.trim();
            const itemId = contextMenu.dataset.itemId;
            
            console.log(`Context menu action: ${action} on item ${itemId}`);
            
            // Handle different actions
            switch (action) {
                case 'View':
                    // Open lightbox or navigate to detail page
                    break;
                case 'Share':
                    // Open share dialog
                    break;
                case 'Download':
                    // Trigger download
                    break;
                case 'Delete':
                    // Show confirmation and delete
                    break;
            }
            
            // Hide menu after action
            contextMenu.classList.remove('visible');
            contextMenu.setAttribute('aria-hidden', 'true');
        });
    });
}

// Export for potential use in other modules
export { initApp };

