/**
 * ReactionEngine — Interactive Emoji Reactions with 60fps Canvas Particle Physics
 */
export class ReactionEngine {
    constructor(soundEngine) {
        this.soundEngine = soundEngine;
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.isAnimating = false;
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'reaction-particles-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    spawnBurst(x, y, emoji = '🚀') {
        const count = 16;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI / count) * i + (Math.random() * 0.4 - 0.2) + Math.PI; // Upwards arc
            const speed = 4 + Math.random() * 8;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1) * 0.8,
                vy: -Math.abs(Math.sin(angle) * speed) - 3,
                gravity: 0.18,
                alpha: 1,
                decay: 0.015 + Math.random() * 0.02,
                size: 16 + Math.random() * 12,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.15,
                emoji
            });
        }

        if (!this.isAnimating) {
            this.isAnimating = true;
            requestAnimationFrame(() => this.animate());
        }

        this.soundEngine && this.soundEngine.reactionBurst();
    }

    animate() {
        if (this.particles.length === 0) {
            this.isAnimating = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.alpha -= p.decay;
            p.rotation += p.rotationSpeed;

            if (p.alpha <= 0 || p.y > window.innerHeight) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, p.alpha);
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.font = `${p.size}px sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(p.emoji, 0, 0);
            this.ctx.restore();
        }

        requestAnimationFrame(() => this.animate());
    }

    bindReactions(container) {
        if (!container) return;

        container.querySelectorAll('.reaction-pill-btn').forEach(btn => {
            if (btn.dataset.bound) return;
            btn.dataset.bound = 'true';

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const rect = btn.getBoundingClientRect();
                const emoji = btn.dataset.emoji || '🚀';
                const countSpan = btn.querySelector('.reaction-count');

                const isVoted = btn.classList.toggle('active');
                let count = parseInt(btn.dataset.count || '0', 10);

                if (isVoted) {
                    count += 1;
                    this.spawnBurst(rect.left + rect.width / 2, rect.top, emoji);
                } else {
                    count = Math.max(0, count - 1);
                }

                btn.dataset.count = count;
                if (countSpan) countSpan.textContent = count;
            });
        });
    }
}
