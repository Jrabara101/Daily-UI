export class MentionSystem {
    constructor(menuElement, editorElement, trie) {
        this.menu = menuElement;
        this.editor = editorElement;
        this.trie = trie;
        this.isVisible = false;
        this.selectedIndex = 0;
        this.currentPrefix = '';
    }

    show(x, y, prefix) {
        this.currentPrefix = prefix;
        const matches = this.trie.search(prefix);

        if (matches.length === 0) {
            this.hide();
            return;
        }

        this.renderMenu(matches);

        this.menu.style.left = `${x}px`;
        this.menu.style.top = `${y}px`;
        this.menu.classList.remove('hidden');
        this.isVisible = true;
        this.selectedIndex = 0;
        this.highlightItem(0);
    }

    renderMenu(matches) {
        this.menu.innerHTML = matches.map((name, index) => `
            <div class="menu-item" data-index="${index}">
                <div class="icon" style="border-radius:50%; background:#444;">${name[0]}</div>
                <div class="content">
                    <div class="title">${name}</div>
                </div>
            </div>
        `).join('');

        this.menu.querySelectorAll('.menu-item').forEach((item, index) => {
            item.addEventListener('click', () => this.selectItem(index));
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
        if (!this.isVisible) return;
        const items = this.menu.querySelectorAll('.menu-item');
        if (items.length === 0) return;

        if (direction === 'up') {
            this.selectedIndex = (this.selectedIndex - 1 + items.length) % items.length;
        } else if (direction === 'down') {
            this.selectedIndex = (this.selectedIndex + 1) % items.length;
        }

        this.highlightItem(this.selectedIndex);
    }

    selectItem(index) {
        const items = this.menu.querySelectorAll('.menu-item');
        if (index >= 0 && index < items.length) {
            const name = items[index].querySelector('.title').textContent;
            return name;
        }
        return null;
    }

    executeCurrentSelection() {
        return this.selectItem(this.selectedIndex);
    }
}
