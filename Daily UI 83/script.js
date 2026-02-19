/* ============================================
   QUANTUM — THE KINETIC ACTION SYSTEM
   Micro-Interactions & Physics Engine
   ============================================ */

// ---- SQUIRCLE SVG CLIP-PATH (injected into DOM) ----
(function injectSquircleClip() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.innerHTML = `
        <defs>
            <clipPath id="squircle-clip" clipPathUnits="objectBoundingBox">
                <path d="M 0.5 0 C 0.85 0, 1 0.15, 1 0.5 C 1 0.85, 0.85 1, 0.5 1 C 0.15 1, 0 0.85, 0 0.5 C 0 0.15, 0.15 0, 0.5 0 Z"/>
            </clipPath>
        </defs>`;
    document.body.prepend(svg);
})();

// ---- HSL THEMING: Apply data attributes ----
document.querySelectorAll('.btn[data-btn-h]').forEach(btn => {
    btn.style.setProperty('--h', btn.dataset.btnH);
    btn.style.setProperty('--s', btn.dataset.btnS + '%');
    btn.style.setProperty('--l', btn.dataset.btnL + '%');
});

// ---- 1. MAGNETIC BUTTON CLASS ----
class MagneticButton {
    constructor(element) {
        this.btn = element;
        this.strength = 0.3;
        this.bound = {
            move: this.handleMove.bind(this),
            leave: this.reset.bind(this)
        };
        this.btn.addEventListener('mousemove', this.bound.move);
        this.btn.addEventListener('mouseleave', this.bound.leave);
    }

    handleMove(e) {
        const rect = this.btn.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        this.btn.style.transform = `translate(${x * this.strength}px, ${y * this.strength}px)`;
    }

    reset() {
        this.btn.style.transform = 'translate(0px, 0px)';
    }
}

// Init all magnetic buttons
document.querySelectorAll('.magnetic').forEach(el => new MagneticButton(el));

// ---- 2. LIQUID RIPPLE (Canvas-based) ----
class LiquidRipple {
    constructor(button) {
        this.btn = button;
        this.canvas = button.querySelector('.ripple-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.ripples = [];
        this.animating = false;

        this.btn.addEventListener('click', this.createRipple.bind(this));
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.btn.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createRipple(e) {
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(5);

        const rect = this.btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const maxRadius = Math.sqrt(rect.width * rect.width + rect.height * rect.height);

        // Get HSL from CSS variables
        const h = getComputedStyle(this.btn).getPropertyValue('--h').trim();
        const s = getComputedStyle(this.btn).getPropertyValue('--s').trim();

        this.ripples.push({
            x, y,
            radius: 0,
            maxRadius,
            alpha: 0.5,
            color: `hsla(${h}, ${s}, 75%, `,
        });

        if (!this.animating) {
            this.animating = true;
            this.animate();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ripples = this.ripples.filter(r => {
            r.radius += (r.maxRadius - r.radius) * 0.08;
            r.alpha *= 0.96;

            if (r.alpha < 0.01) return false;

            this.ctx.beginPath();
            this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = r.color + r.alpha + ')';
            this.ctx.fill();
            return true;
        });

        if (this.ripples.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.animating = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// Init all ripple buttons
document.querySelectorAll('.ripple-btn').forEach(el => new LiquidRipple(el));

// ---- 3. STATE MORPH BUTTON ----
class StateMorphButton {
    constructor(button) {
        this.btn = button;
        this.isProcessing = false;
        this.btn.addEventListener('click', () => this.trigger());
    }

    trigger() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        // Phase 1: Morph to circle (loading)
        this.btn.classList.add('loading');

        // Phase 2: After simulated async, show success
        setTimeout(() => {
            this.btn.classList.remove('loading');
            this.btn.classList.add('success');

            // Phase 3: Reset after showing success
            setTimeout(() => {
                this.btn.classList.remove('success');
                this.isProcessing = false;
            }, 2000);
        }, 2200);
    }
}

// Init morph buttons
document.querySelectorAll('.morph-btn').forEach(el => new StateMorphButton(el));

// ---- 4. DEBOUNCE CLICK HANDLER ----
function debounceClick(button, handler, timeout = 3000) {
    let locked = false;
    button.addEventListener('click', async (e) => {
        if (locked) return;
        locked = true;
        button.style.opacity = '0.7';
        button.style.pointerEvents = 'none';

        try {
            await handler(e);
        } catch (err) {
            console.error('Action failed:', err);
        } finally {
            setTimeout(() => {
                locked = false;
                button.style.opacity = '1';
                button.style.pointerEvents = 'auto';
            }, timeout);
        }
    });
}

// ---- 5. DESTRUCTIVE BUTTON (Confirm Pattern) ----
class DestructiveButton {
    constructor(button) {
        this.btn = button;
        this.textEl = button.querySelector('.destructive-text');
        this.iconEl = button.querySelector('.destructive-icon');
        this.originalText = this.textEl ? this.textEl.textContent : '';
        this.originalIcon = this.iconEl ? this.iconEl.textContent : '';
        this.confirming = false;
        this.timeout = null;

        this.btn.addEventListener('click', () => this.handleClick());
    }

    handleClick() {
        if (!this.confirming) {
            // First click: ask for confirmation
            this.confirming = true;
            this.btn.classList.add('confirming');
            if (this.textEl) this.textEl.textContent = 'Are you sure?';
            if (this.iconEl) this.iconEl.textContent = 'warning';

            // Auto-reset after 3 seconds
            this.timeout = setTimeout(() => this.reset(), 3000);
        } else {
            // Second click: execute
            clearTimeout(this.timeout);
            if (this.textEl) this.textEl.textContent = 'Deleted!';
            if (this.iconEl) this.iconEl.textContent = 'check';
            this.btn.style.background = '#22c55e';
            this.btn.classList.remove('confirming');

            setTimeout(() => {
                this.reset();
                this.btn.style.background = '';
            }, 2000);
        }
    }

    reset() {
        this.confirming = false;
        this.btn.classList.remove('confirming');
        if (this.textEl) this.textEl.textContent = this.originalText;
        if (this.iconEl) this.iconEl.textContent = this.originalIcon;
    }
}

// Init destructive buttons
document.querySelectorAll('.btn-destructive').forEach(el => new DestructiveButton(el));

// ---- 6. HAPTIC FEEDBACK (on mousedown for all buttons) ----
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousedown', () => {
        if (navigator.vibrate) navigator.vibrate(5);
    });
});

// ---- 7. ENTRANCE ANIMATIONS (Intersection Observer) ----
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.demo-section, .image-break, .cta-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    fadeObserver.observe(el);
});

// ---- 8. RESIZE HANDLER for Ripple Canvases ----
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.querySelectorAll('.ripple-btn').forEach(btn => {
            const canvas = btn.querySelector('.ripple-canvas');
            if (canvas) {
                const rect = btn.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
            }
        });
    }, 100);
});

console.log('⚡ Quantum Kinetic Action System initialized');
