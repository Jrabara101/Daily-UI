// --- State & Config ---
const state = {
    events: [
        {
            id: 'evt-1',
            type: 'flight',
            title: 'Flight JL 408 to Kyoto',
            startTime: '08:45',
            endTime: '10:15',
            location: 'Kansai Int. Airport',
            details: 'Terminal 2 • Gate A4',
            lat: 34.4320,
            lng: 135.2304,
            icon: 'fa-plane-departure',
            conflict: false
        },
        {
            id: 'evt-2',
            type: 'travel',
            title: 'Haruka Express Train',
            startTime: '10:45',
            endTime: '12:00',
            location: 'En route to Kyoto Station',
            details: 'Car 4 • Seat 12A',
            lat: 34.9858,
            lng: 135.7588,
            icon: 'fa-train',
            conflict: false
        },
        {
            id: 'evt-3',
            type: 'dining',
            title: 'Kichi Kichi Omurice',
            startTime: '12:30',
            endTime: '13:45',
            location: 'Nakagyo Ward',
            details: 'Reservation Confirmed',
            lat: 35.0074,
            lng: 135.7700,
            icon: 'fa-utensils',
            conflict: false
        },
        {
            id: 'evt-4',
            type: 'activity',
            title: 'Kinkaku-ji (Golden Pavilion)',
            startTime: '14:30',
            endTime: '16:00',
            location: 'Kita Ward',
            details: 'Ticket QR Ready',
            lat: 35.0394,
            lng: 135.7292,
            icon: 'fa-camera',
            conflict: false
        },
        {
            id: 'evt-5',
            type: 'hotel',
            title: 'Check-in: The Ritz-Carlton',
            startTime: '16:45',
            endTime: '17:30',
            location: 'Kamogawa River',
            details: 'Room 402 • River View',
            lat: 35.0116,
            lng: 135.7699,
            icon: 'fa-bed',
            conflict: false
        }
    ],
    map: null,
    markers: {},
    observer: null
};

// --- DOM Elements ---
const eventsContainer = document.getElementById('events-container');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadState(); // Load from LocalStorage if available
    initMap();
    detectConflicts();
    renderTimeline();
    setupScrollListener();
});

// --- State Management ---
function saveState() {
    localStorage.setItem('odyssey_itinerary', JSON.stringify(state.events));
}

function loadState() {
    const saved = localStorage.getItem('odyssey_itinerary');
    if (saved) {
        try {
            state.events = JSON.parse(saved);
        } catch (e) {
            console.error("Failed to load state", e);
        }
    }
}

