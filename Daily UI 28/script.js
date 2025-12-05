// DOM Elements
const modalOverlay = document.getElementById('modalOverlay');
const contactModal = document.getElementById('contactModal');
const closeBtn = document.getElementById('closeBtn');
const openModalBtn = document.getElementById('openModalBtn');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const inputs = document.querySelectorAll('input, textarea');

// Open Modal
function openModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus on first input
    setTimeout(() => {
        document.getElementById('name').focus();
    }, 300);
}

// Close Modal
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    // Reset form if needed
    if (successMessage.classList.contains('show')) {
        setTimeout(() => {
            resetForm();
        }, 300);
    }
}

// Event Listeners
openModalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

// Form Submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate email
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        contactForm.style.display = 'none';
        successMessage.classList.add('show');
        
        // Log form data (in real app, this would be sent to server)
        console.log('Contact Form Submitted:', {
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString()
        });
        
        // Auto close after 3 seconds
        setTimeout(() => {
            closeModal();
        }, 3000);
    }, 1500);
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message
function showError(message) {
    // Remove existing error if any
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    contactForm.insertBefore(errorElement, contactForm.firstChild);
    
    // Animate in
    setTimeout(() => {
        errorElement.style.opacity = '1';
        errorElement.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove error after 3 seconds
    setTimeout(() => {
        errorElement.style.opacity = '0';
        errorElement.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            errorElement.remove();
        }, 300);
    }, 3000);
}

// Reset form
function resetForm() {
    contactForm.reset();
    contactForm.style.display = 'block';
    successMessage.classList.remove('show');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';
}

// Input focus animations
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
    
    // Add floating label effect on input
    input.addEventListener('input', function() {
        if (this.value.length > 0) {
            this.style.borderColor = '#667eea';
        } else {
            this.style.borderColor = '#e0e0e0';
        }
    });
});

// Icon hover effects enhancement
const contactIcons = document.querySelectorAll('.contact-icon');
contactIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        const i = this.querySelector('i');
        i.style.animation = 'iconBounce 0.5s ease';
    });
});

// Add icon bounce animation
const style = document.createElement('style');
style.textContent = `
    @keyframes iconBounce {
        0%, 100% {
            transform: translateY(0) scale(1);
        }
        50% {
            transform: translateY(-5px) scale(1.1);
        }
    }
    
    .error-message {
        background: #ff6b6b;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 15px;
        text-align: center;
        font-size: 14px;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    }
    
    /* Additional icon animations */
    .contact-icon:nth-child(1):hover i {
        animation: phoneRing 0.5s ease;
    }
    
    .contact-icon:nth-child(2):hover i {
        animation: envelopeFly 0.5s ease;
    }
    
    .contact-icon:nth-child(3):hover i {
        animation: locationPulse 0.5s ease;
    }
    
    @keyframes phoneRing {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-10deg); }
        75% { transform: rotate(10deg); }
    }
    
    @keyframes envelopeFly {
        0% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
        100% { transform: translateY(0); }
    }
    
    @keyframes locationPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
    }
`;
document.head.appendChild(style);

// Auto-open modal on page load (optional - remove if not needed)
// setTimeout(() => {
//     openModal();
// }, 1000);

// Prevent form submission on Enter key in textarea (allow Shift+Enter for new line)
document.getElementById('message').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        // Allow normal behavior, form will handle submission
    }
});

