/**
 * GENESIS — Intelligent Project Creation Wizard
 * Senior Front-end Engineering: Vanilla JavaScript Implementation
 */

// ==================== UTILITY FUNCTIONS ====================

/**
 * Debounce Function - Prevents API flooding during typing
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Email Validation using Regex
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Password Strength Validator
 * Returns object with isValid and message
 */
const validatePassword = (password) => {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const missing = [];
    if (!checks.length) missing.push('at least 8 characters');
    if (!checks.uppercase) missing.push('an uppercase letter');
    if (!checks.lowercase) missing.push('a lowercase letter');
    if (!checks.number) missing.push('a number');
    if (!checks.symbol) missing.push('a symbol (!@#$%^&*)');
    
    return {
        isValid: Object.values(checks).every(v => v),
        message: missing.length ? `Missing: ${missing.join(', ')}` : 'Strong password'
    };
};

// ==================== FORM STATE MANAGEMENT ====================

class FormStateManager {
    constructor(formElement) {
        this.form = formElement;
        this.initialState = {};
        this.currentState = {};
        this.isDirty = false;
        
        this.captureInitialState();
        this.setupChangeListeners();
    }
    
    captureInitialState() {
        const formData = new FormData(this.form);
        for (let [key, value] of formData.entries()) {
            this.initialState[key] = value;
            this.currentState[key] = value;
        }
    }
    
    setupChangeListeners() {
        this.form.addEventListener('input', () => {
            this.updateCurrentState();
            this.checkDirtyState();
        });
    }
    
    updateCurrentState() {
        const formData = new FormData(this.form);
        for (let [key, value] of formData.entries()) {
            this.currentState[key] = value;
        }
    }
    
    checkDirtyState() {
        this.isDirty = JSON.stringify(this.initialState) !== JSON.stringify(this.currentState);
        
        // Update autosave indicator
        const autosaveText = document.querySelector('.autosave-text');
        if (autosaveText) {
            autosaveText.textContent = this.isDirty ? 'UNSAVED CHANGES' : 'AUTOSAVE ACTIVE';
            autosaveText.style.color = this.isDirty ? 'var(--color-warning)' : 'var(--color-success)';
        }
    }
    
    reset() {
        this.currentState = { ...this.initialState };
        this.isDirty = false;
    }
}

// ==================== INPUT MASKING ENGINE ====================

class InputMask {
    static currency(input) {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^0-9]/g, '');
            
            if (value === '') {
                e.target.value = '';
                return;
            }
            
            // Convert to number and format
            const number = parseInt(value, 10);
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(number);
            
            e.target.value = formatted;
        });
    }
}

// ==================== CUSTOM SELECT COMPONENT ====================

class CustomSelect {
    constructor(element) {
        this.element = element;
        this.trigger = element.querySelector('.select-trigger');
        this.valueDisplay = element.querySelector('.select-value');
        this.dropdown = element.querySelector('.select-dropdown');
        this.options = element.querySelectorAll('.select-option');
        this.hiddenInput = element.querySelector('input[type="hidden"]');
        this.currentIndex = -1;
        
        this.init();
    }
    
    init() {
        // Click to toggle
        this.trigger.addEventListener('click', () => this.toggle());
        
        // Option selection
        this.options.forEach((option, index) => {
            option.addEventListener('click', () => this.selectOption(index));
        });
        
        // Keyboard navigation
        this.element.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.element.contains(e.target)) {
                this.close();
            }
        });
    }
    
    toggle() {
        const isExpanded = this.element.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.element.setAttribute('aria-expanded', 'true');
        this.dropdown.setAttribute('aria-hidden', 'false');
        if (this.currentIndex >= 0) {
            this.options[this.currentIndex].focus();
        }
    }
    
    close() {
        this.element.setAttribute('aria-expanded', 'false');
        this.dropdown.setAttribute('aria-hidden', 'true');
    }
    
    selectOption(index) {
        const option = this.options[index];
        const value = option.getAttribute('data-value');
        const text = option.textContent;
        
        // Update UI
        this.valueDisplay.textContent = text;
        this.valueDisplay.classList.add('has-value');
        this.hiddenInput.value = value;
        
        // Update selected state
        this.options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        this.currentIndex = index;
        this.close();
        
        // Trigger change event
        this.hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Handle progressive disclosure
        handleProjectTypeChange(value);
    }
    
    handleKeydown(e) {
        const isExpanded = this.element.getAttribute('aria-expanded') === 'true';
        
        switch(e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (!isExpanded) {
                    this.open();
                } else if (this.currentIndex >= 0) {
                    this.selectOption(this.currentIndex);
                }
                break;
                
            case 'Escape':
                e.preventDefault();
                this.close();
                this.element.focus();
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                if (!isExpanded) {
                    this.open();
                } else {
                    this.currentIndex = Math.min(this.currentIndex + 1, this.options.length - 1);
                    this.options[this.currentIndex].focus();
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (isExpanded) {
                    this.currentIndex = Math.max(this.currentIndex - 1, 0);
                    this.options[this.currentIndex].focus();
                }
                break;
        }
    }
}

