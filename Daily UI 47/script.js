// Activity Data Generator
const users = [
    { name: 'John', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=9' },
    { name: 'David', avatar: 'https://i.pravatar.cc/150?img=33' },
    { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=47' },
    { name: 'Chris', avatar: 'https://i.pravatar.cc/150?img=68' },
    { name: 'Anna', avatar: 'https://i.pravatar.cc/150?img=20' },
    { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=51' },
    { name: 'Sophie', avatar: 'https://i.pravatar.cc/150?img=45' }
];

const activityTypes = [
    { type: 'like', template: (u) => `${u.name} liked your design`, category: 'notifications' },
    { type: 'comment', template: (u) => `${u.name} commented "Great UI!" on your post`, category: 'mentions' },
    { type: 'follow', template: (u) => `${u.name} started following you`, category: 'notifications' },
    { type: 'order', template: (u) => `Your order #${Math.floor(Math.random() * 9000 + 1000)} has been shipped`, category: 'notifications' },
    { type: 'achievement', template: (u) => `You earned the "Design Master" achievement!`, category: 'notifications' },
    { type: 'mention', template: (u) => `${u.name} mentioned you in a comment`, category: 'mentions' },
    { type: 'share', template: (u) => `${u.name} shared your post`, category: 'notifications' },
    { type: 'reply', template: (u) => `${u.name} replied to your comment`, category: 'mentions' },
    { type: 'tag', template: (u) => `${u.name} tagged you in a photo`, category: 'mentions' },
    { type: 'update', template: (u) => `Your project "Daily UI Challenge" was updated`, category: 'notifications' },
    { type: 'invite', template: (u) => `${u.name} invited you to join a team`, category: 'notifications' },
    { type: 'review', template: (u) => `${u.name} left a review on your work`, category: 'notifications' }
];

function generateActivities(count = 50) {
    const activities = [];
    const now = Date.now();
    
    for (let i = 0; i < count; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const hoursAgo = Math.floor(Math.random() * 48);
        const timestamp = new Date(now - hoursAgo * 60 * 60 * 1000);
        
        activities.push({
            id: `activity-${i}`,
            user,
            text: activityType.template(user),
            type: activityType.type,
            category: activityType.category,
            timestamp,
            hoursAgo,
            unread: Math.random() > 0.6,
            hasMedia: Math.random() > 0.5,
            mediaType: Math.random() > 0.7 ? 'video' : 'image',
            likes: Math.floor(Math.random() * 50),
            comments: Math.floor(Math.random() * 10),
            shares: Math.floor(Math.random() * 5),
            liked: Math.random() > 0.7,
            commentData: Math.random() > 0.6 ? [
                { user: users[Math.floor(Math.random() * users.length)], text: 'Amazing work!' },
                { user: users[Math.floor(Math.random() * users.length)], text: 'Love this design!' }
            ] : []
        });
    }
    
    return activities.sort((a, b) => b.timestamp - a.timestamp);
}

// Filter Class
class Filter {
    constructor() {
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.init();
    }

    init() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            });
        });

        const searchBar = document.getElementById('searchBar');
        searchBar.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            Feed.instance.filter();
        });

        const hamburger = document.getElementById('hamburger');
        const filters = document.getElementById('filters');
        hamburger.addEventListener('click', () => {
            const isOpen = filters.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
            btn.setAttribute('aria-selected', btn.dataset.filter === filter);
        });
        Feed.instance.filter();
    }

    matches(activity) {
        if (this.currentFilter !== 'all' && activity.category !== this.currentFilter) {
            return false;
        }
        if (this.searchQuery && !activity.text.toLowerCase().includes(this.searchQuery)) {
            return false;
        }
        return true;
    }
}

// Card Class
class Card {
    constructor(activity) {
        this.activity = activity;
        this.element = null;
        this.commentsExpanded = false;
    }

    create() {
        const card = document.createElement('li');
        card.className = `activity-card ${this.activity.unread ? 'unread' : ''}`;
        card.setAttribute('data-id', this.activity.id);
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', this.activity.text);

        const timeAgo = this.formatTime(this.activity.hoursAgo);
        
        card.innerHTML = `
            <div class="card-header">
                <img src="${this.activity.user.avatar}" alt="${this.activity.user.name}" class="avatar" loading="lazy">
                <div class="card-content">
                    <div class="card-top">
                        <p class="activity-text">${this.activity.text}</p>
                        <span class="timestamp">${timeAgo}</span>
                    </div>
                    ${this.activity.hasMedia ? this.createMedia() : ''}
                    ${this.createReactionBar()}
                    ${this.createCommentsSection()}
                </div>
            </div>
        `;

        this.element = card;
        this.attachEvents();
        return card;
    }

    createMedia() {
        if (this.activity.mediaType === 'video') {
            return `
                <div class="activity-preview">
                    <div class="preview-video">
                        <svg width="40" height="40" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                        </svg>
                    </div>
                </div>
            `;
        }
        return `
            <div class="activity-preview">
                <img src="https://picsum.photos/400/300?random=${this.activity.id}" alt="Preview" class="preview-image" loading="lazy">
            </div>
        `;
    }

