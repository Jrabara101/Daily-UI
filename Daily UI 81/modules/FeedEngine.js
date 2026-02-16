export class FeedEngine {
    constructor() {
        this.feed = document.getElementById('feedStream');
        this.composer = document.querySelector('.composer-container');
    }

    post(content, files) {
        // 1. Create Optimistic Post
        const post = document.createElement('div');
        post.className = 'feed-post optimistic';

        let mediaHtml = '';
        if (files.length > 0) {
            mediaHtml = `<div class="media-grid" style="grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));">
                ${files.map(f => `<div class="media-item"><img src="${URL.createObjectURL(f)}" style="width:100%; height:100%; object-fit:cover;"></div>`).join('')}
            </div>`;
        }

        post.innerHTML = `
            <div class="user-profile" style="margin-bottom:0.5rem;">
                <img src="https://ui-avatars.com/api/?name=Alex+Rivera&background=0D8ABC&color=fff" style="width:32px; height:32px; border-radius:50%; margin-right:8px;">
                <span style="font-weight:600; font-size:0.9rem;">Alex Rivera</span>
                <span style="color:#aaa; font-size:0.8rem; margin-left:8px;">Just now</span>
            </div>
            <div class="post-content">${content}</div>
            ${mediaHtml}
        `;

        this.feed.prepend(post);

        // 2. Trigger "Flying" Animation on Composer
        this.animateComposer();

        // 3. Simulate Network Request
        setTimeout(() => {
            post.classList.remove('optimistic');
            // Mock Success Haptic
            if (navigator.vibrate) navigator.vibrate([10, 30]);
        }, 1500);
    }

    animateComposer() {
        // Clone composer for animation to avoid breaking the layout permanently
        const clone = this.composer.cloneNode(true);
        const rect = this.composer.getBoundingClientRect();

        clone.style.position = 'fixed';
        clone.style.top = `${rect.top}px`;
        clone.style.left = `${rect.left}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.zIndex = '999';
        clone.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';

        document.body.appendChild(clone);

        // Trigger reflow
        void clone.offsetWidth;

        // Animate down
        clone.style.transform = 'translateY(100px) scale(0.9)';
        clone.style.opacity = '0';

        setTimeout(() => {
            clone.remove();
        }, 600);
    }
}
