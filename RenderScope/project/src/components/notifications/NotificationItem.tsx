import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Notification } from '../../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onClose: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  // Handle notification icon based on type
  const NotificationIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-error" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'info':
        return <Info className="h-5 w-5 text-info" />;
      default:
        return <Info className="h-5 w-5 text-info" />;
    }
  };

  // Handle close with animation
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300); // Match animation duration
  };

  // Auto-close after duration
  useEffect(() => {
    if (notification.autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.autoClose, notification.duration]);

  return (
    <div
      className={`notification notification-${notification.type} ${isExiting ? 'exiting' : ''}`}
      role="alert"
    >
      <div className="flex-shrink-0">
        <NotificationIcon />
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-primary">{notification.title}</h4>
        <p className="text-sm text-secondary">{notification.message}</p>
        <div className="text-xs text-secondary mt-1">
          {notification.timestamp.toLocaleTimeString()}
        </div>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-secondary hover:text-primary transition-colors"
        aria-label="Close notification"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};