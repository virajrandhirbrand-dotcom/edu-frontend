import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import AIAssistantSection from './AIAssistantSection';
import PlagiarismAnalyzer from './PlagiarismAnalyzer';
import './StudentDashboard.css';

const PGDashboard = () => {
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
    
    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                // No data loading needed after removing research tools and thesis help
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        loadData();
    }, []);
    
    // Welcome Dashboard for Postgraduate Students
    const WelcomeDashboard = () => (
        <div className="dashboard-welcome">
            <div className="welcome-header">
                <h1 className="welcome-title">Welcome to Postgraduate Learning Hub</h1>
                <p className="welcome-subtitle">Advanced research tools, plagiarism detection, and AI-powered assistance for postgraduate studies</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">🔬</div>
                    <div className="stat-content">
                        <h3>2</h3>
                        <p>Research Tools</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <h3>100%</h3>
                        <p>Research Progress</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h2 className="section-title">Quick Actions</h2>
                <div className="action-grid">
                    <button 
                        className="action-card"
                        onClick={() => setActiveContent('ai-assistant')}
                    >
                        <div className="action-icon">🤖</div>
                        <h3>AI Assistant</h3>
                        <p>Get research assistance from AI</p>
                    </button>
                    <button 
                        className="action-card"
                        onClick={() => setActiveContent('plagiarism')}
                    >
                        <div className="action-icon">🔍</div>
                        <h3>Plagiarism Check</h3>
                        <p>Ensure originality of your work</p>
                    </button>
                </div>
            </div>
        </div>
    );
    
    // Render content based on active sidebar item
    const renderContent = () => {
        switch (activeContent) {
            case 'ai-assistant':
                return <AIAssistantSection />;
            case 'plagiarism':
                return <PlagiarismAnalyzer />;
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
                
                <h1 className="header-title">PG Dashboard - Postgraduate</h1>
                <p className="header-subtitle">Postgraduate Learning Management System</p>
            </div>

            {/* Sidebar */}
            <Sidebar 
                ref={sidebarRef}
                onContentChange={handleContentChange} 
                onCollapseChange={handleCollapseChange}
                userType="pg" 
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

export default PGDashboard;