import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../../../components/common/Card';
import { useSymptoms } from '../../../context/SymptomContext';
import { useAppointments } from '../../../context/AppointmentsContext';
import './MyAppointments.css';

/* ───── Helpers ───── */
const statusClass = (status) => {
    switch (status) {
        case 'Confirmed': return 'appt-status--confirmed';
        case 'Pending': return 'appt-status--pending';
        case 'Completed': return 'appt-status--completed';
        case 'Cancelled': return 'appt-status--cancelled';
        case 'Rejected': return 'appt-status--rejected';
        default: return '';
    }
};

/* ───── Condition → Specialist mapping ───── */
const conditionToSpecialty = {
    'Viral Infection': 'General Physician',
    'Migraine': 'Neurologist',
    'Seasonal Allergies': 'ENT',
    'Skin Infection': 'Dermatologist',
    'Heart Risk': 'Cardiologist',
    'Anxiety': 'Psychiatrist',
    'Back Pain': 'Orthopedics',
};

/* ───── Mock doctors ───── */
const allDoctors = [
    { id: 'd1', name: 'Dr. Anil Gupta', specialty: 'Cardiologist' },
    { id: 'd2', name: 'Dr. Meena Iyer', specialty: 'General Physician' },
    { id: 'd3', name: 'Dr. Rakesh Singh', specialty: 'Dermatologist' },
    { id: 'd4', name: 'Dr. Sonia Patel', specialty: 'General Physician' },
    { id: 'd5', name: 'Dr. Arjun Mehta', specialty: 'Orthopedics' },
    { id: 'd6', name: 'Dr. Priya Sharma', specialty: 'ENT' },
    { id: 'd7', name: 'Dr. Neha Kapoor', specialty: 'Neurologist' },
    { id: 'd8', name: 'Dr. Vikram Rao', specialty: 'Psychiatrist' },
];

const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '11:30 AM', '02:00 PM', '03:00 PM', '04:30 PM'];

/* ───── Component ───── */
const VALID_TABS = ['upcoming', 'book', 'history'];

