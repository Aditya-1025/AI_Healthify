import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Sidebar — Reusable navigation sidebar (fallback / standalone use).
 * Portal layouts (DoctorLayout, PatientLayout) use their own integrated sidebars.
 */
const Sidebar = ({ items = [], title = 'Menu' }) => {
    const defaultItems = [
        { to: '/', label: 'Home', icon: '🏠' },
        { to: '/doctor', label: 'Doctor Portal', icon: '🩺' },
        { to: '/patient', label: 'Patient Portal', icon: '💚' },
    ];

    const navItems = items.length > 0 ? items : defaultItems;

    return (
        <aside
            style={{
                width: 'var(--sidebar-width)',
                background: 'var(--color-secondary)',
                minHeight: '100vh',
                padding: 'var(--space-xl) var(--space-lg)',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-xs)',
            }}
        >
            <h3
                style={{
                    color: 'var(--color-white)',
                    marginBottom: 'var(--space-lg)',
                    fontSize: 'var(--font-size-lg)',
                }}
            >
                {title}
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                {navItems.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-sm)',
                            padding: 'var(--space-sm) var(--space-md)',
                            color: isActive ? 'var(--color-white)' : 'var(--color-text-light)',
                            textDecoration: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: isActive ? 600 : 400,
                            background: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
                            transition: 'background var(--transition-fast), color var(--transition-fast)',
                        })}
                    >
                        {icon && <span style={{ fontSize: 'var(--font-size-lg)', width: '24px', textAlign: 'center' }}>{icon}</span>}
                        {label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
