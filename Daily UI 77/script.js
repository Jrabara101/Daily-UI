/**
 * GRATIS — The High-Fidelity Retention Engine
 * Daily UI 77
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. URL-Driven Personalization
    const params = new URLSearchParams(window.location.search);
    const userName = params.get('name') || 'Creator';
    const userAction = params.get('action') || 'Order';
    const userOrderId = params.get('order_id') || `#ORD-${Math.floor(Math.random() * 10000)}`;

    const titleEl = document.getElementById('thank-you-heading');
    const msgEl = document.getElementById('dynamic-message');
    const orderIdEl = document.getElementById('order-id');

    // Sanitization to prevent XSS (basic)
    const safeName = userName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeAction = userAction.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    titleEl.textContent = `Thank you, ${safeName}!`;
    msgEl.textContent = `Your ${safeAction} has been successfully processed. An email confirmation is on its way.`;
    orderIdEl.textContent = userOrderId;

    // 2. Session State Cleanup
    try {
        localStorage.removeItem('wip_form_data');
        sessionStorage.removeItem('checkout_step');
        console.log('Session state cleaned.');
    } catch (e) {
        console.warn('Storage access restricted.');
    }

    // 3. No-Go-Back Logic
    history.replaceState(null, '', location.href);

    // 4. Confetti Engine (Canvas)
    initConfetti();

    // 5. Retention Pulse Logic
    setTimeout(() => {
        const pills = document.querySelector('.next-step-pills');
        if (pills) {
            pills.classList.add('is-visible');

            // Haptic Affirmation (Mobile)
            if (navigator.vibrate) {
                navigator.vibrate(5); // Tiny 5ms vibration
            }
        }
    }, 2000);

    // 6. Asynchronous Receipt Generation
    const receiptBtn = document.getElementById('download-receipt');

    receiptBtn.addEventListener('click', async () => {
        const originalText = receiptBtn.querySelector('.btn-text').textContent;
        receiptBtn.querySelector('.btn-text').textContent = "Generating...";
        receiptBtn.disabled = true;

        // Mimic server latency
        await new Promise(r => setTimeout(r, 1500));

        // Generate Blob
        const receiptContent = `
========================================
           OFFICIAL RECEIPT
========================================
Date: ${new Date().toLocaleString()}
Order ID: ${userOrderId}
Customer: ${safeName}
Action: ${safeAction}
Status: Completed
----------------------------------------
Total: $299.00
----------------------------------------
Thank you for your business!
        `;

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt_${userOrderId}.txt`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        receiptBtn.querySelector('.btn-text').textContent = "Downloaded!";
        setTimeout(() => {
            receiptBtn.querySelector('.btn-text').textContent = originalText;
            receiptBtn.disabled = false;
        }, 2000);
    });

    // Victory Vibration on Load
    if (navigator.vibrate) {
        navigator.vibrate([10, 50, 10]);
    }
});

/**
 * High-Performance Canvas Confetti
 */
function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Handle Resize
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

    const particles = [];
    const colors = [
        '#4f46e5', // Indigo
        '#a855f7', // Purple
        '#22c55e', // Success Green
        '#ffffff', // White
        '#f472b6' // Pink
    ];

    class Particle {
        constructor() {
            this.x = width / 2; // Start from center
            this.y = height / 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.radius = Math.random() * 5 + 2;
            // Explosion velocity
            this.vx = (Math.random() - 0.5) * 20;
            this.vy = (Math.random() - 0.5) * 20 - 5; // Upward bias
            this.gravity = 0.25;
            this.friction = 0.96;
            this.opacity = 1;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;

            this.x += this.vx;
            this.y += this.vy;

            this.rotation += this.rotationSpeed;
            this.opacity -= 0.008; // Fade out slowly
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2); // Square confetti
            ctx.restore();
        }
    }

    // Burst!
    function burst() {
        for (let i = 0; i < 150; i++) {
            particles.push(new Particle());
        }
    }

    let isAnimating = false;

    // Animation Loop
    function animate() {
        isAnimating = true;
        ctx.clearRect(0, 0, width, height);

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].x += particles[i].vx;
            particles[i].y += particles[i].vy;
            particles[i].vy += particles[i].gravity;
            particles[i].rotation += particles[i].rotationSpeed;
            particles[i].opacity -= 0.008;

            particles[i].draw();

            if (particles[i].opacity <= 0 || particles[i].y > height) {
                particles.splice(i, 1);
            }
        }

        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            isAnimating = false;
            ctx.clearRect(0, 0, width, height);
        }
    }

    // Trigger initial burst
    burst();
    if (!isAnimating) animate();

    // Occasional random mini-bursts for fun
    setInterval(() => {
        if (Math.random() > 0.7) {
            const pX = Math.random() * width;
            const pY = Math.random() * height * 0.5; // Start higher up
            for (let i = 0; i < 20; i++) {
                const p = new Particle();
                p.x = pX;
                p.y = pY;
                particles.push(p);
            }
            if (!isAnimating) animate();
        }
    }, 2000);
}
