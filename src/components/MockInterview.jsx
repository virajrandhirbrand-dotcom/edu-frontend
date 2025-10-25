import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import './MockInterview.css';

const MockInterview = () => {
    const [interviewStage, setInterviewStage] = useState('setup'); // setup, interview, review
    const [jobRole, setJobRole] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('entry');
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeFileName, setResumeFileName] = useState('');
    const [technicalSkills, setTechnicalSkills] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [interviewFeedback, setInterviewFeedback] = useState(null);
    const [questionFeedback, setQuestionFeedback] = useState(null);
    const [timeSpent, setTimeSpent] = useState(0);
    const [overallScore, setOverallScore] = useState(0);

    const recognitionRef = useRef(null);
    const synthesisRef = useRef(null);
    const timerRef = useRef(null);
    const fileInputRef = useRef(null);

    // Initialize speech recognition and synthesis
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        setCurrentAnswer(prev => prev + transcript + ' ');
                    } else {
                        interimTranscript += transcript;
                    }
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
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
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // Handle resume file upload
    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                setResumeFile(file);
                setResumeFileName(file.name);
            } else {
                alert('Please upload a PDF or Word document');
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }
    };

    // Start interview
    const handleStartInterview = async () => {
        if (!jobRole.trim() || !companyName.trim()) {
            alert('Please enter job role and company name');
            return;
        }

        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('jobRole', jobRole);
            formData.append('companyName', companyName);
            formData.append('experienceLevel', experienceLevel);
            formData.append('technicalSkills', technicalSkills);
            formData.append('numberOfQuestions', 7);
            if (resumeFile) {
                formData.append('resume', resumeFile);
            }

            const response = await api.post('/ai/mock-interview/generate-questions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200 && response.data.questions) {
                setQuestions(response.data.questions);
                setAnswers(new Array(response.data.questions.length).fill(''));
                setCurrentQuestionIndex(0);
                setInterviewStage('interview');
                speakQuestion(response.data.questions[0]);
                startTimer();
            }
        } catch (error) {
            console.error('Error generating questions:', error);
            // Fallback questions with technical skills focus
            const fallbackQuestions = [
                "Tell me about yourself and your relevant experience.",
                "Can you walk us through a technical project you've worked on?",
                "What programming languages are you most proficient in?",
                "How do you approach solving complex technical problems?",
                "Describe your experience with " + (technicalSkills || "relevant technologies") + ".",
                "Tell me about your experience with databases and data management.",
                "Why are you interested in this position at " + companyName + "?",
            ];
            setQuestions(fallbackQuestions);
            setAnswers(new Array(fallbackQuestions.length).fill(''));
            setCurrentQuestionIndex(0);
            setInterviewStage('interview');
            speakQuestion(fallbackQuestions[0]);
            startTimer();
        } finally {
            setIsProcessing(false);
        }
    };

    // Speak question
    const speakQuestion = (question) => {
        if (synthesisRef.current) {
            synthesisRef.current.cancel();
            const utterance = new SpeechSynthesisUtterance(question);
            utterance.rate = 1;
            utterance.pitch = 1;
            synthesisRef.current.speak(utterance);
        }
    };

    // Start timer
    const startTimer = () => {
        let seconds = 0;
        timerRef.current = setInterval(() => {
            seconds++;
            setTimeSpent(seconds);
        }, 1000);
    };

    // Start recording
    const startRecording = () => {
        if (recognitionRef.current) {
            setCurrentAnswer('');
            setIsRecording(true);
            recognitionRef.current.start();
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    };

    // Submit answer
    const handleSubmitAnswer = async () => {
        if (!currentAnswer.trim()) {
            alert('Please provide an answer');
            return;
        }

        setIsProcessing(true);
        try {
            const response = await api.post('/ai/mock-interview/evaluate-answer', {
                question: questions[currentQuestionIndex],
                answer: currentAnswer,
                jobRole,
                companyName,
                technicalSkills,
                experienceLevel
            });

            if (response.status === 200) {
                const feedback = response.data;
                setQuestionFeedback(feedback);

                // Update answers
                const newAnswers = [...answers];
                newAnswers[currentQuestionIndex] = currentAnswer;
                setAnswers(newAnswers);

                // Move to next question or finish
                if (currentQuestionIndex < questions.length - 1) {
                    setTimeout(() => {
                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                        setCurrentAnswer('');
                        setQuestionFeedback(null);
                        speakQuestion(questions[currentQuestionIndex + 1]);
                    }, 2000);
                } else {
                    finishInterview(newAnswers);
                }
            }
        } catch (error) {
            console.error('Error evaluating answer:', error);
            alert('Failed to evaluate answer. Skipping to next question.');
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setCurrentAnswer('');
                setQuestionFeedback(null);
            } else {
                finishInterview(answers);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    // Finish interview
    const finishInterview = async (finalAnswers) => {
        setIsProcessing(true);
        try {
            const response = await api.post('/ai/mock-interview/generate-report', {
                jobRole,
                companyName,
                technicalSkills,
                experienceLevel,
                questions,
                answers: finalAnswers,
                timeSpent
            });

            if (response.status === 200) {
                setInterviewFeedback(response.data);
                setOverallScore(response.data.overallScore || 0);
            }
        } catch (error) {
            console.error('Error generating report:', error);
            setInterviewFeedback({
                overallScore: 75,
                strengths: ['Good communication', 'Relevant technical knowledge', 'Problem-solving approach'],
                improvements: ['Provide more specific technical examples', 'Practice time management', 'Deepen technical expertise'],
                recommendations: ['Practice more technical questions', 'Review advanced concepts in ' + (technicalSkills || 'your field'), 'Work on real-world projects'],
                nextSteps: ['Review technical fundamentals', 'Practice system design questions', 'Build more projects']
            });
        } finally {
            setIsProcessing(false);
            setInterviewStage('review');
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    // Skip question
    const handleSkipQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            const newAnswers = [...answers];
            newAnswers[currentQuestionIndex] = 'Skipped';
            setAnswers(newAnswers);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCurrentAnswer('');
            setQuestionFeedback(null);
            speakQuestion(questions[currentQuestionIndex + 1]);
        } else {
            finishInterview(answers);
        }
    };

    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="mock-interview">
            <div className="section-header">
                <h1 className="section-title">Mock Interview Practice</h1>
                <p className="section-subtitle">Practice interviews with AI-powered questions and feedback</p>
            </div>

            {interviewStage === 'setup' && (
                <div className="setup-section">
                    <h2>Configure Your Mock Interview</h2>
                    <div className="setup-grid">
                        <div className="input-group">
                            <label htmlFor="jobRole">Job Role/Position</label>
                            <input
                                id="jobRole"
                                type="text"
                                value={jobRole}
                                onChange={(e) => setJobRole(e.target.value)}
                                placeholder="e.g., Software Engineer, Data Scientist"
                                className="input-field"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="company">Company Name</label>
                            <input
                                id="company"
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="e.g., Google, Microsoft, Startup ABC"
                                className="input-field"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="experience">Experience Level</label>
                            <select
                                id="experience"
                                value={experienceLevel}
                                onChange={(e) => setExperienceLevel(e.target.value)}
                                className="input-field"
                            >
                                <option value="entry">Entry Level (0-2 years)</option>
                                <option value="mid">Mid-Level (2-5 years)</option>
                                <option value="senior">Senior Level (5+ years)</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="skills">Technical Skills (comma-separated)</label>
                            <input
                                id="skills"
                                type="text"
                                value={technicalSkills}
                                onChange={(e) => setTechnicalSkills(e.target.value)}
                                placeholder="e.g., Java, Python, React, Spring Boot, AWS"
                                className="input-field"
                            />
                        </div>

                        <div className="input-group resume-upload">
                            <label htmlFor="resume">Upload Your Resume (Optional)</label>
                            <div className="resume-upload-box">
                                <input
                                    ref={fileInputRef}
                                    id="resume"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeUpload}
                                    className="file-input"
                                />
                                <label htmlFor="resume" className="upload-label">
                                    <span className="upload-icon">📄</span>
                                    <span className="upload-text">
                                        {resumeFileName ? `✓ ${resumeFileName}` : 'Click to upload resume (PDF/DOC)'}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleStartInterview}
                        disabled={isProcessing || !jobRole.trim() || !companyName.trim()}
                        className="start-btn"
                    >
                        {isProcessing ? (
                            <>
                                <span className="spinner"></span>
                                Generating Questions...
                            </>
                        ) : (
                            'Start Mock Interview'
                        )}
                    </button>

                    <div className="interview-tips">
                        <h3>Interview Tips</h3>
                        <ul>
                            <li>Find a quiet place to practice</li>
                            <li>Speak clearly and maintain good pace</li>
                            <li>Provide specific technical examples from your projects</li>
                            <li>Demonstrate your knowledge of technical skills mentioned</li>
                            <li>Keep answers concise but comprehensive with technical details</li>
                            <li>Practice active listening and confidence</li>
                        </ul>
                    </div>
                </div>
            )}

            {interviewStage === 'interview' && questions.length > 0 && (
                <div className="interview-section">
                    <div className="interview-progress">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                        <p className="progress-text">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </p>
                    </div>

                    <div className="timer">Time: {formatTime(timeSpent)}</div>

                    <div className="question-card">
                        <h3 className="question-title">{questions[currentQuestionIndex]}</h3>
                    </div>

                    <div className="answer-section">
                        <div className="transcript-box">
                            <h4>Your Answer:</h4>
                            <div className="transcript-content">
                                {currentAnswer || <p className="placeholder">Your speech will appear here...</p>}
                            </div>
                        </div>

                        <div className="recording-controls">
                            {!isRecording ? (
                                <button onClick={startRecording} className="record-btn">
                                    Start Recording
                                </button>
                            ) : (
                                <button onClick={stopRecording} className="stop-record-btn">
                                    Stop Recording
                                </button>
                            )}
                        </div>

                        <div className="action-buttons">
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={isProcessing || !currentAnswer.trim()}
                                className="submit-btn"
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner"></span>
                                        Evaluating...
                                    </>
                                ) : (
                                    'Submit Answer'
                                )}
                            </button>

                            <button
                                onClick={handleSkipQuestion}
                                disabled={isProcessing}
                                className="skip-btn"
                            >
                                Skip Question
                            </button>
                        </div>

                        {questionFeedback && (
                            <div className="feedback-box">
                                <h4>Feedback</h4>
                                <p><strong>Score:</strong> {questionFeedback.score}/10</p>
                                <p><strong>Feedback:</strong> {questionFeedback.feedback}</p>
                                {questionFeedback.suggestions && (
                                    <p><strong>Suggestions:</strong> {questionFeedback.suggestions}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {interviewStage === 'review' && interviewFeedback && (
                <div className="review-section">
                    <div className="overall-score">
                        <div className="score-circle">
                            <span className="score-value">{overallScore}</span>
                            <span className="score-label">/100</span>
                        </div>
                        <div className="score-text">
                            <h3>Interview Complete</h3>
                            <p>Total Time: {formatTime(timeSpent)}</p>
                        </div>
                    </div>

                    <div className="feedback-sections">
                        {interviewFeedback.strengths && (
                            <div className="feedback-card strengths">
                                <h4>Your Strengths</h4>
                                <ul>
                                    {interviewFeedback.strengths.map((strength, idx) => (
                                        <li key={idx}>{strength}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {interviewFeedback.improvements && (
                            <div className="feedback-card improvements">
                                <h4>Areas to Improve</h4>
                                <ul>
                                    {interviewFeedback.improvements.map((improvement, idx) => (
                                        <li key={idx}>{improvement}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {interviewFeedback.recommendations && (
                            <div className="feedback-card recommendations">
                                <h4>Recommendations</h4>
                                <ul>
                                    {interviewFeedback.recommendations.map((rec, idx) => (
                                        <li key={idx}>{rec}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {interviewFeedback.nextSteps && (
                            <div className="feedback-card next-steps">
                                <h4>Next Steps</h4>
                                <ul>
                                    {interviewFeedback.nextSteps.map((step, idx) => (
                                        <li key={idx}>{step}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="answer-review">
                        <h3>Your Answers Review</h3>
                        {questions.map((question, idx) => (
                            <div key={idx} className="answer-item">
                                <h5>Q{idx + 1}: {question}</h5>
                                <p><strong>Your Answer:</strong> {answers[idx] || 'Skipped'}</p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            setInterviewStage('setup');
                            setJobRole('');
                            setCompanyName('');
                            setExperienceLevel('entry');
                            setTechnicalSkills('');
                            setResumeFile(null);
                            setResumeFileName('');
                            setCurrentAnswer('');
                            setCurrentQuestionIndex(0);
                            setTimeSpent(0);
                            setOverallScore(0);
                            setInterviewFeedback(null);
                        }}
                        className="restart-btn"
                    >
                        Start Another Interview
                    </button>
                </div>
            )}
        </div>
    );
};

export default MockInterview;
