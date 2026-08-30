/**
 * MentionSystem — Autocomplete & Rich Hover Context for User Mentions (@) and Tags (#)
 */
export class MentionSystem {
    constructor(menuElement, editorElement, trie, soundEngine) {
        this.menu = menuElement;
        this.editor = editorElement;
        this.trie = trie;
        this.soundEngine = soundEngine;
        this.isVisible = false;
        this.selectedIndex = 0;
        this.currentPrefix = '';
        this.matches = [];
    }

    show(x, y, prefix, mode = '@') {
        this.currentPrefix = prefix;
        this.mode = mode;
        this.matches = this.trie.search(prefix);

        if (this.matches.length === 0) {
            this.hide();
            return;
        }

        this.renderMenu(this.matches);

        const boundedX = Math.min(x, window.innerWidth - 300);
        this.menu.style.left = `${Math.max(16, boundedX)}px`;
        this.menu.style.top = `${y + 8}px`;
        this.menu.classList.remove('hidden');
        this.isVisible = true;
        this.selectedIndex = 0;
        this.highlightItem(0);
        this.soundEngine && this.soundEngine.menuPop();
    }

    renderMenu(matches) {
        this.menu.innerHTML = `
            <div class="menu-header">${this.mode === '@' ? 'Mention Teammate' : 'Filter by Hashtag'}</div>
            <div class="menu-items-scroll">
                ${matches.map((item, index) => {
                    const isObj = typeof item === 'object' && item !== null;
                    const name = isObj ? item.name : item;
                    const role = isObj ? (item.role || item.department || '') : '';
                    const avatar = isObj ? item.avatar : null;

                    return `
                        <div class="menu-item ${index === 0 ? 'selected' : ''}" data-index="${index}">
                            ${avatar ? `
                                <img src="${avatar}" class="mention-avatar-img" alt="${name}">
                            ` : `
                                <div class="icon" style="border-radius:50%; background:var(--accent-color); color:#fff; font-weight:700;">
                                    ${this.mode === '#' ? '#' : name[0]}
                                </div>
                            `}
                            <div class="content">
                                <div class="title">${this.mode === '#' ? '#' : '@'}${name}</div>
                                ${role ? `<div class="desc">${role}</div>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        this.menu.querySelectorAll('.menu-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.selectedIndex = index;
                if (window.__pulseStream_onMentionSelect) {
                    window.__pulseStream_onMentionSelect(this.executeCurrentSelection());
                }
            });
        });
    }

    hide() {
        this.menu.classList.add('hidden');
        this.isVisible = false;
    }

    highlightItem(index) {
        const items = this.menu.querySelectorAll('.menu-item');
        items.forEach((item, i) => {
            if (i === index) item.classList.add('selected');
            else item.classList.remove('selected');
        });
    }

    navigate(direction) {
        if (!this.isVisible || this.matches.length === 0) return;

        if (direction === 'up') {
            this.selectedIndex = (this.selectedIndex - 1 + this.matches.length) % this.matches.length;
        } else if (direction === 'down') {
            this.selectedIndex = (this.selectedIndex + 1) % this.matches.length;
        }

        this.highlightItem(this.selectedIndex);
        this.soundEngine && this.soundEngine.keyTap();
    }

    executeCurrentSelection() {
        if (!this.isVisible || this.matches.length === 0) return null;
        const item = this.matches[this.selectedIndex];
        return typeof item === 'object' && item !== null ? item.name : item;
    }
}
