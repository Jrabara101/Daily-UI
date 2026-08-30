/**
 * MediaEngine — Client-Side WebP Compression, Multi-Image Masonry & Fullscreen Lightbox
 */
export class MediaEngine {
    constructor(soundEngine) {
        this.soundEngine = soundEngine;
        this.files = [];
        this.previews = []; // Array of { src, file, id }
        this.grid = document.getElementById('mediaGrid');
        this.lightboxModal = null;
        this.setupLightbox();
    }

    setupLightbox() {
        // Create lightbox if not in DOM
        if (!document.getElementById('pulseLightboxModal')) {
            const modal = document.createElement('div');
            modal.id = 'pulseLightboxModal';
            modal.className = 'lightbox-modal hidden';
            modal.innerHTML = `
                <div class="lightbox-backdrop"></div>
                <div class="lightbox-content">
                    <button class="lightbox-close-btn" title="Close Lightbox (Esc)">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <img class="lightbox-img" src="" alt="Fullscreen preview">
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.lightbox-backdrop').addEventListener('click', () => this.closeLightbox());
            modal.querySelector('.lightbox-close-btn').addEventListener('click', () => this.closeLightbox());
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                    this.closeLightbox();
                }
            });
        }
        this.lightboxModal = document.getElementById('pulseLightboxModal');
    }

    openLightbox(src) {
        if (!this.lightboxModal) return;
        const img = this.lightboxModal.querySelector('.lightbox-img');
        if (img) img.src = src;
        this.lightboxModal.classList.remove('hidden');
        this.soundEngine && this.soundEngine.menuPop();
    }

    closeLightbox() {
        if (!this.lightboxModal) return;
        this.lightboxModal.classList.add('hidden');
    }

    handleFiles(fileList) {
        Array.from(fileList).forEach(file => {
            if (file.type.startsWith('image/')) {
                this.processImage(file);
            }
        });
    }

    processImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const MAX_WIDTH = 1920;
                const MAX_HEIGHT = 1080;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/webp', 0.82);
                this.renderPreview(dataUrl, file);
                this.soundEngine && this.soundEngine.keyTap();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    renderPreview(src, originalFile) {
        const itemObj = {
            id: 'media_' + Math.random().toString(36).substr(2, 9),
            src,
            file: originalFile
        };
        this.previews.push(itemObj);
        this.files.push(originalFile);

        this.updateComposerGrid();
    }

    removePreview(id) {
        const idx = this.previews.findIndex(p => p.id === id);
        if (idx !== -1) {
            this.previews.splice(idx, 1);
            this.files.splice(idx, 1);
            this.updateComposerGrid();
        }
    }

    updateComposerGrid() {
        if (!this.grid) return;
        this.grid.innerHTML = '';

        if (this.previews.length === 0) return;

        this.grid.className = `media-grid layout-${Math.min(this.previews.length, 4)}`;

        this.previews.forEach((p, idx) => {
            const div = document.createElement('div');
            div.className = 'media-item';
            div.innerHTML = `
                <img src="${p.src}" alt="Attachment preview">
                <button class="remove-media-btn" title="Remove image">&times;</button>
            `;

            div.querySelector('.remove-media-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removePreview(p.id);
            });

            div.addEventListener('click', () => {
                this.openLightbox(p.src);
            });

            this.grid.appendChild(div);
        });
    }

    getFiles() {
        return this.files;
    }

    getPreviews() {
        return this.previews.map(p => p.src);
    }

    clear() {
        this.files = [];
        this.previews = [];
        if (this.grid) this.grid.innerHTML = '';
    }

    /**
     * Helper to render responsive media grid in feed posts
     */
    static renderFeedMediaGrid(imageUrls = []) {
        if (!imageUrls || imageUrls.length === 0) return '';

        const count = imageUrls.length;
        const layoutClass = `media-grid layout-${Math.min(count, 4)}`;

        return `
            <div class="${layoutClass}">
                ${imageUrls.slice(0, 4).map((url, i) => {
                    const isExtra = i === 3 && count > 4;
                    return `
                        <div class="media-item ${isExtra ? 'has-overlay' : ''}" data-lightbox-src="${url}">
                            <img src="${url}" alt="Post media" loading="lazy">
                            ${isExtra ? `<div class="media-overlay-count">+${count - 3}</div>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
}
