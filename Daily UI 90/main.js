/**
 * Senior Logic: Project Architect
 * Handles AI streaming, View Transitions, and state management.
 */

class ProjectArchitect {
    constructor() {
        this.commandInput = document.getElementById('command-input');
        this.creationHub = document.getElementById('creation-hub');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.cancelBtn = document.getElementById('cancel-btn');
        this.floatingToolbar = document.getElementById('floating-toolbar');
        this.abortController = null;
        this.isGenerated = false;

        this.init();
    }

    init() {
        // Auto-expand textarea
        this.commandInput.addEventListener('input', () => {
            this.commandInput.style.height = 'auto';
            this.commandInput.style.height = this.commandInput.scrollHeight + 'px';
        });

        // Handle Enter key
        this.commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (this.commandInput.value.trim()) {
                    this.startArchitecting();
                }
            }
        });

        // Handle Cancel
        this.cancelBtn.addEventListener('click', () => this.cancelArchitecting());
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.abortController) {
                this.cancelArchitecting();
            }
        });

        // Unsaved changes protection
        window.addEventListener('beforeunload', (e) => {
            if (this.isGenerated) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    async startArchitecting() {
        const prompt = this.commandInput.value.trim();
        this.abortController = new AbortController();

        // Show loading
        this.loadingOverlay.classList.remove('hidden');
        setTimeout(() => this.loadingOverlay.classList.add('opacity-100'), 10);

        try {
            // Simulate AI delay
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(resolve, 2000);
                this.abortController.signal.addEventListener('abort', () => {
                    clearTimeout(timeout);
                    reject(new DOMException('Aborted', 'AbortError'));
                });
            });

            // Transition to Grid
            const projectData = this.generateMockPhases(prompt);
            await this.transitionToGrid(projectData);

            // Start streaming text to cards
            await this.streamToCards(projectData);

            this.isGenerated = true;
            this.loadingOverlay.classList.add('hidden');
            this.floatingToolbar.classList.remove('hidden');

        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('Architecting cancelled by user');
            } else {
                console.error('Architecting failed:', err);
            }
        } finally {
            this.abortController = null;
        }
    }

    cancelArchitecting() {
        if (this.abortController) {
            this.abortController.abort();
            this.loadingOverlay.classList.remove('opacity-100');
            setTimeout(() => this.loadingOverlay.classList.add('hidden'), 500);
        }
    }

    generateMockPhases(prompt) {
        return {
            inception: {
                title: "Inception",
                content: `Analyzing "${prompt}" requirements. Vision: Establish scope and business case. Primary goals: Stakeholder alignment, risk assessment.`,
                color: "pink"
            },
            elaboration: {
                title: "Elaboration",
                content: "Designing architecture and capturing use cases. Baseline architecture: Resilient, scalable, and modular. Tooling: Gemini API, Tailwind CSS, View Transitions.",
                color: "blue"
            },
            construction: {
                title: "Construction",
                content: "Iterative development and integration. Focus on: Clean code, semantic HTML, and responsive Bento grids. All components optimized for motion-reduce.",
                color: "purple"
            },
            transition: {
                title: "Transition",
                content: "Deployment and user feedback loop. Finalizing build: Production-ready assets and cross-browser verification. Author: Beejay T.",
                color: "indigo"
            }
        };
    }

    async transitionToGrid(projectData) {
        if (!document.startViewTransition) {
            this.renderBentoGrid(projectData);
            return;
        }

        return document.startViewTransition(() => {
            this.renderBentoGrid(projectData);
        }).updateCallbackDone;
    }

    renderBentoGrid(projectData) {
        this.creationHub.classList.remove('flex', 'items-center', 'justify-center');
        this.creationHub.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6', 'p-8', 'md:p-20');

        // Exact signature from requirement
        const authorInfo = `<div class="col-span-full text-right text-xs text-gray-400 mt-8">Created by Beejay T.</div>`;

        this.creationHub.innerHTML = Object.entries(projectData).map(([key, phase]) => `
            <div id="card-${key}" 
                 style="view-transition-name: card-${key}"
                 class="bento-card group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden reveal-card flex flex-col justify-between">
                <div class="absolute top-0 left-0 w-2 h-full bg-${phase.color}-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                <div>
                    <div class="text-${phase.color}-400 text-xs font-bold tracking-widest uppercase mb-2">${phase.title} Phase</div>
                    <div id="text-${key}" class="text-white text-lg font-light leading-relaxed outline-none" contenteditable="true"></div>
                </div>
                <div class="mt-8 flex items-center space-x-2 text-gray-500 text-xs">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>Ready for refinement</span>
                </div>
            </div>
        `).join('') + authorInfo + `<div class="col-span-full h-24"></div>`;

        this.setupToolbar();
    }

    setupToolbar() {
        const saveBtn = document.getElementById('save-btn');
        saveBtn.addEventListener('click', () => {
            this.isGenerated = false; // Allow leaving after save
            saveBtn.innerText = 'Saved!';
            saveBtn.classList.replace('bg-pink-500', 'bg-green-500');
            setTimeout(() => {
                saveBtn.innerText = 'Save Project';
                saveBtn.classList.replace('bg-green-500', 'bg-pink-500');
            }, 2000);
        });
    }

    async streamToCards(projectData) {
        const phases = Object.entries(projectData);
        const streamPromises = phases.map(([key, phase]) => this.typewriterEffect(document.getElementById(`text-${key}`), phase.content));
        await Promise.all(streamPromises);

        // Focus the first card for accessibility
        document.getElementById('text-inception').focus();
    }

    async typewriterEffect(element, text) {
        element.classList.add('typewriter-cursor');
        for (let i = 0; i <= text.length; i++) {
            if (this.abortController?.signal.aborted) break;
            element.innerText = text.substring(0, i);
            await new Promise(r => setTimeout(r, 20 + Math.random() * 30));
        }
        element.classList.remove('typewriter-cursor');
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new ProjectArchitect();
});
