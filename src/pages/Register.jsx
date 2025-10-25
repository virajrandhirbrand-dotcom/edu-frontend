import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '', 
        role: 'student',
        firstName: '',
        lastName: '',
        class: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
        }
        
        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
        }
        
        if (formData.role === 'student' && !formData.class) {
            newErrors.class = 'Class is required for students';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async e => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setErrors({ submit: 'Registration failed! User may already exist.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            {/* Left Side - Visual Content */}
            <div className="register-visual">
                <div className="visual-content">
                    <div className="visual-header">
                        <h2>Join EduPlatform</h2>
                        <p>Start your educational journey with us</p>
                    </div>
                    <div className="visual-features">
                        <div className="feature-item">
                            <div className="feature-icon">🚀</div>
                            <div className="feature-text">
                                <h3>Get Started Fast</h3>
                                <p>Quick and easy registration process</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🎯</div>
                            <div className="feature-text">
                                <h3>Personalized Learning</h3>
                                <p>Tailored content based on your role</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🌟</div>
                            <div className="feature-text">
                                <h3>Community Access</h3>
                                <p>Connect with students and peers</p>
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
            <div className="register-form-section">
                <div className="register-card">
                    {/* Header */}
                    <div className="register-header">
                        <Link to="/" className="back-home">
                            ← Back to Home
                        </Link>
                        <h1>Create Your Account</h1>
                        <p>Join our learning community today</p>
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="error-message">
                            {errors.submit}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={onSubmit} className="register-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={onChange}
                                    className={errors.firstName ? 'error' : ''}
                                    placeholder="Enter your first name"
                                />
                                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={onChange}
                                    className={errors.lastName ? 'error' : ''}
                                    placeholder="Enter your last name"
                                />
                                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={onChange}
                                className={errors.email ? 'error' : ''}
                                placeholder="Enter your email"
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={onChange}
                                className={errors.password ? 'error' : ''}
                                placeholder="Create a password"
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                            <div className="password-hint">
                                Must be at least 6 characters long
                            </div>
                        </div>

                        {formData.role === 'student' && (
                            <div className="form-group">
                                <label htmlFor="class">Class/Standard</label>
                                <select
                                    id="class"
                                    name="class"
                                    value={formData.class}
                                    onChange={onChange}
                                    className={errors.class ? 'error' : ''}
                                >
                                    <option value="">Select your class</option>
                                    <option value="1">Class 1</option>
                                    <option value="2">Class 2</option>
                                    <option value="3">Class 3</option>
                                    <option value="4">Class 4</option>
                                    <option value="5">Class 5</option>
                                    <option value="6">Class 6</option>
                                    <option value="7">Class 7</option>
                                    <option value="8">Class 8</option>
                                    <option value="9">Class 9</option>
                                    <option value="10">Class 10</option>
                                </select>
                                {errors.class && <span className="error-text">{errors.class}</span>}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="role">I am a</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={onChange}
                            >
                                <option value="student">Student</option>
                                <option value="ug">Undergraduate (UG)</option>
                                <option value="pg">Postgraduate (PG)</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            className={`submit-btn ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="login-link">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </div>

                    {/* Terms */}
                    <div className="terms">
                        By creating an account, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;