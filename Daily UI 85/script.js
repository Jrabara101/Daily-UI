/**
 * LogStream — Senior Front-end Engineering Core
 */

// 1. Configuration & State
const CONFIG = {
    TOTAL_ITEMS: 5000,
    ITEMS_PER_PAGE: 12,
    PREFETCH_DELAY: 200,
    DELTA: 1 // Pagination sliding window delta
};

let STATE = {
    currentPage: 1,
    data: [],
    filteredData: [],
    isLoading: false,
    hoverTimer: null
};

/**
 * 2. Data Simulation Utility
 * Generates a massive dataset of logs.
 */
const generateLogs = (count) => {
    const SIGS = ['SUCCESS', 'WARNING', 'CRITICAL', 'INFO'];
    const EVENTS = [
        'HTTP/2 GET /api/v1/auth - Handled by edge_node_',
        'Memory usage spikes above 85% on container_',
        'DB_CONNECTION_TIMEOUT: master_db replica refused handshake',
        'Cleanup job completed: cached items purged',
        'SSL Certificate renewed for *.sys-node.io',
        'Batch chunk processing: MB processed',
        'Background worker initiated re-indexing of sector_',
        'Unauthorized access attempt blocked at gateway_',
        'Firewall rules updated: new policy deployed'
    ];

    return Array.from({ length: count }, (_, i) => {
        const date = new Date();
        date.setMinutes(date.getMinutes() - i);

        const sig = SIGS[Math.floor(Math.random() * SIGS.length)];
        let event = EVENTS[Math.floor(Math.random() * EVENTS.length)];

        // Add random flavor to events
        if (event.includes('edge_node_')) event += `west_0${Math.floor(Math.random() * 5)}`;
        if (event.includes('container_')) event += `0${Math.floor(Math.random() * 9)}`;
        if (event.includes('sector_')) event += `0x${Math.floor(Math.random() * 256).toString(16)}`;

        return {
            pid: `#LX-${999999 - i}`,
            time: date.toISOString().replace('T', ' ').substring(0, 19) + '.' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
            event: event,
            sig: sig,
            level: sig === 'CRITICAL' ? 'critical' : sig === 'WARNING' ? 'warning' : 'nominal'
        };
    });
};

/**
 * 3. Pagination Logic (Sliding Window Algorithm)
 */
const generatePaginationRange = (current, total) => {
    const delta = CONFIG.DELTA;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i);
    }

    if (current - delta > 2) {
        rangeWithDots.push(1, '...');
    } else {
        rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < total - 1) {
        rangeWithDots.push('...', total);
    } else if (total > 1) {
        rangeWithDots.push(total);
    }

    return rangeWithDots;
};

/**
 * 4. UI Rendering
 */
