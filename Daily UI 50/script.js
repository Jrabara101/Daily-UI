// ============================================================================
// STATE MANAGEMENT - Simple Store Pattern with Observer
// ============================================================================

class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

// Initialize store
const store = new Store({
    jobs: [],
    activities: [],
    applications: [],
    savedJobs: new Set(),
    comparedJobs: new Set(),
    compareMode: false,
    filters: {
        search: '',
        location: '',
        remote: false,
        sort: 'relevance',
        salaryMin: 0,
        salaryMax: 200,
        jobTypes: ['fulltime'],
        experienceLevels: [],
        techTags: [],
        companySize: '',
        easyApply: false
    },
    activityFilter: 'all',
    unreadOnly: false,
    currentView: 'jobs',
    selectedJobId: null,
    theme: localStorage.getItem('theme') || 'light'
});

// ============================================================================
// DATA GENERATION - Mock Data (100+ jobs, 200+ activities)
// ============================================================================

const companies = [
    'TechCorp', 'InnovateLabs', 'DataFlow', 'CloudSync', 'DevOps Inc', 'AI Solutions',
    'WebCraft', 'MobileFirst', 'SecureNet', 'CodeBase', 'StartupHub', 'EnterpriseX',
    'AgileSoft', 'NextGen', 'FutureTech', 'SmartSys', 'DigitalEdge', 'CyberCore',
    'AppWorks', 'SystemPro', 'NetVault', 'CodeForge', 'TechVault', 'DevStream',
    'CloudNine', 'DataCore', 'WebSphere', 'MobileCore', 'TechFlow', 'InnovateX'
];

const jobTitles = [
    'Senior Frontend Developer', 'Full Stack Engineer', 'React Developer', 'Vue.js Specialist',
    'Angular Developer', 'Node.js Engineer', 'Python Developer', 'Java Developer',
    'DevOps Engineer', 'Cloud Architect', 'Data Scientist', 'Machine Learning Engineer',
    'UI/UX Designer', 'Product Manager', 'Scrum Master', 'QA Engineer', 'Security Engineer',
    'Backend Developer', 'Mobile Developer', 'iOS Developer', 'Android Developer',
    'TypeScript Developer', 'Go Developer', 'Rust Developer', 'Blockchain Developer',
    'Site Reliability Engineer', 'Technical Lead', 'Engineering Manager', 'CTO'
];

const techTags = [
    'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'TypeScript', 'JavaScript',
    'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'MongoDB', 'PostgreSQL', 'Redis',
    'Next.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Go', 'Rust', 'Swift',
    'Kotlin', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Blockchain', 'Web3'
];

const locations = [
    'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA',
    'Chicago, IL', 'Denver, CO', 'Remote', 'London, UK', 'Toronto, Canada',
    'Berlin, Germany', 'Amsterdam, Netherlands', 'Sydney, Australia', 'Tokyo, Japan'
];

const activityTypes = [
    'new_match', 'profile_viewed', 'application_submitted', 'status_changed',
    'interview_scheduled', 'job_expiring'
];

function generateJobId() {
    return 'job_' + Math.random().toString(36).substr(2, 9);
}

function generateActivityId() {
    return 'act_' + Math.random().toString(36).substr(2, 9);
}

function generateJobs(count = 120) {
    const jobs = [];
    const now = Date.now();
    
    for (let i = 0; i < count; i++) {
        const company = companies[Math.floor(Math.random() * companies.length)];
        const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const isRemote = location === 'Remote' || Math.random() > 0.6;
        const salaryMin = Math.floor(Math.random() * 100) + 50;
        const salaryMax = salaryMin + Math.floor(Math.random() * 50) + 20;
        const jobType = ['fulltime', 'parttime', 'contract'][Math.floor(Math.random() * 3)];
        const experienceLevel = ['entry', 'mid', 'senior', 'executive'][Math.floor(Math.random() * 4)];
        const companySize = ['startup', 'small', 'medium', 'large'][Math.floor(Math.random() * 4)];
        const easyApply = Math.random() > 0.7;
        const postedDaysAgo = Math.floor(Math.random() * 30);
        const postedDate = now - (postedDaysAgo * 24 * 60 * 60 * 1000);
        
        // Generate tech tags (2-5 random tags)
        const numTags = Math.floor(Math.random() * 4) + 2;
        const jobTags = [];
        const availableTags = [...techTags];
        for (let j = 0; j < numTags; j++) {
            const tagIndex = Math.floor(Math.random() * availableTags.length);
            jobTags.push(availableTags.splice(tagIndex, 1)[0]);
        }
        
        // Calculate relevance score (recency × match score × interaction)
        const recencyScore = 1 / (postedDaysAgo + 1);
        const matchScore = 0.5 + Math.random() * 0.5;
        const interactionScore = 1; // Would be based on user behavior
        const relevanceScore = recencyScore * matchScore * interactionScore;
        
        jobs.push({
            id: generateJobId(),
            title,
            company,
            location,
            remote: isRemote,
            salaryMin,
            salaryMax,
            jobType,
            experienceLevel,
            companySize,
            easyApply,
            tags: jobTags,
            postedDate,
            relevanceScore,
            description: `We are looking for a ${title} to join our team. This role involves working with modern technologies and collaborating with cross-functional teams.`,
            requirements: [
                `${experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} level experience`,
                `Strong knowledge of ${jobTags.slice(0, 2).join(' and ')}`,
                'Excellent communication skills',
                'Team player with problem-solving abilities'
            ],
            benefits: [
                'Health insurance',
                '401(k) matching',
                'Flexible work hours',
                isRemote ? 'Fully remote' : 'Hybrid work options'
            ]
        });
    }
    
    return jobs;
}

