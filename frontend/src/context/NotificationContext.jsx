import React, { createContext, useContext, useState, useCallback } from 'react';

/* ──────────────────────────────────────────────
   NotificationContext
   Global notification state for the Patient portal.
   Provides:
     - notifications       (full list)
     - unreadCount         (badge number)
     - addNotification(notification)
     - markAsRead(id)
     - markAllAsRead()
     - clearNotifications()
     - dismissReminder(id)
     - activeReminder      (currently visible medicine popup)
     - setActiveReminder
   ────────────────────────────────────────────── */

const NotificationContext = createContext(null);

/* ── Seed notifications ── */
const SEED_NOTIFICATIONS = [
    {
        id: 1,
        type: 'appointment',
        message: 'Dr. Gupta confirmed your appointment for Mar 12',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
        read: false,
    },
    {
        id: 2,
        type: 'prescription',
        message: 'New prescription added by Dr. Gupta — Metformin 500mg',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
    },
    {
        id: 3,
        type: 'medicine',
        message: 'Time to take Metformin 500mg — Morning dose',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: false,
    },
    {
        id: 4,
        type: 'appointment',
        message: 'Reminder: Appointment with Dr. Meena Iyer tomorrow at 11:00 AM',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        read: true,
    },
    {
        id: 5,
        type: 'medicine',
        message: 'Time to take Paracetamol 500mg — Afternoon dose',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        read: true,
    },
    {
        id: 6,
        type: 'prescription',
        message: 'Prescription for Amoxicillin has been updated by Dr. Meena Iyer',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        read: true,
    },
];

let nextId = 100;

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
    const [activeReminder, setActiveReminder] = useState(null);

    /* Add a new notification */
    const addNotification = useCallback((notification) => {
        const newNotif = {
            id: ++nextId,
            type: notification.type || 'medicine',
            message: notification.message,
            timestamp: notification.timestamp || new Date(),
            read: false,
        };
        setNotifications(prev => [newNotif, ...prev]);
        return newNotif;
    }, []);

    /* Mark single notification as read */
    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    /* Mark all notifications as read */
    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    /* Clear all notifications */
    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    /* Dismiss a medicine reminder popup */
    const dismissReminder = useCallback(() => {
        setActiveReminder(null);
    }, []);

    /* Derived */
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearNotifications,
                activeReminder,
                setActiveReminder,
                dismissReminder,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

/** Convenience hook */
export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used inside <NotificationProvider>');
    return ctx;
};

export default NotificationContext;