// ==================== PROGRESSIVE DISCLOSURE ====================

const dynamicFieldTemplates = {
    marketing: `
        <div class="form-group dynamic-field">
            <div class="input-wrapper">
                <input 
                    type="text" 
                    id="social-channels" 
                    name="socialChannels"
                    class="form-input"
                    placeholder=" "
                >
                <label for="social-channels" class="floating-label">
                    <span class="label-text">SOCIAL MEDIA CHANNELS</span>
                </label>
                <div class="input-glow"></div>
            </div>
        </div>
        <div class="form-group dynamic-field">
            <div class="input-wrapper">
                <input 
                    type="text" 
                    id="target-audience" 
                    name="targetAudience"
                    class="form-input"
                    placeholder=" "
                >
                <label for="target-audience" class="floating-label">
                    <span class="label-text">TARGET AUDIENCE</span>
                </label>
                <div class="input-glow"></div>
            </div>
        </div>
    `,
    saas: `
        <div class="form-group dynamic-field">
            <div class="input-wrapper">
                <input 
                    type="text" 
                    id="tech-stack" 
                    name="techStack"
                    class="form-input"
                    placeholder=" "
                >
                <label for="tech-stack" class="floating-label">
                    <span class="label-text">TECHNOLOGY STACK</span>
                </label>
                <div class="input-glow"></div>
            </div>
        </div>
    `,
    enterprise: `
        <div class="form-group dynamic-field">
            <div class="input-wrapper">
                <input 
                    type="text" 
                    id="department" 
                    name="department"
                    class="form-input"
                    placeholder=" "
                >
                <label for="department" class="floating-label">
                    <span class="label-text">DEPARTMENT</span>
                </label>
                <div class="input-glow"></div>
            </div>
        </div>
    `,
    research: `
        <div class="form-group dynamic-field">
            <div class="input-wrapper">
                <input 
                    type="text" 
                    id="research-area" 
                    name="researchArea"
                    class="form-input"
                    placeholder=" "
                >
                <label for="research-area" class="floating-label">
                    <span class="label-text">RESEARCH AREA</span>
                </label>
                <div class="input-glow"></div>
            </div>
        </div>
    `
};

function handleProjectTypeChange(type) {
    const dynamicFieldsContainer = document.getElementById('dynamic-fields');
    
    if (type && dynamicFieldTemplates[type]) {
        dynamicFieldsContainer.innerHTML = dynamicFieldTemplates[type];
        dynamicFieldsContainer.classList.add('active');
    } else {
        dynamicFieldsContainer.innerHTML = '';
        dynamicFieldsContainer.classList.remove('active');
    }
}

// ==================== ASYNC VALIDATION ====================

/**
 * Simulated API call to check project name uniqueness
 */
const checkProjectNameAvailability = async (name) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate some taken names
    const takenNames = ['quantum leap', 'genesis', 'apollo', 'nexus'];
    return !takenNames.includes(name.toLowerCase());
};

/**
 * Debounced project name validator
 */
const validateProjectName = debounce(async (input) => {
    const value = input.value.trim();
    const errorTooltip = input.closest('.form-group').querySelector('.error-tooltip');
    
    if (value.length < 3) {
        showError(errorTooltip, 'Project name must be at least 3 characters');
        return;
    }
    
    // Show loading state
    input.style.borderColor = 'var(--color-warning)';
    
    const isAvailable = await checkProjectNameAvailability(value);
    
    if (isAvailable) {
        hideError(errorTooltip);
        input.style.borderColor = 'var(--color-success)';
    } else {
        showError(errorTooltip, 'This project name is already taken. Please choose another.');
        input.style.borderColor = 'var(--color-error)';
    }
}, 500);

// ==================== ERROR HANDLING ====================

function showError(tooltip, message) {
    tooltip.textContent = message;
    tooltip.classList.add('visible');
    tooltip.setAttribute('aria-live', 'assertive');
}

function hideError(tooltip) {
    tooltip.classList.remove('visible');
    tooltip.textContent = '';
}

// ==================== FOCUS MODE ====================

