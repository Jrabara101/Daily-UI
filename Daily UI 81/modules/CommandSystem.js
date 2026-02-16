export class CommandSystem {
    constructor(menuElement, editorElement) {
        this.menu = menuElement;
        this.editor = editorElement;
        this.isVisible = false;
        this.selectedIndex = 0;
        this.items = this.menu.querySelectorAll('.menu-item');
        this.activeTrigger = null; // '/' or '@'
    }

    show(x, y, triggerType = '/') {
        this.menu.style.left = `${x}px`;
        this.menu.style.top = `${y}px`;
        this.menu.classList.remove('hidden');
        this.isVisible = true;
        this.activeTrigger = triggerType;
        this.selectedIndex = 0;
        this.highlightItem(0);

        // Update menu content based on trigger if needed
        // For now index.html has hardcoded slash commands
    }

    hide() {
        this.menu.classList.add('hidden');
        this.isVisible = false;
        this.activeTrigger = null;
    }

    highlightItem(index) {
        this.items.forEach((item, i) => {
            if (i === index) item.classList.add('selected');
            else item.classList.remove('selected');
        });
    }

    navigate(direction) {
        if (!this.isVisible) return;

        if (direction === 'up') {
            this.selectedIndex = (this.selectedIndex - 1 + this.items.length) % this.items.length;
        } else if (direction === 'down') {
            this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
        }

        this.highlightItem(this.selectedIndex);
    }

    executeCurrentSelection() {
        if (!this.isVisible) return null;
        const item = this.items[this.selectedIndex];
        return item ? item.dataset.command : null;
    }
}