// --- Map Logic (Leaflet) ---
function initMap() {
    state.map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView([34.9858, 135.7588], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(state.map);

    state.events.forEach(event => {
        const marker = L.marker([event.lat, event.lng]).addTo(state.map);
        marker.bindPopup(`<b>${event.title}</b><br>${event.location}`);
        state.markers[event.id] = marker;
    });
}

// --- Render Logic ---
function renderTimeline() {
    // Clear current content
    eventsContainer.innerHTML = '';

    // Sort logic handled in conflict detection
    state.events.forEach((event, index) => {
        // 1. Check for gap logic (Transit)
        if (index > 0) {
            const prevEvent = state.events[index - 1];
            renderTransitGap(prevEvent, event);
        }

        // 2. Render Event Card
        const row = document.createElement('div');
        row.className = 'event-row';
        row.dataset.id = event.id;

        // Drag events
        row.draggable = true;
        row.addEventListener('dragstart', handleDragStart);
        row.addEventListener('dragover', handleDragOver);
        row.addEventListener('drop', handleDrop);
        row.addEventListener('dragend', handleDragEnd);

        const typeColor = getTypeColor(event.type);
        const conflictClass = event.conflict ? 'conflict-pattern' : '';

        row.innerHTML = `
            <div class="time-col">
                ${event.startTime}
                <div class="event-node" style="border-color: ${typeColor}"></div>
            </div>
            <div class="card-col">
                <div class="event-card ${conflictClass}" data-id="${event.id}">
                    <div class="card-header">
                        <span class="tag ${event.type}" style="background-color: ${typeColor}">${event.type}</span>
                        <span class="card-duration"><i class="fa-regular fa-clock"></i> ${calculateDuration(event.startTime, event.endTime)}</span>
                    </div>
                    <div class="event-title">${event.title}</div>
                    <div class="event-details">
                        <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
                        <span><i class="fa-solid fa-circle-info"></i> ${event.details}</span>
                    </div>
                </div>
            </div>
        `;

        eventsContainer.appendChild(row);
    });

    updateConnectivityLine();

    // Re-attach observer to new elements
    if (state.observer) {
        document.querySelectorAll('.event-row').forEach(row => {
            state.observer.observe(row);
        });
    }
}

function renderTransitGap(prev, current) {
    const dist = getDistance(prev.lat, prev.lng, current.lat, current.lng).toFixed(1);
    const duration = calculateTimeDiff(prev.endTime, current.startTime);

    // Logic: Only show if gap is significant (>0.5km or >15mins)
    if (dist > 0.5 || duration > 15) {
        const gap = document.createElement('div');
        gap.className = 'transit-gap';

        // Dynamic icons based on distance
        const icon = dist > 5 ? 'fa-car' : 'fa-person-walking';

        gap.innerHTML = `
            <div class="transit-icon"><i class="fa-solid ${icon}"></i></div>
            <div class="transit-line"></div>
            <span>${dist} km • ${duration > 0 ? duration + ' min' : 'Transit'}</span>
        `;
        eventsContainer.appendChild(gap);
    }
}

// --- Logic Engine: Conflicts & Time ---
function detectConflicts() {
    // Reset
    state.events.forEach(e => e.conflict = false);
    // Ensure sorted by time
    state.events.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    for (let i = 0; i < state.events.length - 1; i++) {
        const current = state.events[i];
        const next = state.events[i + 1];

        // Conflict if Current Ends AFTER Next Starts
        if (timeToMinutes(current.endTime) > timeToMinutes(next.startTime)) {
            current.conflict = true;
            next.conflict = true;
            // Haptic
            if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        }
    }
}

function timeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function calculateTimeDiff(start, end) {
    return timeToMinutes(end) - timeToMinutes(start);
}

function calculateDuration(start, end) {
    const diff = calculateTimeDiff(start, end);
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
}

function updateConnectivityLine() {
    const line = document.querySelector('.timeline-line');
    if (!line || state.events.length < 2) return;

    const typeColors = state.events.map(e => getTypeColor(e.type));

    // Create a robust gradient
    let gradientStr = 'linear-gradient(to bottom';
    typeColors.forEach((color, i) => {
        const percent = (i / (typeColors.length - 1)) * 100;
        gradientStr += `, ${color} ${percent}%`;
    });
    gradientStr += ')';

    line.style.background = gradientStr;
}

// --- Drag & Drop ---
let draggedId = null;

function handleDragStart(e) {
    draggedId = this.dataset.id;
    this.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    draggedId = null;
}

function handleDrop(e) {
    if (e.stopPropagation) e.stopPropagation();

    // Traverse up to find the row if dropped on child
    const targetRow = e.target.closest('.event-row');
    if (!targetRow) return false;

    const targetId = targetRow.dataset.id;
    if (draggedId && draggedId !== targetId) {
        const draggedIndex = state.events.findIndex(e => e.id === draggedId);
        const targetIndex = state.events.findIndex(e => e.id === targetId);

        if (draggedIndex > -1 && targetIndex > -1) {
            // Reorder
            const [movedItem] = state.events.splice(draggedIndex, 1);
            state.events.splice(targetIndex, 0, movedItem);

            // Re-render
            detectConflicts(); // Re-check (although sort happens in detectConflicts, so it might undo manual drop if times aren't changed.
            // Strict sorting prevents arbitrary DnD unless we change times.
            // For this UI, let's assume DnD SWAPS times or we disable auto-sort for a moment?
            // "Recalculating the start_time and end_time... based on the drop position."

            // AUTO-ADJUST TIME LOGIC:
            if (targetIndex > 0) {
                // Adjusted Start = Prev Event End + 15min buffer
                const prev = state.events[targetIndex - 1];
                const newStartMins = timeToMinutes(prev.endTime) + 15;
                const duration = calculateTimeDiff(movedItem.startTime, movedItem.endTime);

                movedItem.startTime = minutesToTime(newStartMins);
                movedItem.endTime = minutesToTime(newStartMins + duration);
            } else {
                // Moved to top -> set to 08:00
                const duration = calculateTimeDiff(movedItem.startTime, movedItem.endTime);
                movedItem.startTime = "08:00";
                movedItem.endTime = minutesToTime(480 + duration); // 480 = 8*60
            }

            detectConflicts(); // Recalculate
            saveState(); // Persist
            renderTimeline();
        }
    }
    return false;
}

function minutesToTime(totalMinutes) {
    let hours = Math.floor(totalMinutes / 60);
    let mins = totalMinutes % 60;
    // Wrap around 24h
    hours = hours % 24;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// --- Scroll Sync ---
function setupScrollListener() {
    const observerOptions = {
        root: document.querySelector('.timeline-wrapper'),
        threshold: 0.5,
        rootMargin: "-10% 0px -40% 0px" // Focus on center-top area
    };

    state.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.dataset.id;
                activateEvent(id);
            }
        });
    }, observerOptions);

    if (state.events.length > 0) {
        document.querySelectorAll('.event-row').forEach(row => {
            state.observer.observe(row);
        });
    }
}

function activateEvent(id) {
    document.querySelectorAll('.event-card').forEach(c => c.classList.remove('active-card'));
    const activeRow = document.querySelector(`.event-row[data-id="${id}"]`);
    if (activeRow) {
        activeRow.querySelector('.event-card').classList.add('active-card');
    }

    const event = state.events.find(e => e.id === id);
    if (event && state.map) {
        state.map.flyTo([event.lat, event.lng], 14, {
            animate: true,
            duration: 1.2
        });
        if (state.markers[id]) state.markers[id].openPopup();
    }
}

// --- Utils ---
function getTypeColor(type) {
    const colors = {
        flight: '#d35400',
        travel: '#e67e22',
        dining: '#f39c12',
        activity: '#2980b9',
        hotel: '#8e44ad'
    };
    return colors[type] || '#bdc3c7';
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
