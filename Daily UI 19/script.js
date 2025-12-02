// Sample leaderboard data
const leaderboardData = [
    { rank: 4, name: "Pixel Master", score: 9847, change: 45, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&round" },
    { rank: 5, name: "Quantum Leap", score: 9623, change: -12, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&round" },
    { rank: 6, name: "Cyber Phoenix", score: 9412, change: 23, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&round" },
    { rank: 7, name: "Nova Strike", score: 9123, change: 67, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&round" },
    { rank: 8, name: "Ghost Runner", score: 8934, change: -5, avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&round" },
    { rank: 9, name: "Star Commander", score: 8756, change: 34, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&round" },
    { rank: 10, name: "Blaze Runner", score: 8567, change: 12, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&round" },
    { rank: 11, name: "Void Walker", score: 8345, change: -23, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&round" },
    { rank: 12, name: "Echo Pulse", score: 8123, change: 56, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&round" },
    { rank: 13, name: "Frost Byte", score: 7890, change: 8, avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&round" }
];

// DOM elements
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const regularRankings = document.querySelector('.regular-rankings');
const refreshBtn = document.getElementById('refreshBtn');
const timeFilter = document.getElementById('timeFilter');

// Initialize leaderboard
function initLeaderboard() {
    generateRankings();
    animateRankings();
    setupEventListeners();
}

// Generate regular rankings
function generateRankings() {
    regularRankings.innerHTML = '';
    leaderboardData.forEach(player => {
        const rankItem = document.createElement('div');
        rankItem.className = 'rank-item';
        rankItem.setAttribute('data-rank', player.rank);
        rankItem.innerHTML = `
            <span class="rank">#${player.rank}</span>
            <div class="player">
                <img src="${player.avatar}" alt="${player.name}">
                <div>
                    <div class="name">${player.name}</div>
                    <div class="score">${player.score.toLocaleString()} pts</div>
                </div>
            </div>
            <div class="change ${player.change >= 0 ? 'positive' : 'negative'}">
                <i class="fas fa-arrow-${player.change >= 0 ? 'up' : 'down'}"></i> ${Math.abs(player.change)}
            </div>
        `;
        regularRankings.appendChild(rankItem);
    });
}

// Animate rankings with stagger effect
function animateRankings() {
    const items = document.querySelectorAll('.rank-item, .rank-card');
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('slide-in', 'bounce-in');
    });
}

// Tab switching
function setupEventListeners() {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Refresh animation
    refreshBtn.addEventListener('click', () => {
        refreshBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
            // Simulate data refresh
            generateRankings();
            animateRankings();
        }, 500);
    });

    // Progress bar animation
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = '0%';
        setTimeout(() => {
            progressFill.style.width = '72%';
        }, 500);
    }
}

// Challenge button
document.addEventListener('click', (e) => {
    if (e.target.closest('.challenge-btn')) {
        e.target.closest('.challenge-btn').innerHTML = '<i class="fas fa-check"></i> Challenged!';
        setTimeout(() => {
            e.target.closest('.challenge-btn').innerHTML = '<i class="fas fa-fire"></i> Challenge Now';
        }, 2000);
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', initLeaderboard);

// Entrance animation for entire leaderboard
window.addEventListener('load', () => {
    document.querySelector('.leaderboard-container').style.opacity = '1';
});
