import React, { useState } from 'react';

/* ──────────────────────────────────────────────
   PreferenceSettings — Theme selector
   Future: POST /user/settings/update
   ────────────────────────────────────────────── */

const THEMES = [
    { key: 'light', label: 'Light Mode', icon: '☀️', desc: 'Classic bright interface' },
    { key: 'dark', label: 'Dark Mode', icon: '🌙', desc: 'Easy on the eyes at night' },
    { key: 'system', label: 'System Default', icon: '💻', desc: 'Follows your OS preference' },
];

const PreferenceSettings = () => {
    const [theme, setTheme] = useState('light');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        /* Future API: POST /user/settings/update { theme } */
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="as__card">
            <div className="as__card-head">
                <span className="as__card-icon">🎨</span>
                <div>
                    <h3>Preferences</h3>
                    <p>Customize the look and feel of your dashboard</p>
                </div>
            </div>

            {saved && <div className="as__alert as__alert--success">✅ Theme preference saved!</div>}

            <div className="as__theme-grid">
                {THEMES.map((t) => (
                    <button
                        key={t.key}
                        className={`as__theme-option ${theme === t.key ? 'as__theme-option--active' : ''}`}
                        onClick={() => setTheme(t.key)}
                    >
                        <span className="as__theme-icon">{t.icon}</span>
                        <strong>{t.label}</strong>
                        <span className="as__theme-desc">{t.desc}</span>
                        {theme === t.key && <span className="as__theme-check">✓</span>}
                    </button>
                ))}
            </div>

            <div className="as__form-actions">
                <button className="as__btn as__btn--primary" onClick={handleSave}>💾 Save Preferences</button>
            </div>
        </div>
    );
};

export default PreferenceSettings;
