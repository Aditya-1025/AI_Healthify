import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HealthTrendsPanel from '../../../components/doctor/patientMonitoring/HealthTrendsPanel';
import MedicationAdherenceCard from '../../../components/doctor/patientMonitoring/MedicationAdherenceCard';
import PatientAlerts from '../../../components/doctor/patientMonitoring/PatientAlerts';
import '../../../components/doctor/patientMonitoring/PatientMonitoring.css';
import './PatientDetails.css';

/* ───── Full patient mock data ───── */
const PATIENTS_DB = [
    {
        id: 1,
        name: 'Priya Sharma',
        age: 34,
        gender: 'Female',
        phone: '+91 98765 43210',
        email: 'priya.sharma@email.com',
        address: '42 MG Road, Pune, Maharashtra',
        bloodGroup: 'B+',
        status: 'Active',
        conditions: ['Hypertension', 'Diabetes'],
        allergies: ['Penicillin', 'Sulfa drugs'],
        emergencyContact: 'Ravi Sharma — +91 99887 76655',
        vitals: {
            bp: '140/90 mmHg',
            heartRate: '82 bpm',
            weight: '68 kg',
            temperature: '98.4°F',
            spo2: '98%',
            bmi: '24.2',
            lastRecorded: 'Mar 5, 2026',
        },
        prescriptions: [
            { id: 1, date: 'Mar 5, 2026', diagnosis: 'Hypertension — Stage 2', medicines: 2, status: 'Active' },
            { id: 3, date: 'Feb 10, 2026', diagnosis: 'Diabetes Management', medicines: 3, status: 'Completed' },
        ],
        appointments: [
            { date: 'Mar 20, 2026', time: '10:00 AM', type: 'Cardiology Follow-up', doctor: 'Dr. Anil Gupta', status: 'Scheduled' },
            { date: 'Apr 5, 2026', time: '11:30 AM', type: 'Routine Checkup', doctor: 'Dr. Meena Iyer', status: 'Scheduled' },
        ],
        history: [
            { date: 'Mar 5, 2026', event: 'Prescribed Metformin & Amlodipine', type: 'Prescription' },
            { date: 'Feb 14, 2026', event: 'General consultation — vitals recorded', type: 'Visit' },
            { date: 'Feb 10, 2026', event: 'Diabetes medication adjusted', type: 'Prescription' },
            { date: 'Jan 20, 2026', event: 'Blood work — HbA1c: 6.8%', type: 'Lab Report' },
            { date: 'Jan 5, 2026', event: 'Initial consultation — Hypertension diagnosed', type: 'Visit' },
        ],
    },
    {
        id: 2,
        name: 'Rahul Verma',
        age: 28,
        gender: 'Male',
        phone: '+91 87654 32109',
        email: 'rahul.verma@email.com',
        address: '18 Baner, Pune, Maharashtra',
        bloodGroup: 'O+',
        status: 'Active',
        conditions: ['Asthma'],
        allergies: ['Dust', 'Pollen'],
        emergencyContact: 'Sunita Verma — +91 88776 65544',
        vitals: {
            bp: '120/80 mmHg',
            heartRate: '78 bpm',
            weight: '72 kg',
            temperature: '98.6°F',
            spo2: '97%',
            bmi: '23.1',
            lastRecorded: 'Mar 3, 2026',
        },
        prescriptions: [
            { id: 2, date: 'Mar 3, 2026', diagnosis: 'Viral Infection', medicines: 3, status: 'Active' },
        ],
        appointments: [
            { date: 'Mar 10, 2026', time: '2:00 PM', type: 'Follow-up — Viral Infection', doctor: 'Dr. Meena Iyer', status: 'Scheduled' },
        ],
        history: [
            { date: 'Mar 3, 2026', event: 'Treated for viral infection with respiratory issues', type: 'Visit' },
            { date: 'Feb 20, 2026', event: 'Asthma review — inhaler prescription renewed', type: 'Prescription' },
            { date: 'Jan 15, 2026', event: 'Pulmonary function test — Normal', type: 'Lab Report' },
        ],
    },
    {
        id: 3,
        name: 'Sneha Patil',
        age: 45,
        gender: 'Female',
        phone: '+91 76543 21098',
        email: 'sneha.patil@email.com',
        address: '7 Koregaon Park, Pune, Maharashtra',
        bloodGroup: 'A-',
        status: 'Active',
        conditions: ['Migraine', 'Anxiety'],
        allergies: ['NSAIDs'],
        emergencyContact: 'Anand Patil — +91 77665 54433',
        vitals: {
            bp: '118/76 mmHg',
            heartRate: '70 bpm',
            weight: '62 kg',
            temperature: '98.6°F',
            spo2: '99%',
            bmi: '22.5',
            lastRecorded: 'Feb 28, 2026',
        },
        prescriptions: [
            { id: 3, date: 'Feb 28, 2026', diagnosis: 'Chronic Migraine with Aura', medicines: 2, status: 'Completed' },
        ],
        appointments: [
            { date: 'Mar 28, 2026', time: '9:30 AM', type: 'Neurology Follow-up', doctor: 'Dr. Rakesh Singh', status: 'Scheduled' },
        ],
        history: [
            { date: 'Feb 28, 2026', event: 'Migraine treatment — Sumatriptan & Propranolol', type: 'Prescription' },
            { date: 'Feb 10, 2026', event: 'MRI scan — No abnormalities', type: 'Lab Report' },
            { date: 'Jan 30, 2026', event: 'Initial neurology consultation', type: 'Visit' },
        ],
    },
    {
        id: 4,
        name: 'Amit Deshmukh',
        age: 52,
        gender: 'Male',
        phone: '+91 65432 10987',
        email: 'amit.d@email.com',
        address: '101 Kothrud, Pune, Maharashtra',
        bloodGroup: 'AB+',
        status: 'Follow-up',
        conditions: ['Cardiac'],
        allergies: [],
        emergencyContact: 'Kavita Deshmukh — +91 66554 43322',
        vitals: {
            bp: '130/85 mmHg',
            heartRate: '68 bpm',
            weight: '80 kg',
            temperature: '98.2°F',
            spo2: '96%',
            bmi: '27.8',
            lastRecorded: 'Feb 25, 2026',
        },
        prescriptions: [
            { id: 4, date: 'Feb 25, 2026', diagnosis: 'Post-Angioplasty Follow-up', medicines: 4, status: 'Active' },
        ],
        appointments: [
            { date: 'Mar 25, 2026', time: '10:00 AM', type: 'Cardiac Review', doctor: 'Dr. Anil Gupta', status: 'Scheduled' },
            { date: 'Apr 25, 2026', time: '10:00 AM', type: 'Treadmill Test', doctor: 'Dr. Anil Gupta', status: 'Scheduled' },
        ],
        history: [
            { date: 'Feb 25, 2026', event: 'Post-angioplasty follow-up — medications renewed', type: 'Prescription' },
            { date: 'Feb 22, 2026', event: 'ECG & Echocardiogram — Stable', type: 'Lab Report' },
            { date: 'Feb 1, 2026', event: 'Angioplasty procedure completed', type: 'Visit' },
            { date: 'Jan 25, 2026', event: 'Chest pain — Emergency admission', type: 'Visit' },
        ],
    },
    {
        id: 5,
        name: 'Neha Kulkarni',
        age: 31,
        gender: 'Female',
        phone: '+91 54321 09876',
        email: 'neha.k@email.com',
        address: '25 Hadapsar, Pune, Maharashtra',
        bloodGroup: 'O-',
        status: 'Inactive',
        conditions: [],
        allergies: [],
        emergencyContact: 'Prasad Kulkarni — +91 55443 32211',
        vitals: {
            bp: '115/75 mmHg',
            heartRate: '74 bpm',
            weight: '58 kg',
            temperature: '98.6°F',
            spo2: '99%',
            bmi: '21.3',
            lastRecorded: 'Feb 10, 2026',
        },
        prescriptions: [],
        appointments: [],
        history: [
            { date: 'Feb 10, 2026', event: 'Annual health checkup — all clear', type: 'Visit' },
        ],
    },
    {
        id: 6,
        name: 'Vikram Rao',
        age: 40,
        gender: 'Male',
        phone: '+91 43210 98765',
        email: 'vikram.r@email.com',
        address: '56 Aundh, Pune, Maharashtra',
        bloodGroup: 'A+',
        status: 'Active',
        conditions: ['ENT'],
        allergies: ['Aspirin'],
        emergencyContact: 'Lakshmi Rao — +91 44332 21100',
        vitals: {
            bp: '125/82 mmHg',
            heartRate: '76 bpm',
            weight: '75 kg',
            temperature: '98.8°F',
            spo2: '98%',
            bmi: '25.0',
            lastRecorded: 'Jan 18, 2026',
        },
        prescriptions: [],
        appointments: [
            { date: 'Mar 15, 2026', time: '3:00 PM', type: 'ENT Follow-up', doctor: 'Dr. Sanjay Kumar', status: 'Scheduled' },
        ],
        history: [
            { date: 'Jan 18, 2026', event: 'ENT consultation — Sinusitis treatment', type: 'Visit' },
            { date: 'Jan 10, 2026', event: 'CT scan — Sinus inflammation', type: 'Lab Report' },
        ],
    },
];

