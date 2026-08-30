/**
 * CommandSystem — Multi-Category Slash Command Floating Palette
 */
export const COMMANDS_DEF = [
    {
        category: 'Interactive Blocks',
        items: [
            { id: 'poll', title: 'Live Team Poll', desc: 'Embed an interactive voting poll with percentage bars', icon: '📊' },
            { id: 'task', title: 'Action Checklist', desc: 'Track interactive tasks with live progress tracking', icon: '☑️' },
            { id: 'code', title: 'Code Snippet', desc: 'Embed syntax-highlighted code with 1-click copy', icon: '💻' },
            { id: 'voice', title: 'Voice Memo', desc: 'Attach an async voice snippet with waveform visualizer', icon: '🎙️' }
        ]
    },
    {
        category: 'AI Context Co-Pilot',
        items: [
            { id: 'ai-polish', title: 'AI Tone Polish', desc: 'Refactor notes into an executive-level summary', icon: '✨' },
            { id: 'ai-standup', title: 'AI Standup Format', desc: 'Structure into Yesterday, Today & Blockers', icon: '📋' },
            { id: 'ai-tldr', title: 'AI TL;DR Badge', desc: 'Extract a punchy 1-line key takeaway badge', icon: '💡' }
        ]
    }
];

export class CommandSystem {
    constructor(menuElement, editorElement, soundEngine) {
        this.menu = menuElement;
        this.editor = editorElement;
        this.soundEngine = soundEngine;
        this.isVisible = false;
        this.selectedIndex = 0;
        this.activeFilter = '';
        this.filteredItems = [];
    }

    show(x, y, query = '') {
        this.activeFilter = query.toLowerCase().trim();
        this.renderMenu();

        if (this.filteredItems.length === 0) {
            this.hide();
            return;
        }

        // Keep inside viewport
        const menuWidth = 320;
        const menuHeight = 360;
        const boundedX = Math.min(x, window.innerWidth - menuWidth - 24);
        const boundedY = y + 10;

        this.menu.style.left = `${Math.max(16, boundedX)}px`;
        this.menu.style.top = `${boundedY}px`;
        this.menu.classList.remove('hidden');
        this.isVisible = true;

        this.selectedIndex = 0;
        this.highlightItem(0);
        this.soundEngine && this.soundEngine.menuPop();
    }

    renderMenu() {
        this.filteredItems = [];
        let html = '';

        COMMANDS_DEF.forEach(cat => {
            const matchedInCat = cat.items.filter(item => 
                !this.activeFilter || 
                item.title.toLowerCase().includes(this.activeFilter) || 
                item.id.toLowerCase().includes(this.activeFilter) ||
                item.desc.toLowerCase().includes(this.activeFilter)
            );

            if (matchedInCat.length > 0) {
                html += `<div class="menu-header">${cat.category}</div>`;
                matchedInCat.forEach(item => {
                    const globalIdx = this.filteredItems.length;
                    this.filteredItems.push(item);
                    html += `
                        <div class="menu-item ${globalIdx === 0 ? 'selected' : ''}" data-command="${item.id}" data-index="${globalIdx}">
                            <div class="icon">${item.icon}</div>
                            <div class="content">
                                <div class="title">${item.title}</div>
                                <div class="desc">${item.desc}</div>
                            </div>
                        </div>
                    `;
                });
            }
        });

        this.menu.innerHTML = html;

        // Click listeners
        this.menu.querySelectorAll('.menu-item').forEach((el, idx) => {
            el.addEventListener('click', () => {
                this.selectedIndex = idx;
                const cmd = this.executeCurrentSelection();
                if (window.__pulseStream_onCommandSelect) {
                    window.__pulseStream_onCommandSelect(cmd);
                }
            });
        });
    }

    hide() {
        this.menu.classList.add('hidden');
        this.isVisible = false;
        this.activeFilter = '';
    }

    highlightItem(index) {
        const items = this.menu.querySelectorAll('.menu-item');
        items.forEach((item, i) => {
            if (i === index) item.classList.add('selected');
            else item.classList.remove('selected');
        });
    }

    navigate(direction) {
        if (!this.isVisible || this.filteredItems.length === 0) return;

        if (direction === 'up') {
            this.selectedIndex = (this.selectedIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
        } else if (direction === 'down') {
            this.selectedIndex = (this.selectedIndex + 1) % this.filteredItems.length;
        }

        this.highlightItem(this.selectedIndex);
        this.soundEngine && this.soundEngine.keyTap();
    }

    executeCurrentSelection() {
        if (!this.isVisible || this.filteredItems.length === 0) return null;
        const item = this.filteredItems[this.selectedIndex];
        return item ? item.id : null;
    }
}
