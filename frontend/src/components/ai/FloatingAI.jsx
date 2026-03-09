import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSymptoms } from '../../context/SymptomContext';
import { useAIUI } from '../../context/AIUIContext';
import './FloatingAI.css';

/* ───── Initial messages & suggestions (same as PatientDashboard) ───── */
const initialMessages = [
    { id: 1, from: 'bot', text: 'Hello! 👋 I\'m your Healthify AI assistant. I can help you understand your health vitals, remind you about medications, and answer general wellness questions.' },
    { id: 2, from: 'user', text: 'What does my latest blood pressure reading mean?' },
    { id: 3, from: 'bot', text: 'Your BP is 120/80 mmHg — that\'s within the **normal range** 🎉. Systolic (120) is under 130 and diastolic (80) is under 85. Keep up the healthy lifestyle! Want tips to maintain it?' },
];

const defaultSuggestions = [
    'How is my heart rate trend?',
    'When is my next appointment?',
    'Medication side effects',
    'Diet recommendations',
];

const analysisSuggestions = [
    'Explain my top condition',
    'Should I see a doctor?',
    'Book an appointment',
    'Medication for my symptoms',
];

/* ───── Component ───── */
const FloatingAI = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { analysisResult } = useSymptoms();
    const { isOpen, toggleAI, closeAI } = useAIUI();

    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [showConditionDetail, setShowConditionDetail] = useState(false);
    const hasInjectedRef = useRef(false);
    const messagesEndRef = useRef(null);

    const suggestions = analysisResult ? analysisSuggestions : defaultSuggestions;

    /* Determine if we should hide (doctor routes) */
    const isHidden = location.pathname.startsWith('/doctor');

    /* ── Inject symptom-analysis context when arriving from SymptomChecker ── */
    useEffect(() => {
        if (isHidden) return;
        if (analysisResult && !hasInjectedRef.current) {
            hasInjectedRef.current = true;

            const sympNames = analysisResult.symptoms.join(', ');
            const topCondition = analysisResult.conditions[0];
            const riskEmoji = { low: '🟢', moderate: '🟡', high: '🔴' };

            const contextMsg = {
                id: Date.now(),
                from: 'bot',
                text: `📋 I see you just ran a symptom analysis! Here's what I found:\n\n`
                    + `• **Symptoms reported:** ${sympNames}\n`
                    + `• **Severity:** ${analysisResult.severity.charAt(0).toUpperCase() + analysisResult.severity.slice(1)}\n`
                    + `• **Duration:** ${analysisResult.duration}\n`
                    + `• **Most likely condition:** ${topCondition.name} (${topCondition.likelihood} likelihood)\n`
                    + `• **Risk level:** ${riskEmoji[analysisResult.riskLevel] || '⚪'} ${analysisResult.riskLevel.charAt(0).toUpperCase() + analysisResult.riskLevel.slice(1)}\n\n`
                    + `Would you like me to explain any of these findings in more detail, or help you book an appointment?`,
            };

            setMessages((prev) => [...prev, contextMsg]);
        }
    }, [analysisResult, isHidden]);

    /* Auto-scroll to bottom on new messages */
    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { id: Date.now(), from: 'user', text: input };
        const botMsg = {
            id: Date.now() + 1,
            from: 'bot',
            text: `Thanks for asking about "${input}". In a production app this would call the AI backend. For now, please consult your doctor for personalised advice. 😊`,
        };
        setMessages((prev) => [...prev, userMsg, botMsg]);
        setInput('');
    };

    const handleSuggestion = (text) => {
        setInput(text);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    /* Hide on doctor routes — AFTER all hooks */
    if (isHidden) return null;

    return (
        <>
            {/* ── Chat Panel ── */}
            <div className={`floating-ai__panel ${isOpen ? 'floating-ai__panel--open' : ''}`}>
                {/* Header */}
                <div className="floating-ai__header">
                    <div className="floating-ai__header-left">
                        <div className="floating-ai__avatar">🤖</div>
                        <div>
                            <p className="floating-ai__title">
                                Healthify AI <span className="floating-ai__online"></span>
                            </p>
                            <p className="floating-ai__subtitle">Ask me anything about your health</p>
                        </div>
                    </div>
                    <button
                        className="floating-ai__close"
                        onClick={toggleAI}
                        title="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Messages */}
                <div className="floating-ai__messages">
                    {messages.map((m) => (
                        <div key={m.id} className={`floating-ai__msg floating-ai__msg--${m.from === 'bot' ? 'bot' : 'user'}`}>
                            <span className="floating-ai__msg-icon">
                                {m.from === 'bot' ? '🤖' : '🙂'}
                            </span>
                            <div className="floating-ai__msg-bubble">{m.text}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* ── AI Suggested Actions (when analysis exists) ── */}
                {analysisResult && (
                    <div className="floating-ai__actions">
                        <div className="floating-ai__actions-label">
                            🧭 Based on your analysis:
                        </div>
                        <div className="floating-ai__actions-grid">
                            <button
                                className="floating-ai__action-btn"
                                onClick={() => { navigate('/patient/my-appointments?tab=book'); closeAI(); }}
                            >
                                📅 Book Appointment
                            </button>
                            <button
                                className="floating-ai__action-btn"
                                onClick={() => setShowConditionDetail(prev => !prev)}
                            >
                                📖 Learn About {analysisResult.conditions[0]?.name || 'Condition'}
                            </button>
                            <button
                                className="floating-ai__action-btn"
                                onClick={() => { navigate('/patient/symptom-checker'); closeAI(); }}
                            >
                                🔄 Monitor Symptoms
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Condition Detail Expandable ── */}
                {showConditionDetail && analysisResult && (
                    <div className="floating-ai__condition">
                        <div className="floating-ai__condition-header">
                            <span className="floating-ai__condition-title">
                                📖 About: {analysisResult.conditions[0]?.name}
                            </span>
                            <button
                                className="floating-ai__condition-close"
                                onClick={() => setShowConditionDetail(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="floating-ai__condition-body">
                            <p>
                                <strong>{analysisResult.conditions[0]?.name}</strong> is a common
                                condition that can cause a range of symptoms including fever, body aches,
                                and fatigue. It is typically caused by a virus and usually resolves within
                                7–10 days with proper rest and care.
                            </p>
                            <h5>🔬 Common Symptoms</h5>
                            <ul>
                                <li>Fever or chills lasting 2–5 days</li>
                                <li>Headache and body aches</li>
                                <li>Unusual fatigue and weakness</li>
                                <li>Sore throat or congestion</li>
                            </ul>
                            <h5>🩺 When to See a Doctor</h5>
                            <ul>
                                <li>Fever persists beyond 3 days or exceeds 103°F</li>
                                <li>Difficulty breathing or chest pain</li>
                                <li>Symptoms worsen after improvement</li>
                            </ul>
                            <div className="floating-ai__disclaimer">
                                ⚠️ AI-generated info for educational purposes only. Consult a healthcare professional.
                            </div>
                        </div>
                    </div>
                )}

                {/* Suggestions */}
                <div className="floating-ai__suggestions">
                    {suggestions.map((s) => (
                        <button
                            key={s}
                            className="floating-ai__suggestion"
                            onClick={() => handleSuggestion(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="floating-ai__input-row">
                    <input
                        className="floating-ai__input"
                        type="text"
                        placeholder="Type your health question…"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="floating-ai__send" onClick={handleSend} title="Send">
                        ➤
                    </button>
                </div>
            </div>

            {/* ── Floating Toggle Button ── */}
            <button
                className={`floating-ai__fab ${isOpen ? 'floating-ai__fab--active' : ''}`}
                onClick={toggleAI}
                title="AI Health Assistant"
            >
                <span className="floating-ai__fab-icon">{isOpen ? '✕' : '🤖'}</span>
            </button>
        </>
    );
};

export default FloatingAI;
