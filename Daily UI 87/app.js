/**
 * OmniTip — The Context-Aware Spatial Portal
 * Senior UI/UX & Front-end Engineering Challenge
 */

class OmniTip {
    constructor() {
        this.root = document.getElementById('omnitip-root');
        this.content = this.root.querySelector('.omnitip-content');
        this.activeTarget = null;
        this.intentTimer = null;
        this.hideTimer = null;
        this.intentDelay = 300; // ms
        this.bridgeEnabled = false;

        this.userData = {
            'SEC-8842': {
                name: 'Marcus Thorne',
                role: 'Senior Ops Officer',
                compliance: 77,
                logged: '6h 12m',
                remaining: '1h 48m',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
            },
            'SEC-9103': {
                name: 'Elena Rodriguez',
                role: 'Lead Security Tech',
                compliance: 92,
                logged: '7h 05m',
                remaining: '0h 55m',
                img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
            },
            'SEC-7721': {
                name: 'James Chen',
                role: 'Field Analyst',
                compliance: 45,
                logged: '3h 30m',
                remaining: '4h 30m',
                img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
            },
            'SEC-5564': {
                name: 'Sarah Jenkins',
                role: 'Resource Coordinator',
                compliance: 0,
                logged: '0h 00m',
                remaining: '8h 00m',
                img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
            }
        };

        this.init();
    }

