import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUserProfile } from '../../../context/UserProfileContext';
import AccountSettings from '../../../components/settings/AccountSettings';
import '../../patient/pages/PatientProfile.css'; /* reuse same stylesheet */

/* ──────────────────────────────────────────────
   DoctorProfile
   View & edit doctor profile with photo upload.

   Future: GET /user/profile, POST /user/profile/update
   ────────────────────────────────────────────── */

const FIELDS = [
    { key: 'fullName', label: 'Full Name', icon: '👤', type: 'text' },
    { key: 'email', label: 'Email', icon: '📧', type: 'email' },
    { key: 'phone', label: 'Phone Number', icon: '📞', type: 'tel' },
    { key: 'specialization', label: 'Specialization', icon: '🩺', type: 'text' },
    { key: 'yearsOfExperience', label: 'Years of Experience', icon: '📅', type: 'number' },
    { key: 'hospital', label: 'Hospital / Clinic Name', icon: '🏥', type: 'text' },
    { key: 'licenseNumber', label: 'License Number', icon: '🪪', type: 'text' },
    { key: 'consultationFee', label: 'Consultation Fee', icon: '💰', type: 'text' },
];

const DoctorProfile = () => {
    const [searchParams] = useSearchParams();
    const startEditing = searchParams.get('edit') === 'true';
    const showSettings = searchParams.get('tab') === 'settings';

    const { getProfile, updateProfile, uploadProfilePhoto } = useUserProfile();
    const profile = getProfile('doctor');

    /* ── Render settings page if ?tab=settings ── */
    if (showSettings) return <AccountSettings role="doctor" />;

    const [editing, setEditing] = useState(startEditing);
    const [draft, setDraft] = useState({ ...profile });
    const [saved, setSaved] = useState(false);
    const fileRef = useRef(null);

    /* ── Photo upload ── */
    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await uploadProfilePhoto('doctor', file);
    };

    /* ── Save ── */
    const handleSave = () => {
        const initials = draft.fullName
            .replace(/^Dr\.\s*/i, '')
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
        updateProfile('doctor', { ...draft, initials });
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
                    <p>View and manage your professional information</p>
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
                    <span className="up__role-badge up__role-badge--doctor">Doctor</span>
                    <p>{profile.email}</p>
                </div>
            </div>

            {/* ── Fields grid ── */}
            <div className="up__card">
                <div className="up__card-head">
                    <span className="up__card-head-icon">📋</span>
                    <h3>Professional Information</h3>
                </div>

                <div className="up__fields">
                    {FIELDS.map((f) => (
                        <div key={f.key} className="up__field">
                            <label className="up__field-label">
                                <span className="up__field-icon">{f.icon}</span>
                                {f.label}
                            </label>

                            {editing ? (
                                <input
                                    className="up__field-input"
                                    type={f.type}
                                    value={draft[f.key]}
                                    onChange={(e) => handleChange(f.key, e.target.value)}
                                />
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

export default DoctorProfile;
