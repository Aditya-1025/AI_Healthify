import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!form.email || !form.password) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);

        /* Mock authentication — replace with API call later */
        setTimeout(() => {
            /* Determine role from email for demo purposes */
            const isDoctor = form.email.toLowerCase().includes('doctor') ||
                form.email.toLowerCase().includes('dr');

            const role = isDoctor ? 'doctor' : 'patient';

            login({
                name: isDoctor ? 'Dr. Anil Gupta' : 'Priya Sharma',
                email: form.email,
                role,
                avatar: isDoctor ? 'DA' : 'PS',
            });

            setLoading(false);
            navigate(role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
        }, 800);
    };

    return (
        <div className="auth">
            <div className="auth__bg">
                <div className="auth__bg-circle auth__bg-circle--1" />
                <div className="auth__bg-circle auth__bg-circle--2" />
                <div className="auth__bg-circle auth__bg-circle--3" />
            </div>

            <div className="auth__card">
                {/* Brand */}
                <Link to="/" className="auth__brand">
                    Health<span>ify</span>
                </Link>

                <h1 className="auth__title">Welcome back</h1>
                <p className="auth__subtitle">Sign in to your Healthify account</p>

                {/* Error */}
                {error && <div className="auth__error">⚠️ {error}</div>}

                <form className="auth__form" onSubmit={handleSubmit}>
                    <div className="auth__field">
                        <label htmlFor="login-email">Email address</label>
                        <div className="auth__input-wrap">
                            <span className="auth__input-icon">📧</span>
                            <input
                                id="login-email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="auth__field">
                        <label htmlFor="login-password">Password</label>
                        <div className="auth__input-wrap">
                            <span className="auth__input-icon">🔒</span>
                            <input
                                id="login-password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <div className="auth__extras">
                        <label className="auth__remember">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <button type="button" className="auth__forgot">Forgot password?</button>
                    </div>

                    <button
                        type="submit"
                        className={`auth__submit ${loading ? 'auth__submit--loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="auth__spinner" />
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="auth__divider">
                    <span>or continue with</span>
                </div>

                {/* Social (mock) */}
                <div className="auth__social">
                    <button className="auth__social-btn" type="button">🔵 Google</button>
                    <button className="auth__social-btn" type="button">🍎 Apple</button>
                </div>

                <p className="auth__footer-text">
                    Don't have an account?{' '}
                    <Link to="/signup" className="auth__link">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
