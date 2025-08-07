import { useState, useCallback } from 'react';
import { Notification, NotificationType } from '../types/notification';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    options?: { autoClose?: boolean; duration?: number }
  ) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const notification: Notification = {
      id,
      type,
      title,
      message,
      autoClose: options?.autoClose !== undefined ? options.autoClose : true,
      duration: options?.duration || 5000, // Default 5 seconds
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-close notification if enabled
    if (notification.autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => {
      // Mark notification for exit animation
      const updated = prev.map(notification =>
        notification.id === id
          ? { ...notification, exiting: true }
          : notification
      );

      // Remove notification after animation completes
      setTimeout(() => {
        setNotifications(current =>
          current.filter(notification => notification.id !== id)
        );
      }, 300); // Animation duration

      return updated;
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods for different notification types
  const success = useCallback((title: string, message: string, options?: { autoClose?: boolean; duration?: number }) => {
    return addNotification('success', title, message, options);
  }, [addNotification]);

  const error = useCallback((title: string, message: string, options?: { autoClose?: boolean; duration?: number }) => {
    return addNotification('error', title, message, options);
  }, [addNotification]);

  const warning = useCallback((title: string, message: string, options?: { autoClose?: boolean; duration?: number }) => {
    return addNotification('warning', title, message, options);
  }, [addNotification]);

  const info = useCallback((title: string, message: string, options?: { autoClose?: boolean; duration?: number }) => {
    return addNotification('info', title, message, options);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info
  };
};