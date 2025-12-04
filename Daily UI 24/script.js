// DOM Elements
const passengerNameInput = document.getElementById('passengerName');
const originInput = document.getElementById('origin');
const destinationInput = document.getElementById('destination');
const originCityInput = document.getElementById('originCity');
const destCityInput = document.getElementById('destCity');
const gateInput = document.getElementById('gate');
const seatInput = document.getElementById('seat');
const flightInput = document.getElementById('flight');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');

const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');

// Display Elements
const displayName = document.getElementById('displayName');
const displayNameRight = document.getElementById('displayNameRight');
const displayOriginCode = document.getElementById('displayOriginCode');
const displayOriginCodeRight = document.getElementById('displayOriginCodeRight');
const displayDestCode = document.getElementById('displayDestCode');
const displayDestCodeRight = document.getElementById('displayDestCodeRight');
const displayOriginCity = document.getElementById('displayOriginCity');
const displayDestCity = document.getElementById('displayDestCity');
const displayGate = document.getElementById('displayGate');
const displaySeat = document.getElementById('displaySeat');
const displaySeatRight = document.getElementById('displaySeatRight');
const displayFlight = document.getElementById('displayFlight');
const displayFlightRight = document.getElementById('displayFlightRight');
const displayDate = document.getElementById('displayDate');
const displayTime = document.getElementById('displayTime');

// Event Listeners
generateBtn.addEventListener('click', generateBoardingPass);
resetBtn.addEventListener('click', resetForm);

// Real-time update listeners
passengerNameInput.addEventListener('input', updateBoardingPass);
originInput.addEventListener('input', updateBoardingPass);
destinationInput.addEventListener('input', updateBoardingPass);
originCityInput.addEventListener('input', updateBoardingPass);
destCityInput.addEventListener('input', updateBoardingPass);
gateInput.addEventListener('input', updateBoardingPass);
seatInput.addEventListener('input', updateBoardingPass);
flightInput.addEventListener('input', updateBoardingPass);
dateInput.addEventListener('input', updateBoardingPass);
timeInput.addEventListener('input', updateBoardingPass);

// Generate Boarding Pass
function generateBoardingPass() {
    updateBoardingPass();
    
    // Add a visual feedback
    generateBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        generateBtn.style.transform = 'scale(1)';
    }, 100);

    // Show success message
    showNotification('Boarding pass generated successfully!');
}

// Update Boarding Pass in real-time
function updateBoardingPass() {
    const passengerName = passengerNameInput.value.toUpperCase() || 'PASSENGER NAME';
    const origin = originInput.value.toUpperCase() || 'XXX';
    const destination = destinationInput.value.toUpperCase() || 'XXX';
    const originCity = originCityInput.value.toUpperCase() || 'ORIGIN CITY';
    const destCity = destCityInput.value.toUpperCase() || 'DESTINATION CITY';
    const gate = gateInput.value || '00';
    const seat = seatInput.value.toUpperCase() || '00A';
    const flight = flightInput.value || '000';
    const date = dateInput.value.toUpperCase() || 'DATE NOT SET';
    const time = timeInput.value || 'TIME NOT SET';

    // Update left side
    displayName.textContent = passengerName;
    displayOriginCode.textContent = origin;
    displayDestCode.textContent = destination;
    displayOriginCity.textContent = originCity;
    displayDestCity.textContent = destCity;
    displayGate.textContent = gate;
    displaySeat.textContent = seat;
    displayFlight.textContent = flight;
    displayDate.textContent = date;
    displayTime.textContent = time;

    // Update right side
    displayNameRight.textContent = passengerName;
    displayOriginCodeRight.textContent = origin;
    displayDestCodeRight.textContent = destination;
    displaySeatRight.textContent = seat;
    displayFlightRight.textContent = flight;
}

// Reset Form
function resetForm() {
    passengerNameInput.value = 'GLEN B. KAISER';
    originInput.value = 'JFK';
    destinationInput.value = 'SFO';
    originCityInput.value = 'NEW YORK CITY';
    destCityInput.value = 'SAN FRANCISCO';
    gateInput.value = '34';
    seatInput.value = '56E';
    flightInput.value = '186';
    dateInput.value = 'APRIL 14, 2016';
    timeInput.value = '6:03 PM';

    updateBoardingPass();
    showNotification('Form reset to default values!');
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .btn-generate {
        transition: transform 0.1s ease, box-shadow 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize boarding pass on page load
window.addEventListener('load', () => {
    updateBoardingPass();
});