import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../services/api';
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

        /* Call backend login API */
        api.post('/auth/login', {
            email: form.email,
            password: form.password,
        })
            .then((response) => {
                setLoading(false);
                
                // Store the token
                localStorage.setItem('token', response.access_token);
                
                // Get user data from backend response
                const userData = response.user || {};
                
                // Store complete user info in localStorage for chatbot and other components
                localStorage.setItem('user', JSON.stringify({
                    id: userData.id,
                    name: userData.name,
                    email: userData.email
                }));
                
                // Store user info in context
                login({
                    name: userData.name || form.email.split('@')[0],
                    email: userData.email || form.email,
                    role: userData.email?.toLowerCase().includes('doctor') ? 'doctor' : 'patient',
                    avatar: (userData.name || form.email.split('@')[0]).slice(0, 2).toUpperCase(),
                });

                // Redirect to dashboard
                const role = userData.email?.toLowerCase().includes('doctor') ? 'doctor' : 'patient';
                navigate(role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
            })
            .catch((err) => {
                setLoading(false);
                setError(err.message || 'Login failed. Please check your email and password.');
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
