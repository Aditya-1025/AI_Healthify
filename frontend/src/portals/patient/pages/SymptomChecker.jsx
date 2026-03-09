import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import { useSymptoms } from '../../../context/SymptomContext';
import { useAIUI } from '../../../context/AIUIContext';
import './SymptomChecker.css';

/* ───── Static data ───── */
const commonSymptoms = [
    { id: 'fever', label: 'Fever', icon: '🤒' },
    { id: 'cough', label: 'Cough', icon: '😷' },
    { id: 'headache', label: 'Headache', icon: '🤕' },
    { id: 'fatigue', label: 'Fatigue', icon: '😴' },
    { id: 'nausea', label: 'Nausea', icon: '🤢' },
    { id: 'chest-pain', label: 'Chest Pain', icon: '💔' },
    { id: 'dizziness', label: 'Dizziness', icon: '😵' },
    { id: 'sore-throat', label: 'Sore Throat', icon: '🗣️' },
    { id: 'body-ache', label: 'Body Ache', icon: '🦴' },
    { id: 'shortness', label: 'Shortness of Breath', icon: '🫁' },
    { id: 'cold', label: 'Cold / Runny Nose', icon: '🤧' },
    { id: 'vomiting', label: 'Vomiting', icon: '🤮' },
];

const durationOptions = [
    'Less than a day',
    '1–2 days',
    '3–5 days',
    '1 week',
    '1–2 weeks',
    'More than 2 weeks',
];

/* Mock AI analysis result */
const mockResult = {
    conditions: [
        { name: 'Viral Infection', likelihood: 'high' },
        { name: 'Migraine', likelihood: 'medium' },
        { name: 'Seasonal Allergies', likelihood: 'low' },
    ],
    riskLevel: 'moderate',     // low | moderate | high
    recommendations: [
        'Rest and stay hydrated — aim for 8+ glasses of water daily',
        'Take over-the-counter pain relief (paracetamol) as needed',
        'Monitor your temperature every 4–6 hours',
        'Consult a doctor if symptoms persist beyond 3 days or worsen',
        'Avoid strenuous physical activity until you feel better',
    ],
};

