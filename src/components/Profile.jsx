import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Profile = ({ userType = 'student' }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: '',
        profileImage: null
    });

    // Load profile data on component mount
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                const profileData = JSON.parse(savedProfile);
                setProfile({
                    name: profileData.name || '',
                    profileImage: profileData.profileImage || null
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    // Compact profile button styles
    const profileButtonStyle = {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '60px'
    };

    const profileImageStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#f8f9fa',
        border: '2px solid #007BFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: '#007BFF',
        backgroundImage: profile.profileImage ? `url(${profile.profileImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    };

    const nameStyle = {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#2c3e50',
        margin: 0
    };

    return (
        <div style={profileButtonStyle} onClick={handleProfileClick}>
            <div style={profileImageStyle}>
                {!profile.profileImage && '👤'}
            </div>
            {profile.name && (
                <p style={nameStyle}>{profile.name}</p>
            )}
        </div>
    );
};

export default Profile;