const MyAppointments = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    const activeTab = VALID_TABS.includes(tabParam) ? tabParam : 'upcoming';
    const { analysisResult } = useSymptoms();
    const { upcoming, past, addAppointment } = useAppointments();

    /* Dynamic tab config */
    const tabs = [
        { id: 'upcoming', icon: '📋', label: 'Upcoming Visits', count: upcoming.length },
        { id: 'book', icon: '➕', label: 'Book', count: null },
        { id: 'history', icon: '🕒', label: 'Past Visits', count: past.length },
    ];

    const setActiveTab = (tab) => {
        setSearchParams({ tab }, { replace: true });
    };

    /* Derive AI-recommended specialty from analysis context */
    const topCondition = analysisResult?.conditions?.[0]?.name || null;
    const recommendedSpecialty = topCondition
        ? conditionToSpecialty[topCondition] || 'General Physician'
        : null;

    /* Filter doctors by recommended specialty (or show all) */
    const filteredDoctors = useMemo(() => {
        if (!recommendedSpecialty) return allDoctors;
        const matched = allDoctors.filter(d => d.specialty === recommendedSpecialty);
        return matched.length > 0 ? matched : allDoctors;
    }, [recommendedSpecialty]);

    /* Booking form state */
    const [bookingForm, setBookingForm] = useState({
        doctor: '',
        date: '',
        time: '',
        reason: '',
    });
    const [bookingSuccess, setBookingSuccess] = useState(false);

    /* Auto-fill reason from symptoms (only once when analysis arrives) */
    const autoReason = analysisResult?.symptoms?.join(', ') || '';
    const displayReason = bookingForm.reason || autoReason;

    const updateField = (field, value) => {
        setBookingForm(prev => ({ ...prev, [field]: value }));
        setBookingSuccess(false);
    };

    const handleBookingSubmit = (e) => {
        e.preventDefault();
        const selectedDoctor = bookingForm.doctor || filteredDoctors[0]?.name;
        const selectedSpecialty = recommendedSpecialty
            || allDoctors.find(d => d.name === selectedDoctor)?.specialty
            || 'General';

        addAppointment({
            patientName: 'Aditya Jaiswal',
            doctor: selectedDoctor,
            specialty: selectedSpecialty,
            date: bookingForm.date,
            time: bookingForm.time,
            reason: displayReason,
        });

        console.log('📅 Appointment Booked:', {
            doctor: selectedDoctor,
            specialty: selectedSpecialty,
            date: bookingForm.date,
            time: bookingForm.time,
            reason: displayReason,
        });

        /* Reset form & switch to upcoming tab */
        setBookingForm({ doctor: '', date: '', time: '', reason: '' });
        setBookingSuccess(false);
        setSearchParams({ tab: 'upcoming' }, { replace: true });
    };

    return (
        <section className="appts">
            {/* ── Page Header ── */}
            <div className="appts__header">
                <div className="appts__header-icon">📅</div>
                <h2>My Appointments</h2>
                <p>Manage your upcoming visits and view appointment history</p>
            </div>

            {/* ── Appointment Summary Bar ── */}
            <div className="appts__summary">
                <div className="appts__summary-card">
                    <div className="appts__summary-icon appts__summary-icon--upcoming">📅</div>
                    <div className="appts__summary-info">
                        <div className="appts__summary-label">Upcoming</div>
                        <div className="appts__summary-value">{upcoming.length}</div>
                    </div>
                </div>

                <div className="appts__summary-card">
                    <div className="appts__summary-icon appts__summary-icon--completed">✅</div>
                    <div className="appts__summary-info">
                        <div className="appts__summary-label">Completed</div>
                        <div className="appts__summary-value">{past.length}</div>
                    </div>
                </div>

                <div className="appts__summary-card appts__summary-card--highlight">
                    <div className="appts__summary-icon appts__summary-icon--next">⏰</div>
                    <div className="appts__summary-info">
                        <div className="appts__summary-label">Next Visit</div>
                        {upcoming.length > 0 ? (
                            <>
                                <div className="appts__summary-value">{upcoming[0].day} {upcoming[0].month} · {upcoming[0].time}</div>
                                <div className="appts__summary-sub">{upcoming[0].doctor}</div>
                            </>
                        ) : (
                            <div className="appts__summary-value">None scheduled</div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Tab Navigation ── */}
            <div className="appts__tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`appts__tab${activeTab === tab.id ? ' appts__tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}&nbsp;{tab.label}
                        {tab.count !== null && (
                            <span className="appts__tab-badge">{tab.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* ══════════  TAB: Upcoming Appointments  ══════════ */}
            {activeTab === 'upcoming' && (
                <div className="appts__tab-content" key="upcoming">
                    <div className="appts__section">
                        <div className="appts__section-title">
                            <h3>📋 Upcoming Appointments</h3>
                            <span className="appts__count-badge">{upcoming.length}</span>
                        </div>
                        <Card>
                            {upcoming.length === 0 ? (
                                <div className="appts__empty">
                                    <p>No upcoming appointments. <strong>Book one now!</strong></p>
                                </div>
                            ) : (
                                upcoming.map((a) => (
                                    <div key={a.id} className="appt-item">
                                        <div className="appt-item__date appt-item__date--upcoming">
                                            <span className="appt-item__date-day">{a.day}</span>
                                            <span className="appt-item__date-month">{a.month}</span>
                                        </div>
                                        <div className="appt-item__info">
                                            <h4 className="appt-item__doctor">{a.doctor}</h4>
                                            <p className="appt-item__specialty">{a.specialty}</p>
                                        </div>
                                        <div className="appt-item__meta">
                                            <span className="appt-item__time">{a.time}</span>
                                            <span className={`appt-status ${statusClass(a.status)}`}>{a.status}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </Card>
                    </div>
                </div>
            )}

            {/* ══════════  TAB: Book New Appointment  ══════════ */}
            {activeTab === 'book' && (
                <div className="appts__tab-content" key="book">
                    <div className="appts__section">
                        <div className="appts__section-title">
                            <h3>➕ Book New Appointment</h3>
                        </div>

                        {/* AI Recommendation Banner */}
                        {recommendedSpecialty && (
                            <div className="appts__ai-rec">
                                <div className="appts__ai-rec-icon">🤖</div>
                                <div className="appts__ai-rec-body">
                                    <div className="appts__ai-rec-heading">AI Recommendation</div>
                                    <div className="appts__ai-rec-text">
                                        Based on your symptom analysis (<strong>{topCondition}</strong>), we recommend booking with a:
                                    </div>
                                    <div className="appts__ai-rec-specialty">
                                        🩺 {recommendedSpecialty}
                                    </div>
                                </div>
                            </div>
                        )}

                        <Card>
                            {bookingSuccess ? (
                                <div className="booking-success">
                                    <div className="booking-success__icon">✅</div>
                                    <h4 className="booking-success__title">Appointment Confirmed!</h4>
                                    <p className="booking-success__text">
                                        Your appointment with <strong>{bookingForm.doctor || filteredDoctors[0]?.name}</strong> on{' '}
                                        <strong>{bookingForm.date}</strong> at <strong>{bookingForm.time}</strong> has been booked.
                                    </p>
                                    <button
                                        className="appts__booking-btn"
                                        type="button"
                                        onClick={() => { setBookingForm({ doctor: '', date: '', time: '', reason: '' }); setBookingSuccess(false); }}
                                    >
                                        📅 Book Another
                                    </button>
                                </div>
                            ) : (
                                <form className="booking-form" onSubmit={handleBookingSubmit}>
                                    {/* Specialty (read-only when AI-filled) */}
                                    {recommendedSpecialty && (
                                        <div className="booking-form__group">
                                            <label className="booking-form__label">Specialty</label>
                                            <div className="booking-form__specialty-pill">
                                                🩺 {recommendedSpecialty}
                                            </div>
                                        </div>
                                    )}

                                    {/* Doctor */}
                                    <div className="booking-form__group">
                                        <label className="booking-form__label" htmlFor="bf-doctor">Select Doctor</label>
                                        <select
                                            id="bf-doctor"
                                            className="booking-form__select"
                                            value={bookingForm.doctor}
                                            onChange={(e) => updateField('doctor', e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Choose a doctor…</option>
                                            {filteredDoctors.map(d => (
                                                <option key={d.id} value={d.name}>
                                                    {d.name} — {d.specialty}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date */}
                                    <div className="booking-form__group">
                                        <label className="booking-form__label" htmlFor="bf-date">Select Date</label>
                                        <input
                                            id="bf-date"
                                            type="date"
                                            className="booking-form__input"
                                            value={bookingForm.date}
                                            onChange={(e) => updateField('date', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>

                                    {/* Time Slots */}
                                    <div className="booking-form__group">
                                        <label className="booking-form__label">Select Time</label>
                                        <div className="booking-form__slots">
                                            {timeSlots.map(slot => (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    className={`booking-form__slot${bookingForm.time === slot ? ' booking-form__slot--active' : ''}`}
                                                    onClick={() => updateField('time', slot)}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <div className="booking-form__group">
                                        <label className="booking-form__label" htmlFor="bf-reason">Reason for Visit</label>
                                        <textarea
                                            id="bf-reason"
                                            className="booking-form__textarea"
                                            rows="3"
                                            placeholder="Describe your reason…"
                                            value={displayReason}
                                            onChange={(e) => updateField('reason', e.target.value)}
                                        />
                                        {autoReason && !bookingForm.reason && (
                                            <span className="booking-form__hint">✨ Auto-filled from your symptom analysis</span>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="booking-form__submit"
                                        disabled={!bookingForm.doctor || !bookingForm.date || !bookingForm.time}
                                    >
                                        ✅ Confirm Appointment
                                    </button>
                                </form>
                            )}
                        </Card>
                    </div>
                </div>
            )}

            {/* ══════════  TAB: Past Appointments  ══════════ */}
            {activeTab === 'history' && (
                <div className="appts__tab-content" key="history">
                    <div className="appts__section">
                        <div className="appts__section-title">
                            <h3>🕒 Past Appointments</h3>
                            <span className="appts__count-badge">{past.length}</span>
                        </div>
                        <Card>
                            {past.map((a) => (
                                <div key={a.id} className="appt-item appt-item--past">
                                    <div className="appt-item__date appt-item__date--past">
                                        <span className="appt-item__date-day">{a.day}</span>
                                        <span className="appt-item__date-month">{a.month}</span>
                                    </div>
                                    <div className="appt-item__info">
                                        <h4 className="appt-item__doctor">{a.doctor}</h4>
                                        <p className="appt-item__specialty">{a.specialty}</p>
                                    </div>
                                    <div className="appt-item__meta">
                                        <span className="appt-item__time">{a.time}</span>
                                        <span className={`appt-status ${statusClass(a.status)}`}>{a.status}</span>
                                    </div>
                                </div>
                            ))}
                        </Card>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MyAppointments;
