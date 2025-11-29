/* ============================================
   ON/OFF SWITCH COMPONENT - JAVASCRIPT
   Accessible toggle switch functionality
   ============================================ */

class SwitchComponent {
  /**
   * Initialize switch components
   * @param {Object} options - Configuration options
   */
  static init(options = {}) {
    this.options = options;
    this.setupListeners();
  }

  /**
   * Setup event listeners for all switches
   */
  static setupListeners() {
    const switches = document.querySelectorAll('input[type="checkbox"][role="switch"]');

    switches.forEach((switchEl) => {
      // Change listener
      switchEl.addEventListener('change', (e) => {
        this.handleChange(e, switchEl);
      });

      // Keyboard support (Space/Enter)
      switchEl.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          switchEl.click();
        }
      });

      // Ensure proper ARIA attributes
      if (!switchEl.hasAttribute('aria-label')) {
        const label = switchEl.parentElement?.querySelector('label');
        if (label) {
          switchEl.setAttribute('aria-label', label.textContent);
        }
      }
    });
  }

  /**
   * Handle switch change event
   * @param {Event} event - Change event
   * @param {HTMLElement} switchEl - Switch element
   */
  static handleChange(event, switchEl) {
    const isChecked = switchEl.checked;
    const id = switchEl.id;
    const name = switchEl.name;

    // Update aria-checked
    switchEl.setAttribute('aria-checked', isChecked);

    // Trigger custom event
    const customEvent = new CustomEvent('switchChange', {
      detail: {
        id,
        name,
        checked: isChecked,
        element: switchEl,
      },
    });
    switchEl.dispatchEvent(customEvent);

    // Call callback if provided
    if (this.options.onToggle) {
      this.options.onToggle({ id, name, checked: isChecked });
    }

    // Log state
    console.log(`Switch "${name || id}" is now ${isChecked ? 'ON' : 'OFF'}`);
  }

  /**
   * Toggle a switch programmatically
   * @param {string} id - Switch ID
   * @param {boolean} state - New state (optional)
   */
  static toggle(id, state = null) {
    const switchEl = document.getElementById(id);
    if (!switchEl) {
      console.warn(`Switch with ID "${id}" not found`);
      return false;
    }

    if (state !== null) {
      switchEl.checked = state;
    } else {
      switchEl.checked = !switchEl.checked;
    }

    // Trigger change event
    switchEl.dispatchEvent(new Event('change', { bubbles: true }));
    return switchEl.checked;
  }

  /**
   * Get switch state
   * @param {string} id - Switch ID
   * @returns {boolean} Current state
   */
  static getState(id) {
    const switchEl = document.getElementById(id);
    if (!switchEl) {
      console.warn(`Switch with ID "${id}" not found`);
      return null;
    }
    return switchEl.checked;
  }

  /**
   * Enable/Disable a switch
   * @param {string} id - Switch ID
   * @param {boolean} enabled - Enable state
   */
  static setEnabled(id, enabled) {
    const switchEl = document.getElementById(id);
    if (!switchEl) {
      console.warn(`Switch with ID "${id}" not found`);
      return;
    }
    switchEl.disabled = !enabled;
  }

  /**
   * Reset all switches to initial state
   * @param {boolean} state - Reset to this state
   */
  static resetAll(state = false) {
    const switches = document.querySelectorAll('input[type="checkbox"][role="switch"]');
    switches.forEach((switchEl) => {
      switchEl.checked = state;
      switchEl.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  /**
   * Get all switch states
   * @returns {Object} Object with switch IDs and their states
   */
  static getAllStates() {
    const switches = document.querySelectorAll('input[type="checkbox"][role="switch"]');
    const states = {};

    switches.forEach((switchEl) => {
      const id = switchEl.id || switchEl.name || 'unnamed';
      states[id] = switchEl.checked;
    });

    return states;
  }

  /**
   * Create switch instance programmatically
   * @param {Object} config - Switch configuration
   * @returns {HTMLElement} Switch container element
   */
  static create(config) {
    const {
      id = 'switch-' + Date.now(),
      name = 'switch',
      label = 'Toggle Switch',
      checked = false,
      disabled = false,
      size = 'md', // sm, md, lg
      variant = 'primary', // primary, secondary, danger
      description = '',
      showStatus = false,
      icons = false,
      textLabels = false,
      onChange = null,
    } = config;

    // Create container
    const container = document.createElement('div');
    container.className = 'switch-container';

    // Create switch wrapper
    const wrapper = document.createElement('div');
    wrapper.className = `switch switch-${size} switch-${variant}`;

    // Create input
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.name = name;
    input.role = 'switch';
    input.checked = checked;
    input.disabled = disabled;
    input.setAttribute('aria-label', label);
    input.setAttribute('aria-checked', checked);

    // Create slider
    const slider = document.createElement('div');
    slider.className = 'switch-slider';

    wrapper.appendChild(input);
    wrapper.appendChild(slider);

    // Add icons if enabled
    if (icons) {
      const iconsDiv = document.createElement('div');
      iconsDiv.className = 'switch-icons';
      iconsDiv.innerHTML = `
        <span class="icon-on">✓</span>
        <span class="icon-off">✕</span>
      `;
      wrapper.appendChild(iconsDiv);
    }

    // Add text labels if enabled
    if (textLabels) {
      const textDiv = document.createElement('div');
      textDiv.className = 'switch-text-labels';
      textDiv.innerHTML = `
        <span class="text-on">ON</span>
        <span class="text-off">OFF</span>
      `;
      wrapper.appendChild(textDiv);
    }

    container.appendChild(wrapper);

    // Add label if provided
    if (label) {
      const labelEl = document.createElement('label');
      labelEl.htmlFor = id;
      labelEl.className = 'switch-label';
      labelEl.textContent = label;
      container.appendChild(labelEl);
    }

    // Add status if enabled
    if (showStatus) {
      const status = document.createElement('span');
      status.className = 'switch-status';
      status.textContent = checked ? 'ON' : 'OFF';
      container.appendChild(status);

      input.addEventListener('change', function () {
        status.textContent = this.checked ? 'ON' : 'OFF';
      });
    }

    // Add description if provided
    if (description) {
      const desc = document.createElement('div');
      desc.className = 'switch-description';
      desc.textContent = description;
      container.appendChild(desc);
    }

    // Add change listener
    input.addEventListener('change', function () {
      if (onChange) {
        onChange({ id, checked: this.checked });
      }
    });

    return container;
  }
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    SwitchComponent.init();
  });
} else {
  SwitchComponent.init();
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SwitchComponent;
}
