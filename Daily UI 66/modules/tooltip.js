/**
 * Floating Tooltip Module
 * Portal-based tooltip using Floating UI
 */

import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';

export class FloatingTooltip {
    constructor(portalElement) {
        this.portal = portalElement || document.body;
        this.tooltip = null;
        this.cleanup = null;
        this.isVisible = false;
        
        this.init();
    }

    init() {
        // Create tooltip element
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tooltip';
        this.tooltip.setAttribute('role', 'tooltip');
        this.tooltip.setAttribute('aria-hidden', 'true');
        this.portal.appendChild(this.tooltip);
        
        // Hide initially
        this.hide();
    }

    /**
     * Show tooltip at position
     * @param {HTMLElement} referenceElement - Element to position relative to
     * @param {Object} data - Tooltip data { title, value, date }
     */
    async show(referenceElement, data) {
        if (!referenceElement || !data) return;
        
        // Update content
        this.updateContent(data);
        
        // Show tooltip
        this.tooltip.style.opacity = '0';
        this.tooltip.setAttribute('aria-hidden', 'false');
        this.tooltip.style.display = 'block';
        
        // Position tooltip
        await this.updatePosition(referenceElement);
        
        // Fade in
        requestAnimationFrame(() => {
            this.tooltip.style.transition = 'opacity 0.2s ease-in-out';
            this.tooltip.style.opacity = '1';
        });
        
        this.isVisible = true;
        
        // Auto-update position on scroll/resize
        this.cleanup = autoUpdate(referenceElement, this.tooltip, () => {
            this.updatePosition(referenceElement);
        });
    }

    /**
     * Update tooltip position using Floating UI
     * @param {HTMLElement} referenceElement - Reference element
     */
    async updatePosition(referenceElement) {
        if (!referenceElement || !this.tooltip) return;
        
        const { x, y } = await computePosition(referenceElement, this.tooltip, {
            placement: 'top',
            middleware: [
                offset(8),
                flip({
                    fallbackPlacements: ['bottom', 'left', 'right']
                }),
                shift({
                    padding: 8
                })
            ]
        });
        
        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }

    /**
     * Update tooltip content
     * @param {Object} data - { title, value, date }
     */
    updateContent(data) {
        const { title, value, date } = data;
        
        this.tooltip.innerHTML = `
            <div class="tooltip-title">${title || ''}</div>
            <div class="tooltip-value">${value !== undefined ? value.toLocaleString() : ''}</div>
            ${date ? `<div class="tooltip-date">${date}</div>` : ''}
        `;
    }

    /**
     * Hide tooltip
     */
    hide() {
        if (!this.tooltip) return;
        
        this.tooltip.style.transition = 'opacity 0.2s ease-in-out';
        this.tooltip.style.opacity = '0';
        
        setTimeout(() => {
            if (this.tooltip) {
                this.tooltip.style.display = 'none';
                this.tooltip.setAttribute('aria-hidden', 'true');
            }
        }, 200);
        
        this.isVisible = false;
        
        // Cleanup auto-update
        if (this.cleanup) {
            this.cleanup();
            this.cleanup = null;
        }
    }

    /**
     * Show tooltip for chart data point
     * @param {HTMLElement} element - Chart point element
     * @param {Object} data - Chart data point
     */
    async showChartTooltip(element, data) {
        const tooltipData = {
            title: data.series || 'New orders',
            value: data.value,
            date: data.date ? new Date(data.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) : ''
        };
        
        await this.show(element, tooltipData);
    }

    /**
     * Show tooltip for heatmap cell
     * @param {HTMLElement} element - Heatmap cell element
     * @param {Object} data - Cell data
     */
    async showHeatmapTooltip(element, data) {
        const tooltipData = {
            title: 'Activity',
            value: data.value,
            date: `${data.day} at ${data.time}`
        };
        
        await this.show(element, tooltipData);
    }

    /**
     * Destroy tooltip instance
     */
    destroy() {
        this.hide();
        
        if (this.cleanup) {
            this.cleanup();
        }
        
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }
        
        this.tooltip = null;
    }
}

