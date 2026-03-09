import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import './NotificationBell.css';

/* ── Notification type icon ── */
const typeIcon = (type) => {
    switch (type) {
        case 'appointment': return '📅';
        case 'prescription': return '💊';
        case 'medicine': return '⏰';
        default: return '🔔';
    }
};

/* ── Relative time ── */
const relativeTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(timestamp)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return 'Yesterday';
    return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    /* Close on outside click */
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    /* Show max 6 in dropdown */
    const displayNotifs = notifications.slice(0, 6);

    const handleNotifClick = (notif) => {
        markAsRead(notif.id);
        setOpen(false);
        navigate('/patient/notifications');
    };

    return (
        <div className="notif-bell" ref={dropdownRef}>
            <button
                className="notif-bell__trigger"
                onClick={() => setOpen(!open)}
                title="Notifications"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="notif-bell__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {open && (
                <div className="notif-bell__dropdown">
                    {/* Dropdown header */}
                    <div className="notif-bell__dropdown-header">
                        <h4>Notifications</h4>
                        {unreadCount > 0 && (
                            <button className="notif-bell__mark-all" onClick={markAllAsRead}>
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notification list */}
                    <div className="notif-bell__list">
                        {displayNotifs.length > 0 ? (
                            displayNotifs.map((n) => (
                                <div
                                    key={n.id}
                                    className={`notif-bell__item ${!n.read ? 'notif-bell__item--unread' : ''}`}
                                    onClick={() => handleNotifClick(n)}
                                >
                                    <span className="notif-bell__item-icon">{typeIcon(n.type)}</span>
                                    <div className="notif-bell__item-content">
                                        <p>{n.message}</p>
                                        <span className="notif-bell__item-time">{relativeTime(n.timestamp)}</span>
                                    </div>
                                    {!n.read && <span className="notif-bell__item-dot" />}
                                </div>
                            ))
                        ) : (
                            <div className="notif-bell__empty">
                                <span>🔕</span>
                                <p>No notifications</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="notif-bell__dropdown-footer">
                            <button
                                className="notif-bell__view-all"
                                onClick={() => { setOpen(false); navigate('/patient/notifications'); }}
                            >
                                View All Notifications →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
