import React, { useState, useMemo } from 'react';
import Card from '../../../components/common/Card';
import { useAppointments } from '../../../context/AppointmentsContext';
import './DoctorAppointments.css';

/* ───── Currently logged-in doctor (swap with auth context later) ───── */
const CURRENT_DOCTOR = 'Dr. Anil Gupta';

/* ───── Filter config ───── */
const STATUS_FILTERS = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'Pending', label: 'Pending', icon: '⏳' },
    { id: 'Confirmed', label: 'Confirmed', icon: '✅' },
    { id: 'Rejected', label: 'Rejected', icon: '❌' },
];

/* ───── Time slot options ───── */
const TIME_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM',
];

/* ───── Status helpers ───── */
const statusClass = (status) => {
    switch (status) {
        case 'Confirmed': return 'doc-appt-status--confirmed';
        case 'Pending': return 'doc-appt-status--pending';
        case 'Rejected': return 'doc-appt-status--rejected';
        case 'Completed': return 'doc-appt-status--completed';
        case 'Cancelled': return 'doc-appt-status--cancelled';
        default: return '';
    }
};

const statusIcon = (status) => {
    switch (status) {
        case 'Confirmed': return '✅';
        case 'Pending': return '⏳';
        case 'Rejected': return '❌';
        case 'Completed': return '✔️';
        default: return '•';
    }
};

