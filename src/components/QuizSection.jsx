import React, { useState, useEffect } from 'react';
import api from '../api';

const QuizSection = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [quizLoading, setQuizLoading] = useState(false);
    
    // AI Quiz Generator states
    const [showGenerator, setShowGenerator] = useState(false);
    const [generatorForm, setGeneratorForm] = useState({
        standard: '',
        subject: '',
        topic: '',
        difficulty: 'medium',
        numQuestions: 5
    });
    const [generatedQuiz, setGeneratedQuiz] = useState(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await api.get('/quizzes');
                setQuizzes(res.data);
            } catch (err) {
                console.error("Failed to fetch quizzes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    const startQuiz = (quiz) => {
        setSelectedQuiz(quiz);
        setCurrentQuestion(0);
        setAnswers({});
        setScore(null);
    };

    const submitAnswer = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const nextQuestion = () => {
        if (currentQuestion < selectedQuiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            submitQuiz();
        }
    };

    const submitQuiz = async () => {
        setQuizLoading(true);
        try {
            // For AI-generated quizzes, send the quiz data directly
            // For database quizzes, send the quiz ID
            const payload = selectedQuiz._id && !selectedQuiz.questions ? 
                { quizId: selectedQuiz._id, answers } : 
                { quizData: selectedQuiz, answers };
                
            const res = await api.post('/quizzes/submit', payload);
            setScore(res.data);
        } catch (err) {
            console.error("Failed to submit quiz", err);
            alert('Failed to submit quiz. Please try again.');
        } finally {
            setQuizLoading(false);
        }
    };

    const resetQuiz = () => {
        setSelectedQuiz(null);
        setCurrentQuestion(0);
        setAnswers({});
        setScore(null);
    };

    // AI Quiz Generator functions
    const handleGeneratorInput = (e) => {
        const { name, value } = e.target;
        setGeneratorForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generateQuiz = async () => {
        if (!generatorForm.standard || !generatorForm.subject || !generatorForm.topic) {
            alert('Please fill in all required fields');
            return;
        }

        setGenerating(true);
        try {
            console.log('Sending quiz generation request:', {
                standard: generatorForm.standard,
                subject: generatorForm.subject,
                topic: generatorForm.topic,
                difficulty: generatorForm.difficulty,
                numQuestions: generatorForm.numQuestions
            });
            
            const res = await api.post('/ai-quiz/generate-quiz', {
                standard: generatorForm.standard,
                subject: generatorForm.subject,
                topic: generatorForm.topic,
                difficulty: generatorForm.difficulty,
                numQuestions: generatorForm.numQuestions
            });
            
            console.log('Quiz generation response:', res.data);
            setGeneratedQuiz(res.data);
            setShowGenerator(false);
        } catch (err) {
            console.error('Failed to generate quiz:', err);
            console.error('Error details:', err.response?.data);
            alert(`Failed to generate quiz: ${err.response?.data?.error || err.message}. Please try again.`);
        } finally {
            setGenerating(false);
        }
    };


    const startGeneratedQuiz = () => {
        if (generatedQuiz) {
            setSelectedQuiz(generatedQuiz);
            setCurrentQuestion(0);
            setAnswers({});
            setScore(null);
        }
    };

    // Get topic suggestions based on subject
    const getTopicSuggestions = (subject) => {
        const suggestions = {
            'Mathematics': ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Decimals', 'Geometry', 'Algebra', 'Trigonometry', 'Statistics'],
            'Science': ['Plants', 'Animals', 'Human Body', 'Solar System', 'Weather', 'Matter', 'Energy', 'Force', 'Light', 'Sound'],
            'English': ['Grammar', 'Vocabulary', 'Reading Comprehension', 'Writing Skills', 'Poetry', 'Literature', 'Essay Writing', 'Letter Writing'],
            'Hindi': ['व्याकरण', 'शब्दावली', 'कहानी', 'कविता', 'निबंध', 'पत्र लेखन', 'वाक्य रचना'],
            'Social Studies': ['Indian History', 'World History', 'Geography', 'Civics', 'Economics', 'Culture', 'Traditions'],
            'History': ['Ancient India', 'Medieval India', 'Modern India', 'World Wars', 'Independence Movement', 'Freedom Fighters'],
            'Geography': ['Physical Geography', 'Human Geography', 'Climate', 'Natural Resources', 'Population', 'Agriculture'],
            'Physics': ['Motion', 'Force', 'Energy', 'Light', 'Sound', 'Electricity', 'Magnetism', 'Heat', 'Waves'],
            'Chemistry': ['Atoms', 'Molecules', 'Elements', 'Compounds', 'Acids', 'Bases', 'Salts', 'Chemical Reactions'],
            'Biology': ['Cell Structure', 'Human Body', 'Plants', 'Animals', 'Ecosystem', 'Evolution', 'Genetics', 'Reproduction'],
            'Computer Science': ['Programming', 'Data Structures', 'Algorithms', 'Database', 'Networking', 'Web Development', 'Software Engineering'],
            'General Knowledge': ['Current Affairs', 'Sports', 'Awards', 'Books', 'Movies', 'Technology', 'Space', 'Nature']
        };
        return suggestions[subject] || [];
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

    const quizGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem'
    };

    const quizCardStyle = {
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
    };

    const buttonStyle = {
        padding: '0.5rem 1rem',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'background-color 0.2s ease',
        margin: '0.25rem'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.5rem 0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '0.875rem',
        backgroundColor: '#fff'
    };

    const selectStyle = {
        width: '100%',
        padding: '0.5rem 0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '0.875rem',
        backgroundColor: '#fff'
    };

    if (loading) {
        return (
            <div style={cardStyle}>
                <div style={titleStyle}>
                    <span></span>
                    Quiz Section
                </div>
                <p>Loading quizzes...</p>
            </div>
        );
    }

    if (selectedQuiz && !score) {
        const question = selectedQuiz.questions[currentQuestion];
        return (
            <div style={cardStyle}>
                <div style={titleStyle}>
                    <span></span>
                    {selectedQuiz.title}
                </div>
                
                <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    Question {currentQuestion + 1} of {selectedQuiz.questions.length}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>
                        {question.question}
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {question.options.map((option, index) => (
                            <label 
                                key={index}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '0.5rem',
                                    padding: '0.5rem',
                                    backgroundColor: answers[question._id || question.question] === option ? '#dbeafe' : '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                <input
                                    type="radio"
                                    name={`question_${question._id || question.question}`}
                                    value={option}
                                    checked={answers[question._id || question.question] === option}
                                    onChange={() => submitAnswer(question._id || question.question, option)}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={nextQuestion}
                        style={buttonStyle}
                        disabled={!answers[question._id || question.question]}
                    >
                        {currentQuestion === selectedQuiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                    </button>
                    <button 
                        onClick={resetQuiz}
                        style={{ ...buttonStyle, backgroundColor: '#6b7280' }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    if (score) {
        return (
            <div style={cardStyle}>
                <div style={titleStyle}>
                    <span></span>
                    Quiz Results
                </div>
                
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: score.score >= 70 ? '#10b981' : '#ef4444' }}>
                        Score: {score.score}%
                    </h3>
                    <p style={{ color: '#6b7280' }}>
                        {score.score >= 70 ? 'Congratulations! You passed!' : 'Keep studying and try again!'}
                    </p>
                </div>

                <button 
                    onClick={resetQuiz}
                    style={buttonStyle}
                >
                    Take Another Quiz
                </button>
            </div>
        );
    }

    return (
        <div style={cardStyle}>
            <div style={titleStyle}>
                <span></span>
                Quiz Section
            </div>

            {/* AI Quiz Generator */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: '0', color: '#1f2937', fontSize: '1.1rem' }}>
                        AI-Powered Quiz Generator
                    </h3>
                    <button 
                        onClick={() => setShowGenerator(!showGenerator)}
                        style={{
                            ...buttonStyle,
                            backgroundColor: showGenerator ? '#6b7280' : '#10b981',
                            fontSize: '0.875rem',
                            padding: '0.5rem 1rem'
                        }}
                    >
                        {showGenerator ? 'Hide Generator' : 'Generate Quiz'}
                    </button>
                </div>

                {showGenerator && (
                    <div style={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        marginBottom: '1rem'
                    }}>
                        {generatorForm.subject && (
                            <div style={{
                                backgroundColor: '#dbeafe',
                                border: '1px solid #3b82f6',
                                borderRadius: '6px',
                                padding: '0.75rem',
                                marginBottom: '1rem',
                                textAlign: 'center'
                            }}>
                                <span style={{ color: '#1e40af', fontWeight: '500' }}>
                                    Selected: {generatorForm.subject} for Class {generatorForm.standard}
                                </span>
                            </div>
                        )}
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                                    Standard *
                                </label>
                                <select
                                    name="standard"
                                    value={generatorForm.standard}
                                    onChange={handleGeneratorInput}
                                    style={selectStyle}
                                >
                                    <option value="">Select Standard</option>
                                    <option value="1">Class 1</option>
                                    <option value="2">Class 2</option>
                                    <option value="3">Class 3</option>
                                    <option value="4">Class 4</option>
                                    <option value="5">Class 5</option>
                                    <option value="6">Class 6</option>
                                    <option value="7">Class 7</option>
                                    <option value="8">Class 8</option>
                                    <option value="9">Class 9</option>
                                    <option value="10">Class 10</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                                    Subject *
                                </label>
                                <select
                                    name="subject"
                                    value={generatorForm.subject}
                                    onChange={handleGeneratorInput}
                                    style={selectStyle}
                                >
                                    <option value="">Select Subject</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Science">Science</option>
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Social Studies">Social Studies</option>
                                    <option value="History">History</option>
                                    <option value="Geography">Geography</option>
                                    <option value="Civics">Civics</option>
                                    <option value="Physics">Physics</option>
                                    <option value="Chemistry">Chemistry</option>
                                    <option value="Biology">Biology</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Economics">Economics</option>
                                    <option value="Business Studies">Business Studies</option>
                                    <option value="Accountancy">Accountancy</option>
                                    <option value="Art">Art</option>
                                    <option value="Music">Music</option>
                                    <option value="Physical Education">Physical Education</option>
                                    <option value="Environmental Studies">Environmental Studies</option>
                                    <option value="General Knowledge">General Knowledge</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                                    Topic *
                                </label>
                                <input
                                    type="text"
                                    name="topic"
                                    value={generatorForm.topic}
                                    onChange={handleGeneratorInput}
                                    placeholder="e.g., Addition, Photosynthesis"
                                    style={inputStyle}
                                />
                                {generatorForm.subject && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                            Suggested topics for {generatorForm.subject}:
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                            {getTopicSuggestions(generatorForm.subject).slice(0, 6).map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => setGeneratorForm(prev => ({ ...prev, topic: suggestion }))}
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        backgroundColor: '#f3f4f6',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '4px',
                                                        fontSize: '0.75rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#e5e7eb';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = '#f3f4f6';
                                                    }}
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                                    Difficulty
                                </label>
                                <select
                                    name="difficulty"
                                    value={generatorForm.difficulty}
                                    onChange={handleGeneratorInput}
                                    style={selectStyle}
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                                    Number of Questions
                                </label>
                                <select
                                    name="numQuestions"
                                    value={generatorForm.numQuestions}
                                    onChange={handleGeneratorInput}
                                    style={selectStyle}
                                >
                                    <option value={3}>3 Questions</option>
                                    <option value={5}>5 Questions</option>
                                    <option value={10}>10 Questions</option>
                                    <option value={15}>15 Questions</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button 
                                onClick={generateQuiz}
                                disabled={generating}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: generating ? '#9ca3af' : '#3b82f6',
                                    cursor: generating ? 'not-allowed' : 'pointer',
                                    fontSize: '1rem',
                                    padding: '0.75rem 1.5rem'
                                }}
                            >
                                {generating ? 'Generating AI Quiz...' : 'Generate AI Quiz'}
                            </button>
                            <button 
                                onClick={() => setShowGenerator(false)}
                                style={{ 
                                    ...buttonStyle, 
                                    backgroundColor: '#6b7280',
                                    fontSize: '1rem',
                                    padding: '0.75rem 1.5rem'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {generatedQuiz && (
                    <div style={{
                        backgroundColor: '#dbeafe',
                        border: '1px solid #3b82f6',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>
                            AI Quiz Generated Successfully!
                        </h4>
                        <p style={{ margin: '0 0 1rem 0', color: '#1e40af', fontSize: '0.875rem' }}>
                            {generatedQuiz.title} - {generatedQuiz.questions.length} questions
                        </p>
                        <button 
                            onClick={startGeneratedQuiz}
                            style={{ ...buttonStyle, backgroundColor: '#10b981' }}
                        >
                            Start Generated Quiz
                        </button>
                    </div>
                )}
            </div>

            <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

            <div style={quizGridStyle}>
                {quizzes.map(quiz => (
                    <div 
                        key={quiz._id} 
                        style={quizCardStyle}
                        onClick={() => startQuiz(quiz)}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                    >
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', fontSize: '1rem' }}>
                            {quiz.title}
                        </h4>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                            {quiz.description}
                        </p>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            Questions: {quiz.questions.length}
                        </div>
                    </div>
                ))}
            </div>

            {quizzes.length === 0 && (
                <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
                    No quizzes available at the moment.
                </p>
            )}
        </div>
    );
};

export default QuizSection;
