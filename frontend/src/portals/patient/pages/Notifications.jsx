import React from 'react';
import { useNotifications } from '../../../context/NotificationContext';
import './Notifications.css';

/* ── Notification type icon ── */
const typeIcon = (type) => {
    switch (type) {
        case 'appointment': return '📅';
        case 'prescription': return '💊';
        case 'medicine': return '⏰';
        default: return '🔔';
    }
};

/* ── Notification type label ── */
const typeLabel = (type) => {
    switch (type) {
        case 'appointment': return 'Appointment';
        case 'prescription': return 'Prescription';
        case 'medicine': return 'Medicine';
        default: return 'Notification';
    }
};

/* ── Format timestamp ── */
const formatTime = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const formatDate = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

/* ── Group by day ── */
const groupByDay = (notifications) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups = { Today: [], Yesterday: [], Earlier: [] };

    notifications.forEach((n) => {
        const d = new Date(n.timestamp);
        if (d.toDateString() === today.toDateString()) {
            groups.Today.push(n);
        } else if (d.toDateString() === yesterday.toDateString()) {
            groups.Yesterday.push(n);
        } else {
            groups.Earlier.push(n);
        }
    });

    return groups;
};

const Notifications = () => {
    const { notifications, markAsRead, markAllAsRead, clearNotifications, unreadCount } = useNotifications();

    const grouped = groupByDay(notifications);

    return (
        <section className="notifs-page">
            {/* ── Header ── */}
            <div className="notifs-page__header">
                <div className="notifs-page__header-left">
                    <div className="notifs-page__header-icon">🔔</div>
                    <div>
                        <h2>Notifications</h2>
                        <p>Stay updated with your health activity</p>
                    </div>
                </div>

                <div className="notifs-page__header-actions">
                    {unreadCount > 0 && (
                        <button className="notifs-page__action-btn" onClick={markAllAsRead}>
                            ✓ Mark All Read
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button className="notifs-page__action-btn notifs-page__action-btn--danger" onClick={clearNotifications}>
                            🗑 Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* ── Stats strip ── */}
            <div className="notifs-page__stats">
                <div className="notifs-page__stat">
                    <span className="notifs-page__stat-num">{notifications.length}</span>
                    <span className="notifs-page__stat-label">Total</span>
                </div>
                <div className="notifs-page__stat notifs-page__stat--unread">
                    <span className="notifs-page__stat-num">{unreadCount}</span>
                    <span className="notifs-page__stat-label">Unread</span>
                </div>
                <div className="notifs-page__stat">
                    <span className="notifs-page__stat-num">
                        {notifications.filter(n => n.type === 'medicine').length}
                    </span>
                    <span className="notifs-page__stat-label">Medicine</span>
                </div>
                <div className="notifs-page__stat">
                    <span className="notifs-page__stat-num">
                        {notifications.filter(n => n.type === 'appointment').length}
                    </span>
                    <span className="notifs-page__stat-label">Appointments</span>
                </div>
            </div>

            {/* ── Notification groups ── */}
            {notifications.length === 0 ? (
                <div className="notifs-page__empty">
                    <span className="notifs-page__empty-icon">🔕</span>
                    <h4>No notifications</h4>
                    <p>You're all caught up! New notifications will appear here.</p>
                </div>
            ) : (
                Object.entries(grouped).map(([label, items]) => {
                    if (items.length === 0) return null;
                    return (
                        <div key={label} className="notifs-page__group">
                            <h3 className="notifs-page__group-label">{label}</h3>
                            <div className="notifs-page__list">
                                {items.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`notifs-page__item ${!n.read ? 'notifs-page__item--unread' : ''}`}
                                    >
                                        <div className="notifs-page__item-icon-wrap">
                                            <span className="notifs-page__item-icon">{typeIcon(n.type)}</span>
                                        </div>

                                        <div className="notifs-page__item-content">
                                            <p className="notifs-page__item-message">{n.message}</p>
                                            <div className="notifs-page__item-meta">
                                                <span className={`notifs-page__item-type notifs-page__item-type--${n.type}`}>
                                                    {typeLabel(n.type)}
                                                </span>
                                                <span className="notifs-page__item-time">
                                                    {formatTime(n.timestamp)} · {formatDate(n.timestamp)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="notifs-page__item-actions">
                                            {!n.read ? (
                                                <button
                                                    className="notifs-page__read-btn"
                                                    onClick={() => markAsRead(n.id)}
                                                    title="Mark as read"
                                                >
                                                    ✓
                                                </button>
                                            ) : (
                                                <span className="notifs-page__read-check">✓</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            )}
        </section>
    );
};

export default Notifications;
