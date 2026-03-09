import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <section className="not-found">
            <div className="not-found__icon">🔍</div>
            <h1 className="not-found__code">404</h1>
            <h2 className="not-found__title">Page Not Found</h2>
            <p className="not-found__text">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="not-found__actions">
                <Link to="/" className="not-found__btn not-found__btn--primary">← Back to Home</Link>
                <Link to="/patient/dashboard" className="not-found__btn not-found__btn--outline">Patient Portal</Link>
            </div>
        </section>
    );
};

export default NotFound;
