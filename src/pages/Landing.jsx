import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-container">
            {/* Navigation */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="logo">
                        <h2>EduPlatform</h2>
                    </div>
                    <div className="nav-links">
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link primary">Sign Up</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>Welcome to Your Learning Journey</h1>
                        <p>Join thousands of students and professionals advancing their careers with our comprehensive learning platform.</p>
                        <div className="hero-buttons">
                            <Link to="/register" className="btn btn-primary">
                                Get Started Free
                            </Link>
                            <Link to="/login" className="btn btn-secondary">
                                Sign In
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="hero-visual">
                            <div className="image-placeholder">
                                <div className="learning-illustration">
                                    <div className="book"></div>
                                    <div className="laptop"></div>
                                    <div className="graduation-cap"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2>Why Choose Our Platform?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📖</div>
                            <h3>Comprehensive Curriculum</h3>
                            <p>Access a wide range of courses tailored for students, undergraduates, and postgraduates.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">👨‍🏫</div>
                            <h3>Expert Instructors</h3>
                            <p>Learn from industry professionals and academic experts with real-world experience.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🚀</div>
                            <h3>Career Advancement</h3>
                            <p>Gain skills that directly translate to career growth and academic success.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Start Your Journey?</h2>
                    <p>Join our community of learners today and take the first step towards your goals.</p>
                    <Link to="/register" className="btn btn-large">
                        Create Your Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>&copy; 2024 EduPlatform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;