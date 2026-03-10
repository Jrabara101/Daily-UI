/**
 * FAQ Premium Engine v2.0
 * Logic for: Fuzzy Search, Deep-Linking, Exclusive Accordion, and SEO Injection.
 */

// 1. FAQ Data Object (Source of Truth for Logic & SEO)
const FAQ_DATA = [
    {
        id: 'password-reset',
        question: 'How do I reset my account password?',
        answer: 'To reset your password, navigate to the login security settings and click \'Forgot Password\'. You will receive an encrypted verification token via your registered email address within 60 seconds.',
        category: 'Security'
    },
    {
        id: 'api-keys',
        question: 'Where can I locate my production API keys?',
        answer: 'Production keys are located in the Developer Dashboard under the \'Credentials\' tab. Please ensure you have enabled Multi-Factor Authentication (MFA) before attempting to view live keys.',
        category: 'Security'
    },
    {
        id: 'billing-cycle',
        question: 'Can I upgrade my plan mid-cycle?',
        answer: 'Yes, upgrades are processed instantly. Your billing will be pro-rated for the remaining days in your current billing cycle. Downgrades take effect at the start of the next period.',
        category: 'Billing'
    }
];

// 2. Debounce Utility
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// 3. SEO Injection (Schema.org JSON-LD)
const injectSEO = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQ_DATA.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
};

// 4. Fuzzy Search & Highlighting Logic
const initSearch = () => {
    const searchInput = document.getElementById('faq-search');
    const faqItems = document.querySelectorAll('.faq-item');
    const noResults = document.getElementById('no-results');

    const performSearch = (query) => {
        query = query.toLowerCase().trim();
        let visibleCount = 0;

        faqItems.forEach((item, index) => {
            const data = FAQ_DATA[index];
            const questionEl = item.querySelector('h3');
            const answerEl = item.querySelector('p');

            const questionText = data.question.toLowerCase();
            const answerText = data.answer.toLowerCase();

            if (questionText.includes(query) || answerText.includes(query)) {
                item.style.display = 'block';
                visibleCount++;

                // Highlight matches
                if (query.length > 2) {
                    highlightText(questionEl, data.question, query);
                    highlightText(answerEl, data.answer, query);
                } else {
                    questionEl.textContent = data.question;
                    answerEl.textContent = data.answer;
                }
            } else {
                item.style.display = 'none';
            }
        });

        noResults.style.display = visibleCount === 0 ? 'flex' : 'none';
    };

    const highlightText = (element, originalText, query) => {
        const regex = new RegExp(`(${query})`, 'gi');
        element.innerHTML = originalText.replace(regex, '<mark>$1</mark>');
    };

    searchInput.addEventListener('input', debounce((e) => performSearch(e.target.value), 300));
};

// 5. URL Hash Deep-Linking Router
const initDeepLinking = () => {
    const currentHash = window.location.hash.replace('#', '');
    if (!currentHash) return;

    const targetButton = document.querySelector(`[data-target="${currentHash}"]`);
    if (targetButton) {
        // Expand target and close others (Exclusive mode)
        toggleAccordion(targetButton, true);

        // Smooth scroll with offset
        requestAnimationFrame(() => {
            const offsetTop = targetButton.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });

            // Senior Pulse Highlight
            const container = targetButton.closest('.faq-item').querySelector('.bg-white\\/5');
            container.classList.add('ring-2', 'ring-emerald-400', 'bg-emerald-400/5');
            setTimeout(() => container.classList.remove('ring-2', 'ring-emerald-400', 'bg-emerald-400/5'), 2000);
        });
    }
};

// 6. Accordion Control (Exclusive Mode)
const initAccordions = () => {
    const triggers = document.querySelectorAll('.faq-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';
            toggleAccordion(trigger, !isOpen);

            // Update URL Hash without scroll jump
            const targetId = trigger.getAttribute('data-target');
            if (!isOpen) {
                history.pushState(null, null, `#${targetId}`);
            } else {
                history.pushState(null, null, ' ');
            }
        });
    });
};

const toggleAccordion = (trigger, shouldOpen) => {
    const parent = trigger.closest('.faq-item');
    const content = parent.querySelector('.accordion-content');

    // Exclusive Mode logic
    if (shouldOpen) {
        document.querySelectorAll('.faq-trigger').forEach(otherTrigger => {
            if (otherTrigger !== trigger) {
                const otherParent = otherTrigger.closest('.faq-item');
                otherTrigger.setAttribute('aria-expanded', 'false');
                otherParent.querySelector('.accordion-content').classList.remove('is-open');
            }
        });
    }

    trigger.setAttribute('aria-expanded', shouldOpen);
    if (shouldOpen) {
        content.classList.add('is-open');
    } else {
        content.classList.remove('is-open');
    }
};

// 7. Micro-Feedback Loop logic
const initFeedback = () => {
    const feedbackButtons = document.querySelectorAll('.feedback-btn');

    feedbackButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const container = btn.closest('.feedback-loop');
            const interactionArea = container.querySelector('.interaction-buttons');

            // Morph interaction
            interactionArea.innerHTML = `
                <div class="flex items-center gap-2 text-emerald-400 check-animation">
                    <span class="material-symbols-outlined">check_circle</span>
                    <span class="text-sm font-bold">Thank you for the feedback!</span>
                </div>
            `;
        });
    });
};

// Orchestration
document.addEventListener('DOMContentLoaded', () => {
    injectSEO();
    initSearch();
    initAccordions();
    initFeedback();

    // Small delay for deep linking to ensure styles are ready
    setTimeout(initDeepLinking, 100);
});

// Handle hash navigation manually
window.addEventListener('hashchange', initDeepLinking);