function generateActivities(count = 220) {
    const activities = [];
    const now = Date.now();
    const jobs = store.getState().jobs;
    
    for (let i = 0; i < count; i++) {
        const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const hoursAgo = Math.floor(Math.random() * 168); // Last 7 days
        const timestamp = now - (hoursAgo * 60 * 60 * 1000);
        const unread = Math.random() > 0.4;
        
        let activity = {
            id: generateActivityId(),
            type,
            timestamp,
            unread,
            read: !unread
        };
        
        // Generate activity-specific data
        switch (type) {
            case 'new_match':
                const matchCount = Math.floor(Math.random() * 5) + 1;
                activity.text = `${matchCount} new ${matchCount === 1 ? 'job matches' : 'jobs match'} your profile`;
                activity.context = matchCount === 1 ? 'React Developer at TechCorp' : `${matchCount} positions available`;
                activity.jobIds = jobs.slice(0, matchCount).map(j => j.id);
                activity.icon = '🎯';
                break;
            case 'profile_viewed':
                const company = companies[Math.floor(Math.random() * companies.length)];
                activity.text = `${company} viewed your profile`;
                activity.context = 'They might be interested in your skills';
                activity.company = company;
                activity.icon = '👁️';
                break;
            case 'application_submitted':
                const job = jobs[Math.floor(Math.random() * Math.min(jobs.length, 10))];
                activity.text = 'Application submitted successfully';
                activity.context = job ? `${job.title} at ${job.company}` : 'Application submitted';
                activity.jobId = job?.id;
                activity.icon = '✅';
                break;
            case 'status_changed':
                const statuses = ['Under Review', 'Interview Scheduled', 'Offer Extended'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                const job2 = jobs[Math.floor(Math.random() * Math.min(jobs.length, 10))];
                activity.text = `Status updated: ${status}`;
                activity.context = job2 ? `${job2.title} at ${job2.company}` : 'Application status';
                activity.status = status;
                activity.jobId = job2?.id;
                activity.icon = '📊';
                break;
            case 'interview_scheduled':
                const job3 = jobs[Math.floor(Math.random() * Math.min(jobs.length, 10))];
                const interviewDate = new Date(now + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000);
                activity.text = 'Interview scheduled';
                activity.context = job3 ? `${job3.title} at ${job3.company}` : 'Interview scheduled';
                activity.interviewDate = interviewDate.toISOString();
                activity.jobId = job3?.id;
                activity.icon = '📅';
                break;
            case 'job_expiring':
                const job4 = jobs[Math.floor(Math.random() * Math.min(jobs.length, 10))];
                activity.text = 'Saved job expiring soon';
                activity.context = job4 ? `${job4.title} at ${job4.company}` : 'Job expiring';
                activity.jobId = job4?.id;
                activity.icon = '⏰';
                break;
        }
        
        activities.push(activity);
    }
    
    // Sort by timestamp (newest first)
    return activities.sort((a, b) => b.timestamp - a.timestamp);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
}

function formatSalary(min, max) {
    return `$${min}k - $${max}k`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const elements = {
    // Header
    globalSearch: document.getElementById('globalSearch'),
    locationInput: document.getElementById('locationInput'),
    notificationsBtn: document.getElementById('notificationsBtn'),
    notificationBadge: document.getElementById('notificationBadge'),
    themeToggle: document.getElementById('themeToggle'),
    profileBtn: document.getElementById('profileBtn'),
    profileDropdown: document.getElementById('profileDropdown'),
    profileMenuContainer: document.querySelector('.profile-menu-container'),
    
    // Mobile tabs
    mobileTabs: document.querySelectorAll('.mobile-tab'),
    
    // Jobs section
    jobsSection: document.getElementById('jobs-section'),
    jobsList: document.getElementById('jobsList'),
    jobsSkeleton: document.getElementById('jobsSkeleton'),
    jobsEmpty: document.getElementById('jobsEmpty'),
    jobSearch: document.getElementById('jobSearch'),
    remoteToggle: document.getElementById('remoteToggle'),
    sortSelect: document.getElementById('sortSelect'),
    filtersBtn: document.getElementById('filtersBtn'),
    filtersDrawer: document.getElementById('filtersDrawer'),
    drawerClose: document.getElementById('drawerClose'),
    viewToggle: document.querySelectorAll('.view-btn'),
    compareBtn: document.getElementById('compareBtn'),
    compareCount: document.getElementById('compareCount'),
    jobDetailPanel: document.getElementById('jobDetailPanel'),
    panelClose: document.getElementById('panelClose'),
    panelContent: document.getElementById('panelContent'),
    
    // Activity section
    activitySection: document.getElementById('activity-section'),
    activityFeed: document.getElementById('activityFeed'),
    activitySkeleton: document.getElementById('activitySkeleton'),
    activityEmpty: document.getElementById('activityEmpty'),
    activityFilters: document.querySelectorAll('.activity-filter-btn'),
    unreadOnly: document.getElementById('unreadOnly'),
    markAllRead: document.getElementById('markAllRead'),
    
    // Applications section
    applicationsSection: document.getElementById('applications-section'),
    kanbanBoard: document.getElementById('kanbanBoard'),
    
    // Modals
    compareModal: document.getElementById('compareModal'),
    compareModalClose: document.getElementById('compareModalClose'),
    compareContent: document.getElementById('compareContent'),
    confirmDialog: document.getElementById('confirmDialog'),
    confirmMessage: document.getElementById('confirmMessage'),
    confirmOk: document.getElementById('confirmOk'),
    confirmCancel: document.getElementById('confirmCancel'),
    
    // Toast & Error
    toastContainer: document.getElementById('toastContainer'),
    errorBanner: document.getElementById('errorBanner'),
    errorMessage: document.getElementById('errorMessage'),
    errorClose: document.getElementById('errorClose')
};

// ============================================================================
// RENDERING FUNCTIONS
// ============================================================================

function renderJobCard(job, isSelected = false) {
    const saved = store.getState().savedJobs.has(job.id);
    const compared = store.getState().comparedJobs.has(job.id);
    const isGridView = elements.jobsList.classList.contains('grid-view');
    
    const card = document.createElement('div');
    card.className = `job-card ${isSelected ? 'selected' : ''}`;
    card.setAttribute('role', 'listitem');
    card.setAttribute('data-job-id', job.id);
    
    if (compared) {
        card.classList.add('selected');
    }
    
    card.innerHTML = `
        ${store.getState().compareMode ? `
            <input type="checkbox" class="job-select-checkbox" ${compared ? 'checked' : ''} 
                   aria-label="Select job for comparison">
        ` : ''}
        <div class="job-card-header">
            <div class="job-logo">${job.company.charAt(0)}</div>
            <div class="job-info">
                <h3 class="job-title">${job.title}</h3>
                <div class="job-company">${job.company}</div>
                <div class="job-meta">
                    <span>${formatSalary(job.salaryMin, job.salaryMax)}</span>
                    <span>•</span>
                    <span>${job.remote ? 'Remote' : job.location}</span>
                    <span>•</span>
                    <span>${formatTimeAgo(job.postedDate)}</span>
                </div>
            </div>
        </div>
        <div class="job-tags">
            ${job.tags.slice(0, 3).map(tag => `<span class="job-tag">${tag}</span>`).join('')}
        </div>
        <div class="job-actions">
            <button class="job-action-btn save-btn ${saved ? 'saved' : ''}" 
                    aria-label="${saved ? 'Unsave' : 'Save'} job">
                ${saved ? 'Saved' : 'Save'}
            </button>
            <button class="job-action-btn apply-btn" aria-label="Apply for job">
                ${job.easyApply ? 'Easy Apply' : 'Apply'}
            </button>
        </div>
    `;
    
    // Event listeners
    card.querySelector('.save-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSaveJob(job.id);
    });
    
    card.querySelector('.apply-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        handleApply(job);
    });
    
    if (card.querySelector('.job-select-checkbox')) {
        card.querySelector('.job-select-checkbox').addEventListener('change', (e) => {
            e.stopPropagation();
            toggleCompareJob(job.id);
        });
    }
    
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.job-action-btn') && !e.target.closest('.job-select-checkbox')) {
            showJobDetail(job);
        }
    });
    
    return card;
}

