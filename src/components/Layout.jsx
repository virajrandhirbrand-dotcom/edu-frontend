import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

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

const Layout = ({ children }) => {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: 'John Doe',
        rollNumber: 'STU001',
        department: 'Computer Science',
        year: '3rd Year',
        college: 'ABC University',
        dateOfBirth: '2000-01-01',
        location: 'New York, USA',
        email: 'john.doe@email.com',
        phone: '+1 234-567-8900',
        profilePhoto: '👤'
    });

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
                    
                    setProfileData(prev => ({
                        ...prev,
                        fullName: fullName,
                        email: decoded.user.email || prev.email,
                    }));
                }
            }
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }, []);

    const handleProfileClick = () => {
        setShowProfileModal(true);
    };

    const handleProfileUpdate = (updatedData) => {
        setProfileData(updatedData);
        setShowProfileModal(false);
    };

    const handleCloseModal = () => {
        setShowProfileModal(false);
    };

    const profileButtonStyle = {
        backgroundColor: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        fontSize: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 100000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        transform: 'translate3d(0, 0, 0)',
        flexShrink: 0
    };

    const usernameStyle = {
        color: '#333',
        fontSize: '0.95rem',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '120px'
    };

    const topRightStyle = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'auto',
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
        cursor: 'pointer'
    };

    return (
        <div style={{ padding: '0' }}>
            {/* Profile Section - Fixed top right */}
            <div style={topRightStyle} onClick={handleProfileClick}>
                <button 
                    style={profileButtonStyle}
                    title="Profile"
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#764ba2';
                        e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#667eea';
                        e.target.style.transform = 'translate3d(0, 0, 0)';
                    }}
                >
                    {profileData.profilePhoto}
                </button>
                <div style={usernameStyle}>
                    {profileData.fullName}
                </div>
            </div>

            {/* Profile Modal */}
            {showProfileModal && (
                <ProfileModal 
                    profileData={profileData}
                    onUpdate={handleProfileUpdate}
                    onClose={handleCloseModal}
                />
            )}

            <main style={{ marginTop: '40px' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;