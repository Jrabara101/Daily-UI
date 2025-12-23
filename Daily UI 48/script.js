// ============================================
// Configuration & Constants
// ============================================

const LAUNCH_DATE = new Date('2025-12-31T00:00:00+08:00');
const SUBSCRIBER_COUNT = 2347;
const PROGRESS_PERCENTAGE = 67;
const TYPING_TEXT = 'Transform Your Logistics in 60 Seconds';
const TYPING_SPEED = 100;

// Hardcoded email subscribers list (50+ for demo)
const EMAIL_SUBSCRIBERS = [
    'maria.cruz@lagunatrading.com',
    'juan.reyes@cavitemerchandise.com',
    'ana.santos@batangasretail.com',
    'roberto.lim@rizaldistribution.com',
    'diana.torres@quezontech.com',
    'carlos.mendoza@calambaenterprises.com',
    'lisa.garcia@sanpedroshop.com',
    'michael.tan@lagunabay.com',
    'jennifer.ong@cavitecommerce.com',
    'david.chua@batangaslogistics.com',
    'sarah.lee@rizalmerchants.com',
    'james.wong@quezonretail.com',
    'patricia.ramos@calambabusiness.com',
    'robert.delacruz@sanpedroenterprises.com',
    'maria.lopez@lagunashop.com',
    'john.santos@cavitestore.com',
    'linda.fernandez@batangasmarket.com',
    'mark.reyes@rizalcommerce.com',
    'catherine.torres@quezonbusiness.com',
    'peter.lim@calambaretail.com',
    'michelle.chan@sanpedroshop.com',
    'daniel.garcia@lagunamarket.com',
    'angela.tan@caviteenterprises.com',
    'christopher.ong@batangascommerce.com',
    'stephanie.chua@rizalretail.com',
    'kevin.lee@quezonmarket.com',
    'nicole.wong@calambashop.com',
    'brian.ramos@sanpedrocommerce.com',
    'amanda.delacruz@lagunaretail.com',
    'jason.lopez@cavitestore.com',
    'rebecca.santos@batangasenterprises.com',
    'ryan.fernandez@rizalmarket.com',
    'jessica.reyes@quezonshop.com',
    'justin.torres@calambacommerce.com',
    'samantha.lim@sanpedroretail.com',
    'brandon.chan@lagunastore.com',
    'olivia.garcia@cavitemarket.com',
    'tyler.tan@batangascommerce.com',
    'emily.ong@rizalenterprises.com',
    'nathan.chua@quezonretail.com',
    'hannah.lee@calambashop.com',
    'aaron.wong@sanpedromarket.com',
    'isabella.ramos@lagunacommerce.com',
    'ethan.delacruz@caviteretail.com',
    'sophia.lopez@batangasstore.com',
    'mason.santos@rizalmarket.com',
    'ava.fernandez@quezonenterprises.com',
    'logan.reyes@calambacommerce.com',
    'mia.torres@sanpedroretail.com',
    'lucas.lim@lagunashop.com'
];

// ============================================
// DOM Elements
// ============================================

const elements = {
    themeToggle: document.getElementById('themeToggle'),
    hamburger: document.getElementById('hamburger'),
    navMenu: document.getElementById('navMenu'),
    heroTitle: document.getElementById('heroTitle'),
    signupForm: document.getElementById('signupForm'),
    userName: document.getElementById('userName'),
    userEmail: document.getElementById('userEmail'),
    earlyAccess: document.getElementById('earlyAccess'),
    submitBtn: document.getElementById('submitBtn'),
    formMessage: document.getElementById('formMessage'),
    subscriberCount: document.getElementById('subscriberCount'),
    particleCanvas: document.getElementById('particleCanvas'),
    confettiCanvas: document.getElementById('confettiCanvas'),
    stickyCta: document.getElementById('stickyCta'),
    stickyNotifyBtn: document.getElementById('stickyNotifyBtn'),
    testimonialsTrack: document.getElementById('testimonialsTrack'),
    testimonialPrev: document.getElementById('testimonialPrev'),
    testimonialNext: document.getElementById('testimonialNext'),
    testimonialDots: document.getElementById('testimonialDots'),
    countdownItems: document.querySelectorAll('.countdown-value')
};

