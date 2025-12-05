// DOM Elements
const menuItems = document.querySelectorAll('.menu-item');
const badges = document.querySelectorAll('.badge');

// Add click handlers to menu items
menuItems.forEach((item, index) => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        const menuText = this.querySelector('.menu-text').textContent;
        const badgeNumber = this.querySelector('.badge').textContent;
        
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Log action (in real app, this would navigate or trigger an action)
        console.log(`Clicked: ${menuText} (${badgeNumber} items)`);
        
        // Optional: Show feedback
        showFeedback(`${menuText} clicked!`);
    });
    
    // Add hover sound effect simulation (visual feedback)
    item.addEventListener('mouseenter', function() {
        const badge = this.querySelector('.badge');
        badge.style.animation = 'pulse 0.3s ease';
    });
});

// Badge pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
    }
    
    .feedback-message {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: white;
        padding: 12px 24px;
        border-radius: 25px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        font-size: 14px;
        font-weight: 500;
        color: #333;
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .feedback-message.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
`;
document.head.appendChild(style);

// Show feedback message
function showFeedback(message) {
    // Remove existing feedback if any
    const existing = document.querySelector('.feedback-message');
    if (existing) {
        existing.remove();
    }
    
    // Create new feedback element
    const feedback = document.createElement('div');
    feedback.className = 'feedback-message';
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    // Show feedback
    setTimeout(() => {
        feedback.classList.add('show');
    }, 10);
    
    // Hide feedback after 2 seconds
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => {
            feedback.remove();
        }, 300);
    }, 2000);
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Optional: Add keyboard navigation
document.addEventListener('keydown', function(e) {
    const items = Array.from(menuItems);
    const currentIndex = items.findIndex(item => item === document.activeElement);
    
    if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
        e.preventDefault();
        items[currentIndex + 1].focus();
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        items[currentIndex - 1].focus();
    } else if (e.key === 'Enter' && document.activeElement.classList.contains('menu-item')) {
        document.activeElement.click();
    }
});

// Make menu items focusable
menuItems.forEach(item => {
    item.setAttribute('tabindex', '0');
});

