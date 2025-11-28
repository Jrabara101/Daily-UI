/* =====================================================
   DYNAMIC COUNTDOWN TIMER - JAVASCRIPT
   ===================================================== */

// =====================================================
// CONFIGURATION
// =====================================================

const CONFIG = {
    targetDate: new Date("June 21, 2026 18:00:00").getTime(), // Target: June 21st, 2026 at 6 PM
    updateInterval: 1000, // Update every 1 second
    urgencyThreshold: 60000, // 1 minute in milliseconds
};

// =====================================================
// DOM ELEMENTS
// =====================================================

const countdownElements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    segment: document.getElementById('seconds-segment'),
    message: document.getElementById('countdown-message'),
    container: document.getElementById('countdown-container'),
    eventDetails: document.getElementById('event-details'),
    progressBar: document.getElementById('progress-bar'),
    progressText: document.getElementById('progress-text')
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Pad single digits with a leading zero
 * @param {number} num - The number to pad
 * @returns {string} - Padded number as string
 */
const pad = (num) => num < 10 ? "0" + num : num;

/**
 * Format milliseconds into time components
 * @param {number} distance - Distance in milliseconds
 * @returns {object} - Object with days, hours, minutes, seconds
 */
const calculateTimeComponents = (distance) => {
    const day = 1000 * 60 * 60 * 24;
    const hour = 1000 * 60 * 60;
    const minute = 1000 * 60;
    const second = 1000;

    return {
        days: Math.floor(distance / day),
        hours: Math.floor((distance % day) / hour),
        minutes: Math.floor((distance % hour) / minute),
        seconds: Math.floor((distance % minute) / second)
    };
};

/**
 * Calculate progress percentage
 * @param {number} distance - Current distance to target
 * @param {number} totalDistance - Initial distance to target
 * @returns {number} - Progress percentage (0-100)
 */
const calculateProgress = (distance, totalDistance) => {
    const percentage = (distance / totalDistance) * 100;
    return Math.max(0, Math.min(100, percentage));
};

/**
 * Store initial countdown distance for progress calculation
 */
let initialDistance = CONFIG.targetDate - new Date().getTime();

// =====================================================
// UPDATE COUNTDOWN
// =====================================================

const updateCountdown = () => {
    // Get current time and calculate distance
    const now = new Date().getTime();
    const distance = CONFIG.targetDate - now;

    // Get time components
    const time = calculateTimeComponents(distance);

    // Check if countdown is finished
    if (distance < 0) {
        handleCountdownComplete();
        return;
    }

    // Update UI with current time
    updateTimeDisplay(time);

    // Update progress bar
    updateProgressBar(distance);

    // Handle urgency state (less than 1 minute)
    if (distance < CONFIG.urgencyThreshold) {
        handleUrgency(distance);
    } else {
        removeUrgency();
    }
};

/**
 * Update time display on UI
 * @param {object} time - Time components object
 */
const updateTimeDisplay = (time) => {
    countdownElements.days.textContent = pad(time.days);
    countdownElements.hours.textContent = pad(time.hours);
    countdownElements.minutes.textContent = pad(time.minutes);
    countdownElements.seconds.textContent = pad(time.seconds);
};

/**
 * Update progress bar display
 * @param {number} distance - Current distance to target
 */
const updateProgressBar = (distance) => {
    const progress = calculateProgress(distance, initialDistance);
    countdownElements.progressBar.style.width = progress + '%';

    // Update progress text
    const time = calculateTimeComponents(distance);
    const totalTime = calculateTimeComponents(initialDistance);
    const percentage = Math.round(progress);
    countdownElements.progressText.textContent = `Countdown Progress: ${percentage}% Complete`;
};

/**
 * Handle urgency state (less than 1 minute remaining)
 * @param {number} distance - Current distance
 */
const handleUrgency = (distance) => {
    // Add pulse animation to seconds segment
    if (!countdownElements.segment.classList.contains('urgent-pulse')) {
        countdownElements.segment.classList.add('urgent-pulse');
    }

    // Update message
    const seconds = Math.floor(distance / 1000);
    countdownElements.message.classList.add('urgent');
    countdownElements.message.innerHTML = `<span style="color: #FF5733; font-weight: 900;">HEADS UP!</span> <span style="color: #33FFBD;">Only ${pad(seconds)} seconds remaining!</span>`;
};