// ============================================
// Theme Toggle
// ============================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', toggleTheme);
}

// ============================================
// Mobile Navigation
// ============================================

function toggleMobileNav() {
    if (elements.navMenu && elements.hamburger) {
        const isExpanded = elements.hamburger.getAttribute('aria-expanded') === 'true';
        elements.navMenu.classList.toggle('active');
        elements.hamburger.setAttribute('aria-expanded', !isExpanded);
    }
}

if (elements.hamburger) {
    elements.hamburger.addEventListener('click', toggleMobileNav);
}

// Close mobile nav when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            elements.navMenu?.classList.remove('active');
            elements.hamburger?.setAttribute('aria-expanded', 'false');
        }
    });
});

// ============================================
// Typing Effect
// ============================================

function typeText(element, text, speed) {
    if (!element) return;
    
    const typingElement = element.querySelector('.typing-text');
    if (!typingElement) return;
    
    let index = 0;
    typingElement.textContent = '';
    
    function type() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ============================================
// Countdown Timer
// ============================================

function updateCountdown() {
    const now = new Date();
    const difference = LAUNCH_DATE - now;
    
    if (difference <= 0) {
        // Launch date has passed
        document.querySelectorAll('.countdown-value').forEach(item => {
            const top = item.querySelector('.digit-top');
            const bottom = item.querySelector('.digit-bottom');
            if (top) top.textContent = '0';
            if (bottom) bottom.textContent = '0';
        });
        return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    const units = [
        { value: days, selector: '[data-unit="days"]' },
        { value: hours, selector: '[data-unit="hours"]' },
        { value: minutes, selector: '[data-unit="minutes"]' },
        { value: seconds, selector: '[data-unit="seconds"]' }
    ];
    
    units.forEach(({ value, selector }) => {
        const item = document.querySelector(selector);
        if (!item) return;
        
        const top = item.querySelector('.digit-top');
        const bottom = item.querySelector('.digit-bottom');
        const currentValue = parseInt(top?.textContent || '0');
        
        if (currentValue !== value) {
            // Flip animation
            item.classList.add('flip');
            
            setTimeout(() => {
                const formattedValue = String(value).padStart(2, '0');
                if (top) top.textContent = formattedValue;
                if (bottom) bottom.textContent = formattedValue;
                item.classList.remove('flip');
            }, 300);
        }
    });
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// ============================================
// Particle System
// ============================================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createParticles();
        this.animate();
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(37, 99, 235, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

let particleSystem = null;
if (elements.particleCanvas) {
    particleSystem = new ParticleSystem(elements.particleCanvas);
}

// ============================================
// Confetti Effect
// ============================================

class ConfettiSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createConfetti() {
        this.resize();
        const colors = ['#2563EB', '#F59E0B', '#22C55E', '#EF4444', '#8B5CF6'];
        const particleCount = 150;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -10,
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                speedX: (Math.random() - 0.5) * 4,
                speedY: Math.random() * 3 + 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: 1
            });
        }
        
        this.animate();
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles = this.particles.filter(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.rotation += particle.rotationSpeed;
            particle.opacity -= 0.01;
            
            if (particle.y > this.canvas.height || particle.opacity <= 0) {
                return false;
            }
            
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate((particle.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
            this.ctx.restore();
            
            return true;
        });
        
        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

const confettiSystem = new ConfettiSystem(elements.confettiCanvas);

// ============================================
// Form Validation & Submission
// ============================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showMessage(message, type) {
    if (!elements.formMessage) return;
    
    elements.formMessage.textContent = message;
    elements.formMessage.className = `form-message ${type}`;
    elements.formMessage.style.display = 'block';
    
    setTimeout(() => {
        elements.formMessage.style.display = 'none';
    }, 5000);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!elements.userName || !elements.userEmail || !elements.submitBtn) return;
    
    const name = elements.userName.value.trim();
    const email = elements.userEmail.value.trim();
    const earlyAccess = elements.earlyAccess?.checked || false;
    
    // Validation
    if (!name) {
        showMessage('Please enter your name', 'error');
        elements.userName.focus();
        return;
    }
    
    if (!email) {
        showMessage('Please enter your email address', 'error');
        elements.userEmail.focus();
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        elements.userEmail.focus();
        return;
    }
    
    // Check if email already exists
    if (EMAIL_SUBSCRIBERS.includes(email.toLowerCase())) {
        showMessage('You\'re already on the waitlist!', 'error');
        return;
    }
    
    // Show loading state
    elements.submitBtn.classList.add('loading');
    elements.submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Add to subscribers list
        EMAIL_SUBSCRIBERS.push(email.toLowerCase());
        
        // Update counter
        const newCount = SUBSCRIBER_COUNT + EMAIL_SUBSCRIBERS.length;
        if (elements.subscriberCount) {
            animateCounter(elements.subscriberCount, SUBSCRIBER_COUNT, newCount);
        }
        
        // Show success message
        showMessage(`Thanks ${name}! We'll notify you when we launch.`, 'success');
        
        // Trigger confetti
        confettiSystem.createConfetti();
        
        // Reset form
        elements.userName.value = '';
        elements.userEmail.value = '';
        elements.earlyAccess.checked = true;
        
        // Reset button
        elements.submitBtn.classList.remove('loading');
        elements.submitBtn.disabled = false;
    }, 1500);
}

