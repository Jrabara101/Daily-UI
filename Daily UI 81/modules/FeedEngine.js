import { MediaEngine } from './MediaEngine.js';

/**
 * FeedEngine — Stream Architecture, Filtering, Threaded Replies, and Network Latency Simulation
 */
export class FeedEngine {
    constructor(soundEngine, blockRegistry, reactionEngine, storageEngine) {
        this.soundEngine = soundEngine;
        this.blockRegistry = blockRegistry;
        this.reactionEngine = reactionEngine;
        this.storageEngine = storageEngine;

        this.feed = document.getElementById('feedStream');
        this.composer = document.querySelector('.composer-container');
        this.unreadBanner = document.getElementById('unreadStreamBanner');
        this.unreadCountSpan = document.getElementById('unreadCountText');

        this.posts = [];
        this.unreadCount = 0;
        this.currentFilter = 'all'; // 'all', 'tasks', 'polls', 'media', 'code', or '#tag'
        this.searchQuery = '';
        this.networkProfile = 'fast4g'; // 'instant', 'fast4g', 'slow3g', 'offline'
        this.offlineQueue = [];
    }

    init(initialPosts = []) {
        this.posts = initialPosts;
        this.renderFeed();

        if (this.unreadBanner) {
            this.unreadBanner.addEventListener('click', () => {
                this.revealUnread();
            });
        }
    }

    setNetworkProfile(profile) {
        this.networkProfile = profile;
        if (profile !== 'offline' && this.offlineQueue.length > 0) {
            // Flush offline queue
            const queued = [...this.offlineQueue];
            this.offlineQueue = [];
            queued.forEach(q => this.post(q.content, q.imageUrls, q.user, q.mood));
        }
    }

    setFilter(filterType) {
        this.currentFilter = filterType;
        this.renderFeed();
    }

    setSearchQuery(query) {
        this.searchQuery = query.toLowerCase().trim();
        this.renderFeed();
    }

    post(content, imageUrls = [], user, mood) {
        const postId = 'post_' + Math.random().toString(36).substr(2, 9);
        const postObj = {
            id: postId,
            user: user || {
                name: 'Alex Rivera',
                handle: '@alex',
                role: 'Staff Systems Architect',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            },
            mood: mood || {
                icon: '🧠',
                label: 'Deep Work',
                dotColor: '#a855f7'
            },
            content,
            imageUrls: imageUrls || [],
            timestamp: 'Just now',
            reactions: { '❤️': 0, '🚀': 1, '🔥': 0, '💡': 0, '👏': 0 },
            replies: [],
            isOptimistic: true
        };

        if (this.networkProfile === 'offline') {
            this.offlineQueue.push(postObj);
            postObj.offlineQueued = true;
        }

        // 1. Add post to state
        this.posts.unshift(postObj);
        this.storageEngine.savePosts(this.posts);

        // 2. Animate Flying Composer Card
        this.animateComposer();
        this.soundEngine && this.soundEngine.publishWhoosh();

        // 3. Render feed
        this.renderFeed();

        // 4. Simulate Network Latency
        let latencyMs = 250;
        if (this.networkProfile === 'instant') latencyMs = 30;
        else if (this.networkProfile === 'slow3g') latencyMs = 1200;
        else if (this.networkProfile === 'offline') latencyMs = 0;

        if (this.networkProfile !== 'offline') {
            setTimeout(() => {
                postObj.isOptimistic = false;
                this.renderFeed();
                this.soundEngine && this.soundEngine.keyTap();
            }, latencyMs);
        }
    }

    injectSimulatedPost(data) {
        const postId = 'post_sim_' + Math.random().toString(36).substr(2, 9);
        const postObj = {
            id: postId,
            user: data.user,
            mood: {
                icon: data.user.moodIcon || '⚡',
                label: data.user.moodLabel || 'Active',
                dotColor: '#10b981'
            },
            content: data.content,
            imageUrls: data.media || [],
            timestamp: 'Just now',
            reactions: data.reactions || { '🚀': 2, '❤️': 1 },
            replies: [],
            isOptimistic: false
        };

        // Attach poll if defined
        if (data.poll) {
            postObj.content += this.blockRegistry.createPollTemplate(data.poll.question, data.poll.options);
        }
        // Attach tasks if defined
        if (data.tasks) {
            postObj.content += this.blockRegistry.createTaskTemplate(data.tasks);
        }
        // Attach code if defined
        if (data.codeSnippet) {
            postObj.content += this.blockRegistry.createCodeTemplate(data.codeSnippet.lang, data.codeSnippet.code);
        }

        // Add to unread stack
        this.posts.unshift(postObj);
        this.unreadCount += 1;
        this.updateUnreadBanner();
        this.storageEngine.savePosts(this.posts);
    }

