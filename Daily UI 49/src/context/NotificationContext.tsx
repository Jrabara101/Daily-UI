import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Notification, NotificationOptions, NotificationContextType } from '../types/notification';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const MAX_NOTIFICATIONS = 5;
const DEFAULT_DURATION = 5000; // 5 seconds

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateId = (): string => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, options: NotificationOptions = {}): string => {
      const id = generateId();
      const notification: Notification = {
        id,
        message,
        type: options.type || 'info',
        duration: options.duration ?? DEFAULT_DURATION,
        createdAt: Date.now(),
        dismissible: options.dismissible ?? true,
        pauseOnHover: options.pauseOnHover ?? true,
      };

      setNotifications((prev) => {
        const updated = [...prev, notification];
        // Limit to MAX_NOTIFICATIONS, remove oldest if exceeded
        if (updated.length > MAX_NOTIFICATIONS) {
          return updated.slice(-MAX_NOTIFICATIONS);
        }
        return updated;
      });

      return id;
    },
    []
  );

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, notify, remove, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

