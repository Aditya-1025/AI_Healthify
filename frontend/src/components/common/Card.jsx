import React from 'react';
import './Card.css';

/**
 * Card — design-token–driven container with hover elevation.
 *
 * Props
 * ─────
 * @param {React.ReactNode} children   — Card content
 * @param {'default'|'compact'|'spacious'} size     — Padding variant
 * @param {'default'|'flat'|'elevated'}    variant  — Shadow variant
 * @param {string}  className — Extra classes to merge
 * @param {object}  style     — Inline overrides (escape hatch)
 * @param {object}  rest      — Forwarded to root <div>
 */
const Card = ({
    children,
    size = 'default',
    variant = 'default',
    className = '',
    style = {},
    ...rest
}) => {
    const sizeClass = size !== 'default' ? `card--${size}` : '';
    const varClass = variant !== 'default' ? `card--${variant}` : '';
    const classes = ['card', sizeClass, varClass, className].filter(Boolean).join(' ');

    return (
        <div className={classes} style={style} {...rest}>
            {children}
        </div>
    );
};

/** Optional sub-components for structured cards */
Card.Header = ({ children, className = '', ...rest }) => (
    <div className={`card__header ${className}`} {...rest}>{children}</div>
);

Card.Body = ({ children, className = '', ...rest }) => (
    <div className={`card__body ${className}`} {...rest}>{children}</div>
);

Card.Footer = ({ children, className = '', ...rest }) => (
    <div className={`card__footer ${className}`} {...rest}>{children}</div>
);

export default Card;
