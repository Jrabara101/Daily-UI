// DOM Elements
const formInputs = {
    passengerName: document.getElementById('passengerName'),
    origin: document.getElementById('origin'),
    destination: document.getElementById('destination'),
    originCity: document.getElementById('originCity'),
    destCity: document.getElementById('destCity'),
    gate: document.getElementById('gate'),
    seat: document.getElementById('seat'),
    flight: document.getElementById('flight'),
    date: document.getElementById('date'),
    time: document.getElementById('time')
};

const displayElements = {
    displayName: document.getElementById('displayName'),
    displayNameRight: document.getElementById('displayNameRight'),
    displayOriginCode: document.getElementById('displayOriginCode'),
    displayOriginCodeRight: document.getElementById('displayOriginCodeRight'),
    displayDestCode: document.getElementById('displayDestCode'),
    displayDestCodeRight: document.getElementById('displayDestCodeRight'),
    displayOriginCity: document.getElementById('displayOriginCity'),
    displayDestCity: document.getElementById('displayDestCity'),
    displayGate: document.getElementById('displayGate'),
    displaySeat: document.getElementById('displaySeat'),
    displaySeatRight: document.getElementById('displaySeatRight'),
    displayFlight: document.getElementById('displayFlight'),
    displayFlightRight: document.getElementById('displayFlightRight'),
    displayDate: document.getElementById('displayDate'),
    displayTime: document.getElementById('displayTime')
};

const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const ticketCard = document.getElementById('ticketCard');
const toast = document.getElementById('toast');

// Real-time Update Setup
Object.keys(formInputs).forEach(key => {
    formInputs[key].addEventListener('input', updateBoardingPass);
});

// Controls Setup
generateBtn.addEventListener('click', () => {
    updateBoardingPass();
    
    // Add brief flash/glow effect to the ticket 
    ticketCard.style.boxShadow = "0 0 50px 20px rgba(0, 229, 255, 0.4)";
    setTimeout(() => {
        ticketCard.style.boxShadow = ""; // Revert to CSS hover/default state
    }, 400);

    showNotification('Boarding Pass Generated!');
});

resetBtn.addEventListener('click', resetForm);

// Core Update Function
function updateBoardingPass() {
    const vals = {
        passengerName: formInputs.passengerName.value.toUpperCase() || 'XXX XXX',
        origin: formInputs.origin.value.toUpperCase() || 'XXX',
        destination: formInputs.destination.value.toUpperCase() || 'XXX',
        originCity: formInputs.originCity.value.toUpperCase() || 'CITY',
        destCity: formInputs.destCity.value.toUpperCase() || 'CITY',
        gate: formInputs.gate.value.toUpperCase() || '--',
        seat: formInputs.seat.value.toUpperCase() || '--',
        flight: formInputs.flight.value.toUpperCase() || '-----',
        date: formInputs.date.value.toUpperCase() || '--/--/----',
        time: formInputs.time.value.toUpperCase() || '--:--'
    };

    // Update Left
    displayElements.displayName.textContent = vals.passengerName;
    displayElements.displayOriginCode.textContent = vals.origin;
    displayElements.displayDestCode.textContent = vals.destination;
    displayElements.displayOriginCity.textContent = vals.originCity;
    displayElements.displayDestCity.textContent = vals.destCity;
    displayElements.displayGate.textContent = vals.gate;
    displayElements.displaySeat.textContent = vals.seat;
    displayElements.displayFlight.textContent = vals.flight;
    displayElements.displayDate.textContent = vals.date;
    displayElements.displayTime.textContent = vals.time;

    // Update Right
    displayElements.displayNameRight.textContent = vals.passengerName;
    displayElements.displayOriginCodeRight.textContent = vals.origin;
    displayElements.displayDestCodeRight.textContent = vals.destination;
    displayElements.displaySeatRight.textContent = vals.seat;
    displayElements.displayFlightRight.textContent = vals.flight;
}

// Reset Form Function
function resetForm() {
    formInputs.passengerName.value = 'ALEX JENKINS';
    formInputs.origin.value = 'JFK';
    formInputs.destination.value = 'LAX';
    formInputs.originCity.value = 'NEW YORK';
    formInputs.destCity.value = 'LOS ANGELES';
    formInputs.gate.value = 'B14';
    formInputs.seat.value = '12F';
    formInputs.flight.value = 'AA038';
    formInputs.date.value = 'OCT 24, 2026';
    formInputs.time.value = '09:45 AM';

    updateBoardingPass();
    showNotification('Form reset to default.');
}

// Toast Notification
let toastTimeout;
function showNotification(msg) {
    clearTimeout(toastTimeout);
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.add('show');
    
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 3D Tilt Effect on Ticket Card
const previewSection = document.querySelector('.preview-section');

previewSection.addEventListener('mousemove', (e) => {
    // Determine mouse position relative to the preview section center
    const rect = previewSection.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top; // y position within the element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (max 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    ticketCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
});

previewSection.addEventListener('mouseleave', () => {
    // Reset ticket position gracefully
    ticketCard.style.transform = `rotateX(0) rotateY(0) translateZ(0)`;
});

// Initialize on load
window.addEventListener('load', () => {
    updateBoardingPass();
    
    // Add staggered entrance animations to form inputs
    const inputs = document.querySelectorAll('.custom-input');
    inputs.forEach((input, index) => {
        input.style.opacity = '0';
        input.style.animation = `fadeInLeft 0.5s ${0.2 + (index * 0.05)}s forwards`;
    });
});