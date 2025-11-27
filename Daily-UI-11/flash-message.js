 function showSuccess(variant) {
            if (variant === 'Simple') {
                FlashMessage.success('Order Confirmed');
            } else if (variant === 'Detailed') {
                FlashMessage.success(
                    'Order Confirmed',
                    'Your order #12345 has been placed successfully and will be shipped within 24 hours.'
                );
            } else if (variant === 'Variant') {
                FlashMessage.success(
                    'Saved',
                    'Your changes have been saved to the database.',
                    { variant: 'compact' }
                );
            } else if (variant === 'Minimal') {
                FlashMessage.success(
                    'Payment Successful',
                    'Transaction completed with order ID: TX-2024-001',
                    { variant: 'minimal' }
                );
            } else if (variant === 'Action') {
                FlashMessage.success(
                    'File Uploaded',
                    'invoice.pdf has been uploaded successfully.',
                    {
                        actions: [
                            { id: 'view', label: 'View', callback: () => alert('Viewing file...') },
                            { id: 'download', label: 'Download', callback: () => alert('Downloading file...') }
                        ]
                    }
                );
            }
        }

        function showError(variant) {
            if (variant === 'Simple') {
                FlashMessage.error('Payment Failed');
            } else if (variant === 'Detailed') {
                FlashMessage.error(
                    'Payment Failed',
                    'Your card was declined. Please check your card details or try a different payment method.'
                );
            } else if (variant === 'Variant') {
                FlashMessage.error(
                    'Error',
                    'An unexpected error occurred.',
                    { variant: 'compact' }
                );
            } else if (variant === 'Minimal') {
                FlashMessage.error(
                    'Connection Lost',
                    'Unable to connect to the server. Please check your internet connection.',
                    { variant: 'minimal' }
                );
            } else if (variant === 'Action') {
                FlashMessage.error(
                    'Validation Error',
                    'Please fix the errors in the form below.',
                    {
                        duration: 0,
                        actions: [
                            { id: 'dismiss', label: 'Dismiss', callback: () => {} },
                            { id: 'scrollDown', label: 'Scroll to Form', callback: () => window.scrollBy({ top: 500, behavior: 'smooth' }) }
                        ]
                    }
                );
            }
        }

        function showWarning(variant) {
            if (variant === 'Simple') {
                FlashMessage.warning('Low Stock');
            } else if (variant === 'Detailed') {
                FlashMessage.warning(
                    'Low Stock Alert',
                    'Only 2 units of "Premium Headphones" remaining in inventory. Reorder recommended.'
                );
            } else if (variant === 'Variant') {
                FlashMessage.warning(
                    'Warning',
                    'Your session is about to expire.',
                    { variant: 'compact' }
                );
            } else if (variant === 'Minimal') {
                FlashMessage.warning(
                    'Maintenance Scheduled',
                    'Server maintenance is scheduled for tonight at 11 PM UTC.',
                    { variant: 'minimal' }
                );
            } else if (variant === 'Action') {
                FlashMessage.warning(
                    'Unsaved Changes',
                    'You have unsaved changes that will be lost if you leave this page.',
                    {
                        duration: 0,
                        actions: [
                            { id: 'save', label: 'Save', callback: () => alert('Changes saved!') },
                            { id: 'discard', label: 'Discard', callback: () => alert('Changes discarded!') }
                        ]
                    }
                );
            }
        }

        function showInfo(variant) {
            if (variant === 'Simple') {
                FlashMessage.info('Syncing Data');
            } else if (variant === 'Detailed') {
                FlashMessage.info(
                    'Syncing Data',
                    'Your account is being synced with the cloud server. This may take a few moments.'
                );
            } else if (variant === 'Variant') {
                FlashMessage.info(
                    'Info',
                    'New features available. Refresh to see updates.',
                    { variant: 'compact' }
                );
            } else if (variant === 'Minimal') {
                FlashMessage.info(
                    'Welcome Back',
                    'Last login: 2 days ago from Manila, Philippines',
                    { variant: 'minimal' }
                );
            } else if (variant === 'Action') {
                FlashMessage.info(
                    'Update Available',
                    'A new version of the app is available. Please update to get the latest features.',
                    {
                        actions: [
                            { id: 'update', label: 'Update Now', callback: () => alert('Updating...') },
                            { id: 'later', label: 'Later', callback: () => {} }
                        ]
                    }
                );
            }
        }

        function showWithProgress() {
            FlashMessage.success(
                'Download in Progress',
                'report-2024.pdf is being downloaded...',
                { duration: 8000, showProgress: true }
            );
        }

        function showNoAutoClose() {
            FlashMessage.warning(
                'Important Notice',
                'This notification will remain until you close it manually.',
                { duration: 0 }
            );
        }

        function showMultiple() {
            FlashMessage.success('Task 1 Completed', 'Database backup finished.');
            setTimeout(() => {
                FlashMessage.info('Task 2 Started', 'Email notifications are being sent...');
            }, 500);
            setTimeout(() => {
                FlashMessage.warning('Task 3 Warning', 'Some emails failed to send.');
            }, 1000);
        }

        function clearAll() {
            FlashMessage.clearAll();
            FlashMessage.info('Cleared', 'All notifications have been removed.');
        }

        function setPosition(position) {
            FlashMessage.setPosition(position);
            const positionLabel = {
                'top-right': 'Top Right',
                'top-left': 'Top Left',
                'top-center': 'Top Center',
                'bottom-center': 'Bottom Center'
            };
            FlashMessage.info('Position Changed', `Notifications will now appear at ${positionLabel[position]}`);
        }

        function demoFormSubmit() {
            FlashMessage.info('Processing...', 'Submitting your form...');
            setTimeout(() => {
                const random = Math.random();
                if (random > 0.5) {
                    FlashMessage.success('Form Submitted', 'Thank you! Your order has been received. Order ID: ORD-2024-56789');
                } else {
                    FlashMessage.error('Form Error', 'Please check your input and try again.');
                }
            }, 2000);
        }