const renderTable = () => {
    const start = (STATE.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
    const end = start + CONFIG.ITEMS_PER_PAGE;
    const pageData = STATE.filteredData.slice(start, end);

    const tbody = document.getElementById('log-body');
    tbody.innerHTML = pageData.map(log => `
        <tr class="hover:bg-white/10 ${log.level === 'critical' ? 'bg-status-red/5 text-status-red' : ''}">
            <td class="px-4 py-3 brutal-border-r text-terminal-dim">${log.pid}</td>
            <td class="px-4 py-3 brutal-border-r font-mono text-sm">${log.time}</td>
            <td class="px-4 py-3 brutal-border-r">${log.event}</td>
            <td class="px-4 py-3 text-center">
                <span class="font-bold">[ ${log.sig} ]</span>
            </td>
        </tr>
    `).join('');

    // Update block range
    document.getElementById('block-range').textContent = `${start + 1}-${Math.min(end, STATE.filteredData.length)}`;
    document.getElementById('total-count').textContent = STATE.filteredData.length.toLocaleString();
};

const renderPagination = () => {
    const totalPages = Math.ceil(STATE.filteredData.length / CONFIG.ITEMS_PER_PAGE);
    const range = generatePaginationRange(STATE.currentPage, totalPages);
    const hub = document.getElementById('pagination-hub');

    let html = `
        <button class="page-btn nav-btn ${STATE.currentPage === 1 ? 'disabled' : ''}" data-page="${STATE.currentPage - 1}" ${STATE.currentPage === 1 ? 'disabled' : ''}>
            <span class="material-symbols-outlined">arrow_back</span>
        </button>
    `;

    range.forEach(item => {
        if (item === '...') {
            html += `<span class="ellipsis">...</span>`;
        } else {
            html += `
                <button class="page-btn ${item === STATE.currentPage ? 'active' : ''}" data-page="${item}" aria-current="${item === STATE.currentPage ? 'page' : 'false'}">
                    ${item}
                </button>
            `;
        }
    });

    html += `
        <button class="page-btn nav-btn ${STATE.currentPage === totalPages ? 'disabled' : ''}" data-page="${STATE.currentPage + 1}" ${STATE.currentPage === totalPages ? 'disabled' : ''}>
            <span class="material-symbols-outlined">arrow_forward</span>
        </button>
    `;

    hub.innerHTML = html;
};

/**
 * 5. State Synchronization (History API)
 */
const updateURL = () => {
    const url = new URL(window.location);
    url.searchParams.set('page', STATE.currentPage);
    window.history.pushState({ page: STATE.currentPage }, '', url);
};

const goToPage = (page) => {
    const totalPages = Math.ceil(STATE.filteredData.length / CONFIG.ITEMS_PER_PAGE);
    const target = Math.max(1, Math.min(page, totalPages));

    if (target === STATE.currentPage) return;

    STATE.isLoading = true;
    document.getElementById('loading-overlay').classList.remove('hidden');

    // Simulate async data fetch/chunking
    setTimeout(() => {
        STATE.currentPage = target;
        STATE.isLoading = false;
        document.getElementById('loading-overlay').classList.add('hidden');
        document.getElementById('jump-input').value = target;

        renderTable();
        renderPagination();
        updateURL();

        // Scroll table to top
        document.getElementById('table-scroll-container').scrollTop = 0;
    }, 150);
};

/**
 * 6. Information Scent Logic
 */
const showTooltip = (e, page) => {
    const tooltip = document.getElementById('info-tooltip');
    const startIdx = (page - 1) * CONFIG.ITEMS_PER_PAGE;
    const firstLog = STATE.filteredData[startIdx];
    const lastLog = STATE.filteredData[Math.min(startIdx + CONFIG.ITEMS_PER_PAGE - 1, STATE.filteredData.length - 1)];

    if (!firstLog) return;

    tooltip.innerHTML = `
        <div class="font-bold border-b border-status-green/30 mb-1">PAGE_${page}_METADATA</div>
        <div>TEMPORAL_WINDOW:</div>
        <div class="text-[10px] opacity-70">${firstLog.time.split(' ')[1]} -> ${lastLog.time.split(' ')[1]}</div>
        <div>PID_RANGE:</div>
        <div class="text-[10px] opacity-70">${firstLog.pid} - ${lastLog.pid}</div>
    `;

    tooltip.style.left = `${e.clientX + 15}px`;
    tooltip.style.top = `${e.clientY + 15}px`;
    tooltip.style.opacity = '1';
};

const hideTooltip = () => {
    document.getElementById('info-tooltip').style.opacity = '0';
};

/**
 * 7. Event Handlers
 */
const initEvents = () => {
    // Event Delegation for Pagination
    document.getElementById('pagination-hub').addEventListener('click', (e) => {
        const btn = e.target.closest('.page-btn');
        if (btn && !btn.classList.contains('disabled')) {
            goToPage(parseInt(btn.dataset.page));
        }
    });

    // Info Scent Hover
    document.getElementById('pagination-hub').addEventListener('mouseover', (e) => {
        const btn = e.target.closest('.page-btn:not(.nav-btn)');
        if (btn) {
            const page = parseInt(btn.dataset.page);
            showTooltip(e, page);

            // Optimistic Prefetching Logic
            STATE.hoverTimer = setTimeout(() => {
                console.log(`[PREFETCH] Warm-up data for page ${page}`);
            }, CONFIG.PREFETCH_DELAY);
        }
    });

    document.getElementById('pagination-hub').addEventListener('mouseout', (e) => {
        if (e.target.closest('.page-btn')) {
            hideTooltip();
            clearTimeout(STATE.hoverTimer);
        }
    });

    // Filter Logic
    document.getElementById('log-pipe').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        STATE.filteredData = STATE.data.filter(log =>
            log.event.toLowerCase().includes(term) ||
            log.pid.toLowerCase().includes(term) ||
            log.sig.toLowerCase().includes(term)
        );
        STATE.currentPage = 1;
        renderTable();
        renderPagination();
    });

    // Jump Input
    document.getElementById('jump-input').addEventListener('change', (e) => {
        goToPage(parseInt(e.target.value));
    });

    // Keyboard Navigation
    window.addEventListener('keydown', (e) => {
        if (document.activeElement.tagName === 'INPUT') return;

        if (e.key === 'ArrowLeft') goToPage(STATE.currentPage - 1);
        if (e.key === 'ArrowRight') goToPage(STATE.currentPage + 1);
    });

    // History Back/Forward
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.page) {
            goToPage(e.state.page);
        }
    });
};

/**
 * 8. Initialization
 */
const init = () => {
    // 1. Load Data
    STATE.data = generateLogs(CONFIG.TOTAL_ITEMS);
    STATE.filteredData = [...STATE.data];

    // 2. Sync State from URL
    const params = new URLSearchParams(window.location.search);
    const urlPage = parseInt(params.get('page'));
    if (urlPage && !isNaN(urlPage)) {
        STATE.currentPage = urlPage;
        document.getElementById('jump-input').value = urlPage;
    }

    // 3. Render Initial UI
    renderTable();
    renderPagination();
    initEvents();

    // 4. Alerts Simulation
    const alertsCont = document.getElementById('alerts-container');
    const alerts = [
        { time: '14:02:08', title: 'DB_TIMEOUT', msg: 'Master_db replica refused handshake.', status: 'red' },
        { time: '13:55:01', title: 'MEM_SPIKE', msg: 'Node_04 memory usage > 90%. Scaling triggered.', status: 'yellow' },
        { time: '12:30:22', title: 'SYS_REPORT', msg: 'Daily backup completed successfully.', status: 'dim' }
    ];

    alertsCont.innerHTML = alerts.map(a => `
        <div class="p-2 brutal-border ${a.status === 'red' ? 'border-status-red bg-status-red/10' : a.status === 'yellow' ? 'border-status-yellow bg-status-yellow/10' : 'border-terminal-dim'}">
            <p class="font-bold ${a.status === 'red' ? 'text-status-red' : a.status === 'yellow' ? 'text-status-yellow' : ''}">[${a.time}] ${a.title}</p>
            <p class="text-xs">${a.msg}</p>
        </div>
    `).join('');

    console.log('LogStream Engine Ready.');
};

document.addEventListener('DOMContentLoaded', init);
