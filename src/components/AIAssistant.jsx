import React, { useState } from 'react';
import api from '../api';

const AIAssistant = ({ userType = 'student', variant = 'card' }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [isExpanded, setIsExpanded] = useState(variant === 'floating' ? false : false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        const currentQuestion = question.trim();
        
        try {
            const response = await api.post('/ai-assistant/ask', {
                question: currentQuestion,
                userType: userType
            });

            const newChat = {
                question: currentQuestion,
                answer: response.data.answer,
                timestamp: new Date().toLocaleTimeString(),
                isFallback: response.data.isFallback
            };

            setChatHistory(prev => [...prev, newChat]);
            setAnswer(response.data.answer);
            setQuestion('');
        } catch (error) {
            console.error('AI Assistant Error:', error);
            const errorChat = {
                question: currentQuestion,
                answer: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toLocaleTimeString(),
                isError: true
            };
            setChatHistory(prev => [...prev, errorChat]);
            setAnswer('Sorry, I encountered an error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setChatHistory([]);
        setAnswer('');
    };

    const getAssistantTitle = () => {
        switch (userType) {
            case 'ug': return 'UG Academic Assistant';
            case 'pg': return 'PG Research Assistant';
            case 'student': return 'Student Assistant';
            default: return 'AI Assistant';
        }
    };

    const getPlaceholder = () => {
        switch (userType) {
            case 'ug': return 'Ask me about courses, study tips, career guidance, internships...';
            case 'pg': return 'Ask me about research, thesis, academic writing, career opportunities...';
            case 'student': return 'Ask me anything about academics, career, technology, or general questions...';
            default: return 'Ask me any question...';
        }
    };

    const containerStyle = variant === 'floating' ? assistantFloatingContainerStyle : assistantContainerStyle;

    return (
        <div style={containerStyle}>
            <div style={headerStyle} onClick={() => setIsExpanded(!isExpanded)}>
                <h4 style={{ margin: 0, color: '#2c3e50' }}>{getAssistantTitle()}</h4>
                <span style={toggleStyle}>{isExpanded ? '−' : '+'}</span>
            </div>

            {isExpanded && (
                <div style={contentStyle}>
                    <p style={descriptionStyle}>
                        Ask me any questions about academics, career guidance, study tips, or anything else you need help with!
                    </p>

                    {/* Chat History */}
                    {chatHistory.length > 0 && (
                        <div style={chatHistoryStyle}>
                            <div style={chatHeaderStyle}>
                                <h5 style={{ margin: 0 }}>💬 Conversation History</h5>
                                <button onClick={clearChat} style={clearButtonStyle}>
                                    Clear Chat
                                </button>
                            </div>
                            <div style={chatMessagesStyle}>
                                {chatHistory.map((chat, index) => (
                                    <div key={index} style={chatItemStyle}>
                                        <div style={questionBubbleStyle}>
                                            <strong>You:</strong> {chat.question}
                                            <span style={timestampStyle}>{chat.timestamp}</span>
                                        </div>
                                        <div style={answerBubbleStyle}>
                                            <strong>AI:</strong> {chat.answer}
                                            {chat.isFallback && (
                                                <span style={fallbackStyle}> (General Response)</span>
                                            )}
                                            {chat.isError && (
                                                <span style={errorStyle}> (Error occurred)</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Question Input */}
                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={inputContainerStyle}>
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder={getPlaceholder()}
                                style={textareaStyle}
                                rows="3"
                                disabled={loading}
                            />
                            <button 
                                type="submit" 
                                disabled={loading || !question.trim()}
                                style={submitButtonStyle}
                            >
                                {loading ? '🤔 Thinking...' : '🚀 Ask'}
                            </button>
                        </div>
                    </form>

                    {/* Quick Questions */}
                    <div style={quickQuestionsStyle}>
                        <h5 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>💡 Quick Questions:</h5>
                        <div style={quickButtonsStyle}>
                            {getQuickQuestions(userType).map((q, index) => (
                                <button
                                    key={index}
                                    onClick={() => setQuestion(q)}
                                    style={quickButtonStyle}
                                    disabled={loading}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Current Answer Display */}
                    {answer && (
                        <div style={answerContainerStyle}>
                            <h5 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>AI Response:</h5>
                            <div style={answerTextStyle}>
                                {answer}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Quick questions based on user type
const getQuickQuestions = (userType) => {
    const commonQuestions = [
        "How can I improve my study habits?",
        "What are the best career opportunities in my field?",
        "How do I prepare for interviews?"
    ];

    const userTypeQuestions = {
        'ug': [
            "What courses should I take next semester?",
            "How can I get an internship?",
            "What skills should I develop for my career?",
            "How do I balance academics and extracurriculars?"
        ],
        'pg': [
            "How do I choose a research topic?",
            "What's the best way to write a thesis?",
            "How can I get published in academic journals?",
            "What are the career options after my degree?"
        ],
        'student': [
            "What programming languages should I learn?",
            "How do I build a strong portfolio?",
            "What are the latest trends in technology?",
            "How can I network with professionals?"
        ]
    };

    return [...commonQuestions, ...(userTypeQuestions[userType] || [])];
};

// Styles
const assistantContainerStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    overflow: 'hidden'
};

// Floating variant styles
const assistantFloatingContainerStyle = {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    width: '360px',
    maxWidth: '90vw',
    zIndex: 1000,
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
    overflow: 'hidden'
};

const headerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '15px 20px',
    borderBottom: '1px solid #e0e0e0',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background-color 0.2s'
};

const toggleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#6c757d'
};

const contentStyle = {
    padding: '20px'
};

const descriptionStyle = {
    color: '#6c757d',
    marginBottom: '20px',
    fontSize: '14px',
    lineHeight: '1.5'
};

const chatHistoryStyle = {
    marginBottom: '20px',
    maxHeight: '300px',
    overflowY: 'auto',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa'
};

const chatHeaderStyle = {
    padding: '10px 15px',
    backgroundColor: '#e9ecef',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const clearButtonStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer'
};

const chatMessagesStyle = {
    padding: '10px'
};

const chatItemStyle = {
    marginBottom: '15px'
};

const questionBubbleStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px',
    borderRadius: '8px 8px 8px 0',
    marginBottom: '5px',
    position: 'relative'
};

const answerBubbleStyle = {
    backgroundColor: '#e9ecef',
    color: '#2c3e50',
    padding: '10px',
    borderRadius: '8px 8px 0 8px',
    position: 'relative'
};

const timestampStyle = {
    fontSize: '10px',
    opacity: '0.8',
    float: 'right',
    marginLeft: '10px'
};

const fallbackStyle = {
    fontSize: '10px',
    color: '#6c757d',
    fontStyle: 'italic'
};

const errorStyle = {
    fontSize: '10px',
    color: '#dc3545',
    fontStyle: 'italic'
};

const formStyle = {
    marginBottom: '20px'
};

const inputContainerStyle = {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end'
};

const textareaStyle = {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '60px'
};

const submitButtonStyle = {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    height: 'fit-content'
};

const quickQuestionsStyle = {
    marginBottom: '20px'
};

const quickButtonsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
};

const quickButtonStyle = {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
};

const answerContainerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
};

const answerTextStyle = {
    color: '#2c3e50',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap'
};

export default AIAssistant;


