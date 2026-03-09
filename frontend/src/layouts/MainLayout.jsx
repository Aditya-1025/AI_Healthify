import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './MainLayout.css';

const navItems = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/doctor', label: 'Doctor Portal', icon: '🩺' },
    { to: '/patient', label: 'Patient Portal', icon: '💚' },
];

const MainLayout = () => {
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
                            end={to === '/'}
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
                    &copy; {new Date().getFullYear()} Healthify
                </div>
            </aside>

            {/* -------- Main column -------- */}
            <div className="layout__main">
                {/* Sticky header */}
                <header className="layout__header">
                    <h2 className="layout__header-title">Dashboard</h2>

                    <div className="layout__header-actions">
                        <span className="layout__header-bell" title="Notifications">🔔</span>
                        <div className="layout__header-avatar">AJ</div>
                    </div>
                </header>

                {/* Centred, card-spaced content */}
                <main className="layout__content">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="layout__footer">
                    Healthify &middot; Your trusted healthcare companion
                </footer>
            </div>
        </div>
    );
};

export default MainLayout;