/* ───── Component ───── */
const DoctorAppointments = () => {
    const { appointments, updateAppointmentStatus, rescheduleAppointment } = useAppointments();
    const [activeFilter, setActiveFilter] = useState('all');
    const [actionFeedback, setActionFeedback] = useState(null); // { id, action }

    /* Reschedule modal state */
    const [rescheduleTarget, setRescheduleTarget] = useState(null); // appointment object
    const [rescheduleDate, setRescheduleDate] = useState('');
    const [rescheduleTime, setRescheduleTime] = useState('');

    /* Only show appointments assigned to this doctor */
    const doctorAppts = useMemo(() =>
        appointments.filter(a => a.doctor === CURRENT_DOCTOR),
        [appointments]
    );

    /* Apply status filter */
    const filteredAppts = useMemo(() => {
        if (activeFilter === 'all') return doctorAppts;
        return doctorAppts.filter(a => a.status === activeFilter);
    }, [doctorAppts, activeFilter]);

    /* Counts for badges */
    const counts = useMemo(() => ({
        all: doctorAppts.length,
        Pending: doctorAppts.filter(a => a.status === 'Pending').length,
        Confirmed: doctorAppts.filter(a => a.status === 'Confirmed').length,
        Rejected: doctorAppts.filter(a => a.status === 'Rejected').length,
    }), [doctorAppts]);

    /* Handle accept / reject */
    const handleAction = (id, action) => {
        const newStatus = action === 'accept' ? 'Confirmed' : 'Rejected';
        updateAppointmentStatus(id, newStatus);
        setActionFeedback({ id, action });
        setTimeout(() => setActionFeedback(null), 2000);
    };

    /* Open reschedule modal */
    const openReschedule = (appt) => {
        setRescheduleTarget(appt);
        setRescheduleDate('');
        setRescheduleTime('');
    };

    /* Close reschedule modal */
    const closeReschedule = () => {
        setRescheduleTarget(null);
        setRescheduleDate('');
        setRescheduleTime('');
    };

    /* Confirm reschedule */
    const confirmReschedule = () => {
        if (!rescheduleDate || !rescheduleTime) return;
        rescheduleAppointment(rescheduleTarget.id, rescheduleDate, rescheduleTime);
        setActionFeedback({ id: rescheduleTarget.id, action: 'reschedule' });
        setTimeout(() => setActionFeedback(null), 2500);
        closeReschedule();
    };

    /* Today's date string for the min attr */
    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <section className="doc-appts">
            {/* ── Page Header ── */}
            <div className="doc-appts__header">
                <div className="doc-appts__header-icon">📥</div>
                <div>
                    <h2>Appointment Inbox</h2>
                    <p>Manage incoming appointment requests from patients</p>
                </div>
            </div>

            {/* ── Stats Bar ── */}
            <div className="doc-appts__stats">
                <div className="doc-appts__stat-card doc-appts__stat-card--pending">
                    <span className="doc-appts__stat-icon">⏳</span>
                    <div>
                        <div className="doc-appts__stat-value">{counts.Pending}</div>
                        <div className="doc-appts__stat-label">Pending</div>
                    </div>
                </div>
                <div className="doc-appts__stat-card doc-appts__stat-card--confirmed">
                    <span className="doc-appts__stat-icon">✅</span>
                    <div>
                        <div className="doc-appts__stat-value">{counts.Confirmed}</div>
                        <div className="doc-appts__stat-label">Confirmed</div>
                    </div>
                </div>
                <div className="doc-appts__stat-card doc-appts__stat-card--rejected">
                    <span className="doc-appts__stat-icon">❌</span>
                    <div>
                        <div className="doc-appts__stat-value">{counts.Rejected}</div>
                        <div className="doc-appts__stat-label">Rejected</div>
                    </div>
                </div>
                <div className="doc-appts__stat-card doc-appts__stat-card--total">
                    <span className="doc-appts__stat-icon">📋</span>
                    <div>
                        <div className="doc-appts__stat-value">{counts.all}</div>
                        <div className="doc-appts__stat-label">Total</div>
                    </div>
                </div>
            </div>

            {/* ── Filter Pills ── */}
            <div className="doc-appts__filters">
                {STATUS_FILTERS.map((f) => (
                    <button
                        key={f.id}
                        type="button"
                        className={`doc-appts__filter${activeFilter === f.id ? ' doc-appts__filter--active' : ''}`}
                        onClick={() => setActiveFilter(f.id)}
                    >
                        {f.icon}&nbsp;{f.label}
                        <span className="doc-appts__filter-badge">{counts[f.id]}</span>
                    </button>
                ))}
            </div>

            {/* ── Action Feedback Toast ── */}
            {actionFeedback && (
                <div className={`doc-appts__toast doc-appts__toast--${actionFeedback.action}`}>
                    {actionFeedback.action === 'accept' && '✅ Appointment confirmed!'}
                    {actionFeedback.action === 'reject' && '❌ Appointment rejected'}
                    {actionFeedback.action === 'reschedule' && '📅 Appointment rescheduled & confirmed!'}
                </div>
            )}

            {/* ── Appointments List ── */}
            <div className="doc-appts__list">
                {filteredAppts.length === 0 ? (
                    <Card>
                        <div className="doc-appts__empty">
                            <div className="doc-appts__empty-icon">📭</div>
                            <h4>No {activeFilter !== 'all' ? activeFilter.toLowerCase() : ''} appointments</h4>
                            <p>Appointment requests from patients will appear here.</p>
                        </div>
                    </Card>
                ) : (
                    filteredAppts.map((appt) => (
                        <div key={appt.id} className={`doc-appt-card ${appt.status === 'Pending' ? 'doc-appt-card--pending' : ''}`}>
                            {/* Pending glow indicator */}
                            {appt.status === 'Pending' && <div className="doc-appt-card__pulse" />}

                            {/* Date badge */}
                            <div className={`doc-appt-card__date ${appt.status === 'Pending' ? 'doc-appt-card__date--pending' : 'doc-appt-card__date--default'}`}>
                                <span className="doc-appt-card__date-day">{appt.day}</span>
                                <span className="doc-appt-card__date-month">{appt.month}</span>
                            </div>

                            {/* Info */}
                            <div className="doc-appt-card__info">
                                <h4 className="doc-appt-card__patient">{appt.patientName || 'Patient'}</h4>
                                <p className="doc-appt-card__specialty">{appt.specialty}</p>
                                {appt.reason && (
                                    <p className="doc-appt-card__reason">💬 {appt.reason}</p>
                                )}
                            </div>

                            {/* Time & Status */}
                            <div className="doc-appt-card__meta">
                                <span className="doc-appt-card__time">🕐 {appt.time}</span>
                                <span className={`doc-appt-status ${statusClass(appt.status)}`}>
                                    {statusIcon(appt.status)} {appt.status}
                                </span>
                            </div>

                            {/* Action buttons (only for pending) */}
                            {appt.status === 'Pending' && (
                                <div className="doc-appt-card__actions">
                                    <button
                                        type="button"
                                        className="doc-appt-card__btn doc-appt-card__btn--accept"
                                        onClick={() => handleAction(appt.id, 'accept')}
                                    >
                                        ✓ Accept
                                    </button>
                                    <button
                                        type="button"
                                        className="doc-appt-card__btn doc-appt-card__btn--reschedule"
                                        onClick={() => openReschedule(appt)}
                                    >
                                        📅 Reschedule
                                    </button>
                                    <button
                                        type="button"
                                        className="doc-appt-card__btn doc-appt-card__btn--reject"
                                        onClick={() => handleAction(appt.id, 'reject')}
                                    >
                                        ✕ Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* ── Reschedule Modal ── */}
            {rescheduleTarget && (
                <div className="doc-appts__overlay" onClick={closeReschedule}>
                    <div className="doc-appts__modal" onClick={(e) => e.stopPropagation()}>
                        {/* Modal header */}
                        <div className="doc-appts__modal-header">
                            <div className="doc-appts__modal-icon">📅</div>
                            <div>
                                <h3>Reschedule Appointment</h3>
                                <p>Choose a new date and time for this appointment</p>
                            </div>
                            <button className="doc-appts__modal-close" onClick={closeReschedule}>✕</button>
                        </div>

                        {/* Patient info strip */}
                        <div className="doc-appts__modal-patient">
                            <div className="doc-appts__modal-avatar">
                                {rescheduleTarget.patientName?.charAt(0) || 'P'}
                            </div>
                            <div>
                                <strong>{rescheduleTarget.patientName || 'Patient'}</strong>
                                <span>{rescheduleTarget.specialty} · Currently {rescheduleTarget.day} {rescheduleTarget.month} at {rescheduleTarget.time}</span>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="doc-appts__modal-form">
                            <div className="doc-appts__modal-field">
                                <label>New Date</label>
                                <input
                                    type="date"
                                    className="doc-appts__modal-input"
                                    value={rescheduleDate}
                                    min={todayStr}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                />
                            </div>
                            <div className="doc-appts__modal-field">
                                <label>New Time</label>
                                <select
                                    className="doc-appts__modal-input"
                                    value={rescheduleTime}
                                    onChange={(e) => setRescheduleTime(e.target.value)}
                                >
                                    <option value="">Select a time slot</option>
                                    {TIME_SLOTS.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Preview of new schedule */}
                        {rescheduleDate && rescheduleTime && (
                            <div className="doc-appts__modal-preview">
                                <span className="doc-appts__modal-preview-icon">✨</span>
                                <span>
                                    New schedule: <strong>{new Date(rescheduleDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong> at <strong>{rescheduleTime}</strong>
                                </span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="doc-appts__modal-actions">
                            <button className="doc-appts__modal-btn doc-appts__modal-btn--cancel" onClick={closeReschedule}>
                                Cancel
                            </button>
                            <button
                                className="doc-appts__modal-btn doc-appts__modal-btn--confirm"
                                disabled={!rescheduleDate || !rescheduleTime}
                                onClick={confirmReschedule}
                            >
                                ✓ Confirm Reschedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default DoctorAppointments;
