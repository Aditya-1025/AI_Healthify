import React from 'react';

/* ──────────────────────────────────────────────
   PatientAlerts
   Recent alerts for the patient, color-coded.

   Future: replace mock data with GET /patients/:id/alerts
   ────────────────────────────────────────────── */

/* ── Alert type config ── */
const ALERT_CONFIG = {
    vitals: {
        icon: '🫀',
        label: 'Vitals Alert',
        cls: 'pa__alert--vitals',
        badgeCls: 'pa__badge--red',
    },
    medication: {
        icon: '💊',
        label: 'Medication',
        cls: 'pa__alert--medication',
        badgeCls: 'pa__badge--orange',
    },
    appointment: {
        icon: '📅',
        label: 'Appointment',
        cls: 'pa__alert--appointment',
        badgeCls: 'pa__badge--blue',
    },
    system: {
        icon: '⚙️',
        label: 'System',
        cls: 'pa__alert--system',
        badgeCls: 'pa__badge--gray',
    },
};

/* ── Mock alerts ── */
const MOCK_ALERTS = [
    {
        id: 1,
        type: 'vitals',
        message: 'High blood pressure detected — 140/90 mmHg exceeds threshold',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        severity: 'critical',
    },
    {
        id: 2,
        type: 'medication',
        message: 'Missed 3 consecutive doses of Amlodipine 5mg',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        severity: 'warning',
    },
    {
        id: 3,
        type: 'vitals',
        message: 'Low sleep duration — average 5.8 hours over the past 3 days',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        severity: 'warning',
    },
    {
        id: 4,
        type: 'appointment',
        message: 'Follow-up appointment overdue by 5 days',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        severity: 'info',
    },
    {
        id: 5,
        type: 'medication',
        message: 'Metformin course ending in 3 days — renewal needed',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        severity: 'info',
    },
    {
        id: 6,
        type: 'vitals',
        message: 'Heart rate elevated to 92 bpm during rest period',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        severity: 'warning',
    },
];

const SEVERITY_CLS = {
    critical: 'pa__severity--critical',
    warning: 'pa__severity--warning',
    info: 'pa__severity--info',
};

const relativeTime = (ts) => {
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

const PatientAlerts = () => {
    const criticalCount = MOCK_ALERTS.filter(a => a.severity === 'critical').length;
    const warningCount = MOCK_ALERTS.filter(a => a.severity === 'warning').length;

    return (
        <div className="pa">
            {/* Header */}
            <div className="pa__header">
                <div className="pa__header-left">
                    <span className="pa__header-icon">🚨</span>
                    <div>
                        <h3 className="pa__title">Recent Alerts</h3>
                        <p className="pa__subtitle">
                            {MOCK_ALERTS.length} alerts · {criticalCount} critical · {warningCount} warnings
                        </p>
                    </div>
                </div>
            </div>

            {/* Alert list */}
            <div className="pa__list">
                {MOCK_ALERTS.map((alert) => {
                    const cfg = ALERT_CONFIG[alert.type] || ALERT_CONFIG.system;
                    return (
                        <div key={alert.id} className={`pa__alert ${cfg.cls}`}>
                            <div className={`pa__alert-icon ${cfg.cls}`}>
                                {cfg.icon}
                            </div>
                            <div className="pa__alert-body">
                                <div className="pa__alert-top">
                                    <span className={`pa__badge ${cfg.badgeCls}`}>{cfg.label}</span>
                                    <span className={`pa__severity ${SEVERITY_CLS[alert.severity]}`}>
                                        {alert.severity}
                                    </span>
                                </div>
                                <p className="pa__alert-msg">{alert.message}</p>
                                <span className="pa__alert-time">{relativeTime(alert.timestamp)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PatientAlerts;
