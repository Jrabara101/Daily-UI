/**
 * Pulse — The High-Fidelity Trend Discovery Hub
 * Core Logic & Interaction
 */

// --- Constants & Data ---
const CATEGORIES = ["All", "Technology", "Finance", "Fitness", "News", "Entertainment"];
const SENTIMENTS = {
    "Technology": "#00f2ff",
    "Finance": "#ffd700",
    "Fitness": "#39ff14",
    "News": "#ff003c",
    "Entertainment": "#ff00ff",
    "General": "#ffffff"
};

let trends = [];
let currentCategory = "All";
let startTime = performance.now();

// --- Weighted Popularity Algorithm ---
// Decay Score = (Likes + Shares * 2) / (Age in hours + 2)^1.8
const calculateDecayScore = (item) => {
    const hoursOld = (Date.now() - item.timestamp) / (1000 * 60 * 60);
    const score = (item.likes + item.shares * 2) / Math.pow(hoursOld + 2, 1.8);
    return score;
};

// --- Velocity Tracker Logic ---
const calculateVelocity = (currentShares, previousShares, timeInterval) => {
    const growth = currentShares - previousShares;
    const velocity = (growth / timeInterval) * 100;
    
    return {
        score: velocity.toFixed(2),
        isHot: velocity > 50,
        direction: growth >= 0 ? 'rising' : 'falling'
    };
};

// --- Sentiment Detection Logic ---
const detectSentiment = (title, category) => {
    const positiveKeywords = ['future', 'wins', 'breakthrough', 'new', 'growth', 'surplus', 'wins', 'reverses', 'success'];
    const negativeKeywords = ['crisis', 'rumors', 'cuts', 'down', 'loss', 'fails', 'warning', 'decline'];
    
    const lowerTitle = title.toLowerCase();
    let score = 0;
    positiveKeywords.forEach(k => { if (lowerTitle.includes(k)) score++; });
    negativeKeywords.forEach(k => { if (lowerTitle.includes(k)) score--; });

    if (score > 0) return '#39ff14'; // Positive (Green)
    if (score < 0) return '#ff003c'; // Negative/Urgent (Crimson)
    
    // Fallback to category color
    return SENTIMENTS[category] || SENTIMENTS.General;
};

// --- Data Simulation ---
const generateMockData = (count = 12) => {
    const items = [];
    const titles = [
        "The Future of Neural Interfaces", "Bitcoin Reaches New All-Time High", 
        "10-Minute Morning Routine for Longevity", "Mars Colony Habitat Prototype Unveiled",
        "AI-Generated Cinema Wins Major Award", "Global Clean Energy Surplus Reported",
        "New VR Sports League Gaining Traction", "Biotech Firm Reverses Cellular Aging",
        "Sustainable Fashion is the New Standard", "Quantum Encryption for Consumer Tech",
        "Mindfulness in the Digital Age", "The Rise of Decentralized Social Media",
        "Global Markets Warning: Economic Decline Predicted", "Tech Layoffs Rumors Surge in Silicon Valley"
    ];

    for (let i = 0; i < count; i++) {
        const title = titles[i % titles.length];
        const category = CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 1)) + 1];
        const isVideo = i === 1 || i === 5; // Mock some videos
        const sentimentColor = detectSentiment(title, category);

        items.push({
            id: i,
            title: title,
            category: category,
            likes: Math.floor(Math.random() * 5000),
            shares: Math.floor(Math.random() * 2000),
            prevShares: Math.floor(Math.random() * 1500),
            timestamp: Date.now() - Math.floor(Math.random() * 48 * 60 * 60 * 1000),
            image: `https://picsum.photos/seed/${i + 50}/800/600`,
            video: isVideo ? 'https://assets.mixkit.co/videos/preview/mixkit-abstract-form-of-blue-and-purple-ink-in-water-41225-large.mp4' : null,
            sentiment: sentimentColor,
            velocity: null
        });
    }
    return items;
};

// --- UI Rendering Functions ---

// --- Helper: Hex to RGB ---
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
};

const createTrendCard = (item, isLarge = false) => {
    const velocityData = calculateVelocity(item.shares, item.prevShares, 1); // 1 hour interval
    item.velocity = velocityData;

    const card = document.createElement('div');
    card.className = `trend-card stagger-in ${isLarge ? 'large' : ''}`;
    card.style.setProperty('--accent-color', item.sentiment);
    card.style.setProperty('--accent-rgb', hexToRgb(item.sentiment));

    const sparklinePoints = velocityData.direction === 'rising' 
        ? "0,25 20,20 40,22 60,10 80,15 100,5" 
        : "0,5 20,10 40,8 60,20 80,18 100,25";
    
    const gradId = velocityData.direction === 'rising' ? 'sparkline-grad' : 'sparkline-grad-down';

    const mediaHtml = item.video 
        ? `<video src="${item.video}" loop muted playsinline poster="${item.image}"></video>`
        : `<img src="${item.image}" alt="${item.title}" loading="lazy">`;

    card.innerHTML = `
        ${mediaHtml}
        <div class="card-overlay">
            <div class="card-content">
                <span class="category-tag" style="color: ${item.sentiment}">${item.category}</span>
                <h3 class="trend-title">${item.title}</h3>
                <div class="engagement-stats">
                    <span>🔥 ${item.likes}</span>
                    <span>🔄 ${item.shares}</span>
                    <span class="${velocityData.isHot ? 'velocity-indicator hot' : ''}">
                        ${velocityData.isHot ? 'HOT' : velocityData.score + '%'}
                    </span>
                </div>
                <div class="pulse-line-container">
                    <svg viewBox="0 0 100 30" class="sparkline">
                        <polyline points="${sparklinePoints}" stroke="url(#${gradId})" />
                    </svg>
                </div>
            </div>
        </div>
    `;

    card.addEventListener('click', () => {
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(5);
        console.log(`Clicked trend: ${item.title}`);
    });

    return card;
};

