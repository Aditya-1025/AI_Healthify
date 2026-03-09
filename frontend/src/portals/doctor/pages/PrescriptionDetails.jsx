import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PrescriptionDetails.css';

/* ───── Full prescription mock data ───── */
const PRESCRIPTIONS_DB = [
    {
        id: 1,
        patient: 'Priya Sharma',
        age: 34,
        gender: 'Female',
        phone: '+91 98765 43210',
        email: 'priya.sharma@email.com',
        conditions: ['Hypertension', 'Diabetes'],
        diagnosis: 'Hypertension — Stage 2',
        date: 'Mar 5, 2026',
        followUp: 'Apr 5, 2026',
        doctor: 'Dr. Anil Gupta',
        specialization: 'Cardiologist',
        status: 'Active',
        medicines: [
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days', instructions: 'Take after meals' },
            { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning' },
        ],
        notes: 'Reduce salt intake. Monitor blood pressure daily. Follow up after 30 days. Avoid strenuous exercise until next visit.',
        vitals: { bp: '140/90 mmHg', heartRate: '82 bpm', weight: '68 kg', temperature: '98.4°F' },
    },
    {
        id: 2,
        patient: 'Rahul Verma',
        age: 28,
        gender: 'Male',
        phone: '+91 87654 32109',
        email: 'rahul.verma@email.com',
        conditions: ['Asthma'],
        diagnosis: 'Viral Infection with respiratory complications',
        date: 'Mar 3, 2026',
        followUp: 'Mar 10, 2026',
        doctor: 'Dr. Meena Iyer',
        specialization: 'General Physician',
        status: 'Active',
        medicines: [
            { name: 'Paracetamol', dosage: '500mg', frequency: 'Three times daily', duration: '5 days', instructions: 'Take after meals' },
            { name: 'Azithromycin', dosage: '500mg', frequency: 'Once daily', duration: '3 days', instructions: 'Take on empty stomach' },
            { name: 'Vitamin C', dosage: '1000mg', frequency: 'Once daily', duration: '10 days', instructions: 'Take with breakfast' },
        ],
        notes: 'Rest for at least 3 days. Stay hydrated. Avoid cold beverages. Use inhaler if breathing difficulty occurs.',
        vitals: { bp: '120/80 mmHg', heartRate: '78 bpm', weight: '72 kg', temperature: '100.2°F' },
    },
    {
        id: 3,
        patient: 'Sneha Patil',
        age: 45,
        gender: 'Female',
        phone: '+91 76543 21098',
        email: 'sneha.patil@email.com',
        conditions: ['Migraine', 'Anxiety'],
        diagnosis: 'Chronic Migraine with Aura',
        date: 'Feb 28, 2026',
        followUp: 'Mar 28, 2026',
        doctor: 'Dr. Rakesh Singh',
        specialization: 'Neurologist',
        status: 'Completed',
        medicines: [
            { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '30 days', instructions: 'Take at onset of migraine' },
            { name: 'Propranolol', dosage: '40mg', frequency: 'Twice daily', duration: '30 days', instructions: 'Preventive — take daily' },
        ],
        notes: 'Maintain a headache diary. Avoid bright lights and loud environments during episodes. Practice relaxation techniques.',
        vitals: { bp: '118/76 mmHg', heartRate: '70 bpm', weight: '62 kg', temperature: '98.6°F' },
    },
    {
        id: 4,
        patient: 'Amit Deshmukh',
        age: 52,
        gender: 'Male',
        phone: '+91 65432 10987',
        email: 'amit.d@email.com',
        conditions: ['Cardiac'],
        diagnosis: 'Post-Angioplasty Follow-up',
        date: 'Feb 25, 2026',
        followUp: 'Mar 25, 2026',
        doctor: 'Dr. Anil Gupta',
        specialization: 'Cardiologist',
        status: 'Active',
        medicines: [
            { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take after breakfast' },
            { name: 'Clopidogrel', dosage: '75mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take with Aspirin' },
            { name: 'Atorvastatin', dosage: '40mg', frequency: 'Night only', duration: '90 days', instructions: 'Take at bedtime' },
            { name: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily', duration: '90 days', instructions: 'Take after meals' },
        ],
        notes: 'Strict diet control. Walk 30 min daily. No lifting heavy objects. Monthly blood work required. Report any chest pain immediately.',
        vitals: { bp: '130/85 mmHg', heartRate: '68 bpm', weight: '80 kg', temperature: '98.2°F' },
    },
];

const PrescriptionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const rx = PRESCRIPTIONS_DB.find((p) => String(p.id) === id);

    if (!rx) {
        return (
            <section className="rxd">
                <div className="rxd__empty">
                    <span className="rxd__empty-icon">🔍</span>
                    <h2>Prescription Not Found</h2>
                    <p>The prescription you're looking for doesn't exist or has been removed.</p>
                    <button className="rxd__btn rxd__btn--primary" onClick={() => navigate('/doctor/prescriptions')}>
                        ← Back to Prescriptions
                    </button>
                </div>
            </section>
        );
    }

    const initials = rx.patient.split(' ').map((w) => w[0]).join('');

    return (
        <section className="rxd">
            {/* ── Top bar ── */}
            <div className="rxd__topbar">
                <button className="rxd__back" onClick={() => navigate('/doctor/prescriptions')}>
                    ← Back
                </button>
                <div className="rxd__topbar-right">
                    <span className={`rxd__status ${rx.status === 'Active' ? 'rxd__status--active' : 'rxd__status--completed'}`}>
                        {rx.status === 'Active' ? '● ' : '✓ '}
                        {rx.status}
                    </span>
                    <span className="rxd__rx-id">RX-{String(rx.id).padStart(4, '0')}</span>
                </div>
            </div>

            {/* ── Header ── */}
            <div className="rxd__header">
                <div className="rxd__header-icon">📋</div>
                <div>
                    <h2>Prescription Details</h2>
                    <p>Issued on {rx.date} · Follow-up: {rx.followUp}</p>
                </div>
            </div>

            {/* ── Main grid ── */}
            <div className="rxd__grid">
                {/* ── Left column ── */}
                <div className="rxd__col-left">
                    {/* Patient card */}
                    <div className="rxd__card">
                        <div className="rxd__card-head">
                            <span className="rxd__card-head-icon">👤</span>
                            <h3>Patient Information</h3>
                        </div>
                        <div className="rxd__patient-row">
                            <div className="rxd__patient-avatar">{initials}</div>
                            <div className="rxd__patient-info">
                                <strong>{rx.patient}</strong>
                                <span>{rx.age} years · {rx.gender}</span>
                            </div>
                        </div>
                        <div className="rxd__detail-grid">
                            <div className="rxd__detail-item">
                                <span className="rxd__detail-label">📞 Phone</span>
                                <span className="rxd__detail-value">{rx.phone}</span>
                            </div>
                            <div className="rxd__detail-item">
                                <span className="rxd__detail-label">📧 Email</span>
                                <span className="rxd__detail-value">{rx.email}</span>
                            </div>
                            <div className="rxd__detail-item rxd__detail-item--full">
                                <span className="rxd__detail-label">🏥 Conditions</span>
                                <div className="rxd__tags">
                                    {rx.conditions.map((c) => (
                                        <span key={c} className="rxd__tag">{c}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doctor & Diagnosis card */}
                    <div className="rxd__card">
                        <div className="rxd__card-head">
                            <span className="rxd__card-head-icon">🩺</span>
                            <h3>Prescription Information</h3>
                        </div>
                        <div className="rxd__detail-grid">
                            <div className="rxd__detail-item">
                                <span className="rxd__detail-label">Doctor</span>
                                <span className="rxd__detail-value">{rx.doctor}</span>
                            </div>
                            <div className="rxd__detail-item">
                                <span className="rxd__detail-label">Specialization</span>
                                <span className="rxd__detail-value">{rx.specialization}</span>
                            </div>
                            <div className="rxd__detail-item">
                                <span className="rxd__detail-label">Date</span>
                                <span className="rxd__detail-value">{rx.date}</span>
                            </div>
                            <div className="rxd__detail-item">
                                <span className="rxd__detail-label">Follow-up</span>
                                <span className="rxd__detail-value">{rx.followUp}</span>
                            </div>
                            <div className="rxd__detail-item rxd__detail-item--full">
                                <span className="rxd__detail-label">Diagnosis</span>
                                <span className="rxd__detail-value rxd__detail-value--diagnosis">{rx.diagnosis}</span>
                            </div>
                        </div>
                    </div>

                    {/* Vitals card */}
                    <div className="rxd__card">
                        <div className="rxd__card-head">
                            <span className="rxd__card-head-icon">❤️</span>
                            <h3>Vitals at Visit</h3>
                        </div>
                        <div className="rxd__vitals-grid">
                            <div className="rxd__vital">
                                <span className="rxd__vital-icon">🩸</span>
                                <div>
                                    <span className="rxd__vital-label">Blood Pressure</span>
                                    <strong>{rx.vitals.bp}</strong>
                                </div>
                            </div>
                            <div className="rxd__vital">
                                <span className="rxd__vital-icon">💓</span>
                                <div>
                                    <span className="rxd__vital-label">Heart Rate</span>
                                    <strong>{rx.vitals.heartRate}</strong>
                                </div>
                            </div>
                            <div className="rxd__vital">
                                <span className="rxd__vital-icon">⚖️</span>
                                <div>
                                    <span className="rxd__vital-label">Weight</span>
                                    <strong>{rx.vitals.weight}</strong>
                                </div>
                            </div>
                            <div className="rxd__vital">
                                <span className="rxd__vital-icon">🌡️</span>
                                <div>
                                    <span className="rxd__vital-label">Temperature</span>
                                    <strong>{rx.vitals.temperature}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right column ── */}
                <div className="rxd__col-right">
                    {/* Medicines table */}
                    <div className="rxd__card">
                        <div className="rxd__card-head">
                            <span className="rxd__card-head-icon">💊</span>
                            <h3>Prescribed Medicines</h3>
                            <span className="rxd__badge">{rx.medicines.length}</span>
                        </div>
                        <div className="rxd__table-wrap">
                            <table className="rxd__table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Medicine</th>
                                        <th>Dosage</th>
                                        <th>Frequency</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rx.medicines.map((med, i) => (
                                        <tr key={i}>
                                            <td><span className="rxd__med-num">{i + 1}</span></td>
                                            <td>
                                                <strong>{med.name}</strong>
                                                <span className="rxd__med-instruction">{med.instructions}</span>
                                            </td>
                                            <td><span className="rxd__pill">{med.dosage}</span></td>
                                            <td>{med.frequency}</td>
                                            <td>{med.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Doctor notes */}
                    <div className="rxd__card">
                        <div className="rxd__card-head">
                            <span className="rxd__card-head-icon">📝</span>
                            <h3>Doctor's Notes</h3>
                        </div>
                        <div className="rxd__notes">
                            {rx.notes.split('. ').map((sentence, i) => (
                                <div key={i} className="rxd__note-item">
                                    <span className="rxd__note-bullet">•</span>
                                    <span>{sentence}{sentence.endsWith('.') ? '' : '.'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom actions ── */}
            <div className="rxd__actions">
                <button className="rxd__btn rxd__btn--secondary" onClick={() => navigate('/doctor/prescriptions')}>
                    ← Back to Prescriptions
                </button>
                <div className="rxd__actions-right">
                    <button className="rxd__btn rxd__btn--outline" onClick={() => window.print()}>
                        🖨️ Print Prescription
                    </button>
                    <button className="rxd__btn rxd__btn--primary">
                        ✏️ Edit Prescription
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PrescriptionDetails;
