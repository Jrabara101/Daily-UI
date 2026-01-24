/**
 * Lumina News Widget - Advanced JavaScript Implementation
 * Features: Shadow Polling, FLIP Animations, DOM Recycling, URL Syncing, Lazy Loading
 */

class LuminaNewsWidget {
    constructor() {
        this.feed = document.getElementById('news-feed');
        this.breakingNewsContainer = document.getElementById('breaking-news');
        this.tickerContent = document.getElementById('ticker-content');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.refreshBtn = document.getElementById('refresh-btn');
        
        // State management
        this.newsItems = new Map(); // Track all news items by ID
        this.visibleCards = new Set(); // Track visible card elements
        this.recycledCards = []; // Pool of recycled DOM elements
        this.pollingInterval = null;
        this.lastUpdateTime = null;
        this.expandedCardId = null;
        
        // Configuration
        this.config = {
            pollInterval: 30000, // 30 seconds
            maxVisibleCards: 15, // Maximum cards in DOM
            apiEndpoint: 'https://newsapi.org/v2/top-headlines', // Mock endpoint
            apiKey: 'demo', // In production, use environment variable
            enableRecycling: true,
            enableLazyLoading: true
        };
        
        // Intersection Observer for lazy loading
        this.imageObserver = null;
        this.cardObserver = null;
        
        this.init();
    }
    
    /**
     * Initialize the widget
     */
    init() {
        this.setupEventListeners();
        this.setupIntersectionObservers();
        this.loadInitialNews();
        this.startPolling();
        this.restoreExpandedState();
        
        // Handle URL hash changes
        window.addEventListener('hashchange', () => this.restoreExpandedState());
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        this.refreshBtn.addEventListener('click', () => this.refreshNews());
        
        // Handle card clicks for expansion
        this.feed.addEventListener('click', (e) => {
            const card = e.target.closest('.news-card');
            if (card) {
                const cardId = card.dataset.id;
                if (e.target.closest('.action-icon')) {
                    this.handleActionClick(e, card);
                } else {
                    this.toggleCardExpansion(card, cardId);
                }
            }
        });
    }
    
