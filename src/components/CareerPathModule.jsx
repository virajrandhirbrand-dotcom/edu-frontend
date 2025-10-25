import React, { useState } from 'react';
import api from '../api';
import './CareerPathModule.css';

const CareerPathModule = () => {
    const [selectedField, setSelectedField] = useState('');
    const [cgpa, setCgpa] = useState('');
    const [preferredCountry, setPreferredCountry] = useState('');
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expandedCard, setExpandedCard] = useState(null);
    const [comparisonMode, setComparisonMode] = useState(false);
    const [selectedPrograms, setSelectedPrograms] = useState([]);

    const fields = [
        'Engineering',
        'Commerce',
        'Science',
        'Arts',
        'Management',
        'Law',
        'Medicine',
        'Architecture',
        'Business Administration',
        'Computer Science',
        'Data Science',
        'Artificial Intelligence'
    ];

    const countries = [
        'India',
        'USA',
        'UK',
        'Canada',
        'Australia',
        'Germany',
        'Netherlands',
        'Singapore',
        'Japan',
        'France',
        'Switzerland',
        'Sweden'
    ];

    const handleGetRecommendations = async () => {
        if (!selectedField || !cgpa || !preferredCountry) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        setRecommendations(null);
        try {
            const response = await api.post('/career-path/recommendations', {
                field: selectedField,
                cgpa: parseFloat(cgpa),
                preferredCountry
            });

            if (response.status === 200 && response.data.success) {
                setRecommendations(response.data.data);
                console.log('Recommendations received:', response.data.data);
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            alert(error.response?.data?.error || 'Failed to get recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleProgramComparison = (program) => {
        if (selectedPrograms.includes(program)) {
            setSelectedPrograms(selectedPrograms.filter(p => p !== program));
        } else if (selectedPrograms.length < 3) {
            setSelectedPrograms([...selectedPrograms, program]);
        } else {
            alert('You can compare up to 3 programs at a time');
        }
    };

    const ComparisonView = () => {
        if (!recommendations || selectedPrograms.length === 0) return null;

        const programs = recommendations.programs || [];
        const selectedProgramData = programs.filter(p => 
            selectedPrograms.includes(p.name)
        );

        return (
            <div className="comparison-container">
                <h3>Program Comparison</h3>
                <div className="comparison-grid">
                    {selectedProgramData.map((program, index) => (
                        <div key={index} className="comparison-card">
                            <h4>{program.name}</h4>
                            <div className="comparison-details">
                                <div className="detail-item">
                                    <span className="label">Duration:</span>
                                    <span className="value">{program.duration}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Description:</span>
                                    <span className="value">{program.description}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const RoadmapView = ({ roadmap }) => {
        if (!roadmap || roadmap.length === 0) return null;

        return (
            <div className="roadmap-container">
                <h3>Your Learning Roadmap</h3>
                <div className="roadmap-timeline">
                    {roadmap.map((item, idx) => (
                        <div key={idx} className="roadmap-step">
                            <div className="step-number">{item.step}</div>
                            <div className="step-content">
                                <h4>{item.title}</h4>
                                <p className="duration">{item.duration}</p>
                                <p className="description">{item.description}</p>
                                {item.resources && <p className="resources"><strong>Resources:</strong> {item.resources}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="career-path-module">
            <div className="section-header">
                <h1 className="section-title">AI-Powered Career Path for Higher Studies</h1>
                <p className="section-subtitle">Get personalized recommendations powered by advanced AI</p>
            </div>

            <div className="input-section">
                <h2>Personalized Career Planning (AI-Driven)</h2>
                <div className="input-grid">
                    <div className="input-group">
                        <label htmlFor="field">Field of Study</label>
                        <select
                            id="field"
                            value={selectedField}
                            onChange={(e) => setSelectedField(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Select your field</option>
                            {fields.map(field => (
                                <option key={field} value={field}>{field}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="cgpa">Your CGPA</label>
                        <input
                            id="cgpa"
                            type="number"
                            min="0"
                            max="10"
                            step="0.01"
                            value={cgpa}
                            onChange={(e) => setCgpa(e.target.value)}
                            placeholder="Enter your CGPA"
                            className="input-field"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="country">Preferred Country/Region</label>
                        <select
                            id="country"
                            value={preferredCountry}
                            onChange={(e) => setPreferredCountry(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Select country</option>
                            {countries.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleGetRecommendations}
                    disabled={loading || !selectedField || !cgpa || !preferredCountry}
                    className="get-recommendations-btn"
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            AI is Analyzing Your Profile...
                        </>
                    ) : (
                        'Get AI-Powered Recommendations'
                    )}
                </button>
            </div>

            {recommendations && (
                <div className="results-section">
                    {/* Personal Analysis */}
                    {recommendations.personalAnalysis && (
                        <div className="personal-analysis-box">
                            <h3>Your AI Analysis</h3>
                            <p>{recommendations.personalAnalysis}</p>
                        </div>
                    )}

                    <div className="recommendations-header">
                        <h2>Personalized Recommendations for {recommendations.field}</h2>
                        {recommendations.programs && recommendations.programs.length > 1 && (
                            <button
                                className="toggle-comparison-btn"
                                onClick={() => setComparisonMode(!comparisonMode)}
                            >
                                {comparisonMode ? 'Hide Comparison' : 'Compare Programs'}
                            </button>
                        )}
                    </div>

                    {/* Career Cards */}
                    {recommendations.programs && recommendations.programs.length > 0 && (
                        <div className="career-cards-container">
                            <h3>Recommended Programs</h3>
                            <div className="career-cards-grid">
                                {recommendations.programs.map((program, index) => (
                                    <div
                                        key={index}
                                        className={`career-card ${expandedCard === index ? 'expanded' : ''}`}
                                    >
                                        <div
                                            className="card-header"
                                            onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                                        >
                                            <h3>{program.name}</h3>
                                            <span className="toggle-icon">{expandedCard === index ? '−' : '+'}</span>
                                        </div>

                                        {expandedCard === index && (
                                            <div className="card-content">
                                                <div className="info-section">
                                                    <h4>Duration</h4>
                                                    <p>{program.duration}</p>
                                                </div>

                                                <div className="info-section">
                                                    <h4>Description</h4>
                                                    <p>{program.description}</p>
                                                </div>

                                                {comparisonMode && (
                                                    <button
                                                        className="compare-btn"
                                                        onClick={() => toggleProgramComparison(program.name)}
                                                    >
                                                        {selectedPrograms.includes(program.name) ? 'Remove from Comparison' : 'Add to Comparison'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comparison View */}
                    {comparisonMode && <ComparisonView />}

                    {/* Top Universities */}
                    {recommendations.topUniversities && recommendations.topUniversities.length > 0 && (
                        <div className="universities-section">
                            <h3>Top Universities for You</h3>
                            <div className="universities-grid">
                                {recommendations.topUniversities.map((uni, index) => (
                                    <div key={index} className="university-card">
                                        <h4>{uni.name}</h4>
                                        <div className="uni-details">
                                            <p><strong>Ranking:</strong> {uni.ranking}</p>
                                            <p><strong>Admission Rate:</strong> {uni.admissionRate}</p>
                                            <p><strong>Annual Tuition:</strong> {uni.tuitionFee}</p>
                                            <p><strong>Min. CGPA Required:</strong> {uni.requiredCGPA}</p>
                                            <p><strong>Specialization:</strong> {uni.specialization}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Required Exams */}
                    {recommendations.requiredExams && recommendations.requiredExams.length > 0 && (
                        <div className="exams-section">
                            <h3>Required Entrance Exams</h3>
                            <div className="exams-grid">
                                {recommendations.requiredExams.map((exam, index) => (
                                    <div key={index} className="exam-card">
                                        <h4>{exam.examName}</h4>
                                        <div className="exam-details">
                                            <p><strong>Importance:</strong> <span className="importance-badge">{exam.importance}</span></p>
                                            <p><strong>Preparation Time:</strong> {exam.preparationTime}</p>
                                            <p><strong>Required Score:</strong> {exam.averageScore}</p>
                                            <p><strong>Exam Fee:</strong> {exam.cost}</p>
                                            <p><strong>Description:</strong> {exam.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Scholarships */}
                    {recommendations.scholarships && recommendations.scholarships.length > 0 && (
                        <div className="scholarships-section">
                            <h3>Available Scholarships</h3>
                            <div className="scholarships-grid">
                                {recommendations.scholarships.map((scholarship, index) => (
                                    <div key={index} className="scholarship-card">
                                        <h4>{scholarship.name}</h4>
                                        <div className="scholarship-details">
                                            <p><strong>Provider:</strong> {scholarship.provider}</p>
                                            <p><strong>Coverage:</strong> {scholarship.coverage}</p>
                                            <p><strong>Eligibility:</strong> {scholarship.eligibility}</p>
                                            <p><strong>Deadline:</strong> {scholarship.deadline}</p>
                                            <p><strong>How to Apply:</strong> {scholarship.website}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Career Prospects */}
                    {recommendations.careerProspects && recommendations.careerProspects.length > 0 && (
                        <div className="career-prospects-section">
                            <h3>Career Prospects</h3>
                            <div className="career-prospects-grid">
                                {recommendations.careerProspects.map((career, index) => (
                                    <div key={index} className="career-prospect-card">
                                        <h4>{career.position}</h4>
                                        <div className="prospect-details">
                                            <p><strong>Salary Range:</strong> {career.averageSalary}</p>
                                            <p><strong>Top Companies:</strong> {career.companies}</p>
                                            <p><strong>Growth Potential:</strong> <span className="growth-badge">{career.growth}</span></p>
                                            <p><strong>Role:</strong> {career.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Roadmap */}
                    {recommendations.roadmap && <RoadmapView roadmap={recommendations.roadmap} />}

                    {/* Estimated Costs */}
                    {recommendations.estimatedCosts && (
                        <div className="costs-section">
                            <h3>Estimated Costs</h3>
                            <div className="costs-grid">
                                <div className="cost-card">
                                    <h4>Annual Tuition</h4>
                                    <p className="cost-value">{recommendations.estimatedCosts.tuitionPerYear}</p>
                                </div>
                                <div className="cost-card">
                                    <h4>Monthly Living Expenses</h4>
                                    <p className="cost-value">{recommendations.estimatedCosts.livingExpenses}</p>
                                </div>
                                <div className="cost-card">
                                    <h4>Total Program Cost</h4>
                                    <p className="cost-value">{recommendations.estimatedCosts.totalCost}</p>
                                </div>
                                <div className="cost-card">
                                    <h4>Funding Options</h4>
                                    <p>{recommendations.estimatedCosts.fundingOptions}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Eligibility Assessment */}
                    {recommendations.eligibilityAssessment && (
                        <div className="eligibility-section">
                            <h3>Eligibility Assessment</h3>
                            <div className="eligibility-box">
                                <p><strong>Overall Eligibility:</strong> <span className={`eligibility-badge ${recommendations.eligibilityAssessment.overallEligibility.toLowerCase().replace(/\s+/g, '-')}`}>{recommendations.eligibilityAssessment.overallEligibility}</span></p>
                                <p><strong>Strengths:</strong> {recommendations.eligibilityAssessment.strengths}</p>
                                <p><strong>Challenges:</strong> {recommendations.eligibilityAssessment.challenges}</p>
                                <p><strong>Recommendations:</strong> {recommendations.eligibilityAssessment.recommendations}</p>
                                <p><strong>Alternative Options:</strong> {recommendations.eligibilityAssessment.alternativeOptions}</p>
                            </div>
                        </div>
                    )}

                    {/* Cost Comparison */}
                    {recommendations.costComparison && (
                        <div className="cost-comparison-section">
                            <h3>Cost Comparison with Other Countries</h3>
                            <div className="cost-comparison-box">
                                <p><strong>Comparison:</strong> {recommendations.costComparison.description}</p>
                                <p><strong>Value for Money:</strong> {recommendations.costComparison.valueForMoney}</p>
                                <p><strong>ROI (Return on Investment):</strong> {recommendations.costComparison.roi}</p>
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    {recommendations.timelineAndMilestones && (
                        <div className="timeline-section">
                            <h3>Important Dates & Milestones</h3>
                            <div className="timeline-box">
                                <p><strong>Start Application Process:</strong> {recommendations.timelineAndMilestones.monthsToApplication}</p>
                                <p><strong>Application Deadline:</strong> {recommendations.timelineAndMilestones.applicationDeadline}</p>
                                <p><strong>Decision Timeline:</strong> {recommendations.timelineAndMilestones.decisionTimeline}</p>
                                <p><strong>Enrollment Date:</strong> {recommendations.timelineAndMilestones.enrollmentDate}</p>
                                <p><strong>Completion Date:</strong> {recommendations.timelineAndMilestones.completionDate}</p>
                            </div>
                        </div>
                    )}

                    {/* AI Generated Metadata */}
                    <div className="ai-metadata">
                        <p>This recommendation was generated by AI on {new Date(recommendations.generatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareerPathModule;
