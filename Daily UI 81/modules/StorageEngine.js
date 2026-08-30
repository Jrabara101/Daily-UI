/**
 * StorageEngine — LocalStorage State Persistence & Draft Auto-Saver
 */
export class StorageEngine {
    constructor() {
        this.DRAFT_KEY = 'pulsestream_composer_draft';
        this.POSTS_KEY = 'pulsestream_saved_posts';
        this.THEME_KEY = 'pulsestream_active_theme';
    }

    saveDraft(htmlContent) {
        if (!htmlContent || htmlContent.trim() === '' || htmlContent === '<br>') {
            localStorage.removeItem(this.DRAFT_KEY);
        } else {
            localStorage.setItem(this.DRAFT_KEY, htmlContent);
        }
    }

    getDraft() {
        return localStorage.getItem(this.DRAFT_KEY) || '';
    }

    clearDraft() {
        localStorage.removeItem(this.DRAFT_KEY);
    }

    savePosts(posts) {
        try {
            localStorage.setItem(this.POSTS_KEY, JSON.stringify(posts));
        } catch (e) {
            console.warn('Failed to persist posts to localStorage:', e);
        }
    }

    getPosts() {
        try {
            const data = localStorage.getItem(this.POSTS_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    saveTheme(theme) {
        localStorage.setItem(this.THEME_KEY, theme);
    }

    getTheme() {
        return localStorage.getItem(this.THEME_KEY) || 'theme-obsidian';
    }
}
