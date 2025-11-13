// FIX: Updated component to use React.PropsWithChildren for better type safety with children props.
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, PropsWithChildren } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

type NotificationType = 'success' | 'info' | 'error';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  title: string;
}

interface NotificationContextType {
  addNotification: (message: string, type: NotificationType, title: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: PropsWithChildren<{}>) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: NotificationType, title: string) => {
    const id = new Date().getTime();
    setNotifications(currentNotifications => [
      ...currentNotifications,
      { id, message, type, title },
    ]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(currentNotifications =>
      currentNotifications.filter(notification => notification.id !== id)
    );
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map(notification => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto-dismiss after 5 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle className="h-6 w-6 text-green-500" />,
        info: <Info className="h-6 w-6 text-blue-500" />,
        error: <Info className="h-6 w-6 text-red-500" />,
    };

    return (
        <div className="notification-toast">
            <div className="flex-shrink-0">
                {icons[notification.type]}
            </div>
            <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{notification.title}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
                <button
                    onClick={onClose}
                    className="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <span className="sr-only">Fechar</span>
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};