/**
 * Remove urgency styling
 */
const removeUrgency = () => {
    countdownElements.segment.classList.remove('urgent-pulse');
    countdownElements.message.classList.remove('urgent');
    countdownElements.message.innerHTML = 'Get ready for the best weekend of the year!';
};

/**
 * Handle countdown completion
 */
const handleCountdownComplete = () => {
    // Stop the interval
    clearInterval(countdownInterval);

    // Clear display
    updateTimeDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Hide countdown container
    countdownElements.container.classList.add('hidden');

    // Stop pulse animation
    countdownElements.segment.classList.remove('urgent-pulse');

    // Show event details
    countdownElements.eventDetails.classList.remove('hidden');
    countdownElements.eventDetails.classList.add('animate-bounce');

    // Update message
    countdownElements.message.innerHTML = '🎉 <span style="color: #FF5733;">THE FESTIVAL IS HERE!</span> 🎉';
    countdownElements.message.innerHTML += '<br><span style="color: #33FFBD;">Enjoy the music and celebrate!</span>';

    // Add event-live class to body for styling changes
    document.body.classList.add('event-live');

    // Hide progress bar
    document.querySelector('.mt-12').style.display = 'none';
};

// =====================================================
// EVENT LISTENERS
// =====================================================

/**
 * Add event listener to ticket button
 */
document.addEventListener('DOMContentLoaded', () => {
    const ticketButton = document.querySelector('#event-details button');
    if (ticketButton) {
        ticketButton.addEventListener('click', () => {
            alert('Thank you for your interest! Ticket purchase functionality coming soon.');
        });
    }
});

// =====================================================
// KEYBOARD ACCESSIBILITY
// =====================================================

/**
 * Allow spacebar or enter to trigger ticket purchase
 */
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        const ticketButton = document.querySelector('#event-details button');
        if (ticketButton && !countdownElements.eventDetails.classList.contains('hidden')) {
            e.preventDefault();
            ticketButton.click();
        }
    }
});

// =====================================================
// RESPONSIVE UPDATES
// =====================================================

/**
 * Handle window resize for responsive adjustments
 */
window.addEventListener('resize', () => {
    // Could add responsive logic here if needed
});

// =====================================================
// INITIALIZATION
// =====================================================

/**
 * Initialize countdown timer
 */
const initializeCountdown = () => {
    // Run the function once immediately to avoid a 1-second delay
    updateCountdown();

    // Update the countdown every 1 second
    window.countdownInterval = setInterval(updateCountdown, CONFIG.updateInterval);

    // Log initialization
    console.log('✅ Countdown Timer Initialized');
    console.log(`📅 Target Date: ${new Date(CONFIG.targetDate).toLocaleString()}`);
    console.log(`⏱️ Update Interval: ${CONFIG.updateInterval}ms`);
};

// =====================================================
// DEBUG UTILITIES (Remove in production)
// =====================================================

/**
 * Utility function to manually skip to end of countdown (for testing)
 * Uncomment to use: skipToEnd()
 */
window.skipToEnd = () => {
    CONFIG.targetDate = new Date().getTime() - 1000;
    updateCountdown();
};

/**
 * Utility function to reset countdown (for testing)
 * Uncomment to use: resetCountdown()
 */
window.resetCountdown = () => {
    CONFIG.targetDate = new Date("June 21, 2026 18:00:00").getTime();
    initialDistance = CONFIG.targetDate - new Date().getTime();
    clearInterval(window.countdownInterval);
    document.body.classList.remove('event-live');
    countdownElements.container.classList.remove('hidden');
    countdownElements.eventDetails.classList.add('hidden');
    updateCountdown();
    window.countdownInterval = setInterval(updateCountdown, CONFIG.updateInterval);
};

// =====================================================
// START COUNTDOWN ON PAGE LOAD
// =====================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCountdown);
} else {
    initializeCountdown();
}