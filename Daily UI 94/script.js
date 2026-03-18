/* News for Business - Interactivity Logic */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');

    // 1. Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Scroll Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal to cards and headers
    document.querySelectorAll('.card, .hero-content, section h2').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        revealObserver.observe(el);
    });

    // 4. Newsletter Form Submission Logic
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const button = form.querySelector('button');
            const originalText = button.textContent;

            button.disabled = true;
            button.textContent = 'Joining...';

            // Simulate API call
            setTimeout(() => {
                button.textContent = 'Welcome Aboard';
                button.style.backgroundColor = 'var(--color-mint-signal)';
                form.reset();

                setTimeout(() => {
                    button.disabled = false;
                    button.textContent = originalText;
                    button.style.backgroundColor = '';
                }, 4000);
            }, 1200);
        });
    });

    // 5. Data Pulse Simulation
    // Randomly "pulse" the signal dots or mock data points
    setInterval(() => {
        const dots = document.querySelectorAll('.signal-dot');
        dots.forEach(dot => {
            dot.style.boxShadow = `0 0 10px var(--color-mint-signal)`;
            setTimeout(() => {
                dot.style.boxShadow = 'none';
            }, 500);
        });
    }, 3000);
});
