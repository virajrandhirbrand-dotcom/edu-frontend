import React from 'react';
import VoiceInterview from './VoiceInterview';

const VoiceInterviewSection = () => {
    const cardStyle = {
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const titleStyle = {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    };

    return (
        <div style={cardStyle}>
            <div style={titleStyle}>
                <span></span>
                Voice Interview Practice
            </div>
            <VoiceInterview />
        </div>
    );
};

export default VoiceInterviewSection;


