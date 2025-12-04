/**
 * Smart TV Navigation Logic
 * Simulates a "Spatial Navigation" system using Arrow Keys.
 */

// State Management
const state = {
    currentGroup: 'hero', // 'hero' or 'carousel'
    currentIndex: 0,
    groups: {
        hero: {
            elementId: 'group-hero',
            items: [],
            columns: 2
        },
        carousel: {
            elementId: 'group-carousel',
            items: [],
            columns: 5 // Dynamic in real app
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // 1. Collect all focusable items into our state
    state.groups.hero.items = Array.from(document.querySelectorAll('[data-group="hero"]'));
    state.groups.carousel.items = Array.from(document.querySelectorAll('[data-group="carousel"]'));
    
    // 2. Set initial focus
    updateFocus();

    // 3. Listen for Keydown events (Remote Control simulation)
    document.addEventListener('keydown', handleKeyInput);
});

function handleKeyInput(e) {
    // Prevent default scrolling for arrow keys
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    switch(e.key) {
        case 'ArrowRight':
            moveHorizontal(1);
            break;
        case 'ArrowLeft':
            moveHorizontal(-1);
            break;
        case 'ArrowDown':
            moveVertical(1);
            break;
        case 'ArrowUp':
            moveVertical(-1);
            break;
        case 'Enter':
            triggerAction();
            break;
    }
}

function moveHorizontal(direction) {
    const group = state.groups[state.currentGroup];
    const maxIndex = group.items.length - 1;
    let newIndex = state.currentIndex + direction;

    // Clamp values
    if (newIndex < 0) newIndex = 0;
    if (newIndex > maxIndex) newIndex = maxIndex;

    state.currentIndex = newIndex;
    updateFocus();
}

function moveVertical(direction) {
    // Logic for jumping between Hero and Carousel sections
    if (state.currentGroup === 'hero' && direction === 1) {
        state.currentGroup = 'carousel';
        state.currentIndex = 0; // Reset to start of row
    } else if (state.currentGroup === 'carousel' && direction === -1) {
        state.currentGroup = 'hero';
        state.currentIndex = 0; // Reset to primary button
    }
    
    updateFocus();
}

function updateFocus() {
    // 1. Remove active class from ALL items
    document.querySelectorAll('.focusable').forEach(el => el.classList.remove('active'));

    // 2. Add active class to CURRENT item
    const currentItem = state.groups[state.currentGroup].items[state.currentIndex];
    if (currentItem) {
        currentItem.classList.add('active');
        
        // 3. Scroll Handling for Carousel
        if (state.currentGroup === 'carousel') {
            centerCarouselItem(currentItem);
        } else {
            // Reset scroll if we go back up
            const track = document.querySelector('.carousel-track');
            track.style.transform = `translateX(0px)`;
        }
    }
}

function centerCarouselItem(element) {
    const container = document.querySelector('.carousel-container');
    const track = document.querySelector('.carousel-track');
    const cardWidth = 300; // Matches CSS
    const gap = 15; // Matches CSS
    
    // Simple scrolling logic:
    // If index > 1, shift the track to the left
    if (state.currentIndex > 1) {
        const offset = (state.currentIndex - 1) * -(cardWidth + gap);
        track.style.transform = `translateX(${offset}px)`;
    } else {
        track.style.transform = `translateX(0px)`;
    }
}

function triggerAction() {
    const currentItem = state.groups[state.currentGroup].items[state.currentIndex];
    
    // Add visual feedback for "Enter" press
    currentItem.style.transform = "scale(0.95)";
    setTimeout(() => {
        currentItem.style.transform = "";
        alert(`Selected: ${currentItem.innerText || currentItem.querySelector('.card-title').innerText}`);
    }, 100);
}