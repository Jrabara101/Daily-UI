/**
 * Stellar Flow — Anticipatory Loading & Perceptual Hydration Engine
 * Daily UI #076
 * 
 * Features:
 * 1. Zero-CLS Anticipatory Skeleton Hydration with staggered micro-reveals.
 * 2. Perceptual Anti-Flash Buffer: guarantees minimum duration to eliminate layout jitter.
 * 3. Network-Adaptive Simulation: test instant, 4G, 3G, and throttled latency in real time.
 * 4. Interactive Sprint Kanban: real-time search filtering, task creation modal with morphing loader, and status management.
 */

// Mock Datastore for Anticipatory Dashboard
const MOCK_DASHBOARD_DATA = {
    user: {
        name: "Slava K.",
        role: "Lead Architect",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        status: "online"
    },
    navItems: [
        { label: "Dashboard", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-item-icon"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`, badge: null, active: true },
        { label: "Active Sprints", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-item-icon"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>`, badge: "Sprint 42", active: false, badgeHighlight: true },
        { label: "Kanban Board", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-item-icon"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>`, badge: "10", active: false },
        { label: "Performance", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-item-icon"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`, badge: "96%", active: false },
        { label: "Team Hub", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-item-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`, badge: "8", active: false },
        { label: "Settings", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-item-icon"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`, badge: null, active: false }
    ],
    stats: [
        { title: "Total Active Tasks", value: "148", trend: "+18.4%", trendClass: "positive", subtext: "vs. previous sprint cycle" },
        { title: "UI Perceived Efficiency", value: "96%", gaugePercent: 96, subtext: "Average response: 18ms" },
        { title: "Active Collaborators", value: "8 Online", teamCount: 8, subtext: "Sprint 42 velocity @ 82%" },
        { title: "Cache Anticipation Hit", value: "99.4%", trend: "0.000 CLS", trendClass: "neutral", subtext: "14 pre-hydrated chunks" }
    ],
    collaborators: [
        { name: "Slava K.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" },
        { name: "Elena R.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" },
        { name: "Marcus V.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" },
        { name: "Aria C.", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80" }
    ],
    notifications: [
        { text: "Anticipatory prefetch cached 14 assets in 28ms", time: "2 min ago", unread: true },
        { text: "Elena R. moved 'Shader Pipeline' to Review", time: "14 min ago", unread: true },
        { text: "Zero CLS verification passed for Sprint 42", time: "1 hour ago", unread: false }
    ],
    tasks: {
        todo: [
            { id: "task-1", title: "Implement WebGPU compute shader pipeline", tag: "Architecture", priority: "Urgent", subtasks: { done: 3, total: 5 }, due: "Tomorrow", assignee: "Elena R.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80" },
            { id: "task-2", title: "Micro-benchmark skeleton anti-flash thresholds", tag: "Performance", priority: "High", subtasks: { done: 1, total: 3 }, due: "In 2 days", assignee: "Slava K.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" },
            { id: "task-3", title: "Add biometric passkey authentication", tag: "Security", priority: "Medium", subtasks: { done: 0, total: 4 }, due: "Next week", assignee: "Marcus V.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" }
        ],
        inprogress: [
            { id: "task-4", title: "Optimize glassmorphic CSS backdrop filters", tag: "Frontend", priority: "High", subtasks: { done: 4, total: 5 }, due: "Today", assignee: "Aria C.", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=60&q=80" },
            { id: "task-5", title: "ServiceWorker background stream cache", tag: "Backend", priority: "Medium", subtasks: { done: 2, total: 4 }, due: "In 3 days", assignee: "Slava K.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" }
        ],
        review: [
            { id: "task-6", title: "Telemetry instrumentation for CLS and INP", tag: "Performance", priority: "Urgent", subtasks: { done: 5, total: 5 }, due: "Pending QA", assignee: "Marcus V.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" },
            { id: "task-7", title: "ARIA live region announcements for skeletons", tag: "Frontend", priority: "Low", subtasks: { done: 3, total: 3 }, due: "In Review", assignee: "Elena R.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80" }
        ],
        done: [
            { id: "task-8", title: "GPU laser wave shimmer keyframe optimizations", tag: "Frontend", priority: "High", subtasks: { done: 4, total: 4 }, due: "Completed", assignee: "Slava K.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" },
            { id: "task-9", title: "HTTP/3 multiplexed pre-caching adapter", tag: "Architecture", priority: "Medium", subtasks: { done: 6, total: 6 }, due: "Shipped", assignee: "Aria C.", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=60&q=80" },
            { id: "task-10", title: "SVG favicon integration & zero-404 verification", tag: "Frontend", priority: "Urgent", subtasks: { done: 2, total: 2 }, due: "Shipped", assignee: "Slava K.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" }
        ]
    }
};

/**
 * ContentHydrator Class
 * Handles DOM injection and clean skeleton-to-content transition
 */
class ContentHydrator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentFilter = "all";
        this.searchQuery = "";
    }

    hydrate(data) {
        this.container.classList.remove('app-loading');
        this.container.classList.add('content-ready');
        this.container.setAttribute('aria-busy', 'false');

        // Populate all components
        this.hydrateBrandLogo();
        this.hydrateNavigation(data.navItems);
        this.hydrateSidebarWidget();
        this.hydrateUserProfile(data.user);
        this.hydrateHeaderActions(data.notifications);
        this.hydrateWelcomeBanner();
        this.hydrateStatsCards(data);
        this.hydrateKanbanBoard(data.tasks);

        // Trigger staggered visual reveal
        requestAnimationFrame(() => {
            this.container.classList.add('is-loaded');
        });
    }

    hydrateBrandLogo() {
        const slot = document.getElementById('logo-slot');
        if (!slot) return;
        slot.innerHTML = `
            <a href="#" class="brand-logo-content" aria-label="Stellar Flow Home">
                <div class="brand-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </div>
                <div class="brand-info">
                    <span class="brand-title">Stellar Flow</span>
                    <span class="brand-version">v2.4 CORE • ANTICIPATORY</span>
                </div>
            </a>
        `;
    }

    hydrateNavigation(navItems) {
        const slots = document.querySelectorAll('.nav-item-slot');
        slots.forEach((slot, index) => {
            const item = navItems[index];
            if (item) {
                const activeClass = item.active ? 'active' : '';
                const badgeHtml = item.badge 
                    ? `<span class="nav-badge ${item.badgeHighlight ? 'highlight' : ''}">${item.badge}</span>` 
                    : '';

                slot.innerHTML = `
                    <a class="hydrated-nav-item ${activeClass}" href="#${item.label.toLowerCase().replace(/\s+/g, '-')}">
                        <div class="nav-item-left">
                            ${item.icon}
                            <span>${item.label}</span>
                        </div>
                        ${badgeHtml}
                    </a>
                `;
            }
        });

        // Add nav link click handling
        document.querySelectorAll('.hydrated-nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.hydrated-nav-item').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    hydrateSidebarWidget() {
        const slot = document.getElementById('sidebar-widget-slot');
        if (!slot) return;
        slot.innerHTML = `
            <div class="hydrated-widget">
                <div class="widget-title-row">
                    <span>Cache Capacity</span>
                    <strong>78%</strong>
                </div>
                <div class="widget-progress-bar">
                    <div class="widget-progress-fill"></div>
                </div>
                <span class="widget-subtext">39.1 GB of 50 GB pre-allocated</span>
            </div>
        `;
    }

    hydrateUserProfile(user) {
        const slot = document.getElementById('user-profile-slot');
        if (!slot) return;
        slot.innerHTML = `
            <div class="hydrated-user-profile" title="View Account Profile">
                <div class="user-info-left">
                    <div class="user-avatar-wrapper">
                        <img src="${user.avatar}" alt="${user.name}" class="user-avatar-img">
                        <span class="user-status-dot" title="Status: Online"></span>
                    </div>
                    <div class="user-text-details">
                        <span class="user-name">${user.name}</span>
                        <span class="user-role">${user.role}</span>
                    </div>
                </div>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-muted)">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
        `;
    }

    hydrateHeaderActions(notifications) {
        // Search bar
        const searchSlot = document.getElementById('search-slot');
        if (searchSlot) {
            searchSlot.innerHTML = `
                <div class="hydrated-search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" id="global-search-input" class="search-input" placeholder="Search tasks, tags, or assignees..." autocomplete="off">
                    <span class="search-shortcut">Ctrl + K</span>
                </div>
            `;

            const input = document.getElementById('global-search-input');
            if (input) {
                input.addEventListener('input', (e) => {
                    this.searchQuery = e.target.value.toLowerCase().trim();
                    this.filterTasks();
                });
            }
        }

        // Filter pills
        const filterSlot = document.getElementById('filter-pills-slot');
        if (filterSlot) {
            filterSlot.innerHTML = `
                <button class="filter-pill active" data-filter="all">All Tasks</button>
                <button class="filter-pill" data-filter="urgent">🚨 Urgent</button>
                <button class="filter-pill" data-filter="frontend">🎨 Frontend</button>
                <button class="filter-pill" data-filter="architecture">🏗️ Arch</button>
            `;

            filterSlot.querySelectorAll('.filter-pill').forEach(pill => {
                pill.addEventListener('click', () => {
                    filterSlot.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    this.currentFilter = pill.dataset.filter;
                    this.filterTasks();
                });
            });
        }

        // Notification Button
        const notifSlot = document.getElementById('notification-slot');
        if (notifSlot) {
            notifSlot.innerHTML = `
                <button class="hydrated-notif-btn" id="notif-toggle-btn" aria-label="View notifications">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span class="notif-badge"></span>
                </button>
            `;

            // Populate notification list
            const notifList = document.getElementById('notif-list');
            if (notifList) {
                notifList.innerHTML = notifications.map(n => `
                    <li class="notif-item">
                        <div class="notif-dot" style="width:6px;height:6px;border-radius:50%;background:${n.unread ? 'var(--primary)' : 'var(--text-muted)'};margin-top:5px;flex-shrink:0;"></div>
                        <div>
                            <div>${n.text}</div>
                            <div class="notif-time">${n.time}</div>
                        </div>
                    </li>
                `).join('');
            }

            const toggleBtn = document.getElementById('notif-toggle-btn');
            const dropdown = document.getElementById('notification-dropdown');
            if (toggleBtn && dropdown) {
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('hidden');
                });
            }

            const markAll = document.getElementById('mark-all-read');
            if (markAll) {
                markAll.addEventListener('click', () => {
                    const badge = document.querySelector('.notif-badge');
                    if (badge) badge.style.display = 'none';
                    document.querySelectorAll('.notif-item .notif-dot').forEach(d => d.style.background = 'var(--text-muted)');
                    showToast("All notifications marked as read", "info");
                });
            }
        }
    }

    hydrateWelcomeBanner() {
        const slot = document.getElementById('welcome-banner-slot');
        if (!slot) return;
        slot.innerHTML = `
            <div class="hydrated-banner">
                <div class="banner-text-left">
                    <h1>Sprint 42 Control Deck</h1>
                    <p>Anticipatory engine running with 0 perceived layout shift and 100% telemetry verification.</p>
                </div>
                <div class="banner-pill-group">
                    <span class="banner-pill">
                        <span class="highlight-dot"></span>
                        WebGPU Active
                    </span>
                    <span class="banner-pill">
                        ⚡ 148 Tasks Tracked
                    </span>
                </div>
            </div>
        `;
    }

    hydrateStatsCards(data) {
        // Card 0: Total Tasks
        const card0 = document.getElementById('stat-card-0');
        if (card0) {
            const stat = data.stats[0];
            card0.innerHTML = `
                <div class="hydrated-card-header">
                    <span>${stat.title}</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </div>
                <div class="card-metric-row">
                    <span class="metric-number">${stat.value}</span>
                    <svg class="sparkline-svg" viewBox="0 0 100 30">
                        <path d="M0,25 Q20,20 35,22 T70,10 T100,5" />
                    </svg>
                </div>
                <div class="card-footer-info">
                    <span class="metric-trend ${stat.trendClass}">${stat.trend}</span>
                    <span>${stat.subtext}</span>
                </div>
            `;
        }

        // Card 1: UI Efficiency Gauge
        const card1 = document.getElementById('stat-card-1');
        if (card1) {
            const stat = data.stats[1];
            card1.innerHTML = `
                <div class="hydrated-card-header">
                    <span>${stat.title}</span>
                    <span class="metric-trend positive">Instant</span>
                </div>
                <div class="gauge-area">
                    <div class="svg-gauge-wrapper">
                        <svg class="gauge-svg" viewBox="0 0 80 80">
                            <defs>
                                <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="var(--primary)" />
                                    <stop offset="100%" stop-color="var(--accent-cyan)" />
                                </linearGradient>
                            </defs>
                            <circle class="gauge-circle-bg" cx="40" cy="40" r="32" />
                            <circle class="gauge-circle-progress" cx="40" cy="40" r="32" />
                        </svg>
                        <span class="gauge-center-text">${stat.value}</span>
                    </div>
                </div>
                <div class="card-footer-info">
                    <span>${stat.subtext}</span>
                </div>
            `;
        }

        // Card 2: Collaborators Stack
        const card2 = document.getElementById('stat-card-2');
        if (card2) {
            const stat = data.stats[2];
            card2.innerHTML = `
                <div class="hydrated-card-header">
                    <span>${stat.title}</span>
                    <span class="metric-trend positive">${stat.value}</span>
                </div>
                <div class="avatars-row">
                    <div class="hydrated-avatar-stack">
                        ${data.collaborators.map(c => `
                            <img src="${c.avatar}" alt="${c.name}" title="${c.name}" class="avatar-stack-item">
                        `).join('')}
                        <div class="avatar-overflow-badge">+4</div>
                    </div>
                </div>
                <div class="card-footer-info">
                    <span>${stat.subtext}</span>
                </div>
            `;
        }

        // Card 3: Cache Hit Rate
        const card3 = document.getElementById('stat-card-3');
        if (card3) {
            const stat = data.stats[3];
            card3.innerHTML = `
                <div class="hydrated-card-header">
                    <span>${stat.title}</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--accent-emerald)">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <div class="card-metric-row">
                    <span class="metric-number">${stat.value}</span>
                    <span class="metric-trend ${stat.trendClass}">${stat.trend}</span>
                </div>
                <div class="card-footer-info">
                    <span>${stat.subtext}</span>
                </div>
            `;
        }
    }

    hydrateKanbanBoard(tasks) {
        const columns = [
            { id: "todo", title: "To Do", dotClass: "todo" },
            { id: "inprogress", title: "In Progress", dotClass: "inprogress" },
            { id: "review", title: "Review / QA", dotClass: "review" },
            { id: "done", title: "Done", dotClass: "done" }
        ];

        columns.forEach(col => {
            const colEl = document.querySelector(`.column[data-col-id="${col.id}"]`);
            if (!colEl) return;

            const colTasks = tasks[col.id] || [];

            colEl.innerHTML = `
                <div class="hydrated-column-header">
                    <div class="col-header-left">
                        <span class="col-indicator-dot ${col.dotClass}"></span>
                        <span class="col-title">${col.title}</span>
                        <span class="col-count-badge" id="count-${col.id}">${colTasks.length}</span>
                    </div>
                    <button class="col-quick-add" title="Add task to ${col.title}" data-col="${col.id}">+</button>
                </div>
                <div class="task-cards-list" id="list-${col.id}">
                    ${colTasks.map(t => this.renderTaskCard(t)).join('')}
                </div>
            `;

            // Quick add listener
            const addBtn = colEl.querySelector('.col-quick-add');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    const colSelect = document.getElementById('task-column-select');
                    if (colSelect) colSelect.value = col.id;
                    openTaskModal();
                });
            }
        });

        this.updateTotalTaskCount();
    }

    renderTaskCard(task) {
        const progressPercent = (task.subtasks.done / task.subtasks.total) * 100;
        const tagClass = task.tag.toLowerCase().replace(/[^a-z0-9]/g, '');
        const priorityClass = task.priority.toLowerCase();

        return `
            <div class="task-card" data-task-id="${task.id}" data-tag="${tagClass}" data-priority="${priorityClass}" data-title="${task.title.toLowerCase()}" data-assignee="${task.assignee.toLowerCase()}">
                <div class="task-card-tags-row">
                    <span class="tag-pill ${tagClass}">${task.tag}</span>
                    <span class="priority-pill ${priorityClass}">${task.priority}</span>
                </div>
                <h4 class="task-card-title">${task.title}</h4>
                <div class="task-subtasks-bar-wrapper">
                    <div class="subtasks-info">
                        <span>Subtasks</span>
                        <span>${task.subtasks.done}/${task.subtasks.total}</span>
                    </div>
                    <div class="subtask-progress">
                        <div class="subtask-fill" style="width: ${progressPercent}%;"></div>
                    </div>
                </div>
                <div class="task-card-footer">
                    <div class="task-due-date">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>${task.due}</span>
                    </div>
                    <img src="${task.avatar}" alt="${task.assignee}" title="Assigned to ${task.assignee}" class="task-assignee-avatar">
                </div>
            </div>
        `;
    }

    filterTasks() {
        const allCards = document.querySelectorAll('.task-card');
        let visibleCount = 0;

        allCards.forEach(card => {
            const title = card.dataset.title || "";
            const tag = card.dataset.tag || "";
            const priority = card.dataset.priority || "";
            const assignee = card.dataset.assignee || "";

            const matchesSearch = !this.searchQuery || 
                title.includes(this.searchQuery) || 
                tag.includes(this.searchQuery) || 
                priority.includes(this.searchQuery) || 
                assignee.includes(this.searchQuery);

            const matchesFilter = this.currentFilter === "all" || 
                priority === this.currentFilter || 
                tag === this.currentFilter;

            if (matchesSearch && matchesFilter) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        const counterEl = document.getElementById('board-total-count');
        if (counterEl) {
            counterEl.textContent = `Showing ${visibleCount} task${visibleCount === 1 ? '' : 's'}`;
        }
    }

    updateTotalTaskCount() {
        const allCards = document.querySelectorAll('.task-card');
        const counterEl = document.getElementById('board-total-count');
        if (counterEl) {
            counterEl.textContent = `Showing ${allCards.length} tasks`;
        }
    }
}

/**
 * LoadingManager Class
 * Manages simulation cycles, anti-flash perceptual thresholds, and network profiles
 */
class LoadingManager {
    constructor() {
        this.minDuration = 300; // ms minimum to prevent jarring flicker
        this.startTime = 0;
        this.hydrator = new ContentHydrator('app-container');
        this.networkProfile = 'fast4g';
        this.isFrozen = false;

        this.initControls();
        this.initModal();
    }

    startLoading() {
        this.startTime = Date.now();
        const container = document.getElementById('app-container');
        const networkDot = document.getElementById('network-dot');
        const engineStatus = document.getElementById('engine-status');

        container.setAttribute('aria-busy', 'true');
        container.classList.remove('content-ready', 'is-loaded');
        container.classList.add('app-loading');

        if (networkDot) networkDot.className = 'pulsar-dot loading';
        if (engineStatus) engineStatus.textContent = 'FETCHING SPRINT METRICS...';

        const delay = this.getSimulatedDelay();

        this.mockApiCall(delay).then((data) => {
            if (this.isFrozen) {
                if (engineStatus) engineStatus.textContent = 'SKELETON FROZEN (INSPECTION)';
                return;
            }
            this.handleDataReady(data);
        });
    }

    getSimulatedDelay() {
        switch (this.networkProfile) {
            case 'instant':
                return 30;
            case 'fast4g':
                return 250;
            case 'slow3g':
                return 1200;
            case 'throttled':
                return 2500;
            case 'adaptive':
            default:
                const conn = navigator.connection;
                if (conn && conn.effectiveType === 'slow-2g') return 2000;
                if (conn && conn.effectiveType === '2g') return 1500;
                if (conn && conn.effectiveType === '3g') return 800;
                return Math.floor(Math.random() * 350) + 150;
        }
    }

    mockApiCall(delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(MOCK_DASHBOARD_DATA);
            }, delay);
        });
    }

    handleDataReady(data) {
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, this.minDuration - elapsed);

        const telemetryDelay = document.getElementById('telemetry-delay');
        if (telemetryDelay) {
            telemetryDelay.textContent = `${elapsed + remaining}ms`;
        }

        setTimeout(() => {
            this.hydrator.hydrate(data);

            const networkDot = document.getElementById('network-dot');
            const engineStatus = document.getElementById('engine-status');

            if (networkDot) networkDot.className = 'pulsar-dot';
            if (engineStatus) engineStatus.textContent = 'IDLE (HYDRATED)';

            showToast(`Hydrated in ${elapsed + remaining}ms with 0 layout shift`, "success");
        }, remaining);
    }

    initControls() {
        // Network Profile Selector
        const profileSelect = document.getElementById('network-profile');
        if (profileSelect) {
            profileSelect.addEventListener('change', (e) => {
                this.networkProfile = e.target.value;
                showToast(`Network profile set to: ${e.target.options[e.target.selectedIndex].text}`, "info");
            });
        }

        // Shimmer Style Selector
        const shimmerSelect = document.getElementById('shimmer-style');
        if (shimmerSelect) {
            shimmerSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                document.body.classList.remove('pulse-shimmer', 'low-bandwidth');
                if (val === 'pulse') document.body.classList.add('pulse-shimmer');
                if (val === 'low-bandwidth') document.body.classList.add('low-bandwidth');
                showToast(`Shimmer mode: ${e.target.options[e.target.selectedIndex].text}`, "info");
            });
        }

        // Retrigger Button
        const retriggerBtn = document.getElementById('retrigger-btn');
        if (retriggerBtn) {
            retriggerBtn.addEventListener('click', () => {
                this.isFrozen = false;
                const freezeBtn = document.getElementById('freeze-skeleton-btn');
                if (freezeBtn) freezeBtn.classList.remove('active');
                this.resetSkeletonDOM();
                this.startLoading();
            });
        }

        // Freeze Skeleton Button
        const freezeBtn = document.getElementById('freeze-skeleton-btn');
        if (freezeBtn) {
            freezeBtn.addEventListener('click', () => {
                this.isFrozen = !this.isFrozen;
                freezeBtn.classList.toggle('active', this.isFrozen);
                const freezeText = document.getElementById('freeze-text');
                const networkDot = document.getElementById('network-dot');

                if (this.isFrozen) {
                    if (freezeText) freezeText.textContent = 'Resume Hydration';
                    if (networkDot) networkDot.className = 'pulsar-dot frozen';
                    this.resetSkeletonDOM();
                    showToast("Wireframe inspection mode active (Skeletons frozen)", "info");
                } else {
                    if (freezeText) freezeText.textContent = 'Inspect Skeletons';
                    this.startLoading();
                }
            });
        }

        // Global Keyboard Shortcut: Ctrl + K focuses search
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('global-search-input');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            } else if (e.key === 'Escape') {
                closeTaskModal();
                const notifDropdown = document.getElementById('notification-dropdown');
                if (notifDropdown) notifDropdown.classList.add('hidden');
            }
        });

        // Close dropdown when clicking outside
        window.addEventListener('click', () => {
            const notifDropdown = document.getElementById('notification-dropdown');
            if (notifDropdown && !notifDropdown.classList.contains('hidden')) {
                notifDropdown.classList.add('hidden');
            }
        });
    }

    resetSkeletonDOM() {
        const container = document.getElementById('app-container');
        container.classList.remove('content-ready', 'is-loaded');
        container.classList.add('app-loading');
        container.setAttribute('aria-busy', 'true');

        // Reset slots to raw skeleton structures
        const logoSlot = document.getElementById('logo-slot');
        if (logoSlot) logoSlot.innerHTML = `<div class="skeleton logo-skeleton" aria-hidden="true"></div>`;

        const navSlots = document.querySelectorAll('.nav-item-slot');
        const widths = ['88%', '72%', '80%', '65%', '76%', '58%'];
        navSlots.forEach((slot, i) => {
            slot.innerHTML = `<div class="nav-item skeleton" style="width: ${widths[i]};" aria-hidden="true"></div>`;
        });

        const widgetSlot = document.getElementById('sidebar-widget-slot');
        if (widgetSlot) widgetSlot.innerHTML = `<div class="skeleton widget-skeleton" aria-hidden="true"></div>`;

        const userSlot = document.getElementById('user-profile-slot');
        if (userSlot) {
            userSlot.innerHTML = `
                <div class="user-profile-skeleton">
                    <div class="skeleton circle medium" aria-hidden="true"></div>
                    <div class="user-profile-text-skeleton">
                        <div class="skeleton" style="width: 90px; height: 14px; margin-bottom: 6px;" aria-hidden="true"></div>
                        <div class="skeleton" style="width: 60px; height: 10px;" aria-hidden="true"></div>
                    </div>
                </div>
            `;
        }

        const searchSlot = document.getElementById('search-slot');
        if (searchSlot) searchSlot.innerHTML = `<div class="search-bar skeleton" aria-hidden="true"></div>`;

        const filterSlot = document.getElementById('filter-pills-slot');
        if (filterSlot) {
            filterSlot.innerHTML = `
                <div class="skeleton filter-skeleton" style="width: 80px;" aria-hidden="true"></div>
                <div class="skeleton filter-skeleton" style="width: 70px;" aria-hidden="true"></div>
            `;
        }

        const notifSlot = document.getElementById('notification-slot');
        if (notifSlot) notifSlot.innerHTML = `<div class="notification-icon skeleton circle" aria-hidden="true"></div>`;

        const bannerSlot = document.getElementById('welcome-banner-slot');
        if (bannerSlot) bannerSlot.innerHTML = `<div class="skeleton banner-skeleton" aria-hidden="true"></div>`;

        // Reset stats cards
        const card0 = document.getElementById('stat-card-0');
        if (card0) {
            card0.innerHTML = `
                <div class="card-header skeleton" style="width: 50%; height: 16px;" aria-hidden="true"></div>
                <div class="card-body-skeleton">
                    <div class="skeleton" style="width: 45%; height: 2.2rem; margin: 0.8rem 0;" aria-hidden="true"></div>
                    <div class="skeleton" style="width: 75%; height: 12px;" aria-hidden="true"></div>
                </div>
            `;
        }

        const card1 = document.getElementById('stat-card-1');
        if (card1) {
            card1.innerHTML = `
                <div class="card-header skeleton" style="width: 55%; height: 16px;" aria-hidden="true"></div>
                <div class="gauge-area">
                    <div class="skeleton circle large" aria-hidden="true"></div>
                </div>
                <div class="skeleton" style="width: 60%; height: 12px; margin-top: 0.5rem;" aria-hidden="true"></div>
            `;
        }

        const card2 = document.getElementById('stat-card-2');
        if (card2) {
            card2.innerHTML = `
                <div class="card-header skeleton" style="width: 45%; height: 16px;" aria-hidden="true"></div>
                <div class="avatars-row">
                    <div class="skeleton circle small" aria-hidden="true"></div>
                    <div class="skeleton circle small" aria-hidden="true"></div>
                    <div class="skeleton circle small" aria-hidden="true"></div>
                    <div class="skeleton circle small" aria-hidden="true"></div>
                </div>
                <div class="skeleton" style="width: 70%; height: 12px; margin-top: 0.5rem;" aria-hidden="true"></div>
            `;
        }

        const card3 = document.getElementById('stat-card-3');
        if (card3) {
            card3.innerHTML = `
                <div class="card-header skeleton" style="width: 60%; height: 16px;" aria-hidden="true"></div>
                <div class="card-body-skeleton">
                    <div class="skeleton" style="width: 50%; height: 2.2rem; margin: 0.8rem 0;" aria-hidden="true"></div>
                    <div class="skeleton" style="width: 80%; height: 12px;" aria-hidden="true"></div>
                </div>
            `;
        }

        // Reset kanban columns
        ['todo', 'inprogress', 'review', 'done'].forEach(colId => {
            const colEl = document.querySelector(`.column[data-col-id="${colId}"]`);
            if (colEl) {
                colEl.innerHTML = `
                    <div class="column-header skeleton" style="width: 60%; height: 24px;" aria-hidden="true"></div>
                    <div class="task-cards-list">
                        <div class="task-card skeleton-card">
                            <div class="skeleton" style="width: 100%; height: 115px;" aria-hidden="true"></div>
                        </div>
                        <div class="task-card skeleton-card">
                            <div class="skeleton" style="width: 100%; height: 115px;" aria-hidden="true"></div>
                        </div>
                    </div>
                `;
            }
        });
    }

    initModal() {
        const postBtn = document.getElementById('post-btn');
        if (postBtn) {
            postBtn.addEventListener('click', () => {
                openTaskModal();
            });
        }

        const closeBtn = document.getElementById('close-modal-btn');
        const cancelBtn = document.getElementById('cancel-modal-btn');
        const overlay = document.getElementById('task-modal');

        if (closeBtn) closeBtn.addEventListener('click', closeTaskModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeTaskModal);
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeTaskModal();
            });
        }

        const form = document.getElementById('new-task-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreateTask();
            });
        }
    }

    handleCreateTask() {
        const submitBtn = document.getElementById('submit-task-btn');
        const titleInput = document.getElementById('task-title-input');
        const colSelect = document.getElementById('task-column-select');
        const prioritySelect = document.getElementById('task-priority-select');
        const tagSelect = document.getElementById('task-tag-select');
        const assigneeSelect = document.getElementById('task-assignee-select');

        if (!titleInput.value.trim()) return;

        // Button morph to spinner
        if (submitBtn) submitBtn.classList.add('loading');

        const avatarMap = {
            "Slava K.": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80",
            "Elena R.": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80",
            "Marcus V.": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80",
            "Aria C.": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=60&q=80"
        };

        const newTask = {
            id: `task-${Date.now()}`,
            title: titleInput.value.trim(),
            tag: tagSelect.value,
            priority: prioritySelect.value,
            subtasks: { done: 0, total: 3 },
            due: "In 3 days",
            assignee: assigneeSelect.value,
            avatar: avatarMap[assigneeSelect.value] || avatarMap["Slava K."]
        };

        setTimeout(() => {
            const targetColList = document.getElementById(`list-${colSelect.value}`);
            if (targetColList) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = this.hydrator.renderTaskCard(newTask);
                const newCard = tempDiv.firstElementChild;
                targetColList.prepend(newCard);

                // Update column badge counter
                const countBadge = document.getElementById(`count-${colSelect.value}`);
                if (countBadge) {
                    const current = parseInt(countBadge.textContent, 10) || 0;
                    countBadge.textContent = current + 1;
                }

                this.hydrator.updateTotalTaskCount();
            }

            if (submitBtn) submitBtn.classList.remove('loading');
            closeTaskModal();
            form.reset();
            showToast(`Task created in ${colSelect.options[colSelect.selectedIndex].text}`, "success");
        }, 600);
    }
}

// Helpers for Modal and Toast
function openTaskModal() {
    const modal = document.getElementById('task-modal');
    if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            const input = document.getElementById('task-title-input');
            if (input) input.focus();
        }, 50);
    }
}

function closeTaskModal() {
    const modal = document.getElementById('task-modal');
    if (modal) modal.classList.add('hidden');
}

function showToast(message, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const iconMap = {
        success: "✨",
        info: "⚡",
        warning: "⚠️",
        error: "❌"
    };

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span class="toast-icon">${iconMap[type] || '⚡'}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    const app = new LoadingManager();
    app.startLoading();
});