function renderJobs(jobs) {
    const state = store.getState();
    elements.jobsSkeleton.style.display = 'none';
    
    if (jobs.length === 0) {
        elements.jobsList.innerHTML = '';
        elements.jobsEmpty.style.display = 'block';
        return;
    }
    
    elements.jobsEmpty.style.display = 'none';
    elements.jobsList.innerHTML = '';
    
    // Incremental rendering for performance
    const batchSize = 20;
    let index = 0;
    
    function renderBatch() {
        const end = Math.min(index + batchSize, jobs.length);
        const fragment = document.createDocumentFragment();
        
        for (let i = index; i < end; i++) {
            const job = jobs[i];
            const card = renderJobCard(job);
            fragment.appendChild(card);
        }
        
        elements.jobsList.appendChild(fragment);
        index = end;
        
        if (index < jobs.length) {
            requestAnimationFrame(renderBatch);
        }
    }
    
    renderBatch();
}

function renderActivityItem(activity) {
    const item = document.createElement('div');
    item.className = `activity-item ${activity.unread ? 'unread' : ''}`;
    item.setAttribute('data-activity-id', activity.id);
    
    const job = activity.jobId ? store.getState().jobs.find(j => j.id === activity.jobId) : null;
    
    let ctaButton = '';
    if (activity.jobId) {
        ctaButton = `<button class="btn-secondary" data-action="view-job" data-job-id="${activity.jobId}">View Job</button>`;
    }
    if (activity.type === 'interview_scheduled') {
        ctaButton += `<button class="btn-secondary" data-action="add-calendar">Add to Calendar</button>`;
    }
    
    item.innerHTML = `
        <div class="activity-item-header">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-context">${activity.context}</div>
                <div class="activity-time">${formatTimeAgo(activity.timestamp)}</div>
            </div>
        </div>
        ${ctaButton ? `<div class="activity-actions-item">${ctaButton}</div>` : ''}
    `;
    
    // Event listeners
    item.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.dataset.action;
            if (action === 'view-job' && btn.dataset.jobId) {
                const job = store.getState().jobs.find(j => j.id === btn.dataset.jobId);
                if (job) showJobDetail(job);
            } else if (action === 'add-calendar') {
                showToast('Added to calendar', true);
            }
        });
    });
    
    // Mark as read on click
    item.addEventListener('click', () => {
        if (activity.unread) {
            markActivityRead(activity.id);
        }
    });
    
    return item;
}

