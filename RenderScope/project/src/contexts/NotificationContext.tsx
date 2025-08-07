import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationContainer } from '../components/notifications/NotificationContainer';
import { NotificationType } from '../types/notification';

interface NotificationContextType {
  addNotification: (type: NotificationType, title: string, message: string, options?: { autoClose?: boolean; duration?: number }) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  success: (title: string, message: string, options?: { autoClose?: boolean; duration?: number }) => string;
  error: (title: string, message: string, options?: { autoClose?: boolean; duration?: number }) => string;
  warning: (title: string, message: string, options?: { autoClose?: boolean; duration?: number }) => string;
  info: (title: string, message: string, options?: { autoClose?: boolean; duration?: number }) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info
  } = useNotifications();

  return (
    <NotificationContext.Provider
      value={{
        addNotification,
        removeNotification,
        clearAllNotifications,
        success,
        error,
        warning,
        info
      }}
    >
      {children}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </NotificationContext.Provider>
  );
};