    init() {
        // Event Delegation
        document.addEventListener('mouseover', (e) => this.handleInteraction(e));
        document.addEventListener('mouseout', (e) => this.handleLeave(e));
        document.addEventListener('focusin', (e) => this.handleInteraction(e));
        document.addEventListener('focusout', (e) => this.handleLeave(e));

        // Interaction bridge management
        this.root.addEventListener('mouseenter', () => this.cancelHide());
        this.root.addEventListener('mouseleave', () => this.scheduleHide());

        // A11y
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hide();
        });

        // Resize Observer for dynamic content
        this.resizeObserver = new ResizeObserver(() => {
            if (this.activeTarget) this.updatePosition();
        });
        this.resizeObserver.observe(this.root);
    }

    handleInteraction(e) {
        const target = e.target.closest('[data-tooltip], [data-tooltip-type]');
        if (!target || target === this.activeTarget) return;

        this.cancelTimers();
        this.activeTarget = target;

        this.intentTimer = setTimeout(() => {
            this.show(target);
        }, this.intentDelay);
    }

    handleLeave(e) {
        if (!this.activeTarget) return;

        // If moving to the tooltip root (bridge), don't hide yet
        const related = e.relatedTarget;
        if (related && (this.root.contains(related) || this.activeTarget.contains(related))) {
            return;
        }

        this.cancelTimers();
        this.scheduleHide();
    }

    show(target) {
        const type = target.getAttribute('data-tooltip-type');
        const text = target.getAttribute('data-tooltip');
        const userId = target.getAttribute('data-user-id');

        this.prepareContent(type, text, userId);

        // Ensure it's in the DOM for calc
        this.root.style.display = 'block';
        this.root.classList.remove('hidden');

        this.updatePosition();

        // Use double rAF to ensure transition starts from initial state
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.root.classList.add('visible');
                this.root.removeAttribute('inert');
                this.root.setAttribute('aria-hidden', 'false');
            });
        });

        // Manage interactivity
        if (type === 'user-card' || type === 'rich') {
            this.root.classList.add('omnitip-interactive');
        } else {
            this.root.classList.remove('omnitip-interactive');
        }
    }

    hide() {
        this.root.classList.remove('visible');
        this.root.setAttribute('aria-hidden', 'true');
        this.root.setAttribute('inert', '');

        setTimeout(() => {
            if (!this.root.classList.contains('visible')) {
                this.root.classList.add('hidden');
                this.activeTarget = null;
            }
        }, 200);
    }

    scheduleHide() {
        this.hideTimer = setTimeout(() => this.hide(), 150);
    }

    cancelHide() {
        clearTimeout(this.hideTimer);
    }

    cancelTimers() {
        clearTimeout(this.intentTimer);
        clearTimeout(this.hideTimer);
    }

    prepareContent(type, text, userId) {
        if (type === 'user-card' && this.userData[userId]) {
            const user = this.userData[userId];
            this.content.innerHTML = `
                <div class="user-card-tooltip">
                    <div class="user-card-header">
                        <img src="${user.img}" class="w-10 h-10 rounded-lg object-cover">
                        <div>
                            <h4 class="text-sm font-bold text-slate-800">${user.name}</h4>
                            <p class="text-[11px] text-slate-500 font-medium">${user.role}</p>
                        </div>
                    </div>
                    <div class="user-card-body">
                        <div class="mb-3">
                            <div class="flex justify-between text-[10px] font-bold uppercase tracking-wide mb-1">
                                <span class="text-slate-400">Shift Compliance</span>
                                <span class="text-teal-600">${user.compliance}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${user.compliance}%"></div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-2 mb-3">
                            <div class="bg-slate-50 p-2 rounded-md border border-slate-100">
                                <span class="block text-[9px] text-slate-400 font-bold uppercase">Logged</span>
                                <span class="block text-xs font-semibold">${user.logged}</span>
                            </div>
                            <div class="bg-slate-50 p-2 rounded-md border border-slate-100">
                                <span class="block text-[9px] text-slate-400 font-bold uppercase">Remain</span>
                                <span class="block text-xs font-semibold">${user.remaining}</span>
                            </div>
                        </div>
                        <button class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors shadow-sm focus:ring-2 focus:ring-indigo-300 pointer-events-auto">
                            View Profile
                        </button>
                    </div>
                </div>
            `;
        } else if (type === 'rich') {
            this.content.innerHTML = `
                <div class="flex items-center gap-2 p-1">
                    <span class="material-symbols-outlined text-teal-600">info</span>
                    <div>
                        <p class="font-bold text-slate-800">${text}</p>
                        <p class="text-[11px] text-slate-500">Last updated 2m ago</p>
                    </div>
                </div>
            `;
        } else {
            this.content.textContent = text;
        }
    }

    updatePosition() {
        if (!this.activeTarget) return;

        const targetRect = this.activeTarget.getBoundingClientRect();
        const tooltipRect = this.root.getBoundingClientRect();
        const preferredPos = this.activeTarget.getAttribute('data-tooltip-pos') || 'top';
        const padding = 12;

        let top, left;
        let actualPos = preferredPos;

        // Base calculations
        switch (preferredPos) {
            case 'bottom':
                top = targetRect.bottom + padding;
                left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'left':
                top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
                left = targetRect.left - tooltipRect.width - padding;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
                left = targetRect.right + padding;
                break;
            case 'top':
            default:
                top = targetRect.top - tooltipRect.height - padding;
                left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
                break;
        }

        // Viewport Collision Detection & Flipping
        const viewportPadding = 10;

        // Horizontal check
        if (left < viewportPadding) {
            left = viewportPadding;
        } else if (left + tooltipRect.width > window.innerWidth - viewportPadding) {
            left = window.innerWidth - tooltipRect.width - viewportPadding;
        }

        // Vertical check & flip
        if (actualPos === 'top' && top < viewportPadding) {
            top = targetRect.bottom + padding;
            actualPos = 'bottom';
        } else if (actualPos === 'bottom' && top + tooltipRect.height > window.innerHeight - viewportPadding) {
            top = targetRect.top - tooltipRect.height - padding;
            actualPos = 'top';
        }

        // Update DOM
        this.root.style.top = `${top}px`;
        this.root.style.left = `${left}px`;
        this.root.setAttribute('data-actual-pos', actualPos);
    }
}

// Instantiate
window.omniTip = new OmniTip();