function renderActivities(activities) {
    elements.activitySkeleton.style.display = 'none';
    
    if (activities.length === 0) {
        elements.activityFeed.innerHTML = '';
        elements.activityEmpty.style.display = 'block';
        return;
    }
    
    elements.activityEmpty.style.display = 'none';
    elements.activityFeed.innerHTML = '';
    
    // Group similar activities
    const grouped = groupActivities(activities);
    
    grouped.forEach(group => {
        if (group.items.length > 1 && group.type === 'new_match') {
            const groupEl = document.createElement('div');
            groupEl.className = 'activity-group';
            groupEl.innerHTML = `
                <div class="activity-group-header">
                    <span>${group.text}</span>
                    <button class="btn-secondary group-toggle">Expand</button>
                </div>
                <div class="activity-group-items"></div>
            `;
            
            const itemsContainer = groupEl.querySelector('.activity-group-items');
            group.items.forEach(activity => {
                itemsContainer.appendChild(renderActivityItem(activity));
            });
            
            groupEl.querySelector('.group-toggle').addEventListener('click', () => {
                groupEl.classList.toggle('expanded');
                const btn = groupEl.querySelector('.group-toggle');
                btn.textContent = groupEl.classList.contains('expanded') ? 'Collapse' : 'Expand';
            });
            
            elements.activityFeed.appendChild(groupEl);
        } else {
            group.items.forEach(activity => {
                elements.activityFeed.appendChild(renderActivityItem(activity));
            });
        }
    });
}

function groupActivities(activities) {
    const groups = [];
    const processed = new Set();
    
    activities.forEach(activity => {
        if (processed.has(activity.id)) return;
        
        if (activity.type === 'new_match' && activity.jobIds && activity.jobIds.length > 1) {
            const similar = activities.filter(a => 
                a.type === 'new_match' && 
                !processed.has(a.id) &&
                a.timestamp > activity.timestamp - 3600000 // Within 1 hour
            );
            
            similar.forEach(a => processed.add(a.id));
            
            groups.push({
                type: 'new_match',
                text: `${similar.length} new job matches`,
                items: similar
            });
        } else {
            processed.add(activity.id);
            groups.push({
                type: activity.type,
                text: activity.text,
                items: [activity]
            });
        }
    });
    
    return groups;
}

function renderJobDetail(job) {
    elements.panelContent.innerHTML = `
        <div class="job-detail-header">
            <div class="job-logo" style="width: 4rem; height: 4rem; font-size: 2rem;">${job.company.charAt(0)}</div>
            <h2>${job.title}</h2>
            <p class="job-company">${job.company}</p>
            <div class="job-meta">
                <span>${formatSalary(job.salaryMin, job.salaryMax)}</span>
                <span>•</span>
                <span>${job.remote ? 'Remote' : job.location}</span>
                <span>•</span>
                <span>${job.jobType}</span>
            </div>
        </div>
        <div class="job-detail-content">
            <h3>Description</h3>
            <p>${job.description}</p>
            <h3>Requirements</h3>
            <ul>
                ${job.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
            <h3>Benefits</h3>
            <ul>
                ${job.benefits.map(ben => `<li>${ben}</li>`).join('')}
            </ul>
            <div class="job-tags">
                ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
            </div>
        </div>
        <div class="job-detail-actions">
            <button class="btn-primary apply-detail-btn" style="width: 100%;">${job.easyApply ? 'Easy Apply' : 'Apply Now'}</button>
            <button class="btn-secondary save-detail-btn" style="width: 100%;">
                ${store.getState().savedJobs.has(job.id) ? 'Unsave' : 'Save'}
            </button>
        </div>
    `;
    
    elements.panelContent.querySelector('.apply-detail-btn').addEventListener('click', () => {
        handleApply(job);
    });
    
    elements.panelContent.querySelector('.save-detail-btn').addEventListener('click', () => {
        toggleSaveJob(job.id);
    });
}