if (elements.signupForm) {
    elements.signupForm.addEventListener('submit', handleFormSubmit);
}

// Sticky CTA button
if (elements.stickyNotifyBtn) {
    elements.stickyNotifyBtn.addEventListener('click', () => {
        document.getElementById('signupForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        elements.userName?.focus();
    });
}

// ============================================
// Counter Animation
// ============================================

function animateCounter(element, start, end, duration = 1000) {
    if (!element) return;
    
    const startTime = performance.now();
    const difference = end - start;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + difference * easeOutQuart);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.setAttribute('data-aos', 'fade-up');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

// ============================================
// Sticky CTA Bar
// ============================================

function handleStickyCta() {
    if (!elements.stickyCta) return;
    
    const hero = document.getElementById('hero');
    if (!hero) return;
    
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    const scrollPosition = window.scrollY + window.innerHeight;
    
    if (scrollPosition > heroBottom + 100) {
        elements.stickyCta.classList.add('visible');
    } else {
        elements.stickyCta.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleStickyCta);
handleStickyCta();

// ============================================
// Testimonials Carousel
// ============================================

let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const totalTestimonials = testimonialCards.length;

function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
    
    // Update dots
    const dots = document.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    currentTestimonial = index;
}

function nextTestimonial() {
    const next = (currentTestimonial + 1) % totalTestimonials;
    showTestimonial(next);
}

function prevTestimonial() {
    const prev = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    showTestimonial(prev);
}

// Create dots
if (elements.testimonialDots && testimonialCards.length > 0) {
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.addEventListener('click', () => showTestimonial(index));
        elements.testimonialDots.appendChild(dot);
    });
}

if (elements.testimonialNext) {
    elements.testimonialNext.addEventListener('click', nextTestimonial);
}

if (elements.testimonialPrev) {
    elements.testimonialPrev.addEventListener('click', prevTestimonial);
}

// Auto-rotate testimonials
setInterval(nextTestimonial, 5000);

// ============================================
// Progress Ring Animation
// ============================================

function updateProgressRing() {
    const circle = document.querySelector('.progress-ring-circle');
    if (!circle) return;
    
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (PROGRESS_PERCENTAGE / 100) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
    circle.style.stroke = '#2563EB';
}

// ============================================
// Smooth Scroll
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Start typing effect
    setTimeout(() => {
        typeText(elements.heroTitle, TYPING_TEXT, TYPING_SPEED);
    }, 500);
    
    // Update progress ring
    updateProgressRing();
    
    // Initialize subscriber count
    if (elements.subscriberCount) {
        elements.subscriberCount.textContent = SUBSCRIBER_COUNT.toLocaleString();
    }
    
    // Initialize testimonials
    if (testimonialCards.length > 0) {
        showTestimonial(0);
    }
});

// ============================================
// Service Worker Registration (PWA)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

