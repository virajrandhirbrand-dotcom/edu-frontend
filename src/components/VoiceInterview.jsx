import React, { useState, useRef, useEffect } from 'react';
import api from '../api';

const VoiceInterview = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isInterviewStarted, setIsInterviewStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [interviewComplete, setInterviewComplete] = useState(false);
    const [feedback, setFeedback] = useState('');
    
    const recognitionRef = useRef(null);
    const synthesisRef = useRef(null);

    // Initialize speech recognition and synthesis
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                handleVoiceAnswer(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        if ('speechSynthesis' in window) {
            synthesisRef.current = window.speechSynthesis;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (synthesisRef.current) {
                synthesisRef.current.cancel();
            }
        };
    }, []);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setResumeFile(file);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('resume', file);

            const response = await api.post('/ai/voice-interview/analyze-resume', formData);
            
            if (response.data.questions && response.data.questions.length > 0) {
                setQuestions(response.data.questions);
                setIsInterviewStarted(true);
                speakQuestion(response.data.questions[0]);
            } else {
                alert('Failed to generate interview questions from resume.');
            }
        } catch (error) {
            console.error('Error analyzing resume:', error);
            if (error.response?.status === 404) {
                alert('Voice interview service is not available. Please try again later.');
            } else if (error.response?.data?.error) {
                alert(`Error: ${error.response.data.error}`);
            } else {
                alert('Failed to analyze resume. The system will use default interview questions.');
                // Set fallback questions
                const fallbackQuestions = [
                    "Tell me about yourself and your background.",
                    "What are your key strengths and how do they relate to this role?",
                    "Describe a challenging project you worked on and how you overcame obstacles.",
                    "Where do you see yourself in 5 years?",
                    "What questions do you have for us about this position?"
                ];
                setQuestions(fallbackQuestions);
                setIsInterviewStarted(true);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const speakQuestion = (question) => {
        if (synthesisRef.current) {
            synthesisRef.current.cancel();
            
            // Get available voices and select a female voice
            const voices = synthesisRef.current.getVoices();
            let selectedVoice = null;
            
            // Try to find a female voice
            for (let voice of voices) {
                if (voice.name.includes('Female') || 
                    voice.name.includes('Woman') || 
                    voice.name.includes('Samantha') ||
                    voice.name.includes('Karen') ||
                    voice.name.includes('Susan') ||
                    voice.name.includes('Zira') ||
                    voice.name.includes('Hazel') ||
                    voice.name.includes('Susan')) {
                    selectedVoice = voice;
                    break;
                }
            }
            
            // If no female voice found, try to find any voice that sounds female
            if (!selectedVoice) {
                for (let voice of voices) {
                    if (voice.lang.startsWith('en') && 
                        (voice.name.toLowerCase().includes('female') || 
                         voice.name.toLowerCase().includes('woman') ||
                         voice.name.toLowerCase().includes('samantha') ||
                         voice.name.toLowerCase().includes('karen'))) {
                        selectedVoice = voice;
                        break;
                    }
                }
            }
            
            const utterance = new SpeechSynthesisUtterance(question);
            utterance.rate = 0.7; // Slightly slower for more natural speech
            utterance.pitch = 1.1; // Slightly higher pitch for female voice
            utterance.volume = 1;
            
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => {
                setIsSpeaking(false);
                // Wait a moment before starting to listen
                setTimeout(() => {
                    startListening();
                }, 500);
            };
            
            synthesisRef.current.speak(utterance);
        }
    };

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const handleVoiceAnswer = async (transcript) => {
        const newAnswer = {
            question: currentQuestion,
            answer: transcript,
            timestamp: new Date().toISOString()
        };

        setAnswers(prev => [...prev, newAnswer]);

        // Move to next question
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            // Wait a moment, then move to next question
            setTimeout(() => {
                setCurrentQuestionIndex(nextIndex);
                setCurrentQuestion(questions[nextIndex]);
                // Add a brief pause before asking next question
                setTimeout(() => {
                    speakQuestion(questions[nextIndex]);
                }, 1500);
            }, 2000);
        } else {
            // Interview complete - speak completion message then show results
            if (synthesisRef.current) {
                const completionMessage = "Thank you for completing the interview! I'll now analyze your responses and provide you with detailed feedback. Please wait a moment.";
                
                const voices = synthesisRef.current.getVoices();
                let selectedVoice = null;
                
                // Try to find a female voice
                for (let voice of voices) {
                    if (voice.name.includes('Female') || 
                        voice.name.includes('Woman') || 
                        voice.name.includes('Samantha') ||
                        voice.name.includes('Karen') ||
                        voice.name.includes('Susan') ||
                        voice.name.includes('Zira') ||
                        voice.name.includes('Hazel')) {
                        selectedVoice = voice;
                        break;
                    }
                }
                
                const utterance = new SpeechSynthesisUtterance(completionMessage);
                utterance.rate = 0.7;
                utterance.pitch = 1.1;
                utterance.volume = 1;
                
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
                
                utterance.onend = () => {
                    setTimeout(() => {
                        setInterviewComplete(true);
                        generateFeedback();
                    }, 1000);
                };
                
                synthesisRef.current.speak(utterance);
            } else {
                setTimeout(() => {
                    setInterviewComplete(true);
                    generateFeedback();
                }, 2000);
            }
        }
    };

    const generateFeedback = async () => {
        try {
            const response = await api.post('/ai/voice-interview/feedback', {
                resume: resumeFile?.name,
                questions: questions,
                answers: answers
            });
            
            setFeedback(response.data.feedback);
        } catch (error) {
            console.error('Error generating feedback:', error);
            setFeedback('Thank you for completing the interview! Your responses have been recorded.');
        }
    };

    const startInterview = () => {
        if (questions.length > 0) {
            setCurrentQuestion(questions[0]);
            setCurrentQuestionIndex(0);
            
            // Start with a welcome message
            const welcomeMessage = "Hello! Welcome to your voice interview. I'll be asking you 5 questions today. Please speak clearly when answering. Let's begin with the first question.";
            
            // Speak welcome message first, then the first question
            if (synthesisRef.current) {
                synthesisRef.current.cancel();
                
                const voices = synthesisRef.current.getVoices();
                let selectedVoice = null;
                
                // Try to find a female voice
                for (let voice of voices) {
                    if (voice.name.includes('Female') || 
                        voice.name.includes('Woman') || 
                        voice.name.includes('Samantha') ||
                        voice.name.includes('Karen') ||
                        voice.name.includes('Susan') ||
                        voice.name.includes('Zira') ||
                        voice.name.includes('Hazel')) {
                        selectedVoice = voice;
                        break;
                    }
                }
                
                const utterance = new SpeechSynthesisUtterance(welcomeMessage);
                utterance.rate = 0.7;
                utterance.pitch = 1.1;
                utterance.volume = 1;
                
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
                
                utterance.onend = () => {
                    // After welcome message, ask the first question
                    setTimeout(() => {
                        speakQuestion(questions[0]);
                    }, 1000);
                };
                
                synthesisRef.current.speak(utterance);
            }
        }
    };

    const resetInterview = () => {
        setResumeFile(null);
        setIsInterviewStarted(false);
        setCurrentQuestion('');
        setCurrentQuestionIndex(0);
        setQuestions([]);
        setAnswers([]);
        setIsListening(false);
        setIsSpeaking(false);
        setInterviewComplete(false);
        setFeedback('');
    };

    const containerStyle = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
    };

    const cardStyle = {
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const uploadAreaStyle = {
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f9fafb',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    };

    const buttonStyle = {
        padding: '12px 24px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '10px'
    };

    const statusStyle = {
        padding: '10px',
        borderRadius: '6px',
        margin: '10px 0',
        textAlign: 'center',
        fontWeight: 'bold'
    };

    const listeningStyle = {
        ...statusStyle,
        backgroundColor: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb'
    };

    const speakingStyle = {
        ...statusStyle,
        backgroundColor: '#cce5ff',
        color: '#004085',
        border: '1px solid #99d6ff'
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>
                Voice Interview Practice
            </h2>
            
            <p style={{ textAlign: 'center', color: '#6c757d', marginBottom: '30px' }}>
                Upload your resume and practice with AI-powered voice interviews. Get personalized questions and feedback!
            </p>

            {!isInterviewStarted && !interviewComplete && (
                <div style={cardStyle}>
                    <h3 style={{ marginBottom: '20px', color: '#495057' }}>Upload Your Resume</h3>
                    <div style={uploadAreaStyle}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}></div>
                        <h4 style={{ marginBottom: '10px', color: '#374151' }}>Drop your resume here</h4>
                        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                            Supported formats: PDF, DOC, DOCX, TXT
                        </p>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            style={{ display: 'none' }}
                            id="resume-upload"
                        />
                        <label
                            htmlFor="resume-upload"
                            style={{
                                ...buttonStyle,
                                backgroundColor: isUploading ? '#6c757d' : '#28a745',
                                cursor: isUploading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isUploading ? '⏳ Analyzing...' : '📤 Upload Resume'}
                        </label>
                    </div>
                </div>
            )}

            {isInterviewStarted && !interviewComplete && (
                <div style={cardStyle}>
                    <h3 style={{ marginBottom: '20px', color: '#495057' }}>
                        Interview in Progress ({currentQuestionIndex + 1}/{questions.length})
                    </h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ color: '#007bff', marginBottom: '10px' }}>
                            Question {currentQuestionIndex + 1} of {questions.length}:
                        </h4>
                        <p style={{ 
                            backgroundColor: '#f8f9fa', 
                            padding: '15px', 
                            borderRadius: '8px',
                            border: '1px solid #dee2e6',
                            fontSize: '16px',
                            lineHeight: '1.5'
                        }}>
                            {currentQuestion}
                        </p>
                    </div>

                    {isSpeaking && (
                        <div style={speakingStyle}>
                            Interviewer is speaking... Please listen carefully
                        </div>
                    )}

                    {isListening && (
                        <div style={listeningStyle}>
                            Please answer the question... I'm listening
                        </div>
                    )}

                    {answers.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <h4 style={{ color: '#28a745', marginBottom: '10px' }}>Your Answer:</h4>
                            <div style={{
                                backgroundColor: '#e8f5e8',
                                padding: '15px',
                                borderRadius: '8px',
                                border: '1px solid #c3e6cb',
                                fontSize: '16px',
                                lineHeight: '1.5'
                            }}>
                                <strong>Your Response:</strong> {answers[answers.length - 1].answer}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={resetInterview}
                        style={{
                            ...buttonStyle,
                            backgroundColor: '#dc3545'
                        }}
                    >
                        🔄 Restart Interview
                    </button>
                </div>
            )}

            {interviewComplete && (
                <div style={cardStyle}>
                    <h3 style={{ marginBottom: '20px', color: '#28a745' }}>
                        Interview Complete!
                    </h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ color: '#007bff', marginBottom: '15px' }}>Complete Interview Summary:</h4>
                        {answers.map((answer, index) => (
                            <div key={index} style={{
                                backgroundColor: '#f8f9fa',
                                padding: '15px',
                                borderRadius: '8px',
                                marginBottom: '15px',
                                border: '1px solid #dee2e6'
                            }}>
                                <div style={{ 
                                    color: '#007bff', 
                                    fontWeight: 'bold', 
                                    marginBottom: '8px',
                                    fontSize: '16px'
                                }}>
                                    Question {index + 1}:
                                </div>
                                <div style={{ 
                                    marginBottom: '10px',
                                    fontSize: '15px',
                                    lineHeight: '1.4'
                                }}>
                                    {answer.question}
                                </div>
                                <div style={{ 
                                    color: '#28a745', 
                                    fontWeight: 'bold', 
                                    marginBottom: '5px',
                                    fontSize: '14px'
                                }}>
                                    Your Answer:
                                </div>
                                <div style={{ 
                                    fontSize: '15px',
                                    lineHeight: '1.4',
                                    color: '#495057'
                                }}>
                                    {answer.answer}
                                </div>
                            </div>
                        ))}
                    </div>

                    {feedback && (
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ color: '#6f42c1', marginBottom: '10px' }}>AI Feedback:</h4>
                            <div style={{
                                backgroundColor: '#f3e5f5',
                                padding: '15px',
                                borderRadius: '8px',
                                border: '1px solid #e1bee7',
                                whiteSpace: 'pre-line'
                            }}>
                                {feedback}
                            </div>
                        </div>
                    )}

                    <div style={{ textAlign: 'center' }}>
                        <button
                            onClick={resetInterview}
                            style={{
                                ...buttonStyle,
                                backgroundColor: '#007bff'
                            }}
                        >
                            🆕 Start New Interview
                        </button>
                    </div>
                </div>
            )}

            <div style={cardStyle}>
                <h3 style={{ marginBottom: '15px', color: '#495057' }}>How it Works:</h3>
                <ol style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li><strong>Upload Resume:</strong> Upload your resume in PDF, DOC, or TXT format</li>
                    <li><strong>AI Analysis:</strong> Our AI analyzes your resume and generates 5 personalized questions</li>
                    <li><strong>Voice Questions:</strong> AI asks questions using text-to-speech</li>
                    <li><strong>Voice Answers:</strong> You answer using your voice (speech-to-text)</li>
                    <li><strong>Get Feedback:</strong> Receive detailed feedback on your responses</li>
                </ol>
            </div>
        </div>
    );
};

export default VoiceInterview;