function renderCompareModal() {
    const comparedJobs = Array.from(store.getState().comparedJobs)
        .map(id => store.getState().jobs.find(j => j.id === id))
        .filter(Boolean);
    
    if (comparedJobs.length === 0) {
        showToast('Please select jobs to compare', false);
        return;
    }
    
    elements.compareContent.innerHTML = `
        <div class="compare-grid">
            ${comparedJobs.map(job => `
                <div class="compare-card">
                    <h4>${job.title}</h4>
                    <p class="job-company">${job.company}</p>
                    <div class="compare-item">
                        <div class="compare-label">Salary</div>
                        <div class="compare-value">${formatSalary(job.salaryMin, job.salaryMax)}</div>
                    </div>
                    <div class="compare-item">
                        <div class="compare-label">Location</div>
                        <div class="compare-value">${job.remote ? 'Remote' : job.location}</div>
                    </div>
                    <div class="compare-item">
                        <div class="compare-label">Job Type</div>
                        <div class="compare-value">${job.jobType}</div>
                    </div>
                    <div class="compare-item">
                        <div class="compare-label">Experience</div>
                        <div class="compare-value">${job.experienceLevel}</div>
                    </div>
                    <div class="compare-item">
                        <div class="compare-label">Tech Stack</div>
                        <div class="compare-value">${job.tags.join(', ')}</div>
                    </div>
                    <div class="compare-item">
                        <div class="compare-label">Requirements</div>
                        <div class="compare-value">${job.requirements.join('; ')}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    showModal(elements.compareModal);
}

// ============================================================================
// BUSINESS LOGIC FUNCTIONS
// ============================================================================

function filterJobs(jobs) {
    const filters = store.getState().filters;
    
    return jobs.filter(job => {
        // Search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch = 
                job.title.toLowerCase().includes(searchLower) ||
                job.company.toLowerCase().includes(searchLower) ||
                job.tags.some(tag => tag.toLowerCase().includes(searchLower));
            if (!matchesSearch) return false;
        }
        
        // Location
        if (filters.location) {
            const locationLower = filters.location.toLowerCase();
            if (!job.location.toLowerCase().includes(locationLower) && !job.remote) {
                return false;
            }
        }
        
        // Remote
        if (filters.remote && !job.remote) return false;
        
        // Salary
        if (job.salaryMax < filters.salaryMin * 1000) return false;
        if (job.salaryMin > filters.salaryMax * 1000) return false;
        
        // Job type
        if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(job.jobType)) return false;
        
        // Experience level
        if (filters.experienceLevels.length > 0 && !filters.experienceLevels.includes(job.experienceLevel)) return false;
        
        // Tech tags
        if (filters.techTags.length > 0) {
            const hasTag = filters.techTags.some(tag => job.tags.includes(tag));
            if (!hasTag) return false;
        }
        
        // Company size
        if (filters.companySize && job.companySize !== filters.companySize) return false;
        
        // Easy apply
        if (filters.easyApply && !job.easyApply) return false;
        
        return true;
    });
}

function sortJobs(jobs, sortBy) {
    const sorted = [...jobs];
    
    switch (sortBy) {
        case 'relevance':
            sorted.sort((a, b) => b.relevanceScore - a.relevanceScore);
            break;
        case 'newest':
            sorted.sort((a, b) => b.postedDate - a.postedDate);
            break;
        case 'salary':
            sorted.sort((a, b) => b.salaryMax - a.salaryMax);
            break;
    }
    
    return sorted;
}

function filterActivities(activities) {
    const state = store.getState();
    let filtered = [...activities];
    
    // Activity type filter
    if (state.activityFilter !== 'all') {
        const filterMap = {
            applications: ['application_submitted', 'status_changed', 'interview_scheduled'],
            matches: ['new_match'],
            alerts: ['profile_viewed', 'job_expiring']
        };
        const types = filterMap[state.activityFilter] || [];
        filtered = filtered.filter(a => types.includes(a.type));
    }
    
    // Unread only
    if (state.unreadOnly) {
        filtered = filtered.filter(a => a.unread);
    }
    
    return filtered;
}

function toggleSaveJob(jobId) {
    const state = store.getState();
    const savedJobs = new Set(state.savedJobs);
    
    if (savedJobs.has(jobId)) {
        savedJobs.delete(jobId);
        showToast('Job unsaved', true, () => {
            savedJobs.add(jobId);
            store.setState({ savedJobs });
            updateJobsDisplay();
        });
    } else {
        savedJobs.add(jobId);
        showToast('Job saved', true);
    }
    
    store.setState({ savedJobs });
    updateJobsDisplay();
    updateJobDetail();
}

