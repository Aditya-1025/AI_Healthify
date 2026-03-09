import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../context/UserProfileContext';
import './ProfileDropdown.css';

/* ──────────────────────────────────────────────
   ProfileDropdown
   Replaces the static avatar in both layouts.
   ────────────────────────────────────────────── */

const ProfileDropdown = ({ role = 'patient' }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();
    const { getProfile } = useUserProfile();
    const profile = getProfile(role);

    /* Close on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const basePath = role === 'doctor' ? '/doctor' : '/patient';

    const menuItems = [
        { icon: '👤', label: 'My Profile', action: () => navigate(`${basePath}/profile`) },
        { icon: '✏️', label: 'Edit Profile', action: () => navigate(`${basePath}/profile?edit=true`) },
        { icon: '⚙️', label: 'Account Settings', action: () => navigate(`${basePath}/profile?tab=settings`) },
        { divider: true },
        { icon: '🚪', label: 'Logout', action: () => navigate('/login'), danger: true },
    ];

    return (
        <div className="pd" ref={ref}>
            {/* Avatar trigger */}
            <button className="pd__trigger" onClick={() => setOpen((v) => !v)} aria-label="Profile menu">
                {profile.photo ? (
                    <img src={profile.photo} alt={profile.fullName} className="pd__avatar-img" />
                ) : (
                    <span className="pd__avatar-initials">{profile.initials}</span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="pd__menu">
                    {/* User info header */}
                    <div className="pd__menu-header">
                        <div className="pd__menu-avatar">
                            {profile.photo ? (
                                <img src={profile.photo} alt="" />
                            ) : (
                                <span>{profile.initials}</span>
                            )}
                        </div>
                        <div className="pd__menu-info">
                            <strong>{profile.fullName}</strong>
                            <span>{profile.email}</span>
                        </div>
                    </div>

                    <div className="pd__menu-divider" />

                    {/* Menu items */}
                    {menuItems.map((item, i) =>
                        item.divider ? (
                            <div key={i} className="pd__menu-divider" />
                        ) : (
                            <button
                                key={i}
                                className={`pd__menu-item ${item.danger ? 'pd__menu-item--danger' : ''}`}
                                onClick={() => { item.action(); setOpen(false); }}
                            >
                                <span className="pd__menu-item-icon">{item.icon}</span>
                                {item.label}
                            </button>
                        ),
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