    updateUnreadBanner() {
        if (!this.unreadBanner || !this.unreadCountSpan) return;
        if (this.unreadCount > 0) {
            this.unreadCountSpan.textContent = `${this.unreadCount} new team pulse${this.unreadCount > 1 ? 's' : ''}`;
            this.unreadBanner.classList.remove('hidden');
        } else {
            this.unreadBanner.classList.add('hidden');
        }
    }

    revealUnread() {
        this.unreadCount = 0;
        this.updateUnreadBanner();
        this.renderFeed();
        this.soundEngine && this.soundEngine.menuPop();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderFeed() {
        if (!this.feed) return;

        // Apply filters & search
        const filtered = this.posts.filter(post => {
            const text = (post.content || '').toLowerCase();
            const author = (post.user.name || '').toLowerCase();

            // Search query match
            if (this.searchQuery && !text.includes(this.searchQuery) && !author.includes(this.searchQuery)) {
                return false;
            }

            // Category filter match
            if (this.currentFilter === 'all') return true;
            if (this.currentFilter === 'tasks') return text.includes('interactive-task-widget') || text.includes('task');
            if (this.currentFilter === 'polls') return text.includes('interactive-poll-widget') || text.includes('poll');
            if (this.currentFilter === 'code') return text.includes('interactive-code-widget') || text.includes('code');
            if (this.currentFilter === 'media') return post.imageUrls && post.imageUrls.length > 0;
            if (this.currentFilter.startsWith('#')) return text.includes(this.currentFilter.toLowerCase());

            return true;
        });

        if (filtered.length === 0) {
            this.feed.innerHTML = `
                <div class="empty-feed-state">
                    <div class="empty-icon">📡</div>
                    <div class="empty-title">No context pulses found</div>
                    <div class="empty-subtitle">Try adjusting your filter or publish a new status update above.</div>
                </div>
            `;
            return;
        }

        this.feed.innerHTML = filtered.map(post => this.renderPostCard(post)).join('');

        // Bind interactive elements
        this.blockRegistry.bindInteractions(this.feed);
        this.reactionEngine.bindReactions(this.feed);
        this.bindPostInteractions(this.feed);
    }

    renderPostCard(post) {
        const isOpt = post.isOptimistic;
        const isOffline = post.offlineQueued;
        const mediaHtml = MediaEngine.renderFeedMediaGrid(post.imageUrls);

        return `
            <article class="feed-post ${isOpt ? 'optimistic' : ''} ${isOffline ? 'offline-queued' : ''}" data-post-id="${post.id}">
                ${isOpt ? `
                    <div class="optimistic-banner">
                        <span class="pulse-loader-dot"></span>
                        <span>${isOffline ? 'Queued Offline — Will sync automatically' : 'Publishing to stream...'}</span>
                    </div>
                ` : ''}

                <div class="post-header-row">
                    <div class="post-author-info">
                        <img src="${post.user.avatar}" alt="${post.user.name}" class="post-avatar-img">
                        <div class="post-meta-col">
                            <div class="post-name-row">
                                <span class="post-author-name">${post.user.name}</span>
                                <span class="post-author-handle">${post.user.handle || '@team'}</span>
                                <span class="post-time-dot">•</span>
                                <span class="post-time-text">${post.timestamp}</span>
                            </div>
                            <div class="post-role-badge">
                                <span class="role-dot" style="background: ${post.mood.dotColor};"></span>
                                <span>${post.mood.icon} ${post.mood.label}</span>
                            </div>
                        </div>
                    </div>
                    <div class="post-actions-menu">
                        <button class="post-action-icon-btn copy-link-btn" title="Copy link to pulse">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        </button>
                    </div>
                </div>

                <div class="post-body-content">${post.content}</div>

                ${mediaHtml}

                <div class="post-footer-dock">
                    <div class="reaction-dock-list">
                        ${Object.entries(post.reactions || { '❤️': 0, '🚀': 1, '🔥': 0, '💡': 0, '👏': 0 }).map(([emoji, count]) => `
                            <button class="reaction-pill-btn ${count > 0 ? 'has-votes' : ''}" data-emoji="${emoji}" data-count="${count}">
                                <span class="reaction-emoji">${emoji}</span>
                                <span class="reaction-count">${count}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div class="post-meta-actions">
                        <button class="reply-toggle-btn" title="Threaded replies">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            <span>${post.replies ? post.replies.length : 0}</span>
                        </button>
                    </div>
                </div>

                <!-- Threaded Sub-Replies Accordion -->
                <div class="post-replies-container hidden">
                    <div class="replies-list">
                        ${(post.replies || []).map(r => `
                            <div class="reply-item">
                                <img src="${r.user.avatar}" class="reply-avatar" alt="${r.user.name}">
                                <div class="reply-bubble">
                                    <div class="reply-header">
                                        <strong>${r.user.name}</strong>
                                        <span>${r.timestamp}</span>
                                    </div>
                                    <div class="reply-text">${r.text}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="reply-composer-row">
                        <input type="text" class="reply-input" placeholder="Reply to ${post.user.name}...">
                        <button class="reply-send-btn">Send</button>
                    </div>
                </div>
            </article>
        `;
    }

    bindPostInteractions(container) {
        if (!container) return;

        // Lightbox click on post images
        container.querySelectorAll('[data-lightbox-src]').forEach(item => {
            item.addEventListener('click', () => {
                const src = item.dataset.lightboxSrc;
                if (src && window.__pulseStream_openLightbox) {
                    window.__pulseStream_openLightbox(src);
                }
            });
        });

        // Copy link action
        container.querySelectorAll('.copy-link-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    btn.classList.add('copied');
                    this.soundEngine && this.soundEngine.pollChime();
                    setTimeout(() => btn.classList.remove('copied'), 1500);
                } catch (e) {}
            });
        });

