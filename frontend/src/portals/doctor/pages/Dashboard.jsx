import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import { useAppointments } from '../../../context/AppointmentsContext';
import './Dashboard.css';

/* ───── Patient ID lookup (maps patient name → id) ───── */
const PATIENT_ID_MAP = {
    'Priya Sharma': 1,
    'Rahul Verma': 2,
    'Sneha Patil': 3,
    'Amit Deshmukh': 4,
    'Neha Kulkarni': 5,
    'Vikram Rao': 6,
};

/* ───── All patients (for quick search) ───── */
const ALL_PATIENTS = [
    { id: 1, name: 'Priya Sharma', conditions: 'Hypertension, Diabetes', avatar: 'PS' },
    { id: 2, name: 'Rahul Verma', conditions: 'Asthma', avatar: 'RV' },
    { id: 3, name: 'Sneha Patil', conditions: 'Migraine, Anxiety', avatar: 'SP' },
    { id: 4, name: 'Amit Deshmukh', conditions: 'Cardiac', avatar: 'AD' },
    { id: 5, name: 'Neha Kulkarni', conditions: 'No conditions', avatar: 'NK' },
    { id: 6, name: 'Vikram Rao', conditions: 'ENT', avatar: 'VR' },
];

/* ───── Recent activity feed ───── */
const RECENT_ACTIVITY = [
    { id: 1, icon: '💊', text: 'Prescription added for Priya Sharma', type: 'prescription', time: '2 hours ago' },
    { id: 2, icon: '✅', text: 'Appointment confirmed for Amit Deshmukh', type: 'appointment', time: '3 hours ago' },
    { id: 3, icon: '📋', text: 'Vitals updated for Vikram Rao', type: 'vitals', time: '4 hours ago' },
    { id: 4, icon: '📅', text: 'Neha Kulkarni booked an appointment', type: 'appointment', time: '5 hours ago' },
    { id: 5, icon: '🩺', text: 'Consultation completed with Rahul Verma', type: 'consultation', time: '6 hours ago' },
];

/* ───── Stat cards ───── */
const stats = [
    { id: 1, icon: '🩺', label: 'Total Patients', value: '1,248', trend: '+12%', up: true, color: 'primary' },
    { id: 2, icon: '📅', label: 'Appointments Today', value: '24', trend: '+4%', up: true, color: 'info' },
    { id: 3, icon: '💊', label: 'Prescriptions', value: '386', trend: '-2%', up: false, color: 'warning' },
    { id: 4, icon: '⭐', label: 'Satisfaction Rate', value: '97%', trend: '+1%', up: true, color: 'accent' },
];

/* ───── Quick actions ───── */
const quickActions = [
    { id: 1, icon: '➕', label: 'New Patient', desc: 'Register a new patient', route: '/doctor/patients' },
    { id: 2, icon: '📋', label: 'Book Appointment', desc: 'Schedule a new visit', route: '/doctor/appointments' },
    { id: 3, icon: '💉', label: 'Add Prescription', desc: 'Create a prescription', route: '/doctor/prescriptions' },
    { id: 4, icon: '📊', label: 'View Reports', desc: 'Lab results & diagnostics', route: null },
];

/* ───── Greeting helper ───── */
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
};

