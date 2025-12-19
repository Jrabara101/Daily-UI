// Chair data with image URLs from Unsplash
const chairsData = [
    {
        id: 1,
        name: "BARCELONA CHAIR",
        designer: "LUDWIG MIES VAN DER ROHE",
        year: "1929",
        category: "lounge",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop"
    },
    {
        id: 2,
        name: "WASSILY CHAIR",
        designer: "MARCEL BREUER",
        year: "1925",
        category: "lounge",
        image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=600&fit=crop"
    },
    {
        id: 3,
        name: "KRUSIN LOUNGE CHAIR",
        designer: "MARC KRUSIN",
        year: "2011",
        category: "lounge",
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=600&fit=crop"
    },
    {
        id: 4,
        name: "WOMB CHAIR",
        designer: "EERO SAARINEN",
        year: "1948",
        category: "lounge",
        image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=600&h=600&fit=crop"
    },
    {
        id: 5,
        name: "POLLOCK ARM CHAIR",
        designer: "CHARLES POLLOCK",
        year: "1960",
        category: "lounge",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=600&fit=crop"
    },
    {
        id: 6,
        name: "RISOM LOUNGE CHAIR",
        designer: "JENS RISOM",
        year: "1943",
        category: "lounge",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop"
    },
    {
        id: 7,
        name: "KNOLL LOUNGE CHAIR",
        designer: "FLORENCE KNOLL",
        year: "1954",
        category: "lounge",
        image: "https://images.unsplash.com/photo-1598301257982-0cf01499abb2?w=600&h=600&fit=crop"
    },
    {
        id: 8,
        name: "JEHS+LAUB LOUNGE CHAIR",
        designer: "MARKUS JEHS AND JURGEN LAUB",
        year: "2009",
        category: "lounge",
        image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=600&fit=crop"
    }
];

let currentCategory = 'lounge';
let currentView = 'list';
let favoriteChairs = [...chairsData]; // Start with all chairs as favorites

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderChairs();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderChairs();
        });
    });

    // View toggle buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            renderChairs();
        });
    });

    // Back button
    const backBtn = document.querySelector('.back-btn');
    backBtn.addEventListener('click', () => {
        // You can add navigation logic here
        console.log('Navigate back');
    });
}

// Render chairs based on current category and view
function renderChairs() {
    const grid = document.getElementById('chairsGrid');
    const filteredChairs = favoriteChairs.filter(chair => chair.category === currentCategory);
    
    // Clear existing chairs
    grid.innerHTML = '';
    
    // Update grid class for view mode
    if (currentView === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }
    
    // Render each chair
    filteredChairs.forEach(chair => {
        const card = createChairCard(chair);
        grid.appendChild(card);
    });
}

// Create a chair card element
function createChairCard(chair) {
    const card = document.createElement('div');
    card.className = `chair-card ${currentView === 'list' ? 'list-view' : ''}`;
    
    card.innerHTML = `
        <button class="remove-btn" data-id="${chair.id}" aria-label="Remove from favorites">×</button>
        <div class="chair-image-container">
            <img src="${chair.image}" alt="${chair.name}" class="chair-image" loading="lazy">
        </div>
        <div class="chair-info">
            <div class="chair-name">${chair.name}</div>
            <div class="chair-designer">${chair.designer}</div>
            <div class="chair-year">${chair.year}</div>
        </div>
    `;
    
    // Add remove functionality
    const removeBtn = card.querySelector('.remove-btn');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFromFavorites(chair.id);
    });
    
    return card;
}

// Remove chair from favorites
function removeFromFavorites(chairId) {
    favoriteChairs = favoriteChairs.filter(chair => chair.id !== chairId);
    renderChairs();
    
    // Optional: Show a notification or animation
    if (favoriteChairs.length === 0) {
        const grid = document.getElementById('chairsGrid');
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #999;">No favorite chairs in this category</div>';
    }
}

