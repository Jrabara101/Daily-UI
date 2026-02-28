/**
 * Aura - Dynamic Identity Component
 * Senior UI/UX logic for Fallbacks & Image Degradation
 */
const Aura = {
    generateAvatarColor(name) {
        if (!name) return 'hsl(0, 0%, 20%)';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 55%)`;
    },

    getInitials(name) {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        return parts.map(p => p.charAt(0).toUpperCase()).slice(0, 2).join('');
    },

    handleImageError(img) {
        if (img.dataset.fallbackApplied) return;
        img.dataset.fallbackApplied = 'true';

        const name = img.getAttribute('alt') || 'User';
        const color = this.generateAvatarColor(name);
        const initials = this.getInitials(name);

        const fallbackHTML = `
        <div class="${img.className} flex items-center justify-center text-white font-bold squircle shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]" 
             style="background-color: ${color}; font-size: 15px; line-height: 1; min-height: inherit;">
            ${initials}
        </div>
    `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = fallbackHTML.trim();
        const fallbackNode = wrapper.firstChild;

        if (img.getAttribute('alt')) {
            fallbackNode.setAttribute('role', 'img');
            fallbackNode.setAttribute('aria-label', name);
        } else {
            fallbackNode.setAttribute('aria-hidden', 'true');
        }

        img.parentNode.replaceChild(fallbackNode, img);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const avatars = document.querySelectorAll('.aura-avatar');
    avatars.forEach(img => {
        if (img.tagName !== 'IMG') return;
        img.addEventListener('error', () => Aura.handleImageError(img));
        if (img.complete && img.naturalHeight === 0) {
            Aura.handleImageError(img);
        }
    });
});
