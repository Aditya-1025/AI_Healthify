import React from 'react';
import './Input.css';

/**
 * Input — design-token–driven form input with label support.
 */
const Input = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    className = '',
    ...rest
}) => {
    return (
        <div className={`input-group ${className}`}>
            {label && (
                <label htmlFor={id} className="input-group__label">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`input-group__field ${error ? 'input-group__field--error' : ''}`}
                {...rest}
            />
            {error && <span className="input-group__error">{error}</span>}
        </div>
    );
};

export default Input;
