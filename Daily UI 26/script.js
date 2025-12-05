// DOM Elements
const subscribeForm = document.getElementById('subscribeForm');
const subscribeBtn = document.getElementById('subscribeBtn');
const successMessage = document.getElementById('successMessage');
const frequencySlider = document.getElementById('frequencySlider');
const sliderValue = document.getElementById('sliderValue');
const popupIcon = document.getElementById('popupIcon');

// Frequency options
const frequencyOptions = ['Daily', 'Weekly', 'Monthly'];

// Update slider value display
frequencySlider.addEventListener('input', function() {
    const value = parseInt(this.value);
    sliderValue.textContent = frequencyOptions[value];
    
    // Add animation effect
    sliderValue.style.transform = 'scale(1.2)';
    setTimeout(() => {
        sliderValue.style.transform = 'scale(1)';
    }, 200);
});

// Popup icon click handler
popupIcon.addEventListener('click', function() {
    // Animate the icon
    this.style.animation = 'none';
    setTimeout(() => {
        this.style.animation = 'popupBounce 2s ease-in-out infinite';
    }, 10);
    
    // Show notification
    showNotification('New updates available!');
});

// Form submission handler
subscribeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const zipcode = document.getElementById('zipcode').value.trim();
    const frequency = frequencyOptions[parseInt(frequencySlider.value)];
    
    // Validate email
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Validate zip code if provided
    if (zipcode && !isValidZipCode(zipcode)) {
        showError('Please enter a valid 5-digit zip code');
        return;
    }
    
    // Disable button and show loading state
    subscribeBtn.disabled = true;
    subscribeBtn.innerHTML = '<span class="btn-text">Subscribing...</span><i class="fas fa-spinner fa-spin btn-icon"></i>';
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        subscribeForm.style.display = 'none';
        successMessage.classList.add('show');
        
        // Log subscription data (in real app, this would be sent to server)
        console.log('Subscription Data:', {
            name: name,
            email: email,
            zipcode: zipcode || 'Not provided',
            frequency: frequency
        });
        
        // Reset form after 3 seconds
        setTimeout(() => {
            resetForm();
        }, 3000);
    }, 1500);
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Zip code validation
function isValidZipCode(zipcode) {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zipcode);
}

// Show error message
function showError(message) {
    // Create error element if it doesn't exist
    let errorElement = document.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        subscribeForm.insertBefore(errorElement, subscribeForm.firstChild);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.style.animation = 'slideDown 0.5s ease-out';
    
    // Remove error after 3 seconds
    setTimeout(() => {
        errorElement.style.animation = 'slideUp 0.5s ease-out';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 500);
    }, 3000);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Reset form
function resetForm() {
    subscribeForm.reset();
    subscribeForm.style.display = 'block';
    successMessage.classList.remove('show');
    subscribeBtn.disabled = false;
    subscribeBtn.innerHTML = '<span class="btn-text">Subscribe Now</span><i class="fas fa-arrow-right btn-icon"></i>';
    sliderValue.textContent = frequencyOptions[1];
    frequencySlider.value = 1;
}

// Add input focus animations
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Add CSS for error message and notification
const style = document.createElement('style');
style.textContent = `
    .error-message {
        display: none;
        padding: 12px;
        background: #ff6b6b;
        color: white;
        border-radius: 8px;
        margin-bottom: 15px;
        text-align: center;
        font-size: 14px;
        animation: slideDown 0.5s ease-out;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border-radius: 12px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 500;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

