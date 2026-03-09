import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SecuritySettings from './SecuritySettings';
import NotificationSettings from './NotificationSettings';
import PreferenceSettings from './PreferenceSettings';
import './AccountSettings.css';

/* ──────────────────────────────────────────────
   AccountSettings — Full settings page
   Renders: Security · Notifications · Preferences · Danger Zone
   ────────────────────────────────────────────── */

const AccountSettings = ({ role = 'patient' }) => {
    const navigate = useNavigate();
    const [logoutDone, setLogoutDone] = useState(false);

    const handleLogoutAll = () => {
        /* Future API: POST /user/logout-all */
        setLogoutDone(true);
        setTimeout(() => {
            setLogoutDone(false);
            navigate('/login');
        }, 1500);
    };

    const basePath = role === 'doctor' ? '/doctor' : '/patient';

    return (
        <section className="as">
            {/* ── Header ── */}
            <div className="as__header">
                <div>
                    <h2>⚙️ Account Settings</h2>
                    <p>Manage your security, notifications, and preferences</p>
                </div>
                <button className="as__back-btn" onClick={() => navigate(`${basePath}/profile`)}>
                    ← Back to Profile
                </button>
            </div>

            {/* ── Security ── */}
            <SecuritySettings />

            {/* ── Notifications ── */}
            <NotificationSettings role={role} />

            {/* ── Preferences ── */}
            <PreferenceSettings />

            {/* ── Danger Zone ── */}
            <div className="as__card as__card--danger">
                <div className="as__card-head">
                    <span className="as__card-icon">⚠️</span>
                    <div>
                        <h3>Danger Zone</h3>
                        <p>Irreversible account actions</p>
                    </div>
                </div>

                {logoutDone && (
                    <div className="as__alert as__alert--success">✅ Logged out from all devices — redirecting…</div>
                )}

                <div className="as__danger-actions">
                    <div className="as__danger-row">
                        <div>
                            <strong>Logout from All Devices</strong>
                            <span>Sign out of every active session across all browsers and devices</span>
                        </div>
                        <button className="as__btn as__btn--danger" onClick={handleLogoutAll}>
                            🚪 Logout All
                        </button>
                    </div>

                    <div className="as__danger-divider" />

                    <div className="as__danger-row">
                        <div>
                            <strong>Delete Account</strong>
                            <span>Permanently delete your account and all associated data</span>
                        </div>
                        <button className="as__btn as__btn--danger-outline" disabled>
                            🗑️ Delete (Coming Soon)
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AccountSettings;
