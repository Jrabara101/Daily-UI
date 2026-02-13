// Initial Data Seeding
const DEFAULT_INVITES = [
    {
        id: '1',
        name: 'Elena Rodriguez',
        role: 'Senior UX Strategist',
        avatar: 'https://i.pravatar.cc/150?u=elena',
        sentAt: Date.now() - 1000 * 60 * 2, // 2 mins ago
        type: 'individual'
    },
    {
        id: '2',
        name: 'Founders Lab Alpha',
        role: 'Collaborative Workspace',
        avatar: '', // Group
        avatars: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2', 'https://i.pravatar.cc/150?u=3'],
        count: 8,
        sentAt: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
        type: 'group'
    },
    {
        id: '3',
        name: 'Marcus Wu',
        role: 'Lead Engineer @ TechFlow',
        avatar: 'https://i.pravatar.cc/150?u=marcus',
        sentAt: Date.now() - 1000 * 60 * 60 * 24 * 12, // 12 days ago
        type: 'individual'
    }
];

// State
let outgoingInvites = JSON.parse(localStorage.getItem('nexus_invites')) || DEFAULT_INVITES;
let undoTimer = null;
let lastRemovedInvite = null;

// DOM Elements
const outgoingListEl = document.getElementById('outgoing-list');
const outgoingCountEl = document.getElementById('outgoing-count');
const snackbarEl = document.getElementById('snackbar');
const undoBtn = document.getElementById('undo-btn');

// Render Loop
function render() {
    outgoingListEl.innerHTML = '';
    outgoingCountEl.innerText = outgoingInvites.length;

    outgoingInvites.forEach(invite => {
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'outgoing-card-wrapper';
        cardWrapper.dataset.id = invite.id;

        // Calculate opacity based on age (Decay logic)
        const ageHours = (Date.now() - invite.sentAt) / (1000 * 60 * 60);
        const opacity = ageHours > 24 ? 0.6 : 1;

        // Avatar HTML
        let avatarHtml = '';
        if (invite.type === 'group') {
            avatarHtml = `<div class="avatar-stack">
                ${invite.avatars.map(url => `<img src="${url}" class="avatar-circle">`).join('')}
                <div class="avatar-circle avatar-count">+${invite.count}</div>
            </div>`;
        } else {
            avatarHtml = `<div class="avatar-container pulse-active">
                <img src="${invite.avatar}" alt="${invite.name}">
            </div>`;
        }

        // Time Ago
        const timeString = getTimeAgo(invite.sentAt);

        cardWrapper.innerHTML = `
            <div class="cancel-bg" onclick="cancelInvite('${invite.id}')">
                <span>Cancel Request</span>
            </div>
            <div class="outgoing-card glass-card" style="opacity: ${opacity}">
                <div style="display:flex; align-items:center; width:100%">
                    ${avatarHtml}
                    <div class="details-col">
                        <h4>${invite.name}</h4>
                        <span class="truncate">${invite.role}</span>
                        <div style="margin-top:0.25rem; font-size:0.65rem; color:var(--text-muted)">
                            SENT ${timeString}
                        </div>
                    </div>
                    <div class="status-indicator status-pending">
                        Pending
                    </div>
                </div>
            </div>
        `;

        // Attach Swipe Events
        const card = cardWrapper.querySelector('.outgoing-card');
        attachSwipeGeneric(card, invite.id);

        outgoingListEl.appendChild(cardWrapper);
    });

    // Persist
    localStorage.setItem('nexus_invites', JSON.stringify(outgoingInvites));
}

// Time Ago Logic
function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "YR AGO";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "M AGO";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " DAYS AGO";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "H AGO";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "M AGO";

    return "JUST NOW";
}

// Swipe Logic (Mouse + Touch)
function attachSwipeGeneric(element, id) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const threshold = -80; // Distance to trigger 'swiped' state

    // Colors
    const warningColor = 'var(--error-red)';

    const start = (x) => {
        startX = x;
        isDragging = true;
        element.style.transition = 'none';
        // Reset others
        document.querySelectorAll('.outgoing-card.swiped').forEach(el => {
            if (el !== element) el.classList.remove('swiped');
        });
    };

    const move = (x) => {
        if (!isDragging) return;
        const diff = x - startX;

        // Only allow left swipe
        if (diff > 0) return;

        // Resistance
        currentX = diff;
        element.style.transform = `translateX(${currentX}px)`;
    };

    const end = () => {
        isDragging = false;
        element.style.transition = 'transform 0.2s ease-out';

        if (currentX < threshold) {
            element.classList.add('swiped');
            element.style.transform = ''; // Let CSS handle the fixed state
        } else {
            element.classList.remove('swiped');
            element.style.transform = 'translateX(0)';
        }
        currentX = 0;
    };

    // Touch
    element.addEventListener('touchstart', e => start(e.touches[0].clientX), { passive: true });
    element.addEventListener('touchmove', e => move(e.touches[0].clientX), { passive: true });
    element.addEventListener('touchend', end);

    // Mouse
    element.addEventListener('mousedown', e => start(e.clientX));
    window.addEventListener('mousemove', e => { if (isDragging) move(e.clientX); });
    window.addEventListener('mouseup', () => { if (isDragging) end(); });
}