/* ============================================
   FLASH MESSAGE SYSTEM - JAVASCRIPT
   Notification manager and utilities
   ============================================ */

class FlashMessage {
  /**
   * Configuration for flash messages
   */
  static config = {
    defaultDuration: 5000, // milliseconds
    position: 'top-right', // top-right, top-left, top-center, bottom-center
    maxMessages: 5,
  };

  /**
   * Initialize the flash message system
   * @param {Object} options - Configuration options
   */
  static init(options = {}) {
    this.config = { ...this.config, ...options };
    this.ensureContainer();
  }

  /**
   * Show a success message
   * @param {string} title - Message title
   * @param {string} description - Message description (optional)
   * @param {Object} options - Additional options
   */
  static success(title, description = '', options = {}) {
    return this.show('success', title, description, options);
  }

  /**
   * Show an error message
   * @param {string} title - Message title
   * @param {string} description - Message description (optional)
   * @param {Object} options - Additional options
   */
  static error(title, description = '', options = {}) {
    return this.show('error', title, description, options);
  }

  /**
   * Show a warning message
   * @param {string} title - Message title
   * @param {string} description - Message description (optional)
   * @param {Object} options - Additional options
   */
  static warning(title, description = '', options = {}) {
    return this.show('warning', title, description, options);
  }

  /**
   * Show an info message
   * @param {string} title - Message title
   * @param {string} description - Message description (optional)
   * @param {Object} options - Additional options
   */
  static info(title, description = '', options = {}) {
    return this.show('info', title, description, options);
  }

  /**
   * Show a flash message
   * @param {string} type - Message type (success, error, warning, info)
   * @param {string} title - Message title
   * @param {string} description - Message description
   * @param {Object} options - Additional options
   */
  static show(type, title, description = '', options = {}) {
    const {
      duration = this.config.defaultDuration,
      icon = this.getIcon(type),
      variant = 'default', // default, compact, minimal
      showProgress = true,
      actions = [],
    } = options;

    this.ensureContainer();
    const container = this.getContainer();

    // Check max messages
    const messages = container.querySelectorAll('.flash-message');
    if (messages.length >= this.config.maxMessages) {
      messages[0].remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `flash-message flash-${type} flash-${variant}`;

    // Build content
    let html = `
      <div class="flash-icon">${icon}</div>
      <div class="flash-content">
        <p class="flash-title">${this.escapeHtml(title)}</p>
        ${description ? `<p class="flash-description">${this.escapeHtml(description)}</p>` : ''}
        ${actions.length > 0 ? `<div class="flash-actions">${this.buildActions(actions)}</div>` : ''}
      </div>
      <button class="flash-close" aria-label="Close notification">×</button>
      ${showProgress ? `<div class="flash-progress" style="--duration: ${duration}ms"></div>` : ''}
    `;

    messageEl.innerHTML = html;

    // Add event listeners
    const closeBtn = messageEl.querySelector('.flash-close');
    closeBtn.addEventListener('click', () => this.remove(messageEl));

    actions.forEach((action) => {
      const actionBtn = messageEl.querySelector(`[data-action="${action.id}"]`);
      if (actionBtn) {
        actionBtn.addEventListener('click', () => {
          action.callback?.();
          this.remove(messageEl);
        });
      }
    });

    // Add to container
    container.appendChild(messageEl);

    // Auto remove
    if (duration > 0) {
      setTimeout(() => this.remove(messageEl), duration);
    }

    return messageEl;
  }

  /**
   * Remove a message with animation
   * @param {HTMLElement} messageEl - Message element to remove
   */
  static remove(messageEl) {
    if (!messageEl || !messageEl.parentElement) return;

    messageEl.classList.add('exit-animation');

    setTimeout(() => {
      if (messageEl.parentElement) {
        messageEl.remove();
      }
    }, 300);
  }

  /**
   * Clear all messages
   */
  static clearAll() {
    const container = this.getContainer();
    const messages = container.querySelectorAll('.flash-message');
    messages.forEach((msg) => this.remove(msg));
  }

  /**
   * Get icon for message type
   * @param {string} type - Message type
   * @returns {string} Icon emoji or symbol
   */
  static getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type] || '•';
  }

  /**
   * Build action buttons HTML
   * @param {Array} actions - Array of action objects
   * @returns {string} HTML string
   */
  static buildActions(actions) {
    return actions
      .map(
        (action) =>
          `<button class="flash-action" data-action="${this.escapeHtml(action.id)}">${this.escapeHtml(action.label)}</button>`
      )
      .join('');
  }

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Ensure container exists
   */
  static ensureContainer() {
    if (!this.getContainer()) {
      const container = document.createElement('div');
      const positionClass = `flash-${this.config.position.replace('-', '-')}`;
      container.className = `flash-container ${positionClass}`;
      document.body.appendChild(container);
    }
  }

  /**
   * Get or create container
   * @returns {HTMLElement} Container element
   */
  static getContainer() {
    return document.querySelector('.flash-container');
  }

  /**
   * Set position
   * @param {string} position - Position (top-right, top-left, top-center, bottom-center)
   */
  static setPosition(position) {
    const container = this.getContainer();
    if (container) {
      const oldClass = container.className;
      const newClass = oldClass.replace(/flash-\w+-\w+/, `flash-${position}`);
      container.className = newClass;
    }
  }
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    FlashMessage.init();
  });
} else {
  FlashMessage.init();
}

// Export for use in modules (if applicable)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FlashMessage;
}
