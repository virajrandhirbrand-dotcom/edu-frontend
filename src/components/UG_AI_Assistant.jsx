import React, { useState } from 'react';
import api from '../api';
import './UG_AI_Assistant.css';

const UG_AI_Assistant = () => {
    const userType = 'ug';
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('career');

    // Student-focused quick questions organized by category
    const getQuickQuestionsByCategory = () => {
        return {
            career: [
                "How can I prepare for internships?",
                "What skills employers want?",
                "How do I write a resume?",
                "Campus placement tips?",
                "Best career paths for my field?"
            ],
            academics: [
                "How to ace my exams?",
                "Best study techniques?",
                "How to manage assignments?",
                "Tips for better grades?",
                "How to understand complex topics?"
            ],
            projects: [
                "How to start a project?",
                "Best project ideas?",
                "How to build a portfolio?",
                "Tips for project presentation?",
                "How to showcase my work?"
            ],
            interviews: [
                "How to prepare for interviews?",
                "What to expect in technical interviews?",
                "How to answer common questions?",
                "How to ask good questions?",
                "Tips to overcome nervousness?"
            ],
            skills: [
                "Which programming languages to learn?",
                "Best online courses?",
                "How to practice coding?",
                "What certifications are valuable?",
                "How to stay updated with tech?"
            ]
        };
    };

    const categories = [
        { key: 'career', label: 'Career', icon: '💼' },
        { key: 'academics', label: 'Academics', icon: '📚' },
        { key: 'projects', label: 'Projects', icon: '💻' },
        { key: 'interviews', label: 'Interviews', icon: '🎤' },
        { key: 'skills', label: 'Skills', icon: '🎯' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        try {
            const res = await api.post('/ai-assistant/ask', {
                question: question,
                userType: 'ug'
            });

            const newChat = {
                question: question,
                answer: res.data.answer,
                timestamp: new Date().toLocaleTimeString()
            };

            setChatHistory(prev => [...prev, newChat].slice(-10));
            setAnswer(res.data.answer);
            setQuestion('');
        } catch (err) {
            console.error("Failed to get answer", err);
            setAnswer("Sorry, I'm having trouble connecting. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleQuickQuestion = (quickQuestion) => {
        setQuestion(quickQuestion);
    };

    const quickQuestions = getQuickQuestionsByCategory()[selectedCategory];

    return (
        <div className="ug-ai-assistant">
            <div className="section-header">
                <h1 className="section-title">AI Career Assistant</h1>
                <p className="section-subtitle">Get personalized guidance on career, academics, and skills</p>
            </div>

            {/* Category Selector */}
            <div className="category-selector">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        className={`category-btn ${selectedCategory === cat.key ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.key)}
                    >
                        <span className="category-icon">{cat.icon}</span>
                        <span className="category-label">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="assistant-container">
                {/* Left Side - Chat History */}
                <div className="chat-section">
                    <h3>Chat History</h3>
                    {chatHistory.length === 0 ? (
                        <div className="empty-chat">
                            <p>No questions yet. Ask something to get started!</p>
                        </div>
                    ) : (
                        <div className="chat-history">
                            {chatHistory.map((chat, idx) => (
                                <div key={idx} className="chat-item">
                                    <div className="chat-question">
                                        <span className="q-icon">Q:</span>
                                        <p>{chat.question}</p>
                                    </div>
                                    <div className="chat-answer">
                                        <span className="a-icon">A:</span>
                                        <p>{chat.answer.substring(0, 150)}...</p>
                                    </div>
                                    <div className="chat-time">{chat.timestamp}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side - Ask Questions */}
                <div className="ask-section">
                    {/* Quick Questions */}
                    <div className="quick-questions-box">
                        <h3>Quick Questions</h3>
                        <div className="quick-questions-grid">
                            {quickQuestions.map((q, idx) => (
                                <button
                                    key={idx}
                                    className="quick-question-btn"
                                    onClick={() => handleQuickQuestion(q)}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ask Question Form */}
                    <div className="ask-form-box">
                        <h3>Ask Your Question</h3>
                        <form onSubmit={handleSubmit} className="ask-form">
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Type your question here..."
                                className="question-input"
                                rows="4"
                            />
                            <button
                                type="submit"
                                disabled={loading || !question.trim()}
                                className="submit-btn"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Getting Answer...
                                    </>
                                ) : (
                                    'Get Answer'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Response Box */}
                    {answer && (
                        <div className="response-box">
                            <h3>Response</h3>
                            <div className="response-content">
                                {answer}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UG_AI_Assistant;
