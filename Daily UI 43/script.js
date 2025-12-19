// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const menuSections = document.querySelectorAll('.menu-section');
const menuItems = document.querySelectorAll('.menu-item');

// Filter function
function filterMenu(category) {
    // Update active button
    navButtons.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Filter sections
    menuSections.forEach(section => {
        const sectionCategory = section.dataset.category;
        
        if (category === 'all' || sectionCategory === category) {
            section.classList.remove('hidden');
            // Add fade-in animation
            section.style.animation = 'fadeIn 0.5s ease-in';
        } else {
            section.classList.add('hidden');
        }
    });

    // Smooth scroll to top of menu content
    const menuContent = document.querySelector('.menu-content');
    if (menuContent) {
        menuContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Add click event listeners to navigation buttons
navButtons.forEach(button => {
    button.addEventListener('click', function() {
        const category = this.dataset.category;
        filterMenu(category);
    });
});

// Add hover effects to menu items
menuItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add click animation to menu items
menuItems.forEach(item => {
    item.addEventListener('click', function() {
        // Add a subtle bounce effect
        this.style.transform = 'translateY(-8px) scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'translateY(-8px) scale(1)';
        }, 150);
    });
});

// Initialize - ensure 'All' is active on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state
    filterMenu('all');
    
    // Add smooth transitions to nav buttons
    navButtons.forEach(btn => {
        btn.addEventListener('transitionend', function() {
            // Remove any inline styles that might interfere
            if (this.classList.contains('active')) {
                this.style.borderColor = '';
            }
        });
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    const activeButton = document.querySelector('.nav-btn.active');
    const buttonsArray = Array.from(navButtons);
    const currentIndex = buttonsArray.indexOf(activeButton);
    
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
        buttonsArray[currentIndex - 1].click();
    } else if (e.key === 'ArrowRight' && currentIndex < buttonsArray.length - 1) {
        buttonsArray[currentIndex + 1].click();
    }
});
