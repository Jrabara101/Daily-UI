/**
 * Senior Logic: 3D Card Mechanics
 */
class BadgeMechanics {
    constructor(element) {
        this.badge = element;
        this.glare = this.badge.querySelector('.holographic-glare');
        this.bounds = null;
        this.rafId = null;
        this.isVisible = false; // Intersection Observer flag

        // Skip setup for locked badges initially
        if (this.badge.classList.contains('locked')) {
            this.setupLockedInteractions();
            return;
        }

        this.init();
    }

    init() {
        this.badge.addEventListener('mouseenter', this.onEnter.bind(this));

        // Performance: Only add heavy listeners if visible and hovered
        // We'll attach mousemove in onEnter and remove in onLeave

        this.badge.addEventListener('mouseleave', this.onLeave.bind(this));
        this.badge.addEventListener('click', this.onClick.bind(this));

        // Mobile / Device Orientation Support
        if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
            window.addEventListener('deviceorientation', this.onOrientation.bind(this));
        }
    }

    setupLockedInteractions() {
        this.badge.addEventListener('click', () => {
            this.badge.classList.add('animate-shake');
            // Tailwind doesn't have a built-in shake, we'd need to add it or use keyframes
            this.badge.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], { duration: 300 });

            playAudio('locked');
        });
    }

    onEnter() {
        this.bounds = this.badge.getBoundingClientRect();
        this.badge.style.transition = 'none';
        if (this.glare) this.glare.style.transition = 'opacity 0.3s';
        this.badge.style.zIndex = '100';

        // Bind mousemove only when needed
        this.badge.addEventListener('mousemove', this.onMoveBind = this.onMove.bind(this));
    }

    onMove(e) {
        if (!this.bounds) return;

        const x = e.clientX - this.bounds.left;
        const y = e.clientY - this.bounds.top;
        this.updateTransform(x, y);
    }

    onOrientation(e) {
        // Only if element is visible
        if (!this.isVisible || !this.bounds) return;

        // Basic clamping for device tilt
        const gamma = Math.min(Math.max(e.gamma, -45), 45); // Left/Right
        const beta = Math.min(Math.max(e.beta, -45), 45);   // Front/Back

        // Map to card coordinates (approximate)
        const x = ((gamma + 45) / 90) * this.bounds.width;
        const y = ((beta + 45) / 90) * this.bounds.height;

        this.updateTransform(x, y);
    }

    updateTransform(x, y) {
        const centerX = this.bounds.width / 2;
        const centerY = this.bounds.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        if (this.rafId) cancelAnimationFrame(this.rafId);

        this.rafId = requestAnimationFrame(() => {
            this.badge.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

            if (this.glare) {
                const glareX = (x / this.bounds.width) * 100;
                this.glare.style.background = `linear-gradient(${135 + rotateY}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) ${glareX}%, rgba(255,255,255,0) 100%)`;
                this.glare.style.opacity = '1';
            }
        });
    }

    onLeave() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.badge.removeEventListener('mousemove', this.onMoveBind);

        this.badge.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        this.badge.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        this.badge.style.zIndex = '';

        if (this.glare) {
            this.glare.style.opacity = '0';
        }
    }

    onClick() {
        playAudio('hover');
        fireConfetti(this.bounds.left + this.bounds.width / 2, this.bounds.top + this.bounds.height / 2);

        // "Unlock" celebration effect (scale up)
        // Using simpler animation API for FLIP-like feel
        this.badge.animate([
            { transform: 'scale3d(1.05, 1.05, 1.05)' },
            { transform: 'scale3d(0.9, 0.9, 0.9)' },
            { transform: 'scale3d(1.1, 1.1, 1.1)' },
            { transform: 'scale3d(1, 1, 1)' }
        ], { duration: 400, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' });
    }
}

// Confetti System (Canvas)
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.speedX = Math.random() * 10 - 5;
        this.speedY = Math.random() * -10 - 5;
        this.color = ['#ff2d75', '#00f2ea', '#a2ff00', '#ffffff'][Math.floor(Math.random() * 4)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.gravity = 0.4;
        this.drag = 0.96;
        this.opacity = 1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.speedX *= this.drag;
        this.speedY *= this.drag;
        this.rotation += this.rotationSpeed;
        this.opacity -= 0.015;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function fireConfetti(x, y) {
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle(x, y));
    }
    if (!isAnimating) {
        isAnimating = true;
        animateConfetti();
    }
}

let isAnimating = false;
function animateConfetti() {
    if (particles.length === 0) {
        isAnimating = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, index) => {
        p.update();
        p.draw();
        if (p.opacity <= 0) particles.splice(index, 1);
    });
    requestAnimationFrame(animateConfetti);
}

// Audio System
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playAudio(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'locked') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }
}

// Initialization & Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
    const badges = document.querySelectorAll('.badge-interactive');

    // Intersection Observer for Performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const mechanics = entry.target.mechanics;
            if (mechanics) {
                mechanics.isVisible = entry.isIntersecting;
                if (entry.isIntersecting && !mechanics.bounds) {
                    mechanics.bounds = entry.target.getBoundingClientRect(); // Pre-calc bounds
                }
            }
        });
    }, { threshold: 0.1 });

    badges.forEach(badge => {
        const mechanics = new BadgeMechanics(badge);
        badge.mechanics = mechanics; // Attach instance to element for observer access
        observer.observe(badge);
    });

    // Count Up Animation
    const counters = document.querySelectorAll('.count-up');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCount = () => {
            current += step;
            if (current < target) {
                counter.innerText = Math.ceil(current).toLocaleString();
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        updateCount();
    });

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Re-calc bounds for all visible badges
        badges.forEach(b => {
            if (b.mechanics && b.mechanics.isVisible) {
                b.mechanics.bounds = b.getBoundingClientRect();
            }
        });
    });
});
