import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Notification } from '../../types/notification';
import styles from './Toast.module.css';

interface ToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export const Toast: React.FC<ToastProps> = ({ notification, onRemove, position }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const totalElapsedRef = useRef<number>(0);

  const Icon = iconMap[notification.type];

  useEffect(() => {
    if (notification.duration > 0 && !isPaused) {
      // Reset on new notification
      startTimeRef.current = Date.now();
      totalElapsedRef.current = 0;
      setProgress(100);

      // Progress bar update interval (60fps)
      const updateInterval = 16;

      progressTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current + totalElapsedRef.current;
        const newProgress = Math.max(0, 100 - (elapsed / notification.duration) * 100);
        setProgress(newProgress);

        if (newProgress <= 0) {
          onRemove(notification.id);
        }
      }, updateInterval);

      timerRef.current = setTimeout(() => {
        onRemove(notification.id);
      }, notification.duration - totalElapsedRef.current);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      };
    }
  }, [notification.id, notification.duration, isPaused, onRemove]);

  const handleMouseEnter = () => {
    if (notification.pauseOnHover && !isPaused && notification.duration > 0) {
      // Calculate elapsed time before pausing
      const elapsed = Date.now() - startTimeRef.current;
      totalElapsedRef.current += elapsed;
      
      setIsPaused(true);
      
      // Clear timers
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (notification.pauseOnHover && isPaused) {
      setIsPaused(false);
      startTimeRef.current = Date.now(); // Reset start time for remaining duration
    }
  };

  const handleClose = () => {
    onRemove(notification.id);
  };

  const getAnimationVariants = () => {
    const isTop = position.startsWith('top');
    const isRight = position.endsWith('right');
    
    return {
      initial: {
        opacity: 0,
        x: isRight ? 100 : -100,
        y: isTop ? -20 : 20,
        scale: 0.95,
      },
      animate: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      },
      exit: {
        opacity: 0,
        x: isRight ? 100 : -100,
        scale: 0.95,
        transition: {
          duration: 0.2,
        },
      },
    };
  };

  return (
    <motion.div
      variants={getAnimationVariants()}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`${styles.toast} ${styles[notification.type]}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={notification.type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Icon className={styles.icon} aria-hidden="true" />
        </div>
        <div className={styles.message}>{notification.message}</div>
        {notification.dismissible && (
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close notification"
            type="button"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
      {notification.duration > 0 && (
        <div className={styles.progressBarContainer}>
          <motion.div
            className={styles.progressBar}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      )}
    </motion.div>
  );
};