function setupFocusMode() {
    const form = document.getElementById('genesis-form');
    const formGroups = form.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('.form-input, .custom-select');
        
        if (input) {
            input.addEventListener('focus', () => {
                form.classList.add('focus-mode');
                formGroups.forEach(g => g.classList.remove('focused'));
                group.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                setTimeout(() => {
                    if (!document.activeElement.closest('.form-group')) {
                        form.classList.remove('focus-mode');
                        formGroups.forEach(g => g.classList.remove('focused'));
                    }
                }, 100);
            });
        }
    });
}

// ==================== FORM SUBMISSION ====================

function setupFormSubmission() {
    const form = document.getElementById('genesis-form');
    const submitBtn = document.getElementById('submit-btn');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const isValid = form.checkValidity();
        
        if (!isValid) {
            // Show validation errors
            const invalidInputs = form.querySelectorAll(':invalid');
            invalidInputs.forEach(input => {
                const errorTooltip = input.closest('.form-group')?.querySelector('.error-tooltip');
                if (errorTooltip) {
                    showError(errorTooltip, 'This field is required');
                }
            });
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success - would normally redirect or show success message
        console.log('Form submitted successfully!');
        
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Reset dirty state
        if (window.formStateManager) {
            window.formStateManager.reset();
        }
    });
}

// ==================== UNSAVED CHANGES PROTECTION ====================

function setupUnsavedChangesProtection() {
    const modal = document.getElementById('unsaved-modal');
    const cancelBtn = document.getElementById('modal-cancel');
    const confirmBtn = document.getElementById('modal-confirm');
    let pendingNavigation = null;
    
    // Prevent page unload if dirty
    window.addEventListener('beforeunload', (e) => {
        if (window.formStateManager && window.formStateManager.isDirty) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });
    
    // Modal handlers
    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        pendingNavigation = null;
    });
    
    confirmBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        if (pendingNavigation) {
            window.location.href = pendingNavigation;
        }
    });
}

// ==================== REAL-TIME VALIDATION ====================

function setupRealtimeValidation() {
    // Email validation
    const emailInput = document.getElementById('email');
    const emailTooltip = emailInput.closest('.form-group').querySelector('.error-tooltip');
    
    emailInput.addEventListener('blur', () => {
        const value = emailInput.value.trim();
        if (value && !isValidEmail(value)) {
            showError(emailTooltip, 'Please enter a valid email address');
        } else {
            hideError(emailTooltip);
        }
    });
    
    // Password validation
    const passwordInput = document.getElementById('password');
    const passwordTooltip = passwordInput.closest('.form-group').querySelector('.error-tooltip');
    
    passwordInput.addEventListener('input', debounce(() => {
        const value = passwordInput.value;
        if (value) {
            const validation = validatePassword(value);
            if (!validation.isValid) {
                showError(passwordTooltip, validation.message);
            } else {
                hideError(passwordTooltip);
            }
        }
    }, 300));
    
    // Project name validation
    const projectNameInput = document.getElementById('project-name');
    projectNameInput.addEventListener('input', () => {
        validateProjectName(projectNameInput);
    });
}

// ==================== LOCAL STORAGE PERSISTENCE ====================

function setupLocalStoragePersistence() {
    const form = document.getElementById('genesis-form');
    const STORAGE_KEY = 'genesis-form-draft';
    
    // Load saved data
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = data[key];
                }
            });
        } catch (e) {
            console.error('Failed to load saved form data:', e);
        }
    }
    
    // Save on input (debounced)
    const saveFormData = debounce(() => {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 1000);
    
    form.addEventListener('input', saveFormData);
    
    // Clear on successful submit
    form.addEventListener('submit', () => {
        localStorage.removeItem(STORAGE_KEY);
    });
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize custom select
    const selectElement = document.getElementById('project-type-select');
    new CustomSelect(selectElement);
    
    // Initialize input masking
    const budgetInput = document.getElementById('budget');
    InputMask.currency(budgetInput);
    
    // Initialize form state manager
    const form = document.getElementById('genesis-form');
    window.formStateManager = new FormStateManager(form);
    
    // Setup features
    setupFocusMode();
    setupFormSubmission();
    setupUnsavedChangesProtection();
    setupRealtimeValidation();
    setupLocalStoragePersistence();
    
    // Tab index flow - ensure logical order
    const focusableElements = form.querySelectorAll('input, select, button, [tabindex]');
    focusableElements.forEach((el, index) => {
        if (!el.hasAttribute('tabindex') || el.getAttribute('tabindex') === '0') {
            el.setAttribute('tabindex', index + 1);
        }
    });
    
    console.log('✦ Genesis Form System Initialized');
});
