import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../services/api';
import './Auth.css';

const Signup = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirm: '',
        role: 'patient',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!form.name || !form.email || !form.password || !form.confirm) {
            setError('Please fill in all fields.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (form.password !== form.confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError('');

        /* Call backend registration API */
        api.post('/auth/register', {
            name: form.name,
            email: form.email,
            password: form.password,
        })
            .then((response) => {
                setLoading(false);
                
                // Show success message
                alert('✅ Account created successfully! Please log in with your credentials.');
                
                // Clear form
                setForm({ name: '', email: '', password: '', confirm: '', role: 'patient' });
                
                // Redirect to login page
                navigate('/login');
            })
            .catch((err) => {
                setLoading(false);
                const errorMsg = err.message || 'Registration failed. Please try again.';
                console.error('Registration error:', errorMsg);
                setError(errorMsg);
            });
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

                <h1 className="auth__title">Create your account</h1>
                <p className="auth__subtitle">Join Healthify and take control of your health</p>

                {/* Error */}
                {error && <div className="auth__error">⚠️ {error}</div>}

                <form className="auth__form" onSubmit={handleSubmit}>
                    <div className="auth__field">
                        <label htmlFor="signup-name">Full name</label>
                        <div className="auth__input-wrap">
                            <span className="auth__input-icon">👤</span>
                            <input
                                id="signup-name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="name"
                            />
                        </div>
                    </div>

                    <div className="auth__field">
                        <label htmlFor="signup-email">Email address</label>
                        <div className="auth__input-wrap">
                            <span className="auth__input-icon">📧</span>
                            <input
                                id="signup-email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Role selector */}
                    <div className="auth__field">
                        <label>I am a</label>
                        <div className="auth__role-toggle">
                            <button
                                type="button"
                                className={`auth__role-btn ${form.role === 'patient' ? 'auth__role-btn--active' : ''}`}
                                onClick={() => setForm({ ...form, role: 'patient' })}
                            >
                                💚 Patient
                            </button>
                            <button
                                type="button"
                                className={`auth__role-btn ${form.role === 'doctor' ? 'auth__role-btn--active' : ''}`}
                                onClick={() => setForm({ ...form, role: 'doctor' })}
                            >
                                🩺 Doctor
                            </button>
                        </div>
                    </div>

                    <div className="auth__field">
                        <label htmlFor="signup-password">Password</label>
                        <div className="auth__input-wrap">
                            <span className="auth__input-icon">🔒</span>
                            <input
                                id="signup-password"
                                name="password"
                                type="password"
                                placeholder="Min 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div className="auth__field">
                        <label htmlFor="signup-confirm">Confirm password</label>
                        <div className="auth__input-wrap">
                            <span className="auth__input-icon">🔒</span>
                            <input
                                id="signup-confirm"
                                name="confirm"
                                type="password"
                                placeholder="Re-enter password"
                                value={form.confirm}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`auth__submit ${loading ? 'auth__submit--loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="auth__spinner" />
                        ) : (
                            'Create Account'
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
                    Already have an account?{' '}
                    <Link to="/login" className="auth__link">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
