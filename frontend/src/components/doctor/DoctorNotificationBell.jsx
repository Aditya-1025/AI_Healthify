import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctorNotifications } from '../../context/DoctorNotificationContext';
import './DoctorNotificationBell.css';

/* ── Type icon mapping ── */
const typeIcon = (type) => {
    switch (type) {
        case 'appointment': return '📅';
        case 'prescription': return '💊';
        case 'vitals': return '🫀';
        case 'medicine': return '⏰';
        case 'system': return '⚙️';
        default: return '🔔';
    }
};

/* ── Relative time ── */
const relativeTime = (timestamp) => {
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return 'Yesterday';
    return `${Math.floor(diff / 86400)}d ago`;
};

const DoctorNotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useDoctorNotifications();
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

    const displayNotifs = notifications.slice(0, 6);

    const handleNotifClick = (notif) => {
        markAsRead(notif.id);
        setOpen(false);
        navigate('/doctor/notifications');
    };

    return (
        <div className="doc-bell" ref={dropdownRef}>
            <button
                className="doc-bell__trigger"
                onClick={() => setOpen(!open)}
                title="Notifications"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="doc-bell__badge">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="doc-bell__dropdown">
                    {/* Header */}
                    <div className="doc-bell__dropdown-header">
                        <h4>Notifications</h4>
                        {unreadCount > 0 && (
                            <button className="doc-bell__mark-all" onClick={markAllAsRead}>
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="doc-bell__list">
                        {displayNotifs.length > 0 ? (
                            displayNotifs.map((n) => (
                                <div
                                    key={n.id}
                                    className={`doc-bell__item ${!n.read ? 'doc-bell__item--unread' : ''}`}
                                    onClick={() => handleNotifClick(n)}
                                >
                                    <span className="doc-bell__item-icon">{typeIcon(n.type)}</span>
                                    <div className="doc-bell__item-content">
                                        <p className="doc-bell__item-patient">{n.patientName}</p>
                                        <p className="doc-bell__item-msg">{n.message}</p>
                                        <span className="doc-bell__item-time">{relativeTime(n.timestamp)}</span>
                                    </div>
                                    {!n.read && <span className="doc-bell__item-dot" />}
                                </div>
                            ))
                        ) : (
                            <div className="doc-bell__empty">
                                <span>🔕</span>
                                <p>No notifications</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="doc-bell__dropdown-footer">
                            <button
                                className="doc-bell__view-all"
                                onClick={() => { setOpen(false); navigate('/doctor/notifications'); }}
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

export default DoctorNotificationBell;
