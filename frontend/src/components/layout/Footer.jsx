import React from 'react';

const Footer = () => {
    return (
        <footer
            style={{
                textAlign: 'center',
                padding: 'var(--space-md) var(--space-xl)',
                background: 'var(--color-surface)',
                color: 'var(--color-text-muted)',
                fontSize: 'var(--font-size-xs)',
                borderTop: '1px solid var(--color-border)',
            }}
        >
            &copy; {new Date().getFullYear()} Healthify. All rights reserved.
        </footer>
    );
};

export default Footer;
