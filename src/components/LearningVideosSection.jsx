import React, { useState, useEffect } from 'react';
import api from '../api';

const LearningVideosSection = () => {
    const [trendingVideos, setTrendingVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        const fetchTrendingVideos = async () => {
            try {
                const res = await api.post('/youtube/trending', { category: 'education' });
                setTrendingVideos(res.data.videos || []);
            } catch (err) {
                console.warn('Failed to fetch trending videos (likely quota exceeded):', err);
                setTrendingVideos([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTrendingVideos();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearchLoading(true);
        try {
            const res = await api.post('/youtube/search', { query: searchQuery });
            setSearchResults(res.data.videos || []);
        } catch (err) {
            console.error('Search failed:', err);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

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

    const searchStyle = {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
    };

    const inputStyle = {
        flex: '1',
        minWidth: '200px',
        padding: '0.5rem 0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '0.875rem'
    };

    const buttonStyle = {
        padding: '0.5rem 1rem',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'background-color 0.2s ease'
    };

    const videoGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem'
    };

    const videoCardStyle = {
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
    };

    const videosToShow = searchResults.length > 0 ? searchResults : trendingVideos;

    if (loading) {
        return (
            <div style={cardStyle}>
                <div style={titleStyle}>
                    <span></span>
                    Learning & Videos
                </div>
                <p>Loading educational videos...</p>
            </div>
        );
    }

    return (
        <div style={cardStyle}>
            <div style={titleStyle}>
                <span></span>
                Learning & Videos
            </div>

            <form onSubmit={handleSearch} style={searchStyle}>
                <input
                    type="text"
                    placeholder="Search for educational videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={inputStyle}
                />
                <button 
                    type="submit" 
                    style={buttonStyle}
                    disabled={searchLoading}
                >
                    {searchLoading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {searchResults.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                    <button 
                        onClick={() => setSearchResults([])}
                        style={{ ...buttonStyle, backgroundColor: '#6b7280' }}
                    >
                        Show Trending Videos
                    </button>
                </div>
            )}

            <div style={videoGridStyle}>
                {videosToShow.map((video, index) => (
                    <div 
                        key={video.id || index} 
                        style={videoCardStyle}
                        onClick={() => window.open(video.url, '_blank')}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.25rem' }}>🎥</span>
                            <h4 style={{ margin: '0', color: '#1f2937', fontSize: '1rem' }}>
                                {video.title}
                            </h4>
                        </div>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                            {video.channelTitle}
                        </p>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            Views: {video.viewCount ? parseInt(video.viewCount).toLocaleString() : 'N/A'}
                        </div>
                    </div>
                ))}
            </div>

            {videosToShow.length === 0 && (
                <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
                    No videos available. This might be due to API quota limits.
                </p>
            )}
        </div>
    );
};

export default LearningVideosSection;



