/**
 * Stellar Flow — The Anticipatory Loading Engine
 * 
 * Core Logic:
 * 1. ContentHydrator: Manages the transition from Skeleton -> Content.
 * 2. LoadingManager: Enforces minimum wait times (300ms) to prevent jarring flashes.
 * 3. ConnectionAwareness: Adapts animations based on network speed (4G vs 3G).
 */

class ContentHydrator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.itemsToReveal = document.querySelectorAll('.staggered-item');
    }

    /**
     * Morph the skeletons into real content.
     * In a real app, this would accept a data object and bind it to the DOM.
     * Here, we simulate the transition by removing skeleton classes and adding text.
     */
    hydrate(data) {
        // 1. Mark container as ready (CSS hook)
        this.container.classList.remove('app-loading');
        this.container.classList.add('content-ready');
        this.container.setAttribute('aria-busy', 'false');

        // 2. Populate Data (Simulated)
        this.injectMockData(data);

        // 3. Trigger Staggered Animation with RequestAnimationFrame for smoothness
        requestAnimationFrame(() => {
            this.container.classList.add('is-loaded');
        });
    }

    injectMockData(data) {
        // Helper to safely set text content
        const setContent = (selector, text) => {
            const el = this.container.querySelector(selector);
            if (el) {
                el.classList.remove('skeleton', 'circle', 'large', 'small');
                el.removeAttribute('aria-hidden');
                // Remove shimmer pseudo-element styles effectively by removing the class
                // In a real app we might replace the element entirely
                el.style.width = 'auto'; // Reset forced widths
                el.style.height = 'auto';
                el.textContent = text;
            }
        };

        // Sidebar
        setContent('.user-profile', 'Slava K.');
        const navItems = this.container.querySelectorAll('.nav-links .nav-item');
        const labels = ['Dashboard', 'My Tasks', 'Calendar', 'Reports'];
        navItems.forEach((el, i) => {
            el.classList.remove('skeleton');
            el.removeAttribute('aria-hidden');
            el.style.width = 'auto';
            el.innerHTML = `<span style="opacity:0.8">${labels[i] || 'Link'}</span>`;
        });

        // Header
        const search = this.container.querySelector('.search-bar');
        search.classList.remove('skeleton');
        search.removeAttribute('aria-hidden');
        search.innerHTML = `<input type="text" placeholder="Search..." style="background:transparent;border:none;color:white;width:100%">`;

        // Stats
        const cards = this.container.querySelectorAll('.stats-row .card');

        // Card 1
        if (cards[0]) {
            const header = cards[0].querySelector('.card-header');
            header.classList.remove('skeleton');
            header.removeAttribute('aria-hidden');
            header.textContent = 'Total Tasks';

            const value = cards[0].querySelector('.card-value');
            value.classList.remove('skeleton');
            value.removeAttribute('aria-hidden');
            value.innerHTML = '<span style="font-size:2rem;font-weight:bold">128</span>';
        }

        // Efficiency Gauge (Mock)
        if (cards[1]) {
            const header = cards[1].querySelector('.card-header');
            header.classList.remove('skeleton');
            header.removeAttribute('aria-hidden');
            header.textContent = 'Ui Efficiency';

            const gauge = cards[1].querySelector('.gauge-area .skeleton');
            gauge.classList.remove('skeleton', 'circle');
            gauge.removeAttribute('aria-hidden');
            gauge.style.background = 'conic-gradient(var(--primary-color) 75%, #ffffff10 0)';
            gauge.style.borderRadius = '50%';
        }

    }
}

class LoadingManager {
    constructor() {
        this.minDuration = 300; // ms
        this.startTime = 0;
        this.hydrator = new ContentHydrator('app-container');
        this.initNetworkCheck();
        this.initButtonLoader();
    }

    startLoading() {
        this.startTime = Date.now();
        // aria-busy is already true in HTML, but good to enforce
        document.getElementById('app-container').setAttribute('aria-busy', 'true');

        // Simulate API Request
        this.mockApiCall().then((data) => {
            this.handleDataReady(data);
        });
    }

    mockApiCall() {
        return new Promise(resolve => {
            // Randomize fetching time: 50ms (fast) to 1500ms (slow)
            const randomDelay = Math.floor(Math.random() * 1500) + 50;
            console.log(`[Network] Network latency simulated: ${randomDelay}ms`);

            setTimeout(() => {
                resolve({ user: 'Slava', stats: [12, 45, 99] });
            }, randomDelay);
        });
    }

    handleDataReady(data) {
        const elapsed = Date.now() - this.startTime;
        const remaining = this.minDuration - elapsed;

        if (remaining > 0) {
            console.log(`[UX] Data arrived too fast (${elapsed}ms). Waiting ${remaining}ms to prevent flash.`);
            setTimeout(() => {
                this.hydrator.hydrate(data);
            }, remaining);
        } else {
            console.log(`[UX] Data took ${elapsed}ms. Hydrating immediately.`);
            this.hydrator.hydrate(data);
        }
    }

    initNetworkCheck() {
        // Connection API
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            this.updateConnectionStatus(connection);
            connection.addEventListener('change', () => this.updateConnectionStatus(connection));
        }
    }

    updateConnectionStatus(connection) {
        const type = connection.effectiveType; // 'slow-2g', '2g', '3g', '4g'
        console.log(`[Network] Connection Type: ${type}`);

        const container = document.getElementById('app-container');
        if (type === 'slow-2g' || type === '2g' || type === '3g') {
            document.body.classList.add('low-bandwidth');
            console.log('[UX] Low bandwidth mode active: Switching to blur/pulse');
        } else {
            document.body.classList.remove('low-bandwidth');
        }
    }

    initButtonLoader() {
        const btn = document.getElementById('post-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('loading')) return;

                // Add Loading State
                btn.classList.add('loading');
                btn.setAttribute('aria-label', 'Posting...');

                // Simulate action
                setTimeout(() => {
                    btn.classList.remove('loading');
                    btn.setAttribute('aria-label', 'Post');
                    // Maybe show a success toast here
                }, 2000);
            });
        }
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    const app = new LoadingManager();
    app.startLoading();
});