    /**
     * Setup Intersection Observers for lazy loading and DOM recycling
     */
    setupIntersectionObservers() {
        // Image lazy loading observer
        if (this.config.enableLazyLoading) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px'
            });
        }
        
        // Card visibility observer for DOM recycling
        if (this.config.enableRecycling) {
            this.cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const card = entry.target;
                    const cardId = card.dataset.id;
                    
                    if (entry.isIntersecting) {
                        this.visibleCards.add(cardId);
                    } else {
                        this.visibleCards.delete(cardId);
                        // Recycle off-screen cards if we have too many
                        if (this.visibleCards.size > this.config.maxVisibleCards) {
                            this.recycleOffScreenCards();
                        }
                    }
                });
            }, {
                root: this.feed,
                rootMargin: '100px'
            });
        }
    }
    
    /**
     * Load initial news feed
     */
    async loadInitialNews() {
        this.showLoading();
        try {
            const newsData = await this.fetchNews();
            this.renderNewsFeed(newsData);
            this.updateBreakingNews(newsData.filter(item => item.priority === 'breaking'));
        } catch (error) {
            console.error('Failed to load news:', error);
            this.showError('Failed to load news. Please try again.');
        } finally {
            this.hideLoading();
        }
    }
    
    /**
     * Shadow Polling Engine - Background service for news updates
     */
    startPolling() {
        this.pollingInterval = setInterval(async () => {
            try {
                const newsData = await this.fetchNews();
                this.processNewStories(newsData);
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, this.config.pollInterval);
    }
    
    /**
     * Process new stories and inject high-priority items
     */
    processNewStories(newsData) {
        const existingIds = new Set(Array.from(this.newsItems.keys()));
        const newStories = newsData.filter(item => !existingIds.has(item.id));
        
        // Sort by priority: breaking > urgent > high > normal
        const priorityOrder = { breaking: 0, urgent: 1, high: 2, normal: 3 };
        newStories.sort((a, b) => {
            return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
        });
        
        // Inject high-priority stories at the top
        newStories.forEach(story => {
            if (story.priority === 'breaking' || story.priority === 'urgent') {
                this.injectNewStory(story);
                this.updateBreakingNews([story]);
            } else {
                // Add to end of feed
                this.addStoryToFeed(story, false);
            }
        });
    }
    
    /**
     * Inject new story with smooth animation (FLIP technique)
     */
    injectNewStory(storyData) {
        const newCard = this.createStoryCard(storyData);
        
        // FLIP Animation: First (initial state)
        newCard.classList.add('story-entering');
        this.feed.insertBefore(newCard, this.feed.firstChild);
        
        // Force reflow
        void newCard.offsetHeight;
        
        // FLIP Animation: Last, Invert, Play
        requestAnimationFrame(() => {
            newCard.classList.remove('story-entering');
            newCard.classList.add('story-active');
            
            // Shift existing cards down smoothly
            const existingCards = Array.from(this.feed.children).slice(1);
            existingCards.forEach((card, index) => {
                if (card !== newCard) {
                    card.style.transition = 'transform 0.3s ease-out';
                    card.style.transform = 'translateY(0)';
                }
            });
        });
        
        // Observe for lazy loading and recycling
        this.observeCard(newCard);
        
        // Store in state
        this.newsItems.set(storyData.id, { data: storyData, element: newCard });
        this.visibleCards.add(storyData.id);
    }
    
    /**
     * Add story to feed (at top or bottom)
     */
    addStoryToFeed(storyData, prepend = true) {
        const card = this.createStoryCard(storyData);
        
        if (prepend) {
            this.feed.insertBefore(card, this.feed.firstChild);
        } else {
            this.feed.appendChild(card);
        }
        
        this.observeCard(card);
        this.newsItems.set(storyData.id, { data: storyData, element: card });
        this.visibleCards.add(storyData.id);
    }
    
    /**
     * Render entire news feed
     */
    renderNewsFeed(newsData) {
        // Clear existing feed
        this.feed.innerHTML = '';
        this.newsItems.clear();
        this.visibleCards.clear();
        
        // Sort by priority and timestamp
        const sortedNews = newsData.sort((a, b) => {
            const priorityOrder = { breaking: 0, urgent: 1, high: 2, normal: 3 };
            const priorityDiff = (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
            if (priorityDiff !== 0) return priorityDiff;
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
        
        sortedNews.forEach(story => {
            this.addStoryToFeed(story, false);
        });
    }
    
    /**
     * Create a news card DOM element
     */
    createStoryCard(story) {
        // Try to reuse a recycled card
        let card = this.recycledCards.pop();
        
        if (!card) {
            card = document.createElement('article');
            card.className = 'news-card';
            card.setAttribute('role', 'article');
            card.setAttribute('tabindex', '0');
        } else {
            // Clear previous content
            card.innerHTML = '';
            card.className = 'news-card';
        }
        
        card.dataset.id = story.id;
        card.dataset.sentiment = story.sentiment || 'neutral';
        
        // Calculate adaptive font size based on headline length
        const headlineLength = story.headline.length;
        const fontSize = this.calculateAdaptiveFontSize(headlineLength);
        const lineHeight = this.calculateAdaptiveLineHeight(headlineLength);
        
        const cardHTML = `
            <div class="card-content">
                <div class="card-header">
                    <div class="card-thumbnail-container" style="position: relative; width: 80px; height: 80px;">
                        <img 
                            class="card-thumbnail loading" 
                            data-src="${story.thumbnail || this.getPlaceholderImage()}"
                            alt="${story.headline}"
                            loading="lazy"
                            style="display: none;"
                        >
                        <div class="thumbnail-placeholder">📰</div>
                    </div>
                    <div class="card-text-content">
                        <h3 class="card-headline" style="font-size: ${fontSize}; line-height: ${lineHeight}">
                            ${this.escapeHtml(story.headline)}
                        </h3>
                        <div class="card-meta">
                            <span class="meta-source">${this.escapeHtml(story.source)}</span>
                            <span class="meta-divider"></span>
                            <span class="meta-time">${this.formatTime(story.timestamp)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="card-expanded-content">
                    <div class="expanded-body">
                        ${story.body || story.summary || ''}
                    </div>
                    ${story.relatedStories && story.relatedStories.length > 0 ? `
                        <div class="related-stories">
                            <div class="related-stories-title">Related Stories</div>
                            <div class="related-stories-scroll">
                                ${story.relatedStories.map(related => `
                                    <div class="related-story-item">
                                        <div class="related-story-headline">${this.escapeHtml(related.headline)}</div>
                                        <div class="related-story-meta">${this.escapeHtml(related.source)} • ${this.formatTime(related.timestamp)}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="card-actions">
                    <button class="action-icon" aria-label="Like" data-action="like">
                        <span>❤️</span>
                    </button>
                    <button class="action-icon" aria-label="Bookmark" data-action="bookmark">
                        <span>🔖</span>
                    </button>
                    <button class="action-icon" aria-label="Share" data-action="share">
                        <span>📤</span>
                    </button>
                </div>
            </div>
        `;
        
        card.innerHTML = cardHTML;
        
        // Setup lazy loading for thumbnail
        const thumbnail = card.querySelector('.card-thumbnail');
        if (thumbnail && this.config.enableLazyLoading) {
            this.imageObserver.observe(thumbnail);
        } else if (thumbnail) {
            this.loadImage(thumbnail);
        }
        
        return card;
    }
    
    /**
     * Calculate adaptive font size based on headline length
     */
    calculateAdaptiveFontSize(length) {
        // Use clamp() for responsive sizing
        // Shorter headlines get larger font, longer get smaller
        if (length < 50) {
            return 'clamp(15px, 2.5vw, 17px)';
        } else if (length < 100) {
            return 'clamp(14px, 2.5vw, 16px)';
        } else {
            return 'clamp(13px, 2.5vw, 15px)';
        }
    }
    
    /**
     * Calculate adaptive line height based on headline length
     */
    calculateAdaptiveLineHeight(length) {
        if (length < 50) {
            return '1.3';
        } else if (length < 100) {
            return '1.4';
        } else {
            return '1.5';
        }
    }
    
    /**
     * Load image with blur-up effect
     */
    async loadImage(imgElement) {
        const src = imgElement.dataset.src;
        if (!src) return;
        
        const placeholder = imgElement.nextElementSibling;
        
        try {
            // Load the actual image
            const image = new Image();
            image.onload = () => {
                imgElement.src = src;
                imgElement.style.display = 'block';
                imgElement.classList.remove('loading');
                imgElement.classList.add('loaded');
                if (placeholder) placeholder.style.display = 'none';
            };
            image.onerror = () => {
                imgElement.style.display = 'none';
                if (placeholder) placeholder.style.display = 'flex';
            };
            image.src = src;
        } catch (error) {
            console.error('Image load error:', error);
            if (placeholder) placeholder.style.display = 'flex';
        }
    }
    
    /**
     * Generate a tiny blurred base64 placeholder
     */
    generateBlurPlaceholder() {
        // In production, use a proper blur placeholder service
        // For demo, return a simple data URI
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMWEyMzMyIi8+PC9zdmc+';
    }
    
    /**
     * Get placeholder image URL
     */
    getPlaceholderImage() {
        return `https://picsum.photos/80/80?random=${Math.random()}`;
    }
    
    /**
     * Observe card for lazy loading and recycling
     */
    observeCard(card) {
        if (this.cardObserver) {
            this.cardObserver.observe(card);
        }
        
        const thumbnail = card.querySelector('.card-thumbnail');
        if (thumbnail && this.imageObserver) {
            this.imageObserver.observe(thumbnail);
        }
    }
    
    /**
     * Recycle off-screen cards to save memory
     */
    recycleOffScreenCards() {
        const allCards = Array.from(this.feed.children);
        const cardsToRecycle = allCards.filter(card => {
            const cardId = card.dataset.id;
            return !this.visibleCards.has(cardId) && cardId !== this.expandedCardId;
        });
        
        cardsToRecycle.forEach(card => {
            const cardId = card.dataset.id;
            this.cardObserver.unobserve(card);
            
            // Remove from DOM but keep in pool
            card.remove();
            this.recycledCards.push(card);
            
            // Clean up observers
            const thumbnail = card.querySelector('.card-thumbnail');
            if (thumbnail && this.imageObserver) {
                this.imageObserver.unobserve(thumbnail);
            }
        });
    }
    
    /**
     * Toggle card expansion with FLIP animation
     */
    toggleCardExpansion(card, cardId) {
        const isExpanded = card.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse
            this.collapseCard(card, cardId);
        } else {
            // Expand - use FLIP technique
            this.expandCard(card, cardId);
        }
    }
    
    /**
     * Expand card with FLIP animation
     */
    expandCard(card, cardId) {
        // FLIP: First - get initial position and size
        const first = card.getBoundingClientRect();
        
        // Add expanded class
        card.classList.add('expanded');
        
        // FLIP: Last - get final position and size
        const last = card.getBoundingClientRect();
        
        // FLIP: Invert - calculate the difference
        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;
        const deltaW = first.width / last.width;
        const deltaH = first.height / last.height;
        
        // Apply inverse transform
        card.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
        card.style.transformOrigin = 'top left';
        
        // FLIP: Play - animate to final state
        requestAnimationFrame(() => {
            card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = 'translate(0, 0) scale(1, 1)';
            
            // Clean up after animation
            setTimeout(() => {
                card.style.transition = '';
                card.style.transform = '';
                card.style.transformOrigin = '';
            }, 400);
        });
        
        this.expandedCardId = cardId;
        this.updateURLHash(cardId);
        
        // Scroll into view if needed
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    /**
     * Collapse card
     */
    collapseCard(card, cardId) {
        card.classList.remove('expanded');
        this.expandedCardId = null;
        this.updateURLHash(null);
    }
    
    /**
     * Update URL hash for context syncing
     */
    updateURLHash(cardId) {
        if (cardId) {
            window.location.hash = `news-item-${cardId}`;
        } else {
            if (window.location.hash.startsWith('#news-item-')) {
                history.replaceState(null, '', window.location.pathname);
            }
        }
    }
    
    /**
     * Restore expanded state from URL hash
     */
    restoreExpandedState() {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#news-item-')) {
            const cardId = hash.replace('#news-item-', '');
            const card = this.feed.querySelector(`[data-id="${cardId}"]`);
            if (card && !card.classList.contains('expanded')) {
                this.expandCard(card, cardId);
            }
        }
    }
    
    /**
     * Handle action button clicks (like, bookmark, share)
     */
    handleActionClick(e, card) {
        const actionBtn = e.target.closest('.action-icon');
        if (!actionBtn) return;
        
        const action = actionBtn.dataset.action;
        const cardId = card.dataset.id;
        
        switch (action) {
            case 'like':
                this.toggleLike(actionBtn, cardId);
                break;
            case 'bookmark':
                this.toggleBookmark(actionBtn, cardId);
                break;
            case 'share':
                this.shareStory(cardId);
                break;
        }
        
        // Trigger particle burst
        this.createParticleBurst(actionBtn);
    }
    
    /**
     * Toggle like state
     */
    toggleLike(btn, cardId) {
        const isLiked = btn.classList.contains('liked');
        if (isLiked) {
            btn.classList.remove('liked');
        } else {
            btn.classList.add('liked');
        }
    }
    
    /**
     * Toggle bookmark state
     */
    toggleBookmark(btn, cardId) {
        const isBookmarked = btn.classList.contains('bookmarked');
        if (isBookmarked) {
            btn.classList.remove('bookmarked');
        } else {
            btn.classList.add('bookmarked');
        }
    }
    
    /**
     * Share story
     */
    shareStory(cardId) {
        const story = this.newsItems.get(cardId);
        if (story && navigator.share) {
            navigator.share({
                title: story.data.headline,
                text: story.data.summary,
                url: window.location.href + `#news-item-${cardId}`
            }).catch(err => console.log('Share failed:', err));
        }
    }
    
    /**
     * Create particle burst effect
     */
    createParticleBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const color = getComputedStyle(element).color;
        
        const particleCount = 8;
        const burst = document.createElement('div');
        burst.className = 'particle-burst';
        burst.style.position = 'fixed';
        burst.style.left = `${centerX}px`;
        burst.style.top = `${centerY}px`;
        burst.style.pointerEvents = 'none';
        burst.style.zIndex = '10000';
        
        document.body.appendChild(burst);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 30 + Math.random() * 20;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.color = color;
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.transform = 'translate(-50%, -50%)';
            
            burst.appendChild(particle);
        }
        
        setTimeout(() => {
            burst.remove();
        }, 600);
    }
    
    /**
     * Update breaking news ticker
     */
    updateBreakingNews(breakingStories) {
        if (breakingStories.length === 0) {
            this.breakingNewsContainer.style.display = 'none';
            return;
        }
        
        this.breakingNewsContainer.style.display = 'flex';
        const tickerItems = breakingStories.map(story => 
            `<span class="ticker-item">${this.escapeHtml(story.headline)}</span>`
        ).join('');
        
        // Duplicate for seamless loop
        this.tickerContent.innerHTML = tickerItems + tickerItems;
    }
    
    /**
     * Refresh news feed
     */
    async refreshNews() {
        this.refreshBtn.style.animation = 'spin 0.6s linear';
        try {
            const newsData = await this.fetchNews();
            this.renderNewsFeed(newsData);
            this.updateBreakingNews(newsData.filter(item => item.priority === 'breaking'));
        } catch (error) {
            console.error('Refresh failed:', error);
        } finally {
            setTimeout(() => {
                this.refreshBtn.style.animation = '';
            }, 600);
        }
    }
    
    /**
     * Fetch news from API (mock implementation)
     */
    async fetchNews() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock news data
        return this.generateMockNews();
    }
    
    /**
     * Generate mock news data for demonstration
     */
    generateMockNews() {
        const sources = ['TechCrunch', 'The Verge', 'Wired', 'Ars Technica', 'Engadget'];
        const sentiments = ['positive', 'negative', 'neutral', 'urgent'];
        const priorities = ['breaking', 'urgent', 'high', 'normal'];
        
        const news = [];
        const now = Date.now();
        
        for (let i = 0; i < 20; i++) {
            const id = `news-${now}-${i}`;
            const priority = priorities[Math.floor(Math.random() * priorities.length)];
            const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
            const source = sources[Math.floor(Math.random() * sources.length)];
            const timestamp = new Date(now - i * 60000 * (5 + Math.random() * 10));
            
            const headlines = [
                'Revolutionary AI Model Breaks Language Barriers',
                'Quantum Computing Breakthrough Achieves New Milestone',
                'Sustainable Energy Solutions Transform Industry',
                'Cybersecurity Experts Warn of New Threats',
                'Space Exploration Reaches Historic Achievement',
                'Biotech Innovation Promises Medical Breakthrough',
                'Climate Technology Shows Promising Results',
                'Digital Transformation Accelerates Across Sectors',
                'Renewable Energy Adoption Hits Record High',
                'Tech Giants Announce Major Partnership'
            ];
            
            const headline = headlines[Math.floor(Math.random() * headlines.length)];
            
            news.push({
                id,
                headline: `${headline} - Part ${i + 1}`,
                source,
                timestamp: timestamp.toISOString(),
                priority,
                sentiment,
                thumbnail: `https://picsum.photos/80/80?random=${i}`,
                summary: `This is a detailed summary of the news story about ${headline.toLowerCase()}. The story covers important developments and implications for the industry.`,
                body: `<p>This is the full body content of the news article. It provides comprehensive details about the topic, including background information, current developments, and future implications.</p><p>The story continues with additional context and analysis from industry experts and stakeholders.</p>`,
                relatedStories: i % 3 === 0 ? [
                    {
                        headline: `Related: ${headlines[(i + 1) % headlines.length]}`,
                        source: sources[(i + 1) % sources.length],
                        timestamp: new Date(timestamp.getTime() - 3600000).toISOString()
                    }
                ] : []
            });
        }
        
        return news;
    }
    
    /**
     * Format timestamp to relative time
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    }
    
    /**
     * Show loading indicator
     */
    showLoading() {
        this.loadingIndicator.classList.add('active');
    }
    
    /**
     * Hide loading indicator
     */
    hideLoading() {
        this.loadingIndicator.classList.remove('active');
    }
    
    /**
     * Show error message
     */
    showError(message) {
        // Simple error display - can be enhanced
        console.error(message);
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Cleanup on destroy
     */
    destroy() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
        if (this.cardObserver) {
            this.cardObserver.disconnect();
        }
    }
}

// Initialize widget when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.luminaNews = new LuminaNewsWidget();
    });
} else {
    window.luminaNews = new LuminaNewsWidget();
}