// Action Logic
window.cancelInvite = (id) => {
    const index = outgoingInvites.findIndex(i => i.id === id);
    if (index > -1) {
        // Haptic
        if (navigator.vibrate) navigator.vibrate(50);

        // Optimistic Removal
        lastRemovedInvite = { data: outgoingInvites[index], index: index };
        outgoingInvites.splice(index, 1);
        render();

        // Show Snackbar
        showUndoSnackbar();

        // Set 'Physical' delete timer
        if (undoTimer) clearTimeout(undoTimer);
        undoTimer = setTimeout(() => {
            lastRemovedInvite = null; // Confirm deletion
            console.log(`Deleted invite ${id} permanently on server.`);
        }, 5000);
    }
};

function showUndoSnackbar() {
    snackbarEl.classList.add('visible');
    snackbarEl.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
        if (!lastRemovedInvite) { // If not already undone
            snackbarEl.classList.remove('visible');
            snackbarEl.setAttribute('aria-hidden', 'true');
        }
    }, 5000);
}

undoBtn.addEventListener('click', () => {
    if (lastRemovedInvite) {
        // Restore
        outgoingInvites.splice(lastRemovedInvite.index, 0, lastRemovedInvite.data);
        render();

        // Cleanup
        lastRemovedInvite = null;
        if (undoTimer) clearTimeout(undoTimer);

        snackbarEl.classList.remove('visible');
    }
});

// Incoming Approve Simulation
window.approveRequest = (btn) => {
    // 1. Loading Morph
    const originalText = btn.innerText;
    btn.innerText = "Connecting...";
    btn.style.opacity = "0.7";
    btn.disabled = true;

    setTimeout(() => {
        // 2. Success State
        btn.innerText = "";
        btn.classList.remove('btn-primary');
        btn.style.background = "rgba(16, 185, 129, 0.2)";
        btn.style.color = "#10b981";
        btn.style.border = "1px solid #10b981";

        // Haptic
        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);

        // Add badge icon
        const icon = document.createElement('span');
        icon.innerHTML = '✓ Sent';
        icon.style.fontWeight = "bold";
        btn.appendChild(icon);

        // Float animation logic could go here (DOM manipulation to move element)
        // For now, simpler button morph
    }, 1500);
};

// Initial Render
render();

// Interval to update times
// Connection Logic (Optimistic)
window.sendInvite = async (userId, btn) => {
    // 1. UI: Morph button to 'Pending' immediately (Optimistic feedback start)
    const originalText = btn.innerText;
    const originalStyle = btn.style.cssText;

    btn.classList.add('is-loading');
    btn.innerText = "Requesting...";
    btn.style.opacity = "0.7";
    btn.style.cursor = "wait";

    try {
        // 2. Network: Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));

        // 3. Success: Finalize UI state
        btn.classList.remove('is-loading');
        btn.classList.add('is-pending');
        btn.innerText = "Pending";

        // Styling for 'Pending' state
        btn.style.background = "rgba(59, 130, 246, 0.1)"; // Soft blue bg
        btn.style.color = "#93c5fd"; // Soft blue text
        btn.style.border = "1px solid rgba(59, 130, 246, 0.3)";
        btn.style.opacity = "1";
        btn.disabled = true;
        btn.style.cursor = "default";

        // Trigger haptic feedback for success
        if (navigator.vibrate) navigator.vibrate(10);

        // Add to outgoing list to show persistence across the app
        const newInvite = {
            id: 'new_' + Date.now(),
            name: 'Jessica Lee',
            role: 'Product Designer @ CreativeBox',
            avatar: 'https://i.pravatar.cc/150?u=jessica',
            sentAt: Date.now(),
            type: 'individual'
        };

        // Avoid duplicate adds if clicked multiple times rapidly (though disabled)
        if (!outgoingInvites.find(i => i.name === newInvite.name)) {
            outgoingInvites.unshift(newInvite);
            render();
            // Scroll to top to show user the new item
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

    } catch (error) {
        // 4. Error: Rollback UI state
        btn.classList.remove('is-loading');
        btn.innerText = originalText;
        btn.style.cssText = originalStyle;
        alert("Connection failed. Please try again.");
    }
};

setInterval(() => {
    render();

}, 60000);

window.triggerDemoInvite = () => {
    const suggestedSection = document.querySelector('.section-suggested');
    if (suggestedSection) {
        suggestedSection.scrollIntoView({ behavior: 'smooth' });
        // Highlight effect
        suggestedSection.style.transition = 'background 0.5s';
        suggestedSection.style.background = 'rgba(255,255,255,0.05)';
        setTimeout(() => suggestedSection.style.background = 'transparent', 1000);
    } else {
        alert("Demo: Imagine a modal opening to find people!");
    }
};
