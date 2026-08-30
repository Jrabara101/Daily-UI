/**
 * ContextEngine — Manages user presence, multi-state mood rings, personas, and expiry timers.
 */
export const MOOD_PRESETS = {
    deep_work: {
        id: 'deep_work',
        label: 'Deep Work',
        tagline: 'Flow state active',
        gradientStart: '#ec4899',
        gradientEnd: '#8b5cf6',
        dotColor: '#a855f7',
        icon: '🧠',
        animationSpeed: '3s'
    },
    available: {
        id: 'available',
        label: 'Available',
        tagline: 'Open for pairing / sync',
        gradientStart: '#10b981',
        gradientEnd: '#06b6d4',
        dotColor: '#10b981',
        icon: '🟢',
        animationSpeed: '6s'
    },
    meeting: {
        id: 'meeting',
        label: 'In a Meeting',
        tagline: 'Collaborative discussion',
        gradientStart: '#f59e0b',
        gradientEnd: '#ef4444',
        dotColor: '#f59e0b',
        icon: '👥',
        animationSpeed: '4s'
    },
    shipping: {
        id: 'shipping',
        label: 'Shipping / Deploying',
        tagline: 'Production push active',
        gradientStart: '#06b6d4',
        gradientEnd: '#3b82f6',
        dotColor: '#38bdf8',
        icon: '🚀',
        animationSpeed: '2s'
    },
    brainstorming: {
        id: 'brainstorming',
        label: 'Brainstorming',
        tagline: 'Designing architecture',
        gradientStart: '#8b5cf6',
        gradientEnd: '#f43f5e',
        dotColor: '#f43f5e',
        icon: '💡',
        animationSpeed: '3.5s'
    },
    afk: {
        id: 'afk',
        label: 'Stepped Away',
        tagline: 'AFK / grabbing coffee',
        gradientStart: '#71717a',
        gradientEnd: '#a1a1aa',
        dotColor: '#71717a',
        icon: '☕',
        animationSpeed: '8s'
    },
    on_call: {
        id: 'on_call',
        label: 'On-Call Incident',
        tagline: 'Investigating high-pri alert',
        gradientStart: '#ef4444',
        gradientEnd: '#b91c1c',
        dotColor: '#ef4444',
        icon: '🚨',
        animationSpeed: '1.2s'
    },
    async: {
        id: 'async',
        label: 'Async Only',
        tagline: 'Responding asynchronously',
        gradientStart: '#14b8a6',
        gradientEnd: '#3b82f6',
        dotColor: '#14b8a6',
        icon: '⚡',
        animationSpeed: '5s'
    }
};

export const USER_PERSONAS = {
    alex: {
        id: 'alex',
        name: 'Alex Rivera',
        handle: '@alex',
        role: 'Staff Systems Architect',
        department: 'Platform Engineering',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        defaultMood: 'deep_work'
    },
    sarah: {
        id: 'sarah',
        name: 'Sarah Chen',
        handle: '@sarah',
        role: 'Lead Product Designer',
        department: 'Design Systems & UX',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        defaultMood: 'brainstorming'
    },
    marcus: {
        id: 'marcus',
        name: 'Marcus Vance',
        handle: '@marcus',
        role: 'Principal SRE',
        department: 'Cloud Infrastructure',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        defaultMood: 'shipping'
    }
};

export class ContextEngine {
    constructor(soundEngine) {
        this.soundEngine = soundEngine;
        this.currentPersonaId = localStorage.getItem('pulsestream_persona') || 'alex';
        this.currentMoodId = localStorage.getItem('pulsestream_mood') || 'deep_work';
        this.expiryTimestamp = null;
        this.expiryTimer = null;
        this.onStateChangeCallbacks = [];
    }

    init() {
        this.applyContext(this.currentPersonaId, this.currentMoodId);
    }

    getCurrentUser() {
        return USER_PERSONAS[this.currentPersonaId] || USER_PERSONAS.alex;
    }

    getCurrentMood() {
        return MOOD_PRESETS[this.currentMoodId] || MOOD_PRESETS.deep_work;
    }

    setPersona(personaId) {
        if (!USER_PERSONAS[personaId]) return;
        this.currentPersonaId = personaId;
        localStorage.setItem('pulsestream_persona', personaId);
        const defaultMood = USER_PERSONAS[personaId].defaultMood || 'available';
        this.setMood(defaultMood);
        this.notifyChange();
    }

    setMood(moodId, durationMinutes = null) {
        if (!MOOD_PRESETS[moodId]) return;
        this.currentMoodId = moodId;
        localStorage.setItem('pulsestream_mood', moodId);

        if (this.expiryTimer) {
            clearTimeout(this.expiryTimer);
            this.expiryTimer = null;
        }

        if (durationMinutes && durationMinutes > 0) {
            this.expiryTimestamp = Date.now() + durationMinutes * 60 * 1000;
            this.expiryTimer = setTimeout(() => {
                this.setMood('available');
            }, durationMinutes * 60 * 1000);
        } else {
            this.expiryTimestamp = null;
        }

        this.applyContext(this.currentPersonaId, this.currentMoodId);
        this.notifyChange();
    }

    applyContext(personaId, moodId) {
        const user = USER_PERSONAS[personaId] || USER_PERSONAS.alex;
        const mood = MOOD_PRESETS[moodId] || MOOD_PRESETS.deep_work;

        // 1. Update Profile Avatar & Info in Header
        const avatarImg = document.querySelector('#currentUserAvatar .avatar-img');
        if (avatarImg) {
            avatarImg.src = user.avatar;
            avatarImg.alt = user.name;
        }

        const statusText = document.querySelector('.user-status .status-text');
        if (statusText) {
            statusText.textContent = `${mood.icon} ${mood.label}`;
        }

        const statusDot = document.querySelector('.user-status .status-indicator');
        if (statusDot) {
            statusDot.style.backgroundColor = mood.dotColor;
            statusDot.style.boxShadow = `0 0 10px ${mood.dotColor}`;
        }

        // 2. Update SVG Gradient Mood Ring
        const stop1 = document.querySelector('#moodGradient stop[offset="0%"]');
        const stop2 = document.querySelector('#moodGradient stop[offset="100%"]');
        if (stop1 && stop2) {
            stop1.style.stopColor = mood.gradientStart;
            stop2.style.stopColor = mood.gradientEnd;
        }

        const rotatingBorder = document.querySelector('.rotating-border');
        if (rotatingBorder) {
            rotatingBorder.style.animationDuration = mood.animationSpeed;
        }
    }

    subscribe(callback) {
        this.onStateChangeCallbacks.push(callback);
    }

    notifyChange() {
        this.onStateChangeCallbacks.forEach(cb => cb(this.getCurrentUser(), this.getCurrentMood()));
    }
}
