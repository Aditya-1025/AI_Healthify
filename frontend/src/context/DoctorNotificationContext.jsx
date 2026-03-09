import React, { createContext, useContext, useState, useCallback } from 'react';

/* ──────────────────────────────────────────────
   DoctorNotificationContext
   Global notification state for the Doctor portal.

   Architecture is API-ready:
     • Replace SEED data with   GET  /doctor/notifications
     • Replace addNotification  with POST /doctor/notifications
     • Replace markAsRead       with POST /doctor/notifications/read
   ────────────────────────────────────────────── */

const DoctorNotificationContext = createContext(null);

/* ── Mock notifications ── */
const SEED_NOTIFICATIONS = [
    {
        id: 1,
        type: 'appointment',
        patientName: 'Priya Sharma',
        message: 'New appointment request for Cardiology consultation',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),   // 15 min ago
        read: false,
    },
    {
        id: 2,
        type: 'prescription',
        patientName: 'Rahul Verma',
        message: 'Viewed your prescription for Asthma treatment',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),   // 45 min ago
        read: false,
    },
    {
        id: 3,
        type: 'vitals',
        patientName: 'Amit Deshmukh',
        message: 'Abnormal blood pressure detected — 160/100 mmHg',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
        read: false,
    },
    {
        id: 4,
        type: 'medicine',
        patientName: 'Sneha Patil',
        message: 'Missed 3 consecutive doses of Migraine medication',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3h ago
        read: false,
    },
    {
        id: 5,
        type: 'appointment',
        patientName: 'Neha Kulkarni',
        message: 'Cancelled follow-up appointment scheduled for Mar 14',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: true,
    },
    {
        id: 6,
        type: 'vitals',
        patientName: 'Vikram Rao',
        message: 'Updated vitals — heart rate elevated to 105 bpm',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        read: true,
    },
    {
        id: 7,
        type: 'prescription',
        patientName: 'Priya Sharma',
        message: 'Downloaded prescription PDF for Hypertension treatment',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        read: true,
    },
    {
        id: 8,
        type: 'system',
        patientName: 'System',
        message: 'Weekly patient report is ready for review',
        timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
        read: true,
    },
];

let nextId = 200;

export const DoctorNotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);

    /* ── Future: replace with POST /doctor/notifications ── */
    const addNotification = useCallback((notification) => {
        const newNotif = {
            id: ++nextId,
            type: notification.type || 'system',
            patientName: notification.patientName || 'System',
            message: notification.message,
            timestamp: notification.timestamp || new Date(),
            read: false,
        };
        setNotifications(prev => [newNotif, ...prev]);
        return newNotif;
    }, []);

    /* ── Future: replace with POST /doctor/notifications/read ── */
    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    /* Derived */
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <DoctorNotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearNotifications,
            }}
        >
            {children}
        </DoctorNotificationContext.Provider>
    );
};

/** Convenience hook */
export const useDoctorNotifications = () => {
    const ctx = useContext(DoctorNotificationContext);
    if (!ctx) throw new Error('useDoctorNotifications must be used inside <DoctorNotificationProvider>');
    return ctx;
};

export default DoctorNotificationContext;
