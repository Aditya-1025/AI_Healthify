import React, { useState } from 'react';

/* ──────────────────────────────────────────────
   NotificationSettings — toggle switches
   Future: GET /user/settings, POST /user/settings/update
   ────────────────────────────────────────────── */

const PATIENT_PREFS = [
    { key: 'appointments', label: 'Appointment Notifications', desc: 'Get notified about upcoming and confirmed appointments', icon: '📅' },
    { key: 'prescriptions', label: 'Prescription Updates', desc: 'Alerts when a new prescription is added or updated', icon: '📄' },
    { key: 'medications', label: 'Medication Reminders', desc: 'Timely reminders to take your medicines on schedule', icon: '💊' },
];

const DOCTOR_PREFS = [
    { key: 'appointments', label: 'Appointment Notifications', desc: 'Get notified about new appointment requests', icon: '📅' },
    { key: 'prescriptions', label: 'Prescription Updates', desc: 'Alerts when a patient views or downloads a prescription', icon: '📄' },
    { key: 'medications', label: 'Medication Reminders', desc: 'Adherence alerts for your patients\' medication', icon: '💊' },
    { key: 'vitals', label: 'Patient Vitals Alerts', desc: 'Critical alerts when patient vitals exceed thresholds', icon: '🫀' },
];

const NotificationSettings = ({ role = 'patient' }) => {
    const prefs = role === 'doctor' ? DOCTOR_PREFS : PATIENT_PREFS;

    const defaults = {};
    prefs.forEach((p) => { defaults[p.key] = true; });
    const [toggles, setToggles] = useState(defaults);
    const [saved, setSaved] = useState(false);

    const toggle = (key) => setToggles((t) => ({ ...t, [key]: !t[key] }));

    const handleSave = () => {
        /* Future API: POST /user/settings/update { notifications: toggles } */
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="as__card">
            <div className="as__card-head">
                <span className="as__card-icon">🔔</span>
                <div>
                    <h3>Notification Preferences</h3>
                    <p>Choose which notifications you want to receive</p>
                </div>
            </div>

            {saved && <div className="as__alert as__alert--success">✅ Notification preferences saved!</div>}

            <div className="as__toggles">
                {prefs.map((p) => (
                    <div key={p.key} className="as__toggle-row">
                        <div className="as__toggle-info">
                            <span className="as__toggle-icon">{p.icon}</span>
                            <div>
                                <strong>{p.label}</strong>
                                <span>{p.desc}</span>
                            </div>
                        </div>
                        <button
                            className={`as__switch ${toggles[p.key] ? 'as__switch--on' : ''}`}
                            onClick={() => toggle(p.key)}
                            aria-label={`Toggle ${p.label}`}
                        >
                            <span className="as__switch-thumb" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="as__form-actions">
                <button className="as__btn as__btn--primary" onClick={handleSave}>💾 Save Preferences</button>
            </div>
        </div>
    );
};

export default NotificationSettings;
