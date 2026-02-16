export class MediaEngine {
    constructor() {
        this.files = [];
        this.grid = document.getElementById('mediaGrid');
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

                // Max dimensions (1080p target)
                const MAX_WIDTH = 1920;
                const MAX_HEIGHT = 1080;
                let width = img.width;
                let height = img.height;

                // Calculate aspect ratio
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

                // Compress to WebP with 0.8 quality
                const dataUrl = canvas.toDataURL('image/webp', 0.8);
                this.renderPreview(dataUrl, file);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    renderPreview(src, originalFile) {
        const div = document.createElement('div');
        div.className = 'media-item';
        div.innerHTML = `<img src="${src}" alt="preview">`;

        // Add specific interaction listeners for drag/reorder here if needed

        this.grid.appendChild(div);

        // Store file reference
        this.files.push(originalFile);
    }

    getFiles() {
        return this.files;
    }

    clear() {
        this.files = [];
        this.grid.innerHTML = '';
    }
}
