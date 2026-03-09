import React, { useEffect } from 'react';
import './Modal.css';

/**
 * Modal — design-token–driven overlay dialog.
 * Traps focus, closes on Escape, prevents body scroll.
 */
const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
    /* Close on Escape key */
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div
                className={`modal ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal__header">
                    <h3 className="modal__title">{title}</h3>
                    <button
                        className="modal__close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>
                <div className="modal__body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
