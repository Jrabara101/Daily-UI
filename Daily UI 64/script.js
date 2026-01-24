/**
 * PersonaGate - The Intelligent Onboarding Orchestrator
 * Senior Front-end Engineering Implementation
 * 
 * Features:
 * - State-to-DOM Pipeline
 * - GPU-Accelerated Transitions
 * - URL Parameter Syncing
 * - Keyboard Navigation (A11y)
 * - Click Ripple Effects
 * - Contextual Reveal Animations
 * - FAB Confirmation Button
 */

// ============================================
// Data Store - Single Source of Truth
// ============================================

const personaStore = {
    selectedType: null,
    types: [
        {
            id: 'creator',
            title: 'Creator',
            icon: `<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
            benefits: [
                'Unlimited creative projects',
                'Advanced collaboration tools',
                'Priority support',
                'Custom branding options'
            ]
        },
        {
            id: 'business',
            title: 'Business',
            icon: `<svg viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/></svg>`,
            benefits: [
                'Team management dashboard',
                'Advanced analytics & reporting',
                'Enterprise-grade security',
                'Dedicated account manager'
            ]
        },
        {
            id: 'agency',
            title: 'Agency',
            icon: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
            benefits: [
                'Multi-client workspace management',
                'White-label solutions',
                'Bulk operations & automation',
                'Custom API access'
            ]
        }
    ]
};

// ============================================
// DOM References
// ============================================

const personaGrid = document.getElementById('persona-grid');
const userTypeInput = document.getElementById('user_type_input');
const fabContinue = document.getElementById('fab-continue');
const onboardingForm = document.getElementById('onboarding-form');

// ============================================
// Utility Functions
// ============================================

/**
 * Create ripple effect at click position
 */
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Trigger selection pulse animation
 */
function triggerSelectionPulse(element) {
    // Pulse effect is handled by CSS animation
    // This function can be extended for additional effects
    element.style.animation = 'none';
    // Force reflow
    void element.offsetWidth;
    element.style.animation = null;
}

/**
 * Get URL parameter value
 */
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Update URL without page reload
 */
function updateURL(type) {
    const url = new URL(window.location);
    if (type) {
        url.searchParams.set('type', type);
    } else {
        url.searchParams.delete('type');
    }
    window.history.replaceState({}, '', url);
}

// ============================================
// Render Functions - State-to-DOM Pipeline
// ============================================

/**
 * Render persona card
 */
function renderPersonaCard(persona, index) {
    const card = document.createElement('div');
    card.className = 'persona-card';
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', 'false');
    card.setAttribute('aria-label', `Select ${persona.title} user type`);
    card.setAttribute('tabindex', '0');
    card.dataset.personaId = persona.id;
    card.dataset.index = index;
    
    // Icon
    const iconContainer = document.createElement('div');
    iconContainer.className = 'persona-icon';
    iconContainer.innerHTML = persona.icon;
    
    // Title
    const title = document.createElement('h3');
    title.className = 'persona-title';
    title.textContent = persona.title;
    
    // Benefits (Contextual Reveal)
    const benefitsContainer = document.createElement('div');
    benefitsContainer.className = 'persona-benefits';
    const benefitsList = document.createElement('ul');
    benefitsList.className = 'benefits-list';
    
    persona.benefits.forEach(benefit => {
        const benefitItem = document.createElement('li');
        benefitItem.className = 'benefit-item';
        benefitItem.textContent = benefit;
        benefitsList.appendChild(benefitItem);
    });
    
    benefitsContainer.appendChild(benefitsList);
    
    // Select Role Button
    const selectBtn = document.createElement('button');
    selectBtn.className = 'select-role-btn';
    selectBtn.type = 'button';
    selectBtn.innerHTML = 'SELECT ROLE <span style="margin-left: 0.5rem;">→</span>';
    selectBtn.setAttribute('aria-label', `Confirm selection of ${persona.title}`);
    
    // Assemble card
    card.appendChild(iconContainer);
    card.appendChild(title);
    card.appendChild(benefitsContainer);
    card.appendChild(selectBtn);
    
    return card;
}

/**
 * Render all persona cards
 */
function renderPersonaGrid() {
    personaGrid.innerHTML = '';
    
    personaStore.types.forEach((persona, index) => {
        const card = renderPersonaCard(persona, index);
        personaGrid.appendChild(card);
    });
    
    // Attach event listeners after rendering
    attachCardEventListeners();
}

// ============================================
// Selection Logic
// ============================================

/**
 * Select user type - Single source of truth
 */
function selectUserType(type, element) {
    // 1. Update Data State
    personaStore.selectedType = type;
    userTypeInput.value = type || ''; // Use empty string instead of null to prevent "null" string
    
    // 2. Update URL
    updateURL(type);
    
    // 3. Update UI with GPU-accelerated transitions
    document.querySelectorAll('.persona-card').forEach(card => {
        const isActive = card.dataset.personaId === type;
        card.classList.toggle('is-active', isActive);
        card.setAttribute('aria-checked', isActive ? 'true' : 'false');
        card.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    
    // 4. Update grid state for dimming effect
    personaGrid.classList.toggle('has-selection', type !== null);
    
    // 5. Trigger micro-interaction
    if (element) {
        triggerSelectionPulse(element);
    }
    
    // 6. Show FAB button
    showFABButton();
    
    // 7. Announce to screen readers
    announceSelection(type);
}

/**
 * Announce selection to screen readers
 */
function announceSelection(type) {
    const persona = personaStore.types.find(p => p.id === type);
    if (persona) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `${persona.title} user type selected`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }
}

// ============================================
// FAB Button Logic
// ============================================

function showFABButton() {
    if (personaStore.selectedType) {
        fabContinue.style.display = 'flex';
        // Force reflow for animation
        void fabContinue.offsetWidth;
        fabContinue.classList.add('show');
    }
}

function hideFABButton() {
    fabContinue.classList.remove('show');
    setTimeout(() => {
        if (!fabContinue.classList.contains('show')) {
            fabContinue.style.display = 'none';
        }
    }, 500);
}

// ============================================
// Keyboard Navigation (A11y)
// ============================================

let focusedIndex = 0;

function getCardElements() {
    return Array.from(document.querySelectorAll('.persona-card'));
}

function focusCard(index) {
    const cards = getCardElements();
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;
    
    focusedIndex = index;
    cards[index].focus();
}

function handleKeyboardNavigation(event) {
    const cards = getCardElements();
    const currentCard = event.target.closest('.persona-card');
    
    if (!currentCard) return;
    
    const currentIndex = parseInt(currentCard.dataset.index);
    
    switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
            event.preventDefault();
            focusCard(currentIndex + 1);
            break;
            
        case 'ArrowLeft':
        case 'ArrowUp':
            event.preventDefault();
            focusCard(currentIndex - 1);
            break;
            
        case 'Home':
            event.preventDefault();
            focusCard(0);
            break;
            
        case 'End':
            event.preventDefault();
            focusCard(cards.length - 1);
            break;
            
        case ' ':
        case 'Enter':
            event.preventDefault();
            const personaId = currentCard.dataset.personaId;
            selectUserType(personaId, currentCard);
            break;
            
        case 'Escape':
            if (personaStore.selectedType) {
                event.preventDefault();
                selectUserType(null, null);
                hideFABButton();
            }
            break;
    }
}

// ============================================
// Event Listeners
// ============================================

function attachCardEventListeners() {
    const cards = document.querySelectorAll('.persona-card');
    
    cards.forEach(card => {
        // Click handler
        card.addEventListener('click', (event) => {
            const personaId = card.dataset.personaId;
            
            // Don't trigger if clicking the select button
            if (event.target.closest('.select-role-btn')) {
                return;
            }
            
            selectUserType(personaId, card);
            createRipple(event, card);
        });
        
        // Keyboard navigation
        card.addEventListener('keydown', handleKeyboardNavigation);
        
        // Select button click
        const selectBtn = card.querySelector('.select-role-btn');
        if (selectBtn) {
            selectBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                const personaId = card.dataset.personaId;
                selectUserType(personaId, card);
                // Trigger form submission or next step
                handleContinue();
            });
        }
    });
}

// FAB Continue button handler
fabContinue.addEventListener('click', handleContinue);

function handleContinue() {
    if (personaStore.selectedType) {
        // In a real application, this would submit the form or navigate
        console.log('Continuing with user type:', personaStore.selectedType);
        
        // Example: Submit form
        // onboardingForm.submit();
        
        // Or navigate to next step
        // window.location.href = `/onboarding/step3?type=${personaStore.selectedType}`;
        
        // For demo purposes, show an alert
        alert(`Great choice! You've selected the ${personaStore.types.find(p => p.id === personaStore.selectedType).title} user type.`);
    }
}

// ============================================
// URL Parameter Syncing
// ============================================

function syncFromURL() {
    const typeParam = getURLParameter('type');
    if (typeParam) {
        const persona = personaStore.types.find(p => p.id === typeParam.toLowerCase());
        if (persona) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                const card = document.querySelector(`[data-persona-id="${persona.id}"]`);
                if (card) {
                    selectUserType(persona.id, card);
                    // Scroll card into view
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    }
}

// ============================================
// Initialization
// ============================================

function init() {
    // Render cards
    renderPersonaGrid();
    
    // Sync from URL parameters
    syncFromURL();
    
    // Set initial focus
    const cards = getCardElements();
    if (cards.length > 0) {
        cards[0].setAttribute('tabindex', '0');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        personaStore,
        selectUserType,
        renderPersonaGrid
    };
}