function toggleCompareJob(jobId) {
    const state = store.getState();
    if (!state.compareMode) {
        store.setState({ compareMode: true });
    }
    
    const comparedJobs = new Set(state.comparedJobs);
    
    if (comparedJobs.has(jobId)) {
        comparedJobs.delete(jobId);
    } else {
        if (comparedJobs.size >= 3) {
            showToast('You can compare up to 3 jobs', false);
            return;
        }
        comparedJobs.add(jobId);
    }
    
    store.setState({ comparedJobs });
    elements.compareCount.textContent = comparedJobs.size;
    updateJobsDisplay();
}

function handleApply(job) {
    // Optimistic UI update
    showToast('Application submitted!', true);
    
    // Add to applications
    const applications = [...store.getState().applications];
    applications.push({
        id: 'app_' + Date.now(),
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        status: 'applied',
        appliedDate: Date.now()
    });
    
    store.setState({ applications });
    updateApplicationsDisplay();
    
    // Create activity
    const activities = [...store.getState().activities];
    activities.unshift({
        id: generateActivityId(),
        type: 'application_submitted',
        text: 'Application submitted successfully',
        context: `${job.title} at ${job.company}`,
        jobId: job.id,
        timestamp: Date.now(),
        unread: true,
        read: false,
        icon: '✅'
    });
    
    store.setState({ activities });
    updateActivityDisplay();
}

function markActivityRead(activityId) {
    const activities = store.getState().activities.map(a => 
        a.id === activityId ? { ...a, unread: false, read: true } : a
    );
    store.setState({ activities });
    updateActivityDisplay();
    updateNotificationBadge();
}

