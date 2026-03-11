import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSymptoms } from '../../context/SymptomContext';
import { useAIUI } from '../../context/AIUIContext';
import { api } from '../../services/api';
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
    const [isLoading, setIsLoading] = useState(false);
    const [bookingState, setBookingState] = useState(null); // null, 'selectDoctor', 'selectTime', 'confirm'
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableDoctors, setAvailableDoctors] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
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

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMessage = input.trim().toLowerCase();
        const userMsg = { id: Date.now(), from: 'user', text: input.trim() };
        
        // Add user message to chat
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        
        // Check if user wants to book appointment
        if (userMessage.includes('book') && userMessage.includes('appointment')) {
            setIsLoading(true);
            await startAppointmentBooking();
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            // Call local knowledge base chatbot endpoint
            const response = await api.post('/chatbot/chat', { message: input.trim() });
            let botResponse = response.response;
            
            // Add confidence info if available
            if (response.confidence && response.confidence > 0) {
                botResponse += `\n\n_(Confidence: ${Math.round(response.confidence * 100)}%)_`;
            }
            
            const botMsg = {
                id: Date.now() + 1,
                from: 'bot',
                text: botResponse,
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 1,
                from: 'bot',
                text: `Sorry, I encountered an error: ${error.message}. Please try again or consult your doctor. 😊`,
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const startAppointmentBooking = async () => {
        try {
            // Fetch available doctors
            const doctorsRes = await api.get('/chatbot/doctors-list');
            
            if (!doctorsRes.available || !doctorsRes.doctors || doctorsRes.doctors.length === 0) {
                const errorMsg = {
                    id: Date.now(),
                    from: 'bot',
                    text: '❌ No doctors available at the moment. Please try again later.',
                };
                setMessages((prev) => [...prev, errorMsg]);
                return;
            }
            
            setAvailableDoctors(doctorsRes.doctors);
            setBookingState('selectDoctor');
            
            const botMsg = {
                id: Date.now(),
                from: 'bot',
                text: '👨‍⚕️ Great! Which doctor would you like to book an appointment with?',
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = {
                id: Date.now(),
                from: 'bot',
                text: `Error loading doctors: ${error.message}`,
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
    };

    const handleDoctorSelection = async (doctor) => {
        setSelectedDoctor(doctor);
        
        const userMsg = {
            id: Date.now(),
            from: 'user',
            text: `I'd like to book with ${doctor.name} (${doctor.specialization})`,
        };
        setMessages((prev) => [...prev, userMsg]);
        
        try {
            // Fetch available time slots
            const slotsRes = await api.get('/chatbot/available-slots');
            setAvailableSlots(slotsRes.available_slots || []);
            setBookingState('selectTime');
            
            const botMsg = {
                id: Date.now() + 1,
                from: 'bot',
                text: '📅 Now, please select your preferred appointment time:',
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 1,
                from: 'bot',
                text: `Error loading time slots: ${error.message}`,
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
    };

    const handleTimeSelection = async (slot) => {
        setSelectedTime(slot);
        
        const userMsg = {
            id: Date.now(),
            from: 'user',
            text: `I want to book at ${slot.display}`,
        };
        setMessages((prev) => [...prev, userMsg]);
        
        const botMsg = {
            id: Date.now() + 1,
            from: 'bot',
            text: `✅ Confirm booking with ${selectedDoctor.name} on ${slot.display}? (Fee: ₹${selectedDoctor.fee})`,
        };
        setMessages((prev) => [...prev, botMsg]);
        setBookingState('confirm');
    };

    const confirmBooking = async () => {
        if (!selectedDoctor || !selectedTime) {
            const errorMsg = {
                id: Date.now(),
                from: 'bot',
                text: 'Something went wrong. Please start over.',
            };
            setMessages((prev) => [...prev, errorMsg]);
            setBookingState(null);
            return;
        }

        setIsLoading(true);
        
        try {
            // Get user ID from localStorage (set during login)
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            if (!userStr || !token) {
                throw new Error('User not logged in');
            }
            
            const user = JSON.parse(userStr);
            
            // Book appointment
            const bookRes = await api.post('/chatbot/book-appointment', {
                user_id: user.id,
                doctor_id: selectedDoctor.id,
                time: `${selectedTime.date} ${selectedTime.time}`
            });
            
            if (bookRes.success) {
                const confirmMsg = {
                    id: Date.now(),
                    from: 'user',
                    text: 'Yes, confirm booking',
                };
                setMessages((prev) => [...prev, confirmMsg]);
                
                const successMsg = {
                    id: Date.now() + 1,
                    from: 'bot',
                    text: `${bookRes.message}\n\n📋 **Appointment Details:**\n` +
                        `• Doctor: ${bookRes.appointment.doctor_name}\n` +
                        `• Specialization: ${bookRes.appointment.doctor_specialization}\n` +
                        `• Date & Time: ${bookRes.appointment.appointment_time}\n` +
                        `• Status: ${bookRes.appointment.status}\n\n` +
                        `Your doctor will be waiting for you. 👋`,
                };
                setMessages((prev) => [...prev, successMsg]);
            } else {
                throw new Error(bookRes.message);
            }
            
            // Reset booking state
            setBookingState(null);
            setSelectedDoctor(null);
            setSelectedTime(null);
        } catch (error) {
            const errorMsg = {
                id: Date.now(),
                from: 'bot',
                text: `❌ Booking failed: ${error.message}. Please try again.`,
            };
            setMessages((prev) => [...prev, errorMsg]);
            setBookingState(null);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelBooking = () => {
        const cancelMsg = {
            id: Date.now(),
            from: 'user',
            text: 'Cancel booking',
        };
        setMessages((prev) => [...prev, cancelMsg]);
        
        const botMsg = {
            id: Date.now() + 1,
            from: 'bot',
            text: 'Booking cancelled. How else can I help you? 😊',
        };
        setMessages((prev) => [...prev, botMsg]);
        
        setBookingState(null);
        setSelectedDoctor(null);
        setSelectedTime(null);
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
                                Healthify Assistant <span className="floating-ai__online"></span>
                            </p>
                            <p className="floating-ai__subtitle">Local knowledge base Q&A</p>
                        </div>
                    {isLoading && (
                        <div className="floating-ai__msg floating-ai__msg--bot">
                            <span className="floating-ai__msg-icon">🤖</span>
                            <div className="floating-ai__msg-bubble floating-ai__msg-bubble--loading">
                                <span className="floating-ai__typing-dot"></span>
                                <span className="floating-ai__typing-dot"></span>
                                <span className="floating-ai__typing-dot"></span>
                            </div>
                        </div>
                    )}
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
                    
                    {/* Doctor Selection */}
                    {bookingState === 'selectDoctor' && availableDoctors.length > 0 && (
                        <div className="floating-ai__doctor-selection">
                            {availableDoctors.map((doctor) => (
                                <button
                                    key={doctor.id}
                                    className="floating-ai__doctor-btn"
                                    onClick={() => handleDoctorSelection(doctor)}
                                    disabled={isLoading}
                                >
                                    <div className="floating-ai__doctor-name">{doctor.name}</div>
                                    <div className="floating-ai__doctor-specialty">{doctor.specialization}</div>
                                    <div className="floating-ai__doctor-fee">₹{doctor.fee}</div>
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {/* Time Slot Selection */}
                    {bookingState === 'selectTime' && availableSlots.length > 0 && (
                        <div className="floating-ai__slots-grid">
                            {availableSlots.slice(0, 8).map((slot, idx) => (
                                <button
                                    key={idx}
                                    className="floating-ai__slot-btn"
                                    onClick={() => handleTimeSelection(slot)}
                                    disabled={isLoading}
                                >
                                    {slot.display}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {/* Confirmation Buttons */}
                    {bookingState === 'confirm' && (
                        <div className="floating-ai__confirmation">
                            <button
                                className="floating-ai__confirm-btn floating-ai__confirm-btn--yes"
                                onClick={confirmBooking}
                                disabled={isLoading}
                            >
                                ✅ Confirm
                            </button>
                            <button
                                className="floating-ai__confirm-btn floating-ai__confirm-btn--no"
                                onClick={cancelBooking}
                                disabled={isLoading}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    )}
                    
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
                        disabled={isLoading}
                    />
                    <button 
                        className="floating-ai__send" 
                        onClick={handleSend} 
                        title="Send"
                        disabled={isLoading}
                    >
                        {isLoading ? '⏳' : '➤'}
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
