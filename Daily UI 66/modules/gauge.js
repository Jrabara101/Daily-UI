/**
 * Efficiency Gauge Module
 * SVG circular gauge with CSS custom properties
 */

import { gsap } from 'gsap';

/**
 * Create an efficiency gauge
 * @param {HTMLElement} container - Container element
 * @param {number} initialValue - Initial efficiency value (0-100)
 * @param {string} label - Gauge label
 * @returns {HTMLElement} Gauge element
 */
export const createGauge = (container, initialValue = 0, label = 'Efficiency') => {
    const gaugeId = `gauge-${Math.random().toString(36).substr(2, 9)}`;
    const circumference = 2 * Math.PI * 40; // radius = 40
    
    const gaugeHTML = `
        <div class="gauge-container" data-gauge-id="${gaugeId}">
            <svg class="gauge-svg" width="120" height="120" viewBox="0 0 120 120">
                <circle
                    class="gauge-track"
                    cx="60"
                    cy="60"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    stroke-width="8"
                />
                <circle
                    class="gauge-fill"
                    cx="60"
                    cy="60"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    stroke-width="8"
                    stroke-linecap="round"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${circumference}"
                    style="--gauge-offset: ${circumference}"
                />
            </svg>
            <div class="gauge-value">${initialValue}%</div>
            <div class="text-center mt-2 text-sm text-gray-600">${label}</div>
        </div>
    `;
    
    const wrapper = document.createElement('div');
    wrapper.innerHTML = gaugeHTML;
    const gaugeElement = wrapper.firstElementChild;
    
    container.appendChild(gaugeElement);
    
    // Set initial value
    updateGauge(gaugeElement, initialValue);
    
    return gaugeElement;
};

/**
 * Update gauge value with animation
 * @param {HTMLElement} element - Gauge element
 * @param {number} value - New efficiency value (0-100)
 */
export const updateGauge = (element, value) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (clampedValue / 100) * circumference;
    
    const fillCircle = element.querySelector('.gauge-fill');
    const valueText = element.querySelector('.gauge-value');
    
    if (!fillCircle || !valueText) return;
    
    // Animate stroke-dashoffset with GSAP
    gsap.to(fillCircle, {
        duration: 0.8,
        ease: 'power2.out',
        attr: { 'stroke-dashoffset': offset },
        onUpdate: function() {
            // Update CSS custom property
            fillCircle.style.setProperty('--gauge-offset', this.targets()[0].getAttribute('stroke-dashoffset'));
        }
    });
    
    // Animate value text
    const currentValue = parseInt(valueText.textContent) || 0;
    gsap.to({ value: currentValue }, {
        value: clampedValue,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: function() {
            valueText.textContent = `${Math.round(this.targets()[0].value)}%`;
        }
    });
};

/**
 * Create multiple efficiency gauges
 * @param {HTMLElement} container - Container element
 * @param {Array} gauges - Array of { value, label } objects
 * @returns {Array} Array of gauge elements
 */
export const createMultipleGauges = (container, gauges = []) => {
    // Clear container
    container.innerHTML = '';
    
    const gaugeElements = gauges.map(({ value, label }) => {
        return createGauge(container, value, label);
    });
    
    return gaugeElements;
};

/**
 * Update multiple gauges
 * @param {Array} gaugeElements - Array of gauge elements
 * @param {Array} values - Array of new values
 */
export const updateMultipleGauges = (gaugeElements, values) => {
    gaugeElements.forEach((element, index) => {
        if (values[index] !== undefined) {
            updateGauge(element, values[index]);
        }
    });
};

