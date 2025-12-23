import { useNotificationContext } from '../context/NotificationContext';
import { NotificationOptions } from '../types/notification';

/**
 * Custom hook to easily trigger notifications from any component
 * 
 * @example
 * const notify = useNotification();
 * notify('Success!', { type: 'success' });
 */
export const useNotification = () => {
  const { notify, remove, clearAll } = useNotificationContext();

  return {
    notify: (message: string, options?: NotificationOptions) => notify(message, options),
    remove,
    clearAll,
    // Convenience methods
    success: (message: string, options?: Omit<NotificationOptions, 'type'>) =>
      notify(message, { ...options, type: 'success' }),
    error: (message: string, options?: Omit<NotificationOptions, 'type'>) =>
      notify(message, { ...options, type: 'error' }),
    warning: (message: string, options?: Omit<NotificationOptions, 'type'>) =>
      notify(message, { ...options, type: 'warning' }),
    info: (message: string, options?: Omit<NotificationOptions, 'type'>) =>
      notify(message, { ...options, type: 'info' }),
  };
};

