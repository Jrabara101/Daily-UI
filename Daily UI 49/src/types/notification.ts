export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  type?: NotificationType;
  duration?: number; // in milliseconds
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  dismissible?: boolean;
  pauseOnHover?: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
  createdAt: number;
  dismissible: boolean;
  pauseOnHover: boolean;
}

export interface NotificationContextType {
  notifications: Notification[];
  notify: (message: string, options?: NotificationOptions) => string;
  remove: (id: string) => void;
  clearAll: () => void;
}

