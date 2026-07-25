/**
 * Lumina News Portal - Advanced JavaScript Implementation
 * Features: Multi-column Grid Layout, Category Filtering, Live Search, View Toggle, Shadow Polling, FLIP Animations, Lazy Loading
 */

class LuminaNewsWidget {
    constructor() {
        this.feed = document.getElementById('news-feed');
        this.breakingNewsContainer = document.getElementById('breaking-news');
        this.tickerContent = document.getElementById('ticker-content');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.refreshBtn = document.getElementById('refresh-btn');
        this.searchInput = document.getElementById('search-input');
        this.gridViewBtn = document.getElementById('grid-view-btn');
        this.listViewBtn = document.getElementById('list-view-btn');
        this.categoryPills = document.getElementById('category-pills');
        this.feedCount = document.getElementById('feed-count');
        this.sectionTitle = document.getElementById('section-title');
        this.trendingList = document.getElementById('trending-list');
        this.currentDateEl = document.getElementById('current-date');
        
        // State management
        this.newsItems = new Map(); // All fetched items
        this.filteredItems = []; // Active filtered subset
        this.visibleCards = new Set(); // Track visible elements
        this.recycledCards = []; // Recycled pool
        this.pollingInterval = null;
        this.expandedCardId = null;
        this.currentCategory = 'all';
        this.currentSearchQuery = '';
        this.currentViewMode = 'grid'; // 'grid' or 'list'
        
        // Configuration
        this.config = {
            pollInterval: 30000,
            maxVisibleCards: 25,
            enableRecycling: true,
            enableLazyLoading: true
        };
        
        // Observers
        this.imageObserver = null;
        this.cardObserver = null;
        
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        this.updateDate();
        this.setupEventListeners();
        this.setupIntersectionObservers();
        this.loadInitialNews();
        this.startPolling();
        this.restoreExpandedState();
        
        window.addEventListener('hashchange', () => this.restoreExpandedState());
    }

    /**
     * Update formatted date in header
     */
    updateDate() {
        if (!this.currentDateEl) return;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        this.currentDateEl.textContent = new Date().toLocaleDateString('en-US', options);
    }
    
