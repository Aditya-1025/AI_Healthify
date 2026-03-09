import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import NotificationBell from '../../components/notifications/NotificationBell';
import ProfileDropdown from '../../components/common/ProfileDropdown';
import MedicineReminderPopup from '../../components/notifications/MedicineReminderPopup';
import MedicineReminderService from '../../components/notifications/MedicineReminderService';
import '../../layouts/MainLayout.css';

const navItems = [
    { to: '/patient/dashboard', label: 'My Health', icon: '💚' },
    { to: '/patient/symptom-checker', label: 'Symptom Checker', icon: '🔍' },
    { to: '/patient/my-appointments', label: 'My Appointments', icon: '📅' },
    { to: '/patient/prescriptions', label: 'Prescriptions', icon: '📄' },
    { to: '/patient/medications', label: 'Medications', icon: '💊' },
    { to: '/patient/health-trends', label: 'Health Trends', icon: '📊' },
];

const PatientLayout = () => {
    return (
        <div className="layout">
            {/* -------- Fixed Sidebar -------- */}
            <aside className="layout__sidebar">
                <div className="layout__sidebar-brand">
                    Health<span>ify</span>
                </div>

                <nav className="layout__sidebar-nav">
                    {navItems.map(({ to, label, icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end
                            className={({ isActive }) =>
                                `layout__sidebar-link${isActive ? ' active' : ''}`
                            }
                        >
                            <span className="link-icon">{icon}</span>
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="layout__sidebar-footer">
                    &copy; {new Date().getFullYear()} Healthify &middot; Patient Portal
                </div>
            </aside>

            {/* -------- Main column -------- */}
            <div className="layout__main">
                <header className="layout__header">
                    <h2 className="layout__header-title">Patient Portal</h2>
                    <div className="layout__header-actions">
                        <NotificationBell />
                        <ProfileDropdown role="patient" />
                    </div>
                </header>

                <main className="layout__content">
                    <Outlet />
                </main>

                <footer className="layout__footer">
                    Healthify &middot; Your trusted healthcare companion
                </footer>
            </div>

            {/* ── Background services ── */}
            <MedicineReminderService />
            <MedicineReminderPopup />
        </div>
    );
};

export default PatientLayout;