    createReactionBar() {
        return `
            <div class="reaction-bar">
                <button class="reaction-btn ${this.activity.liked ? 'active' : ''}" data-action="like" aria-label="Like">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a1 1 0 001.364.97l5-.108a1 1 0 00.939-1.01V11.5a1 1 0 00-.82-.984l-5-.108a1 1 0 00-1.483.925zm11.854-3.646a.5.5 0 00-.353-.854H14.5a.5.5 0 00-.5.5v7a.5.5 0 00.5.5h2.793a.5.5 0 00.5-.5v-4a.5.5 0 00-.146-.354l-1.793-1.792z"/>
                    </svg>
                    <span>${this.activity.likes}</span>
                </button>
                <button class="reaction-btn" data-action="comment" aria-label="Comment">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                    </svg>
                    <span>${this.activity.comments}</span>
                </button>
                <button class="reaction-btn" data-action="share" aria-label="Share">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                    </svg>
                    <span>${this.activity.shares}</span>
                </button>
            </div>
        `;
    }

    createCommentsSection() {
        if (!this.activity.commentData || this.activity.commentData.length === 0) {
            return '';
        }
        return `
            <div class="comments-section" id="comments-${this.activity.id}">
                ${this.activity.commentData.map(comment => `
                    <div class="comment">
                        <img src="${comment.user.avatar}" alt="${comment.user.name}" class="comment-avatar" loading="lazy">
                        <div class="comment-content">
                            <div class="comment-author">${comment.user.name}</div>
                            <div class="comment-text">${comment.text}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    attachEvents() {
        const likeBtn = this.element.querySelector('[data-action="like"]');
        const commentBtn = this.element.querySelector('[data-action="comment"]');
        const commentsSection = this.element.querySelector('.comments-section');

        likeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleLike();
        });

        commentBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleComments();
        });

        this.element.addEventListener('click', () => {
            if (commentsSection) {
                this.toggleComments();
            }
        });

        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (commentsSection) {
                    this.toggleComments();
                }
            }
        });
    }

    toggleLike() {
        this.activity.liked = !this.activity.liked;
        this.activity.likes += this.activity.liked ? 1 : -1;
        const likeBtn = this.element.querySelector('[data-action="like"]');
        likeBtn.classList.toggle('active', this.activity.liked);
        likeBtn.querySelector('span').textContent = this.activity.likes;
    }

    toggleComments() {
        const commentsSection = this.element.querySelector('.comments-section');
        if (!commentsSection) return;
        
        this.commentsExpanded = !this.commentsExpanded;
        commentsSection.classList.toggle('expanded', this.commentsExpanded);
    }

    markAsRead() {
        if (this.activity.unread) {
            this.activity.unread = false;
            this.element.classList.remove('unread');
            Feed.instance.updateUnreadCount();
        }
    }

    formatTime(hours) {
        if (hours < 1) return 'Just now';
        if (hours === 1) return '1h ago';
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days === 1) return '1d ago';
        return `${days}d ago`;
    }
}

// Feed Class
class Feed {
    static instance = null;

    constructor() {
        if (Feed.instance) return Feed.instance;
        Feed.instance = this;
        
        this.activities = generateActivities(50);
        this.filteredActivities = [...this.activities];
        this.displayedCount = 10;
        this.filter = new Filter();
        this.feedElement = document.getElementById('feed');
        this.loadingElement = document.getElementById('loadingMore');
        
        this.init();
    }

    init() {
        this.render();
        this.setupInfiniteScroll();
        this.updateUnreadCount();
    }

    render() {
        const visibleActivities = this.filteredActivities.slice(0, this.displayedCount);
        const fragment = document.createDocumentFragment();

        visibleActivities.forEach((activity, index) => {
            const card = new Card(activity);
            const cardElement = card.create();
            cardElement.style.animationDelay = `${index * 0.05}s`;
            fragment.appendChild(cardElement);
        });

        this.feedElement.innerHTML = '';
        this.feedElement.appendChild(fragment);

        // Mark visible cards as read on scroll
        this.setupIntersectionObserver();
    }

    filter() {
        this.filteredActivities = this.activities.filter(activity => 
            this.filter.matches(activity)
        );
        this.displayedCount = 10;
        this.render();
    }

    setupInfiniteScroll() {
        let isLoading = false;
        
        window.addEventListener('scroll', () => {
            if (isLoading) return;
            
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollTop + windowHeight >= documentHeight - 100) {
                this.loadMore();
            }
        });
    }

    loadMore() {
        if (this.displayedCount >= this.filteredActivities.length) return;
        
        this.loadingElement.style.display = 'block';
        
        setTimeout(() => {
            this.displayedCount += 10;
            const newActivities = this.filteredActivities.slice(
                this.displayedCount - 10,
                this.displayedCount
            );
            
            newActivities.forEach((activity, index) => {
                const card = new Card(activity);
                const cardElement = card.create();
                cardElement.style.animationDelay = `${index * 0.05}s`;
                this.feedElement.appendChild(cardElement);
            });
            
            this.loadingElement.style.display = 'none';
            this.setupIntersectionObserver();
        }, 500);
    }

    setupIntersectionObserver() {
        const cards = this.feedElement.querySelectorAll('.activity-card.unread');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cardElement = entry.target;
                    const activityId = cardElement.dataset.id;
                    const activity = this.activities.find(a => a.id === activityId);
                    if (activity) {
                        const card = new Card(activity);
                        card.element = cardElement;
                        card.markAsRead();
                    }
                }
            });
        }, { threshold: 0.5 });

        cards.forEach(card => observer.observe(card));
    }

    updateUnreadCount() {
        const unreadCount = this.activities.filter(a => a.unread).length;
        const badge = document.getElementById('unreadBadge');
        badge.textContent = `${unreadCount} unread`;
        badge.setAttribute('aria-label', `${unreadCount} unread activities`);
    }
}

// Theme Toggle
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    new Feed();
});

