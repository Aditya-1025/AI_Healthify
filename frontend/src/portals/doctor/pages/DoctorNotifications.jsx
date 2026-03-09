import React, { useState, useMemo } from 'react';
import { useDoctorNotifications } from '../../../context/DoctorNotificationContext';
import './DoctorNotifications.css';

/* ── Type config ── */
const TYPE_CONFIG = {
    appointment: { icon: '📅', label: 'Appointment', color: 'appointment' },
    prescription: { icon: '💊', label: 'Prescription', color: 'prescription' },
    vitals: { icon: '🫀', label: 'Vitals Alert', color: 'vitals' },
    medicine: { icon: '⏰', label: 'Adherence', color: 'medicine' },
    system: { icon: '⚙️', label: 'System', color: 'system' },
};

const getConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.system;

/* ── Filter tabs ── */
const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'appointment', label: 'Appointments' },
    { key: 'vitals', label: 'System Alerts' },
];

/* ── Time helpers ── */
const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

const formatDate = (ts) =>
    new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const relativeTime = (ts) => {
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return 'Yesterday';
    return `${Math.floor(diff / 86400)}d ago`;
};

/* ── Group by day ── */
const groupByDay = (notifications) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const groups = { Today: [], Yesterday: [], Earlier: [] };

    notifications.forEach((n) => {
        const d = new Date(n.timestamp);
        if (d.toDateString() === today.toDateString()) groups.Today.push(n);
        else if (d.toDateString() === yesterday.toDateString()) groups.Yesterday.push(n);
        else groups.Earlier.push(n);
    });
    return groups;
};

/* ══════════════════════════════════════════════ */
const DoctorNotifications = () => {
    const {
        notifications, unreadCount,
        markAsRead, markAllAsRead, clearNotifications,
    } = useDoctorNotifications();

    const [activeFilter, setActiveFilter] = useState('all');

    /* Filtered list */
    const filtered = useMemo(() => {
        switch (activeFilter) {
            case 'unread':
                return notifications.filter(n => !n.read);
            case 'appointment':
                return notifications.filter(n => n.type === 'appointment');
            case 'vitals':
                return notifications.filter(n => n.type === 'vitals' || n.type === 'system');
            default:
                return notifications;
        }
    }, [notifications, activeFilter]);

    const grouped = groupByDay(filtered);

    /* Filter badge counts */
    const badgeCount = (key) => {
        switch (key) {
            case 'all': return notifications.length;
            case 'unread': return unreadCount;
            case 'appointment': return notifications.filter(n => n.type === 'appointment').length;
            case 'vitals': return notifications.filter(n => n.type === 'vitals' || n.type === 'system').length;
            default: return 0;
        }
    };

    return (
        <section className="doc-notifs">
            {/* ── Header ── */}
            <div className="doc-notifs__header">
                <div className="doc-notifs__header-left">
                    <div className="doc-notifs__header-icon">🔔</div>
                    <div>
                        <h2>Notifications</h2>
                        <p>Stay updated with patient activity and system alerts</p>
                    </div>
                </div>
                <div className="doc-notifs__header-actions">
                    {unreadCount > 0 && (
                        <button className="doc-notifs__action-btn" onClick={markAllAsRead}>
                            ✓ Mark All Read
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button
                            className="doc-notifs__action-btn doc-notifs__action-btn--danger"
                            onClick={clearNotifications}
                        >
                            🗑 Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="doc-notifs__stats">
                <div className="doc-notifs__stat">
                    <span className="doc-notifs__stat-num">{notifications.length}</span>
                    <span className="doc-notifs__stat-label">Total</span>
                </div>
                <div className="doc-notifs__stat doc-notifs__stat--highlight">
                    <span className="doc-notifs__stat-num">{unreadCount}</span>
                    <span className="doc-notifs__stat-label">Unread</span>
                </div>
                <div className="doc-notifs__stat">
                    <span className="doc-notifs__stat-num">
                        {notifications.filter(n => n.type === 'appointment').length}
                    </span>
                    <span className="doc-notifs__stat-label">Appointments</span>
                </div>
                <div className="doc-notifs__stat">
                    <span className="doc-notifs__stat-num">
                        {notifications.filter(n => n.type === 'vitals' || n.type === 'system').length}
                    </span>
                    <span className="doc-notifs__stat-label">Alerts</span>
                </div>
            </div>

            {/* ── Filter tabs ── */}
            <div className="doc-notifs__filters">
                {FILTERS.map((f) => (
                    <button
                        key={f.key}
                        className={`doc-notifs__filter ${activeFilter === f.key ? 'doc-notifs__filter--active' : ''}`}
                        onClick={() => setActiveFilter(f.key)}
                    >
                        {f.label}
                        <span className="doc-notifs__filter-badge">{badgeCount(f.key)}</span>
                    </button>
                ))}
            </div>

            {/* ── Notification groups ── */}
            {filtered.length === 0 ? (
                <div className="doc-notifs__empty">
                    <span className="doc-notifs__empty-icon">🔕</span>
                    <h4>No notifications</h4>
                    <p>You're all caught up! New notifications will appear here.</p>
                </div>
            ) : (
                Object.entries(grouped).map(([label, items]) => {
                    if (items.length === 0) return null;
                    return (
                        <div key={label} className="doc-notifs__group">
                            <h3 className="doc-notifs__group-label">{label}</h3>
                            <div className="doc-notifs__list">
                                {items.map((n) => {
                                    const cfg = getConfig(n.type);
                                    return (
                                        <div
                                            key={n.id}
                                            className={`doc-notifs__card ${!n.read ? 'doc-notifs__card--unread' : ''}`}
                                        >
                                            {/* Icon */}
                                            <div className={`doc-notifs__card-icon doc-notifs__card-icon--${cfg.color}`}>
                                                {cfg.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="doc-notifs__card-body">
                                                <div className="doc-notifs__card-top-row">
                                                    <span className="doc-notifs__card-patient">{n.patientName}</span>
                                                    <span className={`doc-notifs__card-type doc-notifs__card-type--${cfg.color}`}>
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                                <p className="doc-notifs__card-message">{n.message}</p>
                                                <div className="doc-notifs__card-meta">
                                                    <span className="doc-notifs__card-time">
                                                        {formatTime(n.timestamp)} · {formatDate(n.timestamp)}
                                                    </span>
                                                    <span className="doc-notifs__card-relative">{relativeTime(n.timestamp)}</span>
                                                </div>
                                            </div>

                                            {/* Action */}
                                            <div className="doc-notifs__card-action">
                                                {!n.read ? (
                                                    <button
                                                        className="doc-notifs__read-btn"
                                                        onClick={() => markAsRead(n.id)}
                                                        title="Mark as read"
                                                    >
                                                        ✓
                                                    </button>
                                                ) : (
                                                    <span className="doc-notifs__read-done">✓</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })
            )}
        </section>
    );
};

export default DoctorNotifications;
