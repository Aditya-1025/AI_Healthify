import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import DoctorNotificationBell from '../../components/doctor/DoctorNotificationBell';
import ProfileDropdown from '../../components/common/ProfileDropdown';
import '../../layouts/MainLayout.css';

const navItems = [
    { to: '/doctor/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/doctor/patients', label: 'Patients', icon: '🩺' },
    { to: '/doctor/appointments', label: 'Appointments', icon: '📅' },
    { to: '/doctor/prescriptions', label: 'Prescriptions', icon: '📝' },
];

const DoctorLayout = () => {
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
                    &copy; {new Date().getFullYear()} Healthify &middot; Doctor Portal
                </div>
            </aside>

            {/* -------- Main column -------- */}
            <div className="layout__main">
                <header className="layout__header">
                    <h2 className="layout__header-title">Doctor Portal</h2>
                    <div className="layout__header-actions">
                        <DoctorNotificationBell />
                        <ProfileDropdown role="doctor" />
                    </div>
                </header>

                <main className="layout__content">
                    <Outlet />
                </main>

                <footer className="layout__footer">
                    Healthify &middot; Doctor Portal
                </footer>
            </div>
        </div>
    );
};

export default DoctorLayout;
