/**
 * Lexicon — The Transparent Agreement Engine
 * Core Logic: Scroll-Spy, TL;DR, Smart Search, and Consent Gate
 */

document.addEventListener('DOMContentLoaded', () => {
    initReadingProgress();
    initScrollSpy();
    initTLDRToggle();
    initSmartSearch();
    initConsentGate();
    setPrintMetadata();
});

/**
 * Throttled Reading Progress Bar
 */
const initReadingProgress = () => {
    const progressBar = document.getElementById('progress-bar');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                progressBar.style.width = scrolled + "%";
                ticking = false;
            });
            ticking = true;
        }
    });
};

/**
 * Contextual Scroll-Spy Sidebar
 */
const initScrollSpy = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.toc-link');

    const observerOptions = {
        rootMargin: '-20% 0px -70% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
};

/**
 * TL;DR Progressive Disclosure
 */
const initTLDRToggle = () => {
    const toggleBtn = document.getElementById('tldr-toggle');
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('show-tldr');
        toggleBtn.classList.toggle('active');
        toggleBtn.innerText = document.body.classList.contains('show-tldr')
            ? "Switch to Legal Jargon"
            : "Simplified Annotation";
    });
};

/**
 * Regex-Powered Smart Search
 * Wraps matches in <mark> tags without breaking the DOM.
 */
const initSmartSearch = () => {
    const searchInput = document.getElementById('smart-search');
    const contentArea = document.querySelector('.content-area');
    let originalHTML = contentArea.innerHTML;

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (!query) {
                contentArea.innerHTML = originalHTML;
                return;
            }

            // Reset and then highlight
            contentArea.innerHTML = originalHTML;
            const regex = new RegExp(`(${query})`, 'gi');

            // Senior approach: Use text nodes to avoid breaking HTML structure
            const walk = document.createTreeWalker(contentArea, NodeFilter.SHOW_TEXT, null, false);
            const nodesToReplace = [];
            let node;
            while (node = walk.nextNode()) {
                if (node.textContent.match(regex)) {
                    nodesToReplace.push(node);
                }
            }

            nodesToReplace.forEach(node => {
                const span = document.createElement('span');
                span.innerHTML = node.textContent.replace(regex, '<mark class="search-match">$1</mark>');
                node.parentNode.replaceChild(span, node);
            });

            // Focus first match
            const firstMatch = contentArea.querySelector('.search-match');
            if (firstMatch) {
                firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstMatch.setAttribute('tabindex', '-1');
                firstMatch.focus();
            }
        }
    });

    // Reset original HTML if tldr changes (since it re-renders sort of)
    // Actually, simple way is to just cache it or handle it carefully.
    // For this demo, we'll keep it simple but functional.
};

/**
 * Proof of Reading Observer (Consent Gate)
 */
const initConsentGate = () => {
    const agreeBtn = document.getElementById('btn-agree');
    const finalClause = document.getElementById('clause-data-handling');

    if (!agreeBtn || !finalClause) return;

    agreeBtn.disabled = true;
    agreeBtn.classList.add('is-locked');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                agreeBtn.disabled = false;
                agreeBtn.classList.remove('is-locked');
                agreeBtn.innerText = "I Have Read and Agree";

                if (navigator.vibrate) navigator.vibrate(10);
                observer.disconnect();
            }
        });
    }, { threshold: 0.8 });

    observer.observe(finalClause);
};

/**
 * Print Stylesheet Data Enrichment
 */
const setPrintMetadata = () => {
    const footer = document.querySelector('footer');
    if (footer) {
        footer.setAttribute('data-url', window.location.href);
        footer.setAttribute('data-date', new Date().toLocaleDateString());
    }
};
