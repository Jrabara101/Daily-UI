/* =====================================================
   PRODUCT PAGE JAVASCRIPT
   ===================================================== */

// =====================================================
// THUMBNAIL GALLERY FUNCTIONALITY
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');

    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', function() {
            // Update main image
            const fullImageUrl = this.getAttribute('data-full');
            mainImage.src = fullImageUrl;

            // Update active state
            thumbnails.forEach((thumb) => thumb.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// =====================================================
// COLOR SELECTION
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    const colorButtons = document.querySelectorAll('.color-btn');
    const selectedColorSpan = document.querySelector('.selected-color');

    colorButtons.forEach((button) => {
        button.addEventListener('click', function() {
            // Update active state
            colorButtons.forEach((btn) => btn.classList.remove('active'));
            this.classList.add('active');

            // Update selected color text
            const color = this.getAttribute('data-color');
            selectedColorSpan.textContent = color;
        });
    });
});

// =====================================================
// QUANTITY SELECTOR
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    const decreaseBtn = document.getElementById('decreaseBtn');
    const increaseBtn = document.getElementById('increaseBtn');
    const quantityInput = document.getElementById('quantityInput');

    decreaseBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantityInput.value = quantity - 1;
        }
    });

    increaseBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        quantityInput.value = quantity + 1;
    });

    // Allow manual input
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = 1;
        }
    });
});

// =====================================================
// ADD TO CART BUTTON
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const cartBtnText = document.getElementById('cartBtnText');
    const cartCheckmark = document.getElementById('cartCheckmark');
    const quantityInput = document.getElementById('quantityInput');
    const selectedColorSpan = document.querySelector('.selected-color');

    addToCartBtn.addEventListener('click', function() {
        const quantity = quantityInput.value;
        const color = selectedColorSpan.textContent;

        // Show success state
        cartBtnText.style.display = 'none';
        cartCheckmark.style.display = 'inline';
        addToCartBtn.style.background = '#4caf50';

        // Show notification
        showNotification(`✓ Added ${quantity} AudioMax Pro (${color}) to cart`);

        // Reset button after 2 seconds
        setTimeout(() => {
            cartBtnText.style.display = 'inline';
            cartCheckmark.style.display = 'none';
            addToCartBtn.style.background = '';
        }, 2000);
    });
});

// =====================================================
// WISHLIST BUTTON
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    let isWishlisted = false;

    wishlistBtn.addEventListener('click', function() {
        isWishlisted = !isWishlisted;

        if (isWishlisted) {
            wishlistBtn.textContent = '♥ Wishlisted';
            wishlistBtn.style.background = '#ffe8e8';
            wishlistBtn.style.color = '#ff6b6b';
            showNotification('♥ Added to your wishlist');
        } else {
            wishlistBtn.textContent = '♡ Wishlist';
            wishlistBtn.style.background = '';
            wishlistBtn.style.color = '';
            showNotification('♥ Removed from wishlist');
        }
    });
});

// =====================================================
// TAB FUNCTIONALITY
// ===================================================== 

document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach((button) => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Hide all tab contents
            tabContents.forEach((content) => {
                content.classList.remove('active');
            });

            // Remove active class from all buttons
            tabButtons.forEach((btn) => {
                btn.classList.remove('active');
            });

            // Show selected tab content
            document.getElementById(tabName).classList.add('active');

            // Add active class to clicked button
            this.classList.add('active');
        });
    });
});

// =====================================================
// NOTIFICATION TOAST
// ===================================================== 

function showNotification(message) {
    const toast = document.getElementById('notificationToast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.classList.add('show');

    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// =====================================================
// ZOOM IMAGE ON HOVER (FUTURE ENHANCEMENT)
// ===================================================== 

document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.querySelector('.main-image');
    const mainImg = document.getElementById('mainImage');

    mainImage.addEventListener('mouseenter', function() {
        // Store original size for reference
        this.style.cursor = 'zoom-in';
    });

    mainImage.addEventListener('mouseleave', function() {
        this.style.cursor = 'zoom-in';
    });

    // Click to zoom in/out (optional feature)
    mainImage.addEventListener('click', function() {
        if (mainImg.style.transform === 'scale(1.5)') {
            mainImg.style.transform = 'scale(1)';
            mainImg.style.transition = 'transform 0.3s ease';
        } else {
            mainImg.style.transform = 'scale(1.5)';
            mainImg.style.transition = 'transform 0.3s ease';
        }
    });
});

// =====================================================
// SMOOTH SCROLL FOR ANCHORS
// ===================================================== 

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// =====================================================
// KEYBOARD SHORTCUTS
// ===================================================== 

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', function(event) {
        // Alt + A to add to cart
        if (event.altKey && event.key === 'a') {
            event.preventDefault();
            document.getElementById('addToCartBtn').click();
        }

        // Alt + W to wishlist
        if (event.altKey && event.key === 'w') {
            event.preventDefault();
            document.getElementById('wishlistBtn').click();
        }

        // Arrow keys for thumbnail navigation
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            const thumbnails = document.querySelectorAll('.thumbnail');
            const activeThumbnail = document.querySelector('.thumbnail.active');
            const activeIndex = Array.from(thumbnails).indexOf(activeThumbnail);

            let nextIndex;
            if (event.key === 'ArrowLeft') {
                nextIndex = activeIndex > 0 ? activeIndex - 1 : thumbnails.length - 1;
            } else {
                nextIndex = activeIndex < thumbnails.length - 1 ? activeIndex + 1 : 0;
            }

            thumbnails[nextIndex].click();
        }
    });
});

// =====================================================
// PRICE ANIMATION ON LOAD
// ===================================================== 

document.addEventListener('DOMContentLoaded', function() {
    const priceElement = document.querySelector('.current-price');
    const originalPrice = priceElement.textContent;

    // Add animation class
    priceElement.style.animation = 'slideIn 0.6s ease-out';

    // Add CSS animation if not already present
    if (!document.querySelector('style[data-animation]')) {
        const style = document.createElement('style');
        style.setAttribute('data-animation', 'true');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// =====================================================
// FORM VALIDATION
// ===================================================== 

function validateProductSelection() {
    const quantity = parseInt(document.getElementById('quantityInput').value);

    if (quantity < 1) {
        showNotification('⚠️ Please select a valid quantity');
        return false;
    }

    return true;
}

// =====================================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================================== 

document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation to color buttons
    const colorButtons = document.querySelectorAll('.color-btn');

    colorButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextButton = colorButtons[index + 1] || colorButtons[0];
                nextButton.focus();
                nextButton.click();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevButton = colorButtons[index - 1] || colorButtons[colorButtons.length - 1];
                prevButton.focus();
                prevButton.click();
            }
        });
    });
});

// =====================================================
// SCROLL TO TOP BUTTON (OPTIONAL)
// ===================================================== 

document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', function() {
        // You can add a "scroll to top" button here
        const scrollPosition = window.scrollY;
        
        // Adjust navbar on scroll
        const navbar = document.querySelector('.navbar');
        if (scrollPosition > 50) {
            navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }
    });
});