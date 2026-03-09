import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
    { icon: '🩺', title: 'Doctor Portal', desc: 'Manage patients, appointments, and prescriptions from one dashboard.', to: '/doctor' },
    { icon: '💚', title: 'Patient Portal', desc: 'Track vitals, view medications, manage appointments and more.', to: '/patient' },
    { icon: '🔍', title: 'Symptom Checker', desc: 'AI-powered analysis to understand your symptoms and get recommendations.', to: '/patient/symptom-checker' },
    { icon: '🤖', title: 'AI Health Assistant', desc: 'Chat with our AI to get answers about your health data and next steps.', to: '/patient/dashboard' },
];

const stats = [
    { value: '10,000+', label: 'Patients Served' },
    { value: '500+', label: 'Doctors Available' },
    { value: '97%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'AI Support' },
];

const Home = () => {
    return (
        <div className="home">
            {/* ── Hero ── */}
            <header className="home__hero">
                <nav className="home__nav">
                    <div className="home__brand">Health<span>ify</span></div>
                    <div className="home__nav-links">
                        <Link to="/login" className="home__nav-link">Login</Link>
                        <Link to="/signup" className="home__nav-link home__nav-link--cta">Sign Up</Link>
                    </div>
                </nav>

                <div className="home__hero-content">
                    <h1>Your Health, <span className="home__gradient-text">Simplified</span></h1>
                    <p className="home__hero-sub">
                        Healthify brings together AI-powered diagnostics, appointment management, and real-time health tracking — all in one place.
                    </p>
                    <div className="home__hero-actions">
                        <Link to="/signup" className="home__btn home__btn--primary">Get Started</Link>
                        <Link to="/login" className="home__btn home__btn--outline">Login</Link>
                    </div>
                </div>

                {/* Stats strip */}
                <div className="home__stats">
                    {stats.map((s) => (
                        <div key={s.label} className="home__stat">
                            <div className="home__stat-value">{s.value}</div>
                            <div className="home__stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </header>

            {/* ── Features ── */}
            <section className="home__features">
                <h2 className="home__section-title">Everything You Need</h2>
                <p className="home__section-sub">A complete healthcare platform for patients and doctors alike.</p>

                <div className="home__features-grid">
                    {features.map((f) => (
                        <Link key={f.title} to={f.to} className="home__feature-card">
                            <div className="home__feature-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                            <span className="home__feature-arrow">→</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="home__cta">
                <div className="home__cta-inner">
                    <h2>Ready to take control of your health?</h2>
                    <p>Join thousands of patients and doctors who trust Healthify for modern healthcare management.</p>
                    <Link to="/signup" className="home__btn home__btn--white">Start Now — It's Free</Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="home__footer">
                <div className="home__footer-brand">Health<span>ify</span></div>
                <p>&copy; {new Date().getFullYear()} Healthify. Your trusted healthcare companion.</p>
            </footer>
        </div>
    );
};

export default Home;