/* ───── Component ───── */
const SymptomChecker = () => {
    const { saveAnalysis } = useSymptoms();
    const { openAI } = useAIUI();

    /* State */
    const [description, setDescription] = useState('');
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [severity, setSeverity] = useState('');
    const [duration, setDuration] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);

    /* Handlers */
    const toggleSymptom = (id) => {
        setSelectedSymptoms((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
        );
    };

    const canAnalyze =
        (description.trim().length > 0 || selectedSymptoms.length > 0) &&
        severity &&
        duration;

    const handleAnalyze = () => {
        if (!canAnalyze) return;
        setShowResults(false);
        setIsAnalyzing(true);
        // Simulate AI processing
        setTimeout(() => {
            setIsAnalyzing(false);
            setShowResults(true);

            // ── Save full result into SymptomContext ──
            const symptomLabels = selectedSymptoms.map((id) => {
                const match = commonSymptoms.find((s) => s.id === id);
                return match ? match.label : id;
            });

            saveAnalysis({
                symptoms: symptomLabels,
                description,
                severity,
                duration,
                conditions: mockResult.conditions,
                riskLevel: mockResult.riskLevel,
                recommendations: mockResult.recommendations,
            });
        }, 2500);
    };

    const riskEmoji = { low: '🟢', moderate: '🟡', high: '🔴' };
    const riskLabel = { low: 'Low', moderate: 'Moderate', high: 'High' };

    /* ─── Render ─── */
    return (
        <section className="sc">
            {/* ========== SECTION 1 — Page Header ========== */}
            <div className="sc__header">
                <div className="sc__header-icon">🔍</div>
                <h2>Symptom Checker</h2>
                <p>Understand your symptoms using AI-assisted analysis</p>
            </div>

            {/* ========== SECTION 2 — Describe Symptoms ========== */}
            <Card>
                <div className="sc__section-label">
                    <span className="step-badge">1</span>
                    Describe Your Symptoms
                </div>
                <textarea
                    className="sc__textarea"
                    placeholder="Describe how you feel in your own words…&#10;&#10;For example: I've had a persistent headache for two days, along with mild fever and body aches. The headache gets worse in the evening."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={1000}
                />
                <div className="sc__char-count">{description.length} / 1000</div>
            </Card>

            {/* ========== SECTION 3 — Symptom Chips ========== */}
            <Card>
                <div className="sc__section-label">
                    <span className="step-badge">2</span>
                    Select Common Symptoms
                </div>
                <div className="sc__chips">
                    {commonSymptoms.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            className={`sc__chip${selectedSymptoms.includes(s.id) ? ' sc__chip--selected' : ''}`}
                            onClick={() => toggleSymptom(s.id)}
                        >
                            <span className="sc__chip-icon">{s.icon}</span>
                            {s.label}
                        </button>
                    ))}
                </div>
            </Card>

            {/* ========== SECTION 4 — Severity & Duration ========== */}
            <Card>
                <div className="sc__section-label">
                    <span className="step-badge">3</span>
                    Severity &amp; Duration
                </div>

                <div className="sc__input-row">
                    {/* Severity */}
                    <div className="sc__input-group">
                        <label>How severe are your symptoms?</label>
                        <div className="sc__severity-group">
                            {['mild', 'moderate', 'severe'].map((level) => (
                                <div key={level} className="sc__severity-option">
                                    <input
                                        type="radio"
                                        name="severity"
                                        id={`sev-${level}`}
                                        value={level}
                                        checked={severity === level}
                                        onChange={() => setSeverity(level)}
                                    />
                                    <label
                                        htmlFor={`sev-${level}`}
                                        className={`sc__severity-label sc__severity-label--${level}`}
                                    >
                                        {level === 'mild' && '🟢'}
                                        {level === 'moderate' && '🟡'}
                                        {level === 'severe' && '🔴'}
                                        &nbsp;{level.charAt(0).toUpperCase() + level.slice(1)}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="sc__input-group">
                        <label htmlFor="duration">How long have you had these symptoms?</label>
                        <select
                            id="duration"
                            className="sc__duration-select"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        >
                            <option value="">Select duration…</option>
                            {durationOptions.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {/* ========== SECTION 5 — Analyze Button ========== */}
            <div className="sc__analyze-wrap">
                <button
                    type="button"
                    className="sc__analyze-btn"
                    disabled={!canAnalyze || isAnalyzing}
                    onClick={handleAnalyze}
                >
                    🧠 Analyze Symptoms
                </button>
            </div>

            {/* ========== SECTION 6 — Loading State ========== */}
            {isAnalyzing && (
                <Card>
                    <div className="sc__loading">
                        <div className="sc__loading-spinner" />
                        <p className="sc__loading-title">Analyzing your symptoms…</p>
                        <p className="sc__loading-subtitle">🧠 AI is reviewing your health data</p>
                    </div>
                </Card>
            )}

            {/* ========== SECTION 7 — Results Card ========== */}
            {showResults && !isAnalyzing && (
                <Card className="sc__results-card" variant="elevated">
                    <div className="sc__results-title">
                        <span className="sc__results-title-icon">📋</span>
                        Analysis Result
                    </div>

                    {/* Possible conditions */}
                    <div className="sc__conditions">
                        <h4>Possible Conditions</h4>
                        {mockResult.conditions.map((c) => (
                            <div key={c.name} className="sc__condition-item">
                                <span className="sc__condition-name">
                                    <span className={`sc__condition-dot sc__condition-dot--${c.likelihood}`} />
                                    {c.name}
                                </span>
                                <span className={`sc__condition-likelihood sc__condition-likelihood--${c.likelihood}`}>
                                    {c.likelihood.charAt(0).toUpperCase() + c.likelihood.slice(1)} likelihood
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Risk level */}
                    <div className="sc__risk">
                        <span className="sc__risk-label">Overall Risk Level:</span>
                        <span className={`sc__risk-badge sc__risk-badge--${mockResult.riskLevel}`}>
                            {riskEmoji[mockResult.riskLevel]} {riskLabel[mockResult.riskLevel]}
                        </span>
                    </div>

                    {/* Recommendations */}
                    <div className="sc__recommendation">
                        <h4>💡 Recommendations</h4>
                        <ul className="sc__recommendation-list">
                            {mockResult.recommendations.map((r) => (
                                <li key={r}>{r}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Disclaimer */}
                    <div className="sc__disclaimer">
                        ⚠️ <strong>Disclaimer:</strong> This analysis is AI-generated and does not replace
                        professional medical advice. Always consult a qualified healthcare provider for an
                        accurate diagnosis and treatment plan.
                    </div>

                    {/* ========== SECTION 8 — AI Assistant Link ========== */}
                    <div className="sc__ai-link-wrap">
                        <button
                            type="button"
                            className="sc__ai-link"
                            onClick={openAI}
                        >
                            🤖 Discuss with AI Assistant →
                        </button>
                    </div>
                </Card>
            )}
        </section>
    );
};

export default SymptomChecker;
