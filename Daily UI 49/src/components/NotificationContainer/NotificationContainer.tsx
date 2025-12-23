import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { useNotificationContext } from '../../context/NotificationContext';
import { Toast } from '../Toast/Toast';
import styles from './NotificationContainer.module.css';

const DEFAULT_POSITION = 'top-right';

export const NotificationContainer: React.FC = () => {
  const { notifications, remove } = useNotificationContext();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  const container = document.body;

  const position = DEFAULT_POSITION; // Could be made configurable via context

  return createPortal(
    <div className={`${styles.container} ${styles[position]}`} aria-live="polite" aria-label="Notifications">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onRemove={remove}
            position={position}
          />
        ))}
      </AnimatePresence>
    </div>,
    container
  );
};