    /**
     * Setup event listeners for controls, filters, search, and interactions
     */
    setupEventListeners() {
        // Refresh
        if (this.refreshBtn) {
            this.refreshBtn.addEventListener('click', () => this.refreshNews());
        }
        
        // Search Input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.currentSearchQuery = e.target.value.trim().toLowerCase();
                this.applyFilters();
            });
        }
        
        // View Switcher (Grid vs List)
        if (this.gridViewBtn && this.listViewBtn) {
            this.gridViewBtn.addEventListener('click', () => this.setViewMode('grid'));
            this.listViewBtn.addEventListener('click', () => this.setViewMode('list'));
        }
        
        // Category Pills Filter
        if (this.categoryPills) {
            this.categoryPills.addEventListener('click', (e) => {
                const pill = e.target.closest('.category-pill');
                if (pill) {
                    this.categoryPills.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    this.currentCategory = pill.dataset.category || 'all';
                    this.applyFilters();
                }
            });
        }
        
        // Card interactions (expansion & action buttons)
        this.feed.addEventListener('click', (e) => {
            const card = e.target.closest('.news-card');
            if (card) {
                const cardId = card.dataset.id;
                if (e.target.closest('.action-icon')) {
                    this.handleActionClick(e, card);
                } else if (e.target.closest('.read-more-btn') || e.target.closest('.card-headline') || e.target.closest('.card-thumbnail-container')) {
                    this.toggleCardExpansion(card, cardId);
                }
            }
        });
    }
    
    /**
     * Switch view mode between grid and list
     */
    setViewMode(mode) {
        this.currentViewMode = mode;
        if (mode === 'grid') {
            this.feed.classList.remove('list-view');
            this.feed.classList.add('grid-view');
            this.gridViewBtn.classList.add('active');
            this.listViewBtn.classList.remove('active');
        } else {
            this.feed.classList.remove('grid-view');
            this.feed.classList.add('list-view');
            this.listViewBtn.classList.add('active');
            this.gridViewBtn.classList.remove('active');
        }
    }

    /**
     * Setup Intersection Observers for lazy loading & DOM recycling
     */
    setupIntersectionObservers() {
        if (this.config.enableLazyLoading) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.imageObserver.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '100px' });
        }
        
        if (this.config.enableRecycling) {
            this.cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const card = entry.target;
                    const cardId = card.dataset.id;
                    if (entry.isIntersecting) {
                        this.visibleCards.add(cardId);
                    } else {
                        this.visibleCards.delete(cardId);
                    }
                });
            }, { root: this.feed, rootMargin: '200px' });
        }
    }
    
    /**
     * Load initial mock news feed
     */
    async loadInitialNews() {
        this.showLoading();
        try {
            const newsData = await this.fetchNews();
            
            // Populate Map
            this.newsItems.clear();
            newsData.forEach(item => this.newsItems.set(item.id, item));
            
            this.renderTrendingStories(newsData.slice(0, 5));
            this.updateBreakingNews(newsData.filter(item => item.priority === 'breaking'));
            this.applyFilters();
        } catch (error) {
            console.error('Failed to load news:', error);
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Filter stories based on Category and Search Query
     */
    applyFilters() {
        const allStories = Array.from(this.newsItems.values());
        
        this.filteredItems = allStories.filter(story => {
            // Category match
            const categoryMatch = (this.currentCategory === 'all') || (story.category === this.currentCategory);
            
            // Search query match
            const queryMatch = !this.currentSearchQuery || 
                story.headline.toLowerCase().includes(this.currentSearchQuery) || 
                story.summary.toLowerCase().includes(this.currentSearchQuery) ||
                story.source.toLowerCase().includes(this.currentSearchQuery);
                
            return categoryMatch && queryMatch;
        });

        // Update Section Title & Count
        if (this.feedCount) {
            this.feedCount.textContent = `${this.filteredItems.length} Stories`;
        }
        
        if (this.sectionTitle) {
            if (this.currentCategory === 'all') {
                this.sectionTitle.textContent = this.currentSearchQuery ? `Search Results for "${this.currentSearchQuery}"` : 'Top Headlines & Feature Stories';
            } else {
                const categoryNames = {
                    technology: 'Technology News',
                    ai: 'AI & Quantum Computing',
                    space: 'Space & Deep Science',
                    business: 'Business & Global Markets',
                    climate: 'Energy & Climate Solutions'
                };
                this.sectionTitle.textContent = categoryNames[this.currentCategory] || 'Filtered News';
            }
        }
        
        this.renderNewsFeed(this.filteredItems);
    }
    
    /**
     * Render news feed
     */
    renderNewsFeed(items) {
        this.feed.innerHTML = '';
        this.visibleCards.clear();
        
        if (items.length === 0) {
            this.feed.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                    <p style="font-size: 40px; margin-bottom: 12px;">🔍</p>
                    <h3 style="font-size: 18px; font-weight: 600; color: var(--text-primary);">No stories found</h3>
                    <p style="font-size: 13px; margin-top: 4px;">Try searching for a different keyword or category.</p>
                </div>
            `;
            return;
        }

        // Render first item as Hero story if category is 'all' and no active search filter
        const isDefaultFeed = (this.currentCategory === 'all' && !this.currentSearchQuery);

        items.forEach((story, index) => {
            const isHero = isDefaultFeed && (index === 0);
            const card = this.createStoryCard(story, isHero);
            this.feed.appendChild(card);
            this.observeCard(card);
            this.visibleCards.add(story.id);
        });
    }

    /**
     * Render sidebar trending stories
     */
    renderTrendingStories(trendingStories) {
        if (!this.trendingList) return;
        
        this.trendingList.innerHTML = trendingStories.map((story, idx) => `
            <li class="trending-item" data-id="${story.id}">
                <span class="trending-rank">0${idx + 1}</span>
                <div class="trending-info">
                    <h4 class="trending-headline">${this.escapeHtml(story.headline)}</h4>
                    <div class="trending-meta">${this.escapeHtml(story.source)} • ${story.readTime}</div>
                </div>
            </li>
        `).join('');

        this.trendingList.querySelectorAll('.trending-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                const card = this.feed.querySelector(`[data-id="${id}"]`);
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    this.expandCard(card, id);
                }
            });
        });
    }

    /**
     * Create individual story card element
     */
    createStoryCard(story, isHero = false) {
        const card = document.createElement('article');
        card.className = `news-card ${isHero ? 'hero-story' : ''}`;
        card.setAttribute('role', 'article');
        card.setAttribute('tabindex', '0');
        card.dataset.id = story.id;
        card.dataset.sentiment = story.sentiment || 'neutral';
        
        const categoryLabels = {
            technology: 'TECH',
            ai: 'AI & QUANTUM',
            space: 'SPACE',
            business: 'MARKETS',
            climate: 'CLIMATE'
        };

        const categoryTag = categoryLabels[story.category] || 'NEWS';
        const priorityTag = story.priority === 'breaking' ? '<span class="badge-tag priority-breaking">BREAKING</span>' : '';

        const cardHTML = `
            <div class="card-thumbnail-container">
                <div class="card-badge-bar">
                    ${priorityTag}
                    <span class="badge-tag">${categoryTag}</span>
                </div>
                <img 
                    class="card-thumbnail loading" 
                    data-src="${story.thumbnail}"
                    alt="${this.escapeHtml(story.headline)}"
                    loading="lazy"
                >
                <div class="thumbnail-placeholder">📰</div>
            </div>
            
            <div class="card-content">
                <h3 class="card-headline">${this.escapeHtml(story.headline)}</h3>
                <p class="card-summary">${this.escapeHtml(story.summary)}</p>
                
                <div class="card-meta">
                    <span class="meta-source">${this.escapeHtml(story.source)}</span>
                    <span class="meta-divider"></span>
                    <span class="meta-time">${this.formatTime(story.timestamp)}</span>
                    <span class="meta-divider"></span>
                    <span class="meta-read-time">⏱️ ${story.readTime || '3 min read'}</span>
                </div>

                <div class="card-expanded-content">
                    <div class="expanded-body">
                        ${story.body}
                    </div>
                    ${story.relatedStories && story.relatedStories.length > 0 ? `
                        <div class="related-stories">
                            <div class="related-stories-title">Related Editorial Coverage</div>
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
                    <div class="action-buttons-group">
                        <button class="action-icon" aria-label="Like story" data-action="like" title="Like">
                            <span>❤️</span>
                        </button>
                        <button class="action-icon" aria-label="Bookmark story" data-action="bookmark" title="Bookmark">
                            <span>🔖</span>
                        </button>
                        <button class="action-icon" aria-label="Share story" data-action="share" title="Share">
                            <span>📤</span>
                        </button>
                    </div>
                    <button class="read-more-btn" aria-label="Expand story">
                        <span>Read Full Story</span>
                        <span>↓</span>
                    </button>
                </div>
            </div>
        `;
        
        card.innerHTML = cardHTML;

        // Lazy load thumbnail image
        const thumbnail = card.querySelector('.card-thumbnail');
        if (thumbnail && this.imageObserver) {
            this.imageObserver.observe(thumbnail);
        } else if (thumbnail) {
            this.loadImage(thumbnail);
        }
        
        return card;
    }

    /**
     * Load image with smooth transition
     */
    async loadImage(imgElement) {
        const src = imgElement.dataset.src;
        if (!src) return;
        
        const placeholder = imgElement.nextElementSibling;
        
        const image = new Image();
        image.onload = () => {
            imgElement.src = src;
            imgElement.classList.remove('loading');
            imgElement.classList.add('loaded');
            if (placeholder) placeholder.style.display = 'none';
        };
        image.onerror = () => {
            if (placeholder) placeholder.style.display = 'flex';
        };
        image.src = src;
    }

    /**
     * Observe card
     */
    observeCard(card) {
        if (this.cardObserver) {
            this.cardObserver.observe(card);
        }
    }
    
    /**
     * Toggle card expansion with smooth FLIP animation
     */
    toggleCardExpansion(card, cardId) {
        const isExpanded = card.classList.contains('expanded');
        if (isExpanded) {
            this.collapseCard(card, cardId);
        } else {
            this.expandCard(card, cardId);
        }
    }

    expandCard(card, cardId) {
        const first = card.getBoundingClientRect();
        card.classList.add('expanded');
        
        const readBtn = card.querySelector('.read-more-btn span:last-child');
        if (readBtn) readBtn.textContent = '↑';

        const last = card.getBoundingClientRect();
        const deltaY = first.top - last.top;
        
        card.style.transform = `translateY(${deltaY}px)`;
        
        requestAnimationFrame(() => {
            card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = 'translateY(0)';
            setTimeout(() => {
                card.style.transition = '';
                card.style.transform = '';
            }, 400);
        });

        this.expandedCardId = cardId;
        this.updateURLHash(cardId);
    }
    
    collapseCard(card, cardId) {
        card.classList.remove('expanded');
        const readBtn = card.querySelector('.read-more-btn span:last-child');
        if (readBtn) readBtn.textContent = '↓';
        this.expandedCardId = null;
        this.updateURLHash(null);
    }

    updateURLHash(cardId) {
        if (cardId) {
            window.location.hash = `news-item-${cardId}`;
        } else {
            if (window.location.hash.startsWith('#news-item-')) {
                history.replaceState(null, '', window.location.pathname);
            }
        }
    }

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
     * Action button handlers
     */
    handleActionClick(e, card) {
        const actionBtn = e.target.closest('.action-icon');
        if (!actionBtn) return;
        
        const action = actionBtn.dataset.action;
        const cardId = card.dataset.id;
        
        switch (action) {
            case 'like':
                actionBtn.classList.toggle('liked');
                break;
            case 'bookmark':
                actionBtn.classList.toggle('bookmarked');
                break;
            case 'share':
                this.shareStory(cardId);
                break;
        }
        
        this.createParticleBurst(actionBtn);
    }

    shareStory(cardId) {
        const story = this.newsItems.get(cardId);
        if (story && navigator.share) {
            navigator.share({
                title: story.headline,
                text: story.summary,
                url: window.location.href + `#news-item-${cardId}`
            }).catch(() => {});
        } else if (story) {
            navigator.clipboard.writeText(window.location.href + `#news-item-${cardId}`);
            alert('Article link copied to clipboard!');
        }
    }

    createParticleBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const color = getComputedStyle(element).color;
        
        const particleCount = 8;
        const burst = document.createElement('div');
        burst.className = 'particle-burst';
        burst.style.left = `${centerX}px`;
        burst.style.top = `${centerY}px`;
        
        document.body.appendChild(burst);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 25 + Math.random() * 15;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.color = color;
            
            burst.appendChild(particle);
        }
        
        setTimeout(() => burst.remove(), 600);
    }

    updateBreakingNews(breakingStories) {
        if (!this.breakingNewsContainer || !this.tickerContent) return;
        
        if (breakingStories.length === 0) {
            this.breakingNewsContainer.style.display = 'none';
            return;
        }
        
        this.breakingNewsContainer.style.display = 'flex';
        const tickerItems = breakingStories.map(story => 
            `<span class="ticker-item">🔴 <strong>${this.escapeHtml(story.headline)}</strong> — ${this.escapeHtml(story.summary)}</span>`
        ).join(' &nbsp;&nbsp;•&nbsp;&nbsp; ');
        
        this.tickerContent.innerHTML = tickerItems + ' &nbsp;&nbsp;•&nbsp;&nbsp; ' + tickerItems;
    }

    /**
     * Background Shadow Polling
     */
    startPolling() {
        this.pollingInterval = setInterval(async () => {
            try {
                const newsData = await this.fetchNews();
                let updated = false;
                newsData.forEach(story => {
                    if (!this.newsItems.has(story.id)) {
                        this.newsItems.set(story.id, story);
                        updated = true;
                    }
                });
                if (updated) {
                    this.applyFilters();
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, this.config.pollInterval);
    }

    async refreshNews() {
        if (this.refreshBtn) {
            this.refreshBtn.style.transform = 'rotate(360deg)';
            this.refreshBtn.style.transition = 'transform 0.6s ease';
        }
        await this.loadInitialNews();
        setTimeout(() => {
            if (this.refreshBtn) {
                this.refreshBtn.style.transform = '';
                this.refreshBtn.style.transition = '';
            }
        }, 600);
    }

    async fetchNews() {
        await new Promise(resolve => setTimeout(resolve, 400));
        return this.generateMockNews();
    }

    generateMockNews() {
        const categories = ['technology', 'ai', 'space', 'business', 'climate'];
        const sources = ['TechCrunch', 'The Verge', 'Wired', 'Ars Technica', 'MIT Tech Review', 'Bloomberg'];
        const sentiments = ['positive', 'urgent', 'neutral', 'positive'];
        const priorities = ['breaking', 'normal', 'normal', 'urgent'];
        const readTimes = ['3 min read', '5 min read', '4 min read', '6 min read'];

        const curatedStories = [
            {
                headline: 'Next-Gen Quantum Processor Achieves Fault-Tolerant Logical Qubits',
                category: 'ai',
                source: 'MIT Tech Review',
                summary: 'Researchers have demonstrated quantum error correction with a physical threshold error rate below 0.1%, paving the way for commercial scale quantum supremacy.',
                thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
                body: `<p>In a historic breakthrough for quantum physics and computer science, engineering teams have successfully maintained 100 fault-tolerant logical qubits simultaneously. The architecture utilizes topological error correcting codes that dramatically lower decoherence.</p><p>This achievement accelerates quantum drug discovery, cryptographic security validation, and complex climate modeling by several decades.</p>`
            },
            {
                headline: 'Global Clean Energy Investment Surpasses $2.5 Trillion in 2026',
                category: 'climate',
                source: 'Bloomberg',
                summary: 'Solar efficiency gains combined with next-gen solid state grid batteries drive unprecedented global capital allocation towards zero-emission infrastructure.',
                thumbnail: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
                body: `<p>Annual clean energy investments have reached a record high. Accelerated adoption of perovskite tandem solar panels has reduced gigawatt deployment costs by 42% over the last eighteen months.</p><p>Grid operators report record high reliability metrics across major continental power networks.</p>`
            },
            {
                headline: 'Autonomous Deep Space Probe Transmits High-Res Imagery of Europa Sub-Surface Oceans',
                category: 'space',
                source: 'Wired',
                summary: 'NASA’s autonomous exploration orbiter has deployed cryo-penetrating radar, revealing liquid thermal vents under Jupiter’s icy moon.',
                thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
                body: `<p>Data transmitted across 600 million kilometers confirms active hydrothermal venting beneath Europa’s 15km ice crust. Spectroscopy instruments detected organic carbon compounds and chemical gradients capable of supporting chemoautotrophic life.</p>`
            },
            {
                headline: 'Autonomous AI Agents Reshape Enterprise Software Architecture',
                category: 'technology',
                source: 'TechCrunch',
                summary: 'Multi-agent frameworks now orchestrate full-stack software development pipelines from natural language prompts with verified unit testing and automated security audits.',
                thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                body: `<p>The shift towards agentic workflow engines is transforming software engineering paradigms. Enterprise IT teams report a 10x velocity increase in feature delivery while maintaining zero-trust architecture compliance.</p>`
            },
            {
                headline: 'Semiconductor Foundry Unveils Sub-1nm Gate-All-Around Transistor Architecture',
                category: 'technology',
                source: 'Ars Technica',
                summary: 'Extreme Ultraviolet (EUV) lithography breakthroughs enable 0.7nm chip fabrication with 35% higher energy efficiency.',
                thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
                body: `<p>Mass production of sub-nanometer chips is scheduled to begin early next quarter. The ribbon FET design allows ultra-dense 3D stacking of logic cores and high-bandwidth memory (HBM4).</p>`
            },
            {
                headline: 'Global Tech Index Rallies to Record Highs Amid Strong Earnings',
                category: 'business',
                source: 'The Verge',
                summary: 'Strong demand for AI infrastructure and cloud computing drives historic quarterly revenue across leading technology conglomerates.',
                thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
                body: `<p>Surging cloud revenue and hardware deployments fueled a market rally across NASDAQ and international exchanges, with capital expenditure in datacenter infrastructure hitting record levels.</p>`
            }
        ];

        const news = [];
        const now = Date.now();

        for (let i = 0; i < 18; i++) {
            const template = curatedStories[i % curatedStories.length];
            const id = `story-${now}-${i}`;
            const priority = (i === 0) ? 'breaking' : priorities[i % priorities.length];
            const sentiment = sentiments[i % sentiments.length];
            const timestamp = new Date(now - i * 45 * 60000);

            news.push({
                id,
                headline: i < curatedStories.length ? template.headline : `${template.headline} — Vol. ${i + 1}`,
                category: template.category,
                source: template.source,
                summary: template.summary,
                thumbnail: `${template.thumbnail}`,
                body: template.body,
                timestamp: timestamp.toISOString(),
                priority,
                sentiment,
                readTime: readTimes[i % readTimes.length],
                relatedStories: [
                    {
                        headline: `Analysis: The Long-Term Impact of ${template.headline.slice(0, 30)}...`,
                        source: template.source,
                        timestamp: new Date(timestamp.getTime() - 1800000).toISOString()
                    }
                ]
            });
        }
        
        return news;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMins = Math.floor((now - date) / 60000);
        const diffHours = Math.floor((now - date) / 3600000);
        
        if (diffMins < 2) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        if (this.loadingIndicator) this.loadingIndicator.classList.add('active');
    }
    
    hideLoading() {
        if (this.loadingIndicator) this.loadingIndicator.classList.remove('active');
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.luminaNews = new LuminaNewsWidget();
    });
} else {
    window.luminaNews = new LuminaNewsWidget();
}