const createFeedItem = (item, rank) => {
    const velocityData = calculateVelocity(item.shares, item.prevShares, 1);
    
    const div = document.createElement('div');
    div.className = 'feed-item stagger-in';
    div.innerHTML = `
        <div class="feed-rank">${rank}</div>
        <div class="feed-thumb">
            <img src="${item.image}" alt="">
        </div>
        <div class="feed-info">
            <div class="feed-title">${item.title}</div>
            <div class="feed-meta">${item.category} • ${item.likes} engagements</div>
        </div>
        <div class="velocity-indicator ${velocityData.isHot ? 'hot' : ''}" style="color: ${velocityData.direction === 'rising' ? '#39ff14' : '#555555'}">
            ${velocityData.direction === 'rising' ? '▲' : '▼'} ${velocityData.score}%
        </div>
    `;
    return div;
};

// --- Web Worker for Sorting ---
const sortingWorker = new Worker('worker.js');

const renderGrid = (filter = "All") => {
    const grid = document.getElementById('featured-grid');
    const feed = document.getElementById('feed-container');
    
    const filtered = filter === "All" ? trends : trends.filter(t => t.category === filter);
    
    // Use Web Worker for sorting to keep UI thread smooth
    sortingWorker.postMessage({ type: 'SORT_TRENDS', items: filtered });

    sortingWorker.onmessage = function(e) {
        if (e.data.type === 'SORTED_TRENDS') {
            const sorted = e.data.sorted;
            
            // Clear existing with a small fade out if needed, but here we just clear
            grid.innerHTML = '';
            feed.innerHTML = '';

            // Render Featured
            sorted.slice(0, 4).forEach((item, idx) => {
                grid.appendChild(createTrendCard(item, idx === 0));
            });

            // Render Feed
            sorted.slice(4).forEach((item, idx) => {
                feed.appendChild(createFeedItem(item, idx + 5));
            });

            // Staggered Entrance Animation
            requestAnimationFrame(() => {
                const items = document.querySelectorAll('.stagger-in');
                items.forEach((item, idx) => {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, idx * 40); // Slightly faster stagger
                });
                setupMediaObserver();
            });
        }
    };
};

// --- Intersection Observer for Video/Media ---
const setupMediaObserver = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.tagName === 'VIDEO') {
                entry.target.play();
            } else if (entry.target.tagName === 'VIDEO') {
                entry.target.pause();
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.trend-card video').forEach(v => observer.observe(v));
};

// --- Real-time Ingestion Simulation ---
const simulateRealTimeUpdate = () => {
    setInterval(() => {
        const newItem = generateMockData(1)[0];
        newItem.timestamp = Date.now();
        newItem.likes = 100;
        newItem.shares = 50;
        
        trends.unshift(newItem);
        if (trends.length > 30) trends.pop();

        if (currentCategory === "All" || currentCategory === newItem.category) {
            // Smoothly slide in new item logic could go here
            // For now, re-render if it's the current view
            renderGrid(currentCategory);
        }
    }, 15000); // Every 15 seconds
};

// --- Performance Tracking (TTI) ---
const trackPerformance = () => {
    window.addEventListener('load', () => {
        const tti = performance.now() - startTime;
        const ttiDisplay = document.getElementById('tti-value');
        if (ttiDisplay) ttiDisplay.textContent = Math.round(tti);
        console.log(`Time to Interactive: ${tti}ms`);
    });
};

// --- Category Navigation ---
const setupNav = () => {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(btn => {
        btn.addEventListener('click', () => {
            navItems.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            
            // Re-render with animation
            renderGrid(currentCategory);
        });
    });
};

// --- Initialization ---
const init = () => {
    // Show skeleton shimmer for 1.2s
    const overlay = document.getElementById('loading-overlay');

    setTimeout(() => {
        trends = generateMockData(20);
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 500);
        renderGrid();
        setupNav();
        setupMediaObserver();
        simulateRealTimeUpdate();
        trackPerformance();
    }, 1200);
};

document.addEventListener('DOMContentLoaded', init);
