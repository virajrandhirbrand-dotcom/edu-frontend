import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Login failed! Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left Side - Visual Content */}
            <div className="login-visual">
                <div className="visual-content">
                    <div className="visual-header">
                        <h2>Welcome to EduPlatform</h2>
                        <p>Your gateway to quality education and learning</p>
                    </div>
                    <div className="visual-features">
                        <div className="feature-item">
                            <div className="feature-icon">🎓</div>
                            <div className="feature-text">
                                <h3>Quality Education</h3>
                                <p>Access to world-class courses and resources</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🤖</div>
                            <div className="feature-text">
                                <h3>AI Assistant</h3>
                                <p>Get personalized help with your studies</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">📊</div>
                            <div className="feature-text">
                                <h3>Progress Tracking</h3>
                                <p>Monitor your learning journey</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="visual-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>

            {/* Right Side - Form Content */}
            <div className="login-form-section">
                <div className="login-card">
                    {/* Header */}
                    <div className="login-header">
                        <Link to="/" className="back-home">
                            ← Back to Home
                        </Link>
                        <h1>Welcome Back</h1>
                        <p>Sign in to your account to continue</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={onSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={onChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={onChange}
                                placeholder="Enter your password"
                                required
                            />
                            <div className="forgot-password">
                                <Link to="/forgot-password">Forgot your password?</Link>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className={`submit-btn ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="register-link">
                        Don't have an account? <Link to="/register">Create one here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;