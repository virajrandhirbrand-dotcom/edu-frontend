import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Sidebar.css';

// Profile Modal Component
const ProfileModal = ({ profileData, onUpdate, onClose }) => {
    const [formData, setFormData] = useState(profileData);
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(profileData);
        setIsEditing(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Profile Information</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="modal-body">
                    <div className="profile-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Roll Number / Student ID</label>
                                <input
                                    type="text"
                                    name="rollNumber"
                                    value={formData.rollNumber}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Year / Semester</label>
                                <input
                                    type="text"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>College / University</label>
                                <input
                                    type="text"
                                    name="college"
                                    value={formData.college}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email ID</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Profile Photo (Emoji)</label>
                                <input
                                    type="text"
                                    name="profilePhoto"
                                    value={formData.profilePhoto}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder=""
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    {!isEditing ? (
                        <button className="edit-btn" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button className="save-btn" onClick={handleSave}>
                                Save Changes
                            </button>
                            <button className="cancel-btn" onClick={handleCancel}>
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const SidebarComponent = ({ onContentChange, userType = 'student', user = { name: 'John Doe', role: 'Student', avatar: '👤' }, onCollapseChange }, ref) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('dashboard');
    const [displayName, setDisplayName] = useState(user.name || 'John Doe');
    const navigate = useNavigate();

    // Fetch logged-in user's name from token
    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                if (decoded.user) {
                    // Token contains firstName and lastName (not fullName)
                    const firstName = decoded.user.firstName || '';
                    const lastName = decoded.user.lastName || '';
                    const fullName = `${firstName} ${lastName}`.trim() || 'User';
                    setDisplayName(fullName);
                }
            }
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }, []);

    // Expose toggleSidebar to parent component
    useImperativeHandle(ref, () => ({
        toggle: () => {
            setIsCollapsed(prev => !prev);
            if (onCollapseChange) {
                onCollapseChange(!isCollapsed);
            }
        }
    }));

    // Define menu items based on user type
    const getMenuItems = () => {
        const baseItems = [
            {
                id: 'learning',
                label: 'Learning & Videos',
                icon: '',
                content: 'learning'
            },
            {
                id: 'quiz',
                label: 'Quiz',
                icon: '',
                content: 'quiz'
            },
            {
                id: 'ai-assistant',
                label: 'AI Assistant',
                icon: '',
                content: 'ai-assistant'
            }
        ];

        if (userType === 'ug') {
            return [
                {
                    id: 'dashboard',
                    label: 'Dashboard',
                    icon: '',
                    content: 'dashboard'
                },
                {
                    id: 'ai-assistant',
                    label: 'AI Assistant',
                    icon: '',
                    content: 'ai-assistant'
                },
                {
                    id: 'mock-interview',
                    label: 'Mock Interview',
                    icon: '',
                    content: 'mock-interview'
                },
                {
                    id: 'resume-analyzer',
                    label: 'Resume Analyzer',
                    icon: '',
                    content: 'resume-analyzer'
                },
                {
                    id: 'youtube-videos',
                    label: 'YouTube Videos',
                    icon: '',
                    content: 'youtube-videos'
                },
                {
                    id: 'plagiarism',
                    label: 'Plagiarism Check',
                    icon: '',
                    content: 'plagiarism'
                },
                {
                    id: 'career-path',
                    label: 'Career Path',
                    icon: '',
                    content: 'career-path'
                }
            ];
        } else if (userType === 'pg') {
            return [
                {
                    id: 'ai-assistant',
                    label: 'AI Assistant',
                    icon: '',
                    content: 'ai-assistant'
                },
                {
                    id: 'plagiarism',
                    label: 'Plagiarism Check',
                    icon: '',
                    content: 'plagiarism'
                }
            ];
        }

        return baseItems;
    };

    const menuItems = getMenuItems();

    const handleItemClick = (item) => {
        setActiveItem(item.id);
        if (onContentChange) {
            onContentChange(item.content);
        }
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        if (onCollapseChange) {
            onCollapseChange(!isCollapsed);
        }
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Sidebar Header */}
            <div className="sidebar-header">
                <div className="sidebar-title">
                    {isCollapsed && <span className="title-icon"></span>}
                </div>
                <button 
                    className="close-btn"
                    onClick={toggleSidebar}
                    title="Close Sidebar"
                    type="button"
                >
                    ✕
                </button>
            </div>

            {/* Sidebar Menu */}
            <nav className="sidebar-nav">
                <ul className="menu-list">
                    {menuItems.map((item) => (
                        <li key={item.id} className="menu-item">
                        <button
                            className={`menu-link ${activeItem === item.id ? 'active' : ''}`}
                            onClick={() => handleItemClick(item)}
                            title={isCollapsed ? item.label : ''}
                        >
                                <span className="menu-icon">{item.icon}</span>
                                {!isCollapsed && <span className="menu-label">{item.label}</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Sidebar Footer - Logout Only */}
            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Profile Modal - Removed from sidebar */}
            {/* Profile Modal - Removed from sidebar */}
        </div>
    );
};

const Sidebar = forwardRef(SidebarComponent);

export default Sidebar;