/* ────────── Component ────────── */
const Dashboard = () => {
    const navigate = useNavigate();
    const { appointments } = useAppointments();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

    /* Doctor's upcoming appointments (non-completed, non-cancelled) */
    const CURRENT_DOCTOR = 'Dr. Anil Gupta';
    const doctorAppts = useMemo(() =>
        appointments
            .filter(a => a.doctor === CURRENT_DOCTOR && a.status !== 'Completed' && a.status !== 'Cancelled')
            .slice(0, 5),
        [appointments]
    );

    /* Pending count */
    const pendingCount = useMemo(() =>
        appointments.filter(a => a.doctor === CURRENT_DOCTOR && a.status === 'Pending').length,
        [appointments]
    );

    /* Today's schedule — all confirmed appointments sorted by time */
    const todaySchedule = useMemo(() =>
        appointments
            .filter(a => a.doctor === CURRENT_DOCTOR && (a.status === 'Confirmed' || a.status === 'Pending'))
            .sort((a, b) => a.time.localeCompare(b.time))
            .slice(0, 6),
        [appointments]
    );

    /* Patient search results */
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        return ALL_PATIENTS.filter(p =>
            p.name.toLowerCase().includes(q) || p.conditions.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    const getPatientId = (name) => PATIENT_ID_MAP[name] || 1;

    return (
        <section className="dashboard">
            {/* ── Greeting ── */}
            <div className="dashboard__greeting">
                <h2>{getGreeting()}, Dr. Gupta 👋</h2>
                <p>Here&#39;s what&#39;s happening at your clinic today.</p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="dashboard__stats">
                {stats.map((s) => (
                    <Card key={s.id} className="stat-card">
                        <div className={`stat-card__icon stat-card__icon--${s.color}`}>
                            {s.icon}
                        </div>
                        <p className="stat-card__value">{s.value}</p>
                        <p className="stat-card__label">{s.label}</p>
                        <span className={`stat-card__trend stat-card__trend--${s.up ? 'up' : 'down'}`}>
                            {s.up ? '↑' : '↓'} {s.trend}
                        </span>
                    </Card>
                ))}
            </div>

            {/* ── Pending Alert + Patient Search (row) ── */}
            <div className="dashboard__alert-search-row">
                {/* Pending Appointments Alert */}
                {pendingCount > 0 && (
                    <div className="dashboard__pending-alert">
                        <div className="dashboard__pending-alert-left">
                            <span className="dashboard__pending-pulse"></span>
                            <span className="dashboard__pending-icon">⚠️</span>
                            <div>
                                <strong>{pendingCount} Pending Appointment{pendingCount > 1 ? 's' : ''}</strong>
                                <span>Require your review</span>
                            </div>
                        </div>
                        <button
                            className="dashboard__pending-btn"
                            onClick={() => navigate('/doctor/appointments')}
                        >
                            Review Now →
                        </button>
                    </div>
                )}

                {/* Patient Quick Search */}
                <div className={`dashboard__search ${searchFocused ? 'dashboard__search--focused' : ''}`}>
                    <span className="dashboard__search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                        className="dashboard__search-input"
                    />
                    {searchQuery && (
                        <button className="dashboard__search-clear" onClick={() => setSearchQuery('')}>✕</button>
                    )}

                    {/* Search dropdown */}
                    {searchFocused && searchQuery && (
                        <div className="dashboard__search-dropdown">
                            {searchResults.length > 0 ? (
                                searchResults.map((p) => (
                                    <div
                                        key={p.id}
                                        className="dashboard__search-result"
                                        onMouseDown={() => navigate(`/doctor/patients/${p.id}`)}
                                    >
                                        <div className="dashboard__search-avatar">{p.avatar}</div>
                                        <div>
                                            <strong>{p.name}</strong>
                                            <span>{p.conditions}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="dashboard__search-empty">No patients found</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Main grid: 3-column layout ── */}
            <div className="dashboard__body">
                {/* ═══ LEFT: Today's Schedule ═══ */}
                <div className="dashboard__col dashboard__col--schedule">
                    <Card>
                        <div className="dashboard__section-header">
                            <div className="dashboard__section-title">
                                <span className="dashboard__section-icon">📋</span>
                                <h3>Today's Schedule</h3>
                            </div>
                            <span className="dashboard__section-badge">{todaySchedule.length} visits</span>
                        </div>

                        <div className="sched-list">
                            {todaySchedule.length > 0 ? (
                                todaySchedule.map((a, i) => (
                                    <div key={a.id} className={`sched-item ${a.status === 'Pending' ? 'sched-item--pending' : ''}`}>
                                        <div className="sched-item__time-col">
                                            <span className="sched-item__time">{a.time}</span>
                                            {i < todaySchedule.length - 1 && <div className="sched-item__line" />}
                                        </div>
                                        <div className="sched-item__info">
                                            <strong>{a.patientName || 'Patient'}</strong>
                                            <span>{a.specialty}</span>
                                        </div>
                                        <span className={`sched-item__status sched-item__status--${a.status.toLowerCase()}`}>
                                            {a.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="dashboard__empty-mini">
                                    <span>📭</span>
                                    <p>No appointments scheduled</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* ═══ CENTER: Upcoming Appointments ═══ */}
                <div className="dashboard__col dashboard__col--appointments">
                    <Card>
                        <div className="dashboard__section-header">
                            <div className="dashboard__section-title">
                                <span className="dashboard__section-icon">📅</span>
                                <h3>Upcoming Appointments</h3>
                            </div>
                            <Link to="/doctor/appointments" className="dashboard__view-all">View all →</Link>
                        </div>

                        <div className="appt-list">
                            {doctorAppts.length > 0 ? (
                                doctorAppts.map((a) => (
                                    <div key={a.id} className={`appt-item ${a.status === 'Pending' ? 'appt-item--highlight' : ''}`}>
                                        <div className={`appt-item__date ${a.status === 'Pending' ? 'appt-item__date--pending' : ''}`}>
                                            <span className="appt-item__day">{a.day}</span>
                                            <span className="appt-item__month">{a.month}</span>
                                        </div>

                                        <div className="appt-item__info">
                                            <h4>{a.patientName || 'Patient'}</h4>
                                            <p>{a.specialty} · {a.time}</p>
                                            {a.reason && <p className="appt-item__reason">💬 {a.reason}</p>}
                                        </div>

                                        <div className="appt-item__right">
                                            <span className={`appt-item__status appt-item__status--${a.status.toLowerCase()}`}>
                                                {a.status}
                                            </span>
                                            <div className="appt-item__actions">
                                                <button
                                                    className="appt-item__btn appt-item__btn--primary"
                                                    onClick={() => navigate(`/doctor/patients/${getPatientId(a.patientName)}`)}
                                                >
                                                    🩺 Start Consultation
                                                </button>
                                                <button
                                                    className="appt-item__btn appt-item__btn--secondary"
                                                    onClick={() => navigate(`/doctor/patients/${getPatientId(a.patientName)}`)}
                                                >
                                                    👤 View Patient
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="dashboard__empty-mini">
                                    <span>📭</span>
                                    <p>No upcoming appointments</p>
                                </div>
                            )}
                        </div>

                        {/* Footer link — always visible below the scrollable list */}
                        {doctorAppts.length > 0 && (
                            <div className="appt-list__footer">
                                <Link to="/doctor/appointments" className="appt-list__footer-link">
                                    View All Appointments →
                                </Link>
                            </div>
                        )}
                    </Card>
                </div>

                {/* ═══ RIGHT: Activity + Quick Actions ═══ */}
                <div className="dashboard__col dashboard__col--sidebar">
                    {/* Recent Activity */}
                    <Card>
                        <div className="dashboard__section-header">
                            <div className="dashboard__section-title">
                                <span className="dashboard__section-icon">🕘</span>
                                <h3>Recent Activity</h3>
                            </div>
                        </div>

                        <div className="activity-feed">
                            {RECENT_ACTIVITY.map((a) => (
                                <div key={a.id} className="activity-item">
                                    <span className="activity-item__icon">{a.icon}</span>
                                    <div className="activity-item__content">
                                        <p>{a.text}</p>
                                        <span className="activity-item__time">{a.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <div className="dashboard__section-header">
                            <div className="dashboard__section-title">
                                <span className="dashboard__section-icon">⚡</span>
                                <h3>Quick Actions</h3>
                            </div>
                        </div>

                        <div className="quick-actions__grid">
                            {quickActions.map((q) => (
                                <button
                                    key={q.id}
                                    className="quick-action"
                                    onClick={() => q.route && navigate(q.route)}
                                >
                                    <span className="quick-action__icon">{q.icon}</span>
                                    <div>
                                        <span className="quick-action__label">{q.label}</span>
                                        <p className="quick-action__desc">{q.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