const HISTORY_ICONS = {
    Prescription: '💊',
    Visit: '🏥',
    'Lab Report': '🧪',
};

const HISTORY_COLORS = {
    Prescription: 'ptd__timeline-dot--rx',
    Visit: 'ptd__timeline-dot--visit',
    'Lab Report': 'ptd__timeline-dot--lab',
};

const STATUS_MAP = {
    Active: { cls: 'ptd__status--active', label: '● Active' },
    'Follow-up': { cls: 'ptd__status--followup', label: '🔄 Follow-up' },
    Inactive: { cls: 'ptd__status--inactive', label: '○ Inactive' },
};

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const patient = PATIENTS_DB.find((p) => String(p.id) === id);

    if (!patient) {
        return (
            <section className="ptd">
                <div className="ptd__empty">
                    <span className="ptd__empty-icon">🔍</span>
                    <h2>Patient Not Found</h2>
                    <p>The patient record you're looking for doesn't exist.</p>
                    <button className="ptd__btn ptd__btn--primary" onClick={() => navigate('/doctor/patients')}>
                        ← Back to Patients
                    </button>
                </div>
            </section>
        );
    }

    const initials = patient.name.split(' ').map((w) => w[0]).join('');
    const st = STATUS_MAP[patient.status] || STATUS_MAP.Active;

    return (
        <section className="ptd">
            {/* ── Top bar ── */}
            <div className="ptd__topbar">
                <button className="ptd__back" onClick={() => navigate('/doctor/patients')}>
                    ← Back to Patients
                </button>
            </div>

            {/* ── Hero card ── */}
            <div className="ptd__hero">
                <div className="ptd__hero-left">
                    <div className="ptd__hero-avatar">{initials}</div>
                    <div className="ptd__hero-info">
                        <h2>{patient.name}</h2>
                        <p>{patient.age} years · {patient.gender} · Blood Group: <strong>{patient.bloodGroup}</strong></p>
                        <div className="ptd__hero-tags">
                            {patient.conditions.length > 0
                                ? patient.conditions.map((c) => (
                                    <span key={c} className="ptd__tag">{c}</span>
                                ))
                                : <span className="ptd__tag ptd__tag--none">No conditions</span>
                            }
                        </div>
                    </div>
                </div>
                <div className="ptd__hero-right">
                    <span className={`ptd__status ${st.cls}`}>{st.label}</span>
                    <span className="ptd__patient-id">PT-{String(patient.id).padStart(4, '0')}</span>
                </div>
            </div>

            {/* ── Contact strip ── */}
            <div className="ptd__contact-strip">
                <div className="ptd__contact-item">
                    <span className="ptd__contact-icon">📞</span>
                    <div>
                        <span className="ptd__contact-label">Phone</span>
                        <strong>{patient.phone}</strong>
                    </div>
                </div>
                <div className="ptd__contact-item">
                    <span className="ptd__contact-icon">📧</span>
                    <div>
                        <span className="ptd__contact-label">Email</span>
                        <strong>{patient.email}</strong>
                    </div>
                </div>
                <div className="ptd__contact-item">
                    <span className="ptd__contact-icon">📍</span>
                    <div>
                        <span className="ptd__contact-label">Address</span>
                        <strong>{patient.address}</strong>
                    </div>
                </div>
                <div className="ptd__contact-item">
                    <span className="ptd__contact-icon">🚨</span>
                    <div>
                        <span className="ptd__contact-label">Emergency Contact</span>
                        <strong>{patient.emergencyContact}</strong>
                    </div>
                </div>
            </div>

            {/* ── Main grid ── */}
            <div className="ptd__grid">
                {/* ── Left column ── */}
                <div className="ptd__col">
                    {/* Vitals card */}
                    <div className="ptd__card">
                        <div className="ptd__card-head">
                            <span className="ptd__card-head-icon">❤️</span>
                            <h3>Current Vitals</h3>
                            <span className="ptd__card-meta">Last recorded: {patient.vitals.lastRecorded}</span>
                        </div>
                        <div className="ptd__vitals-grid">
                            <div className="ptd__vital">
                                <span className="ptd__vital-emoji">🩸</span>
                                <span className="ptd__vital-label">Blood Pressure</span>
                                <strong>{patient.vitals.bp}</strong>
                            </div>
                            <div className="ptd__vital">
                                <span className="ptd__vital-emoji">💓</span>
                                <span className="ptd__vital-label">Heart Rate</span>
                                <strong>{patient.vitals.heartRate}</strong>
                            </div>
                            <div className="ptd__vital">
                                <span className="ptd__vital-emoji">⚖️</span>
                                <span className="ptd__vital-label">Weight</span>
                                <strong>{patient.vitals.weight}</strong>
                            </div>
                            <div className="ptd__vital">
                                <span className="ptd__vital-emoji">🌡️</span>
                                <span className="ptd__vital-label">Temperature</span>
                                <strong>{patient.vitals.temperature}</strong>
                            </div>
                            <div className="ptd__vital">
                                <span className="ptd__vital-emoji">🫁</span>
                                <span className="ptd__vital-label">SpO2</span>
                                <strong>{patient.vitals.spo2}</strong>
                            </div>
                            <div className="ptd__vital">
                                <span className="ptd__vital-emoji">📊</span>
                                <span className="ptd__vital-label">BMI</span>
                                <strong>{patient.vitals.bmi}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Medical info card */}
                    <div className="ptd__card">
                        <div className="ptd__card-head">
                            <span className="ptd__card-head-icon">🏥</span>
                            <h3>Medical Information</h3>
                        </div>
                        <div className="ptd__med-info">
                            <div className="ptd__med-section">
                                <span className="ptd__med-section-label">Conditions</span>
                                <div className="ptd__tags">
                                    {patient.conditions.length > 0
                                        ? patient.conditions.map((c) => (
                                            <span key={c} className="ptd__tag">{c}</span>
                                        ))
                                        : <span className="ptd__empty-text">No recorded conditions</span>
                                    }
                                </div>
                            </div>
                            <div className="ptd__med-section">
                                <span className="ptd__med-section-label">Allergies</span>
                                <div className="ptd__tags">
                                    {patient.allergies.length > 0
                                        ? patient.allergies.map((a) => (
                                            <span key={a} className="ptd__tag ptd__tag--danger">{a}</span>
                                        ))
                                        : <span className="ptd__empty-text">No known allergies</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right column ── */}
                <div className="ptd__col">
                    {/* Prescriptions card */}
                    <div className="ptd__card">
                        <div className="ptd__card-head">
                            <span className="ptd__card-head-icon">💊</span>
                            <h3>Prescriptions</h3>
                            <span className="ptd__badge">{patient.prescriptions.length}</span>
                        </div>
                        {patient.prescriptions.length > 0 ? (
                            <div className="ptd__rx-list">
                                {patient.prescriptions.map((rx) => (
                                    <div key={rx.id} className="ptd__rx-row">
                                        <div className="ptd__rx-info">
                                            <strong>{rx.diagnosis}</strong>
                                            <span>{rx.date} · {rx.medicines} medicines</span>
                                        </div>
                                        <div className="ptd__rx-actions">
                                            <span className={`ptd__rx-status ${rx.status === 'Active' ? 'ptd__rx-status--active' : 'ptd__rx-status--completed'}`}>
                                                {rx.status}
                                            </span>
                                            <button
                                                className="ptd__rx-view"
                                                onClick={() => navigate(`/doctor/prescriptions/${rx.id}`)}
                                            >
                                                View →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="ptd__empty-text">No prescriptions yet.</p>
                        )}
                    </div>

                    {/* Appointments card */}
                    <div className="ptd__card">
                        <div className="ptd__card-head">
                            <span className="ptd__card-head-icon">📅</span>
                            <h3>Upcoming Appointments</h3>
                            <span className="ptd__badge">{patient.appointments.length}</span>
                        </div>
                        {patient.appointments.length > 0 ? (
                            <div className="ptd__apt-list">
                                {patient.appointments.map((apt, i) => (
                                    <div key={i} className="ptd__apt-row">
                                        <div className="ptd__apt-date-block">
                                            <span className="ptd__apt-day">{apt.date.split(' ')[1]?.replace(',', '')}</span>
                                            <span className="ptd__apt-month">{apt.date.split(' ')[0]}</span>
                                        </div>
                                        <div className="ptd__apt-info">
                                            <strong>{apt.type}</strong>
                                            <span>{apt.doctor} · {apt.time}</span>
                                        </div>
                                        <span className="ptd__apt-badge">{apt.status}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="ptd__empty-text">No upcoming appointments.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Timeline (full-width) ── */}
            <div className="ptd__card ptd__card--full">
                <div className="ptd__card-head">
                    <span className="ptd__card-head-icon">🕘</span>
                    <h3>Activity Timeline</h3>
                </div>
                <div className="ptd__timeline">
                    {patient.history.map((item, i) => (
                        <div key={i} className="ptd__timeline-item">
                            <div className={`ptd__timeline-dot ${HISTORY_COLORS[item.type] || ''}`}>
                                {HISTORY_ICONS[item.type] || '📌'}
                            </div>
                            <div className="ptd__timeline-content">
                                <span className="ptd__timeline-date">{item.date}</span>
                                <span className="ptd__timeline-event">{item.event}</span>
                                <span className={`ptd__timeline-type`}>{item.type}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══════════ Patient Monitoring Panel ══════════ */}
            <div className="ptd__monitoring">
                {/* Monitor header + quick actions */}
                <div className="ptd__monitoring-header">
                    <div className="ptd__monitoring-header-left">
                        <div className="ptd__monitoring-badge">📡</div>
                        <div>
                            <h3>Patient Monitoring Panel</h3>
                            <p>Real-time health insights, medication tracking, and alerts</p>
                        </div>
                    </div>
                    <div className="ptd__monitoring-actions">
                        <button
                            className="ptd__monitoring-action-btn ptd__monitoring-action-btn--primary"
                            onClick={() => navigate('/doctor/dashboard')}
                        >
                            🩺 Start Consultation
                        </button>
                        <button
                            className="ptd__monitoring-action-btn"
                            onClick={() => navigate('/doctor/prescriptions')}
                        >
                            ✍️ Write Prescription
                        </button>
                        <button
                            className="ptd__monitoring-action-btn"
                            onClick={() => navigate(`/doctor/patients/${id}`)}
                        >
                            📋 View Full History
                        </button>
                    </div>
                </div>

                {/* Section 1 — Health Trends (Recharts) */}
                <HealthTrendsPanel patientName={patient.name} />

                {/* Section 2 + 3 — Adherence & Alerts side by side */}
                <div className="ptd__grid">
                    <div className="ptd__col">
                        <MedicationAdherenceCard />
                    </div>
                    <div className="ptd__col">
                        <PatientAlerts />
                    </div>
                </div>
            </div>

            {/* ── Bottom actions ── */}
            <div className="ptd__actions">
                <button className="ptd__btn ptd__btn--secondary" onClick={() => navigate('/doctor/patients')}>
                    ← Back to Patients
                </button>
                <div className="ptd__actions-right">
                    <button className="ptd__btn ptd__btn--outline">
                        🖨️ Print Record
                    </button>
                    <button className="ptd__btn ptd__btn--primary" onClick={() => navigate('/doctor/prescriptions')}>
                        ✍️ Write Prescription
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PatientDetails;
