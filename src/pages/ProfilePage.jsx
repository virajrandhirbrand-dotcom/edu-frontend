import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        studentId: '',
        course: '',
        year: '',
        semester: '',
        department: '',
        phone: '',
        address: '',
        skills: [],
        interests: [],
        achievements: [],
        profileImage: null
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Load profile data on component mount
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
            } else {
                setProfile({
                    name: '',
                    email: '',
                    studentId: '',
                    course: '',
                    year: '',
                    semester: '',
                    department: '',
                    phone: '',
                    address: '',
                    skills: [],
                    interests: [],
                    achievements: [],
                    profileImage: null
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleArrayChange = (field, value) => {
        const array = value.split(',').map(item => item.trim()).filter(item => item);
        setProfile(prev => ({
            ...prev,
            [field]: array
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            localStorage.setItem('userProfile', JSON.stringify(profile));
            setMessage('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage('Error updating profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        loadProfile();
        setIsEditing(false);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfile(prev => ({
                    ...prev,
                    profileImage: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('token');
        alert('Logged out successfully!');
        navigate('/');
    };

    const pageStyle = {
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '20px'
    };

    const containerStyle = {
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '30px'
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #eee'
    };

    const profileImageStyle = {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: '#f8f9fa',
        border: '3px solid #007BFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        color: '#007BFF',
        backgroundImage: profile.profileImage ? `url(${profile.profileImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        margin: '0 auto 20px'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        marginBottom: '15px'
    };

    const buttonStyle = {
        padding: '10px 20px',
        margin: '5px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px'
    };

    const primaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#007BFF',
        color: 'white'
    };

    const secondaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#6c757d',
        color: 'white'
    };

    const logoutButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#dc3545',
        color: 'white'
    };

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={{ margin: 0, color: '#2c3e50' }}>👤 Profile</h1>
                    <button 
                        onClick={() => navigate(-1)}
                        style={secondaryButtonStyle}
                    >
                        ← Back
                    </button>
                </div>

                {message && (
                    <div style={{ 
                        padding: '12px', 
                        backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
                        color: message.includes('successfully') ? '#155724' : '#721c24',
                        borderRadius: '6px',
                        marginBottom: '20px',
                        border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
                    }}>
                        {message}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={profileImageStyle}>
                        {!profile.profileImage && '👤'}
                    </div>
                    {isEditing && (
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ fontSize: '14px' }}
                            />
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{ fontWeight: 'bold', color: '#2c3e50', display: 'block', marginBottom: '5px' }}>
                            Full Name:
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter your name"
                                style={inputStyle}
                            />
                        ) : (
                            <p style={{ margin: '0 0 15px 0', fontSize: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                                {profile.name || 'Not provided'}
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', color: '#2c3e50', display: 'block', marginBottom: '5px' }}>
                            Email:
                        </label>
                        {isEditing ? (
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter your email"
                                style={inputStyle}
                            />
                        ) : (
                            <p style={{ margin: '0 0 15px 0', fontSize: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                                {profile.email || 'Not provided'}
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', color: '#2c3e50', display: 'block', marginBottom: '5px' }}>
                            Student ID:
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={profile.studentId}
                                onChange={(e) => handleInputChange('studentId', e.target.value)}
                                placeholder="Enter student ID"
                                style={inputStyle}
                            />
                        ) : (
                            <p style={{ margin: '0 0 15px 0', fontSize: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                                {profile.studentId || 'Not provided'}
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', color: '#2c3e50', display: 'block', marginBottom: '5px' }}>
                            Course:
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={profile.course}
                                onChange={(e) => handleInputChange('course', e.target.value)}
                                placeholder="Enter your course"
                                style={inputStyle}
                            />
                        ) : (
                            <p style={{ margin: '0 0 15px 0', fontSize: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                                {profile.course || 'Not provided'}
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', color: '#2c3e50', display: 'block', marginBottom: '5px' }}>
                            Year:
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={profile.year}
                                onChange={(e) => handleInputChange('year', e.target.value)}
                                placeholder="Enter your year"
                                style={inputStyle}
                            />
                        ) : (
                            <p style={{ margin: '0 0 15px 0', fontSize: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                                {profile.year || 'Not provided'}
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', color: '#2c3e50', display: 'block', marginBottom: '5px' }}>
                            Semester:
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={profile.semester}
                                onChange={(e) => handleInputChange('semester', e.target.value)}
                                placeholder="Enter your semester"
                                style={inputStyle}
                            />
                        ) : (
                            <p style={{ margin: '0 0 15px 0', fontSize: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                                {profile.semester || 'Not provided'}
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', color: '#2c3e50', display: 'block', marginBottom: '5px' }}>
                            Department:
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={profile.department}
                                onChange={(e) => handleInputChange('department', e.target.value)}
                                placeholder="Enter your department"
                                style={inputStyle}
                            />
                        ) : (
                            <p style={{ margin: '0 0 15px 0', fontSize: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                                {profile.department || 'Not provided'}
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', color: '#2c3e50', display: 'block', marginBottom: '5px' }}>
                            Phone:
                        </label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="Enter your phone"
                                style={inputStyle}
                            />
                        ) : (
                            <p style={{ margin: '0 0 15px 0', fontSize: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                                {profile.phone || 'Not provided'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Address */}
                <div style={{ marginTop: '20px' }}>
                    <label style={{ fontWeight: 'bold', color: '#2c3e50', display: 'block', marginBottom: '5px' }}>
                        Address:
                    </label>
                    {isEditing ? (
                        <textarea
                            value={profile.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Enter your address"
                            style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
                        />
                    ) : (
                        <p style={{ margin: '0 0 15px 0', fontSize: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                            {profile.address || 'Not provided'}
                        </p>
                    )}
                </div>

                {/* Skills */}
                <div style={{ marginTop: '20px' }}>
                    <label style={{ fontWeight: 'bold', color: '#2c3e50', display: 'block', marginBottom: '5px' }}>
                        Skills:
                    </label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={profile.skills.join(', ')}
                            onChange={(e) => handleArrayChange('skills', e.target.value)}
                            placeholder="Enter skills separated by commas"
                            style={inputStyle}
                        />
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                            {profile.skills.length > 0 ? profile.skills.map((skill, index) => (
                                <span key={index} style={{
                                    backgroundColor: '#e3f2fd',
                                    color: '#1976d2',
                                    padding: '6px 12px',
                                    borderRadius: '16px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>
                                    {skill}
                                </span>
                            )) : <span style={{ fontSize: '16px', color: '#666', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px', display: 'block' }}>No skills added</span>}
                        </div>
                    )}
                </div>

                {/* Interests */}
                <div style={{ marginTop: '20px' }}>
                    <label style={{ fontWeight: 'bold', color: '#2c3e50', display: 'block', marginBottom: '5px' }}>
                        Interests:
                    </label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={profile.interests.join(', ')}
                            onChange={(e) => handleArrayChange('interests', e.target.value)}
                            placeholder="Enter interests separated by commas"
                            style={inputStyle}
                        />
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                            {profile.interests.length > 0 ? profile.interests.map((interest, index) => (
                                <span key={index} style={{
                                    backgroundColor: '#f3e5f5',
                                    color: '#7b1fa2',
                                    padding: '6px 12px',
                                    borderRadius: '16px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>
                                    {interest}
                                </span>
                            )) : <span style={{ fontSize: '16px', color: '#666', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px', display: 'block' }}>No interests added</span>}
                        </div>
                    )}
                </div>

                {/* Achievements */}
                <div style={{ marginTop: '20px' }}>
                    <label style={{ fontWeight: 'bold', color: '#2c3e50', display: 'block', marginBottom: '5px' }}>
                        Achievements:
                    </label>
                    {isEditing ? (
                        <textarea
                            value={profile.achievements.join(', ')}
                            onChange={(e) => handleArrayChange('achievements', e.target.value)}
                            placeholder="Enter achievements separated by commas"
                            style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
                        />
                    ) : (
                        <div style={{ marginBottom: '15px' }}>
                            {profile.achievements.length > 0 ? (
                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                    {profile.achievements.map((achievement, index) => (
                                        <li key={index} style={{ marginBottom: '8px', fontSize: '16px' }}>
                                            🏆 {achievement}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span style={{ fontSize: '16px', color: '#666', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px', display: 'block' }}>No achievements added</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    {isEditing ? (
                        <div>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                style={secondaryButtonStyle}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                style={primaryButtonStyle}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button
                                onClick={() => setIsEditing(true)}
                                style={primaryButtonStyle}
                            >
                                ✏️ Edit Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                style={logoutButtonStyle}
                            >
                                🚪 Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

