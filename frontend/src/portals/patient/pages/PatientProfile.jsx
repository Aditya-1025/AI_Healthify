import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUserProfile } from '../../../context/UserProfileContext';
import AccountSettings from '../../../components/settings/AccountSettings';
import './PatientProfile.css';

/* ──────────────────────────────────────────────
   PatientProfile
   View & edit patient profile with photo upload.

   Future: GET /user/profile, POST /user/profile/update
   ────────────────────────────────────────────── */

const FIELDS = [
    { key: 'fullName', label: 'Full Name', icon: '👤', type: 'text' },
    { key: 'email', label: 'Email', icon: '📧', type: 'email' },
    { key: 'phone', label: 'Phone Number', icon: '📞', type: 'tel' },
    { key: 'dateOfBirth', label: 'Date of Birth', icon: '🎂', type: 'date' },
    { key: 'gender', label: 'Gender', icon: '⚧️', type: 'select', options: ['Male', 'Female', 'Other'] },
    { key: 'bloodGroup', label: 'Blood Group', icon: '🩸', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    { key: 'height', label: 'Height', icon: '📏', type: 'text' },
    { key: 'weight', label: 'Weight', icon: '⚖️', type: 'text' },
    { key: 'emergencyContact', label: 'Emergency Contact', icon: '🚨', type: 'text' },
];

const PatientProfile = () => {
    const [searchParams] = useSearchParams();
    const startEditing = searchParams.get('edit') === 'true';
    const showSettings = searchParams.get('tab') === 'settings';

    const { getProfile, updateProfile, uploadProfilePhoto } = useUserProfile();
    const profile = getProfile('patient');

    /* ── Render settings page if ?tab=settings ── */
    if (showSettings) return <AccountSettings role="patient" />;

    const [editing, setEditing] = useState(startEditing);
    const [draft, setDraft] = useState({ ...profile });
    const [saved, setSaved] = useState(false);
    const fileRef = useRef(null);

    /* ── Photo upload ── */
    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await uploadProfilePhoto('patient', file);
    };

    /* ── Save ── */
    const handleSave = () => {
        const initials = draft.fullName
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
        updateProfile('patient', { ...draft, initials });
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    /* ── Cancel ── */
    const handleCancel = () => {
        setDraft({ ...profile });
        setEditing(false);
    };

    const handleChange = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

    return (
        <section className="up">
            {/* ── Success toast ── */}
            {saved && (
                <div className="up__toast">
                    <span>✅</span> Profile updated successfully!
                </div>
            )}

            {/* ── Header ── */}
            <div className="up__header">
                <div>
                    <h2>My Profile</h2>
                    <p>View and manage your personal information</p>
                </div>
                {!editing && (
                    <button className="up__edit-btn" onClick={() => { setDraft({ ...profile }); setEditing(true); }}>
                        ✏️ Edit Profile
                    </button>
                )}
            </div>

            {/* ── Avatar card ── */}
            <div className="up__avatar-card">
                <div className="up__avatar-wrap" onClick={() => fileRef.current?.click()}>
                    {profile.photo ? (
                        <img src={profile.photo} alt={profile.fullName} className="up__avatar-img" />
                    ) : (
                        <span className="up__avatar-initials">{profile.initials}</span>
                    )}
                    <div className="up__avatar-overlay">📷 Change</div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="up__avatar-input"
                    />
                </div>
                <div className="up__avatar-info">
                    <h3>{profile.fullName}</h3>
                    <span className="up__role-badge">Patient</span>
                    <p>{profile.email}</p>
                </div>
            </div>

            {/* ── Fields grid ── */}
            <div className="up__card">
                <div className="up__card-head">
                    <span className="up__card-head-icon">📋</span>
                    <h3>Personal Information</h3>
                </div>

                <div className="up__fields">
                    {FIELDS.map((f) => (
                        <div key={f.key} className="up__field">
                            <label className="up__field-label">
                                <span className="up__field-icon">{f.icon}</span>
                                {f.label}
                            </label>

                            {editing ? (
                                f.type === 'select' ? (
                                    <select
                                        className="up__field-input"
                                        value={draft[f.key]}
                                        onChange={(e) => handleChange(f.key, e.target.value)}
                                    >
                                        {f.options.map((o) => (
                                            <option key={o} value={o}>{o}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        className="up__field-input"
                                        type={f.type}
                                        value={draft[f.key]}
                                        onChange={(e) => handleChange(f.key, e.target.value)}
                                    />
                                )
                            ) : (
                                <span className="up__field-value">{profile[f.key]}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Action buttons ── */}
                {editing && (
                    <div className="up__actions">
                        <button className="up__btn up__btn--cancel" onClick={handleCancel}>Cancel</button>
                        <button className="up__btn up__btn--save" onClick={handleSave}>💾 Save Changes</button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PatientProfile;
