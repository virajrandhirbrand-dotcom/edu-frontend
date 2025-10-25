import React, { useState } from 'react';
import api from '../api';

const PlagiarismAnalyzer = () => {
    const [activeTab, setActiveTab] = useState('text'); // 'text' or 'file'
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);

    const handleTextSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) {
            setError('Please enter some text to analyze');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);
        setProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress(prev => Math.min(prev + 10, 90));
        }, 1000);

        try {
            const response = await api.post('/plagiarism/analyze-text', {
                text: text
            });
            setProgress(100);
            setResult(response.data.result);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.msg || 'Analysis failed. Please try again.');
        } finally {
            clearInterval(progressInterval);
            setLoading(false);
            setProgress(0);
        }
    };

    const handleFileSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to analyze');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);
        setProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress(prev => Math.min(prev + 10, 90));
        }, 1000);

        try {
            const formData = new FormData();
            formData.append('document', file);
            formData.append('description', 'Document analysis');

            const response = await api.post('/plagiarism/analyze-document', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProgress(100);
            setResult(response.data.result);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.msg || 'Analysis failed. Please try again.');
        } finally {
            clearInterval(progressInterval);
            setLoading(false);
            setProgress(0);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
                setError('File size must be less than 10MB');
                return;
            }
            setFile(selectedFile);
            setError('');
        }
    };

    const resetForm = () => {
        setText('');
        setFile(null);
        setResult(null);
        setError('');
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981'; // Green
        if (score >= 60) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Poor';
    };

    // Theme styles
    const theme = {
        light: {
            container: { padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' },
            header: { color: '#1f2937', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' },
            tabButton: (active) => ({
                padding: '0.75rem 1rem',
                border: 'none',
                backgroundColor: active ? '#3b82f6' : 'transparent',
                color: active ? 'white' : '#6b7280',
                cursor: 'pointer',
                borderRadius: '6px 6px 0 0',
                fontWeight: '500'
            }),
            input: {
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: '#ffffff',
                color: '#374151'
            },
            button: (disabled) => ({
                padding: '0.75rem 1.5rem',
                backgroundColor: disabled ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontWeight: '500'
            }),
            card: {
                background: '#ffffff',
                padding: '1.25rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb'
            }
        },
        dark: {
            container: { padding: '1.5rem', backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151' },
            header: { color: '#f9fafb', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' },
            tabButton: (active) => ({
                padding: '0.75rem 1rem',
                border: 'none',
                backgroundColor: active ? '#3b82f6' : 'transparent',
                color: active ? 'white' : '#9ca3af',
                cursor: 'pointer',
                borderRadius: '6px 6px 0 0',
                fontWeight: '500'
            }),
            input: {
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #4b5563',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: '#374151',
                color: '#f9fafb'
            },
            button: (disabled) => ({
                padding: '0.75rem 1.5rem',
                backgroundColor: disabled ? '#6b7280' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontWeight: '500'
            }),
            card: {
                background: '#374151',
                padding: '1.25rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
                border: '1px solid #4b5563'
            }
        }
    };

    const currentTheme = theme.light;

    return (
        <div style={currentTheme.container}>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            
            {/* Header with Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={currentTheme.header}>
                    Plagiarism Analyzer
                </h2>
            </div>

            {/* Tab Navigation */}
            <div style={{ 
                display: 'flex', 
                marginBottom: '1.5rem', 
                borderBottom: '1px solid #e5e7eb' 
            }}>
                <button
                    onClick={() => setActiveTab('text')}
                    style={currentTheme.tabButton(activeTab === 'text')}
                >
                    Text Analysis
                </button>
                <button
                    onClick={() => setActiveTab('file')}
                    style={currentTheme.tabButton(activeTab === 'file')}
                >
                    File Analysis
                </button>
            </div>

            {/* Text Analysis Tab */}
            {activeTab === 'text' && (
                <form onSubmit={handleTextSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            fontWeight: '500', 
                            color: '#374151' 
                        }}>
                            Text to Analyze *
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste your text here for plagiarism analysis..."
                            rows={8}
                            style={{
                                ...currentTheme.input,
                                resize: 'vertical'
                            }}
                        />
                        <div style={{ 
                            fontSize: '0.75rem', 
                            color: '#6b7280', 
                            marginTop: '0.25rem' 
                        }}>
                            Character count: {text.length}/10,000
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            type="submit"
                            disabled={loading || !text.trim()}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: loading || !text.trim() ? '#9ca3af' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: loading || !text.trim() ? 'not-allowed' : 'pointer',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {loading && <div style={{ 
                                width: '16px', 
                                height: '16px', 
                                border: '2px solid transparent',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>}
                            {loading ? 'Analyzing... (This may take 10-30 seconds)' : 'Analyze Text'}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </form>
            )}

            {/* File Analysis Tab */}
            {activeTab === 'file' && (
                <form onSubmit={handleFileSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                            Upload Document *
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".txt,.pdf,.doc,.docx"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem'
                            }}
                        />
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                            Supported formats: TXT, PDF, DOC, DOCX (Max 10MB)
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            type="submit"
                            disabled={loading || !file}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: loading || !file ? '#9ca3af' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: loading || !file ? 'not-allowed' : 'pointer',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {loading && <div style={{ 
                                width: '16px', 
                                height: '16px', 
                                border: '2px solid transparent',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>}
                            {loading ? 'Analyzing... (This may take 10-30 seconds)' : 'Analyze Document'}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </form>
            )}

            {/* Progress Bar */}
            {loading && (
                <div style={{ marginTop: '1rem' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                    }}>
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                            Analyzing... {progress}%
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            Using fast AI model for quick results
                        </span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: '#3b82f6',
                            borderRadius: '4px',
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    color: '#dc2626',
                    fontSize: '0.875rem'
                }}>
                    {error}
                </div>
            )}

            {/* Results Display */}
            {result && (
                <div style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ color: '#1f2937', marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
                        Analysis Results
                    </h3>

                    {/* Overall Scores */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getScoreColor(result.analysis.originalityScore) }}>
                                {result.analysis.originalityScore}%
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Originality Score</div>
                            <div style={{ fontSize: '0.75rem', color: getScoreColor(result.analysis.originalityScore), fontWeight: '500' }}>
                                {getScoreLabel(result.analysis.originalityScore)}
                            </div>
                        </div>

                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getScoreColor(100 - result.analysis.plagiarismPercentage) }}>
                                {result.analysis.plagiarismPercentage}%
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Plagiarism Risk</div>
                            <div style={{ fontSize: '0.75rem', color: getScoreColor(100 - result.analysis.plagiarismPercentage), fontWeight: '500' }}>
                                {result.analysis.plagiarismPercentage < 20 ? 'Low' : result.analysis.plagiarismPercentage < 40 ? 'Medium' : 'High'}
                            </div>
                        </div>
                    </div>

                    {/* Flagged Sections */}
                    {result.analysis.flaggedSections && result.analysis.flaggedSections.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ color: '#1f2937', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>
                                Flagged Sections
                            </h4>
                            {result.analysis.flaggedSections.map((section, index) => {
                                const getSeverityColor = (severity) => {
                                    switch (severity?.toLowerCase()) {
                                        case 'high': return { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' };
                                        case 'medium': return { bg: '#fef3c7', border: '#fbbf24', text: '#92400e' };
                                        case 'low': return { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' };
                                        default: return { bg: '#fef3c7', border: '#fbbf24', text: '#92400e' };
                                    }
                                };
                                
                                const severityColors = getSeverityColor(section.severity);
                                
                                return (
                                    <div key={index} style={{
                                        padding: '0.75rem',
                                        backgroundColor: severityColors.bg,
                                        border: `1px solid ${severityColors.border}`,
                                        borderRadius: '6px',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <div style={{ fontSize: '0.875rem', color: severityColors.text, marginBottom: '0.25rem' }}>
                                            <strong>Text:</strong> {section.text}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: severityColors.text }}>
                                            <strong>Confidence:</strong> {Math.round(section.confidence * 100)}% | 
                                            <strong> Severity:</strong> <span style={{ 
                                                textTransform: 'uppercase', 
                                                fontWeight: 'bold',
                                                color: severityColors.text 
                                            }}>{section.severity || 'medium'}</span> | 
                                            <strong> Suggestion:</strong> {section.suggestion}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Recommendations */}
                    {result.analysis.recommendations && result.analysis.recommendations.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ color: '#1f2937', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>
                                Recommendations
                            </h4>
                            <ul style={{ paddingLeft: '1.5rem', margin: '0' }}>
                                {Array.isArray(result.analysis.recommendations) ? (
                                    result.analysis.recommendations.map((recommendation, index) => (
                                        <li key={index} style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem', listStyle: 'disc' }}>
                                            {typeof recommendation === 'string' ? recommendation : JSON.stringify(recommendation)}
                                        </li>
                                    ))
                                ) : (
                                    <li style={{ fontSize: '0.875rem', color: '#374151' }}>
                                        {JSON.stringify(result.analysis.recommendations)}
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Summary */}
                    {result.analysis.summary && (
                        <div>
                            <h4 style={{ color: '#1f2937', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>
                                Analysis Summary
                            </h4>
                            <div style={{
                                padding: '1rem',
                                backgroundColor: '#f8fafc',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                color: '#374151',
                                lineHeight: '1.5'
                            }}>
                                {typeof result.analysis.summary === 'string' ? (
                                    // If summary is a string, split by periods or newlines to create bullet points
                                    <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
                                        {result.analysis.summary
                                            .split(/[.\n]+/)
                                            .filter(point => point.trim().length > 0)
                                            .map((point, index) => (
                                                <li key={index} style={{ marginBottom: '0.5rem', listStyle: 'disc' }}>
                                                    {point.trim()}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                ) : (
                                    // If it's already an array or object, display as bullet points
                                    <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
                                        {Array.isArray(result.analysis.summary) ? (
                                            result.analysis.summary.map((point, index) => (
                                                <li key={index} style={{ marginBottom: '0.5rem', listStyle: 'disc' }}>
                                                    {typeof point === 'string' ? point : JSON.stringify(point)}
                                                </li>
                                            ))
                                        ) : (
                                            <li>{JSON.stringify(result.analysis.summary)}</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlagiarismAnalyzer;
