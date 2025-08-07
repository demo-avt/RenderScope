import React from 'react';
import { NotificationItem } from './NotificationItem';
import { Notification } from '../../types/notification';

interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};