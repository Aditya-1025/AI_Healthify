import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Header — Shared fallback header (for non-portal routes).
 * Portal layouts have their own integrated headers.
 */
const Header = () => {
    return (
        <header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 'var(--header-height)',
                padding: '0 var(--space-xl)',
                background: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
            }}
        >
            <h1 style={{ margin: 0, fontSize: 'var(--font-size-xl)', color: 'var(--color-secondary)' }}>
                Healthify
            </h1>
            <nav style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <Link to="/" style={{ color: 'var(--color-text)', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
                <Link to="/doctor/dashboard" style={{ color: 'var(--color-text)', textDecoration: 'none', fontWeight: 500 }}>Doctor Portal</Link>
                <Link to="/patient/dashboard" style={{ color: 'var(--color-text)', textDecoration: 'none', fontWeight: 500 }}>Patient Portal</Link>
            </nav>
        </header>
    );
};

export default Header;
