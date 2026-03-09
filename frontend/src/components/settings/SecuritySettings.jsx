import React, { useState } from 'react';

/* ──────────────────────────────────────────────
   SecuritySettings — Change password form
   Future: POST /user/change-password
   ────────────────────────────────────────────── */

const SecuritySettings = () => {
    const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus(null);
        setErrorMsg('');

        if (!form.current || !form.newPass || !form.confirm) {
            setStatus('error');
            setErrorMsg('All fields are required.');
            return;
        }
        if (form.newPass.length < 8) {
            setStatus('error');
            setErrorMsg('New password must be at least 8 characters.');
            return;
        }
        if (form.newPass !== form.confirm) {
            setStatus('error');
            setErrorMsg('New password and confirmation do not match.');
            return;
        }

        /* Future API call: POST /user/change-password */
        setStatus('success');
        setForm({ current: '', newPass: '', confirm: '' });
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div className="as__card">
            <div className="as__card-head">
                <span className="as__card-icon">🔒</span>
                <div>
                    <h3>Security</h3>
                    <p>Change your password to keep your account secure</p>
                </div>
            </div>

            {status === 'success' && (
                <div className="as__alert as__alert--success">✅ Password updated successfully!</div>
            )}
            {status === 'error' && (
                <div className="as__alert as__alert--error">⚠️ {errorMsg}</div>
            )}

            <form className="as__form" onSubmit={handleSubmit}>
                <div className="as__form-field">
                    <label>Current Password</label>
                    <div className="as__input-wrap">
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            value={form.current}
                            onChange={(e) => handleChange('current', e.target.value)}
                            placeholder="Enter current password"
                        />
                        <button type="button" className="as__toggle-pw" onClick={() => setShowCurrent((v) => !v)}>
                            {showCurrent ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                <div className="as__form-field">
                    <label>New Password</label>
                    <div className="as__input-wrap">
                        <input
                            type={showNew ? 'text' : 'password'}
                            value={form.newPass}
                            onChange={(e) => handleChange('newPass', e.target.value)}
                            placeholder="At least 8 characters"
                        />
                        <button type="button" className="as__toggle-pw" onClick={() => setShowNew((v) => !v)}>
                            {showNew ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                <div className="as__form-field">
                    <label>Confirm New Password</label>
                    <div className="as__input-wrap">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={form.confirm}
                            onChange={(e) => handleChange('confirm', e.target.value)}
                            placeholder="Re-enter new password"
                        />
                        <button type="button" className="as__toggle-pw" onClick={() => setShowConfirm((v) => !v)}>
                            {showConfirm ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                <div className="as__form-actions">
                    <button type="submit" className="as__btn as__btn--primary">🔐 Update Password</button>
                </div>
            </form>
        </div>
    );
};

export default SecuritySettings;
