import React, { useState } from 'react';
import { useNotification } from '../../hooks/useNotification';
import styles from './Demo.module.css';

export const Demo: React.FC = () => {
  const notify = useNotification();
  const [customMessage, setCustomMessage] = useState('');
  const [customDuration, setCustomDuration] = useState(5000);

  const handleSuccess = () => {
    notify.success('Operation completed successfully!', { duration: 4000 });
  };

  const handleError = () => {
    notify.error('Something went wrong. Please try again.', { duration: 6000 });
  };

  const handleWarning = () => {
    notify.warning('Please review your input before submitting.', { duration: 5000 });
  };

  const handleInfo = () => {
    notify.info('Here is some useful information for you.', { duration: 4000 });
  };

  const handleCustom = () => {
    if (customMessage.trim()) {
      notify.info(customMessage, { duration: customDuration });
    }
  };

  const handleStackTest = () => {
    notify.success('First notification', { duration: 3000 });
    setTimeout(() => notify.info('Second notification', { duration: 3000 }), 300);
    setTimeout(() => notify.warning('Third notification', { duration: 3000 }), 600);
    setTimeout(() => notify.error('Fourth notification', { duration: 3000 }), 900);
    setTimeout(() => notify.success('Fifth notification', { duration: 3000 }), 1200);
    setTimeout(() => notify.info('Sixth notification (should remove oldest)', { duration: 3000 }), 1500);
  };

  const handlePersistent = () => {
    notify.info('This notification will not auto-dismiss', { duration: 0 });
  };

  const handleNoPause = () => {
    notify.info('This notification does not pause on hover', { pauseOnHover: false });
  };

  const handleLongMessage = () => {
    notify.success(
      'This is a very long notification message to test how the toast component handles longer text content. It should wrap nicely and remain readable.',
      { duration: 6000 }
    );
  };

  return (
    <div className={styles.demo}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Basic Notification Types</h2>
        <div className={styles.buttonGroup}>
          <button className={`${styles.button} ${styles.success}`} onClick={handleSuccess}>
            Show Success
          </button>
          <button className={`${styles.button} ${styles.error}`} onClick={handleError}>
            Show Error
          </button>
          <button className={`${styles.button} ${styles.warning}`} onClick={handleWarning}>
            Show Warning
          </button>
          <button className={`${styles.button} ${styles.info}`} onClick={handleInfo}>
            Show Info
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Advanced Features</h2>
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={handleStackTest}>
            Test Stacking (6 notifications)
          </button>
          <button className={styles.button} onClick={handlePersistent}>
            Persistent Notification
          </button>
          <button className={styles.button} onClick={handleNoPause}>
            No Pause on Hover
          </button>
          <button className={styles.button} onClick={handleLongMessage}>
            Long Message Test
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Custom Notification</h2>
        <div className={styles.customForm}>
          <input
            type="text"
            placeholder="Enter notification message..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className={styles.input}
          />
          <div className={styles.durationControl}>
            <label htmlFor="duration">Duration (ms):</label>
            <input
              id="duration"
              type="number"
              min="0"
              max="30000"
              step="1000"
              value={customDuration}
              onChange={(e) => setCustomDuration(Number(e.target.value))}
              className={styles.durationInput}
            />
          </div>
          <button className={styles.button} onClick={handleCustom} disabled={!customMessage.trim()}>
            Send Custom Notification
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Features</h2>
        <ul className={styles.featureList}>
          <li>✅ Stackable notifications (max 5 visible)</li>
          <li>✅ Smooth slide-in/fade-out animations</li>
          <li>✅ Progress bar countdown timer</li>
          <li>✅ Pause on hover (optional)</li>
          <li>✅ Manual close button</li>
          <li>✅ Four variants: Success, Error, Warning, Info</li>
          <li>✅ React Portal rendering</li>
          <li>✅ ARIA accessibility support</li>
          <li>✅ Responsive design</li>
          <li>✅ TypeScript types</li>
          <li>✅ CSS Modules styling</li>
          <li>✅ Auto-dismiss with cleanup</li>
        </ul>
      </div>
    </div>
  );
};