        // Reply toggle & submit
        container.querySelectorAll('.feed-post').forEach(postEl => {
            const postId = postEl.dataset.postId;
            const replyToggle = postEl.querySelector('.reply-toggle-btn');
            const repliesContainer = postEl.querySelector('.post-replies-container');
            const replyInput = postEl.querySelector('.reply-input');
            const replySend = postEl.querySelector('.reply-send-btn');

            if (replyToggle && repliesContainer) {
                replyToggle.addEventListener('click', () => {
                    repliesContainer.classList.toggle('hidden');
                    this.soundEngine && this.soundEngine.keyTap();
                });
            }

            if (replySend && replyInput) {
                replySend.addEventListener('click', () => {
                    const val = replyInput.value.trim();
                    if (!val) return;

                    const targetPost = this.posts.find(p => p.id === postId);
                    if (targetPost) {
                        targetPost.replies = targetPost.replies || [];
                        targetPost.replies.push({
                            user: {
                                name: 'Alex Rivera',
                                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                            },
                            text: val,
                            timestamp: 'Just now'
                        });
                        this.storageEngine.savePosts(this.posts);
                        this.renderFeed();
                        this.soundEngine && this.soundEngine.pollChime();
                    }
                });
            }
        });
    }

    animateComposer() {
        if (!this.composer) return;
        const clone = this.composer.cloneNode(true);
        const rect = this.composer.getBoundingClientRect();

        clone.style.position = 'fixed';
        clone.style.top = `${rect.top}px`;
        clone.style.left = `${rect.left}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.zIndex = '999';
        clone.style.pointerEvents = 'none';
        clone.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

        document.body.appendChild(clone);
        void clone.offsetWidth;

        clone.style.transform = 'translateY(120px) scale(0.92)';
        clone.style.opacity = '0';

        setTimeout(() => clone.remove(), 500);
    }
}