function showJobDetail(job) {
    store.setState({ selectedJobId: job.id });
    renderJobDetail(job);
    elements.jobDetailPanel.setAttribute('aria-hidden', 'false');
    
    // Focus trap
    const focusableElements = elements.jobDetailPanel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

function showModal(modal) {
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus trap
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

function hideModal(modal) {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function showToast(message, success = true, undoCallback = null) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
        ${undoCallback ? '<button class="toast-undo">Undo</button>' : ''}
    `;
    
    elements.toastContainer.appendChild(toast);
    
    if (undoCallback) {
        toast.querySelector('.toast-undo').addEventListener('click', () => {
            undoCallback();
            toast.remove();
        });
    }
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorBanner.style.display = 'flex';
    
    setTimeout(() => {
        elements.errorBanner.style.display = 'none';
    }, 5000);
}

// ============================================================================
// UPDATE FUNCTIONS
// ============================================================================

function updateJobsDisplay() {
    const state = store.getState();
    let jobs = filterJobs(state.jobs);
    jobs = sortJobs(jobs, state.filters.sort);
    renderJobs(jobs);
    updateURL();
}

function updateActivityDisplay() {
    const state = store.getState();
    const activities = filterActivities(state.activities);
    renderActivities(activities);
    updateNotificationBadge();
}

function updateJobDetail() {
    const state = store.getState();
    if (state.selectedJobId) {
        const job = state.jobs.find(j => j.id === state.selectedJobId);
        if (job) {
            renderJobDetail(job);
        }
    }
}

function updateApplicationsDisplay() {
    const state = store.getState();
    const columns = elements.kanbanBoard.querySelectorAll('.kanban-column');
    
    columns.forEach(column => {
        const stage = column.dataset.stage;
        const list = column.querySelector('.kanban-list');
        const count = column.querySelector('.kanban-count');
        
        const apps = state.applications.filter(a => a.status === stage);
        count.textContent = apps.length;
        
        list.innerHTML = '';
        apps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'kanban-card';
            card.draggable = true;
            card.innerHTML = `
                <div class="kanban-card-title">${app.jobTitle}</div>
                <div class="kanban-card-company">${app.company}</div>
            `;
            list.appendChild(card);
        });
    });
}

function updateNotificationBadge() {
    const unreadCount = store.getState().activities.filter(a => a.unread).length;
    elements.notificationBadge.textContent = unreadCount;
    elements.notificationBadge.style.display = unreadCount > 0 ? 'block' : 'none';
}

function updateURL() {
    const state = store.getState();
    const params = new URLSearchParams();
    
    if (state.filters.search) params.set('search', state.filters.search);
    if (state.filters.location) params.set('location', state.filters.location);
    if (state.filters.remote) params.set('remote', '1');
    if (state.filters.sort !== 'relevance') params.set('sort', state.filters.sort);
    if (state.currentView !== 'jobs') params.set('view', state.currentView);
    if (state.selectedJobId) params.set('job', state.selectedJobId);
    
    const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState({}, '', newURL);
}

function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const filters = { ...store.getState().filters };
    
    if (params.get('search')) filters.search = params.get('search');
    if (params.get('location')) filters.location = params.get('location');
    if (params.get('remote')) filters.remote = true;
    if (params.get('sort')) filters.sort = params.get('sort');
    
    store.setState({ filters });
    
    const view = params.get('view') || 'jobs';
    switchView(view);
    
    if (params.get('job')) {
        const job = store.getState().jobs.find(j => j.id === params.get('job'));
        if (job) showJobDetail(job);
    }
    
    // Update form inputs
    if (params.get('search')) elements.jobSearch.value = params.get('search');
    if (params.get('location')) elements.locationInput.value = params.get('location');
    if (params.get('remote')) elements.remoteToggle.checked = true;
    if (params.get('sort')) elements.sortSelect.value = params.get('sort');
}

function switchView(view) {
    store.setState({ currentView: view });
    
    // Update sections
    elements.jobsSection.classList.toggle('active', view === 'jobs');
    elements.jobsSection.classList.toggle('hidden', view !== 'jobs');
    elements.activitySection.classList.toggle('active', view === 'activity');
    elements.activitySection.classList.toggle('hidden', view !== 'activity');
    elements.applicationsSection.classList.toggle('active', view === 'applications');
    elements.applicationsSection.classList.toggle('hidden', view !== 'applications');
    
    // Update mobile tabs
    elements.mobileTabs.forEach(tab => {
        const isActive = tab.dataset.view === view;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive);
    });
}

function toggleTheme() {
    const currentTheme = store.getState().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    store.setState({ theme: newTheme });
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Theme toggle
elements.themeToggle.addEventListener('click', toggleTheme);

// Profile dropdown
elements.profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = elements.profileBtn.getAttribute('aria-expanded') === 'true';
    elements.profileBtn.setAttribute('aria-expanded', !isExpanded);
    elements.profileMenuContainer.setAttribute('aria-expanded', !isExpanded);
});

document.addEventListener('click', (e) => {
    if (!elements.profileMenuContainer.contains(e.target)) {
        elements.profileBtn.setAttribute('aria-expanded', 'false');
        elements.profileMenuContainer.setAttribute('aria-expanded', 'false');
    }
});

// Mobile tabs
elements.mobileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        switchView(tab.dataset.view);
    });
});

// Job search
elements.jobSearch.addEventListener('input', debounce((e) => {
    store.setState({ filters: { ...store.getState().filters, search: e.target.value } });
    updateJobsDisplay();
}, 300));

elements.globalSearch.addEventListener('input', debounce((e) => {
    store.setState({ filters: { ...store.getState().filters, search: e.target.value } });
    updateJobsDisplay();
}, 300));

// Location
elements.locationInput.addEventListener('input', debounce((e) => {
    store.setState({ filters: { ...store.getState().filters, location: e.target.value } });
    updateJobsDisplay();
}, 300));

// Remote toggle
elements.remoteToggle.addEventListener('change', (e) => {
    store.setState({ filters: { ...store.getState().filters, remote: e.target.checked } });
    updateJobsDisplay();
});

// Sort
elements.sortSelect.addEventListener('change', (e) => {
    store.setState({ filters: { ...store.getState().filters, sort: e.target.value } });
    updateJobsDisplay();
});

// View toggle
elements.viewToggle.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.viewToggle.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.dataset.view;
        elements.jobsList.classList.toggle('grid-view', view === 'grid');
        elements.jobsList.classList.toggle('list-view', view === 'list');
        elements.jobsSkeleton.classList.toggle('grid-view', view === 'grid');
        elements.jobsSkeleton.classList.toggle('list-view', view === 'list');
    });
});

// Filters drawer
elements.filtersBtn.addEventListener('click', () => {
    elements.filtersDrawer.setAttribute('aria-hidden', 'false');
});

elements.drawerClose.addEventListener('click', () => {
    elements.filtersDrawer.setAttribute('aria-hidden', 'true');
});

// Salary range
const salaryMin = document.getElementById('salaryMin');
const salaryMax = document.getElementById('salaryMax');
const salaryMinValue = document.getElementById('salaryMinValue');
const salaryMaxValue = document.getElementById('salaryMaxValue');

[salaryMin, salaryMax].forEach(input => {
    input.addEventListener('input', () => {
        salaryMinValue.textContent = salaryMin.value;
        salaryMaxValue.textContent = salaryMax.value;
    });
});

// Apply filters
document.getElementById('applyFilters').addEventListener('click', () => {
    const filters = { ...store.getState().filters };
    
    filters.salaryMin = parseInt(salaryMin.value);
    filters.salaryMax = parseInt(salaryMax.value);
    
    const jobTypeCheckboxes = document.querySelectorAll('input[name="jobType"]:checked');
    filters.jobTypes = Array.from(jobTypeCheckboxes).map(cb => cb.value);
    
    const experienceSelect = document.getElementById('experienceLevel');
    filters.experienceLevels = Array.from(experienceSelect.selectedOptions).map(opt => opt.value);
    
    filters.companySize = document.getElementById('companySize').value;
    filters.easyApply = document.getElementById('easyApply').checked;
    
    store.setState({ filters });
    updateJobsDisplay();
    elements.filtersDrawer.setAttribute('aria-hidden', 'true');
});

// Clear filters
document.getElementById('clearFilters').addEventListener('click', () => {
    const defaultFilters = {
        search: '',
        location: '',
        remote: false,
        sort: 'relevance',
        salaryMin: 0,
        salaryMax: 200,
        jobTypes: ['fulltime'],
        experienceLevels: [],
        techTags: [],
        companySize: '',
        easyApply: false
    };
    store.setState({ filters: defaultFilters });
    updateJobsDisplay();
    
    // Reset form
    salaryMin.value = 0;
    salaryMax.value = 200;
    salaryMinValue.textContent = '0';
    salaryMaxValue.textContent = '200';
    document.querySelectorAll('input[name="jobType"]').forEach(cb => cb.checked = cb.value === 'fulltime');
    document.getElementById('experienceLevel').selectedIndex = -1;
    document.getElementById('companySize').value = '';
    document.getElementById('easyApply').checked = false;
    document.getElementById('techTags').value = '';
    document.getElementById('selectedTags').innerHTML = '';
});

// Tech tags input
const techTagsInput = document.getElementById('techTags');
const selectedTagsContainer = document.getElementById('selectedTags');

techTagsInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
        e.preventDefault();
        const tag = e.target.value.trim();
        const filters = store.getState().filters;
        if (!filters.techTags.includes(tag)) {
            filters.techTags.push(tag);
            store.setState({ filters });
            
            const tagEl = document.createElement('span');
            tagEl.className = 'tag';
            tagEl.innerHTML = `
                ${tag}
                <button class="tag-remove" aria-label="Remove tag">×</button>
            `;
            tagEl.querySelector('.tag-remove').addEventListener('click', () => {
                filters.techTags = filters.techTags.filter(t => t !== tag);
                store.setState({ filters });
                tagEl.remove();
                updateJobsDisplay();
            });
            selectedTagsContainer.appendChild(tagEl);
            e.target.value = '';
        }
    }
});

// Compare jobs
elements.compareBtn.addEventListener('click', () => {
    const state = store.getState();
    if (state.comparedJobs.size === 0 && !state.compareMode) {
        // Enter compare mode
        store.setState({ compareMode: true });
        updateJobsDisplay();
        showToast('Select up to 3 jobs to compare', true);
    } else if (state.comparedJobs.size > 0) {
        // Show compare modal
        renderCompareModal();
    } else {
        // Exit compare mode
        store.setState({ compareMode: false, comparedJobs: new Set() });
        elements.compareCount.textContent = '0';
        updateJobsDisplay();
    }
});

elements.compareModalClose.addEventListener('click', () => {
    hideModal(elements.compareModal);
});

// Job detail panel
elements.panelClose.addEventListener('click', () => {
    elements.jobDetailPanel.setAttribute('aria-hidden', 'true');
    store.setState({ selectedJobId: null });
});

// ESC key to close modals/panels
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (elements.jobDetailPanel.getAttribute('aria-hidden') === 'false') {
            elements.jobDetailPanel.setAttribute('aria-hidden', 'true');
            store.setState({ selectedJobId: null });
        }
        if (elements.filtersDrawer.getAttribute('aria-hidden') === 'false') {
            elements.filtersDrawer.setAttribute('aria-hidden', 'true');
        }
        if (elements.compareModal.getAttribute('aria-hidden') === 'false') {
            hideModal(elements.compareModal);
        }
        if (elements.confirmDialog.getAttribute('aria-hidden') === 'false') {
            hideModal(elements.confirmDialog);
        }
    }
});

// Activity filters
elements.activityFilters.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.activityFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        store.setState({ activityFilter: btn.dataset.filter });
        updateActivityDisplay();
    });
});

elements.unreadOnly.addEventListener('change', (e) => {
    store.setState({ unreadOnly: e.target.checked });
    updateActivityDisplay();
});

elements.markAllRead.addEventListener('click', () => {
    const activities = store.getState().activities.map(a => ({ ...a, unread: false, read: true }));
    store.setState({ activities });
    updateActivityDisplay();
    showToast('All activities marked as read', true);
});

// Error banner
elements.errorClose.addEventListener('click', () => {
    elements.errorBanner.style.display = 'none';
});

// Clear search
document.getElementById('clearSearchBtn')?.addEventListener('click', () => {
    store.setState({ filters: { ...store.getState().filters, search: '' } });
    elements.jobSearch.value = '';
    updateJobsDisplay();
});

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    // Set theme
    const theme = store.getState().theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Generate and load data
    const jobs = generateJobs(120);
    store.setState({ jobs });
    
    // Generate activities after jobs are loaded
    const activities = generateActivities(220);
    store.setState({ activities });
    
    // Show skeleton loaders
    elements.jobsSkeleton.style.display = 'block';
    elements.activitySkeleton.style.display = 'block';
    
    // Simulate loading delay
    setTimeout(() => {
        updateJobsDisplay();
        updateActivityDisplay();
        updateNotificationBadge();
        updateApplicationsDisplay();
        loadFromURL();
    }, 500);
    
    // Simulate network error (for demo)
    if (Math.random() > 0.9) {
        setTimeout(() => {
            showError('Network error. Please check your connection and try again.');
        }, 2000);
    }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

