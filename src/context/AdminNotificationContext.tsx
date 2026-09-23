import React, { createContext, useContext, useState } from 'react';
import { AdminAlertNotification } from '../types';
import { INITIAL_NOTIFICATIONS } from '../services/mockData';

interface AdminNotificationContextType {
  notifications: AdminAlertNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notif: Omit<AdminAlertNotification, 'id' | 'isRead' | 'createdAt'>) => void;
  deleteNotification: (id: string) => void;
  updateReminderDueHours: (id: string, dueHours: number) => void;
}

const AdminNotificationContext = createContext<AdminNotificationContextType | undefined>(undefined);

export const AdminNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AdminAlertNotification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addNotification = (
    notif: Omit<AdminAlertNotification, 'id' | 'isRead' | 'createdAt'>
  ) => {
    const newAlert: AdminAlertNotification = {
      ...notif,
      id: `alert_${Date.now()}`,
      isRead: false,
      createdAt: 'Justo ahora'
    };
    setNotifications(prev => [newAlert, ...prev]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updateReminderDueHours = (id: string, dueHours: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, dueHoursEstimate: dueHours } : n))
    );
  };

  return (
    <AdminNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        deleteNotification,
        updateReminderDueHours
      }}
    >
      {children}
    </AdminNotificationContext.Provider>
  );
};

export const useAdminNotifications = () => {
  const context = useContext(AdminNotificationContext);
  if (!context) {
    throw new Error('useAdminNotifications must be used within AdminNotificationProvider');
  }
  return context;
};
