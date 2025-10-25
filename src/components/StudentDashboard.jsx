import React, { useState, useRef } from 'react';
import Sidebar from './Sidebar';
import LearningVideosSection from './LearningVideosSection';
import QuizSection from './QuizSection';
import AIAssistantSection from './AIAssistantSection';
import './StudentDashboard.css';

const StudentDashboard = () => {
    // Sidebar ref for direct toggle control
    const sidebarRef = useRef(null);
    
    // Sidebar content state
    const [activeContent, setActiveContent] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    
    // Handle sidebar content changes
    const handleContentChange = (content) => {
        setActiveContent(content);
    };

    // Handle sidebar collapse changes
    const handleCollapseChange = (isCollapsed) => {
        setSidebarCollapsed(isCollapsed);
    };

    // Handle hamburger button click - directly toggle sidebar via ref
    const handleHamburgerClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (sidebarRef.current) {
            sidebarRef.current.toggle();
        }
        return false;
    };
    
    // Welcome Dashboard for Students
    const WelcomeDashboard = () => (
        <div className="dashboard-welcome">
            <div className="welcome-header">
                <h1 className="welcome-title">Welcome to Student Learning Hub</h1>
                <p className="welcome-subtitle">Empowering your academic journey with learning materials, quizzes, and AI assistance</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                        <h3>3</h3>
                        <p>Learning Tools</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <h3>100%</h3>
                        <p>Learning Progress</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h2 className="section-title">Quick Actions</h2>
                <div className="action-grid">
                    <button 
                        className="action-card"
                        onClick={() => setActiveContent('learning')}
                    >
                        <div className="action-icon">📚</div>
                        <h3>Learning Videos</h3>
                        <p>Access course materials and videos</p>
                    </button>
                    <button 
                        className="action-card"
                        onClick={() => setActiveContent('quiz')}
                    >
                        <div className="action-icon">📝</div>
                        <h3>Quizzes</h3>
                        <p>Test your knowledge with quizzes</p>
                    </button>
                    <button 
                        className="action-card"
                        onClick={() => setActiveContent('ai-assistant')}
                    >
                        <div className="action-icon">🤖</div>
                        <h3>AI Assistant</h3>
                        <p>Get help from AI tutor</p>
                    </button>
                </div>
            </div>
        </div>
    );
    
    // Render content based on active sidebar item
    const renderContent = () => {
        switch (activeContent) {
            case 'learning':
                return <LearningVideosSection />;
            case 'quiz':
                return <QuizSection />;
            case 'ai-assistant':
                return <AIAssistantSection />;
            case 'dashboard':
                return <WelcomeDashboard />;
            default:
                return <WelcomeDashboard />;
        }
    };

    return (
        <div className="dashboard-container">
            {/* Dashboard Header with Hamburger */}
            <div className="dashboard-header">
                {/* Hamburger Button - Left Side */}
                <button 
                    className="header-hamburger-btn"
                    onClick={handleHamburgerClick}
                    onMouseDown={(e) => e.preventDefault()}
                    onTouchStart={(e) => e.preventDefault()}
                    title={sidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
                    type="button"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
                
                <h1 className="header-title">Student Dashboard</h1>
                <p className="header-subtitle">Student Learning Portal</p>
            </div>

            {/* Sidebar */}
            <Sidebar 
                ref={sidebarRef}
                onContentChange={handleContentChange} 
                onCollapseChange={handleCollapseChange}
                userType="student" 
            />
            
            {/* Main Content */}
            <div className="main-content">
                <div className="content-wrapper">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;