import React, { useState } from 'react';
import './Prescriptions.css';

/* ───── Mock data (swap with GET /patient/prescriptions later) ───── */
const PRESCRIPTIONS = [
    {
        id: 1,
        doctor: 'Dr. Anil Gupta',
        specialization: 'Cardiology',
        date: 'Feb 27, 2026',
        diagnosis: 'Hypertension',
        notes: 'Follow up in 2 weeks. Monitor blood pressure daily.',
        medicines: [
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' },
            { name: 'Amlodipine', dosage: '5mg', frequency: 'Morning', duration: '30 days' },
        ],
    },
    {
        id: 2,
        doctor: 'Dr. Meena Iyer',
        specialization: 'General Medicine',
        date: 'Mar 3, 2026',
        diagnosis: 'Viral Infection',
        notes: 'Rest and hydration. Come back if fever persists beyond 5 days.',
        medicines: [
            { name: 'Paracetamol', dosage: '500mg', frequency: 'Thrice daily', duration: '5 days' },
            { name: 'Vitamin C', dosage: '1000mg', frequency: 'Once daily', duration: '14 days' },
            { name: 'Cetirizine', dosage: '10mg', frequency: 'Night', duration: '5 days' },
        ],
    },
    {
        id: 3,
        doctor: 'Dr. Rakesh Singh',
        specialization: 'Dermatology',
        date: 'Mar 10, 2026',
        diagnosis: 'Allergic Dermatitis',
        notes: 'Avoid exposure to allergens. Apply cream on affected area twice daily.',
        medicines: [
            { name: 'Betamethasone Cream', dosage: '0.1%', frequency: 'Twice daily (topical)', duration: '10 days' },
            { name: 'Fexofenadine', dosage: '120mg', frequency: 'Once daily', duration: '14 days' },
        ],
    },
];

const Prescriptions = () => {
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    return (
        <section className="rx">
            {/* ── Header ── */}
            <div className="rx__header">
                <div className="rx__header-icon">📄</div>
                <div>
                    <h2>Prescriptions</h2>
                    <p>View prescriptions provided by your doctors.</p>
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="rx__stats">
                <div className="rx__stat">
                    <span className="rx__stat-num">{PRESCRIPTIONS.length}</span>
                    <span className="rx__stat-label">Total Prescriptions</span>
                </div>
                <div className="rx__stat">
                    <span className="rx__stat-num">
                        {PRESCRIPTIONS.reduce((s, p) => s + p.medicines.length, 0)}
                    </span>
                    <span className="rx__stat-label">Medicines Prescribed</span>
                </div>
                <div className="rx__stat">
                    <span className="rx__stat-num">
                        {new Set(PRESCRIPTIONS.map((p) => p.doctor)).size}
                    </span>
                    <span className="rx__stat-label">Doctors</span>
                </div>
            </div>

            {/* ── Prescription cards ── */}
            <div className="rx__list">
                {PRESCRIPTIONS.map((rx) => {
                    const isExpanded = expandedId === rx.id;
                    return (
                        <div
                            key={rx.id}
                            className={`rx__card ${isExpanded ? 'rx__card--expanded' : ''}`}
                        >
                            {/* Card header */}
                            <div className="rx__card-top">
                                <div className="rx__card-avatar">
                                    {rx.doctor.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                                </div>
                                <div className="rx__card-info">
                                    <h3>{rx.doctor}</h3>
                                    <p className="rx__card-spec">{rx.specialization}</p>
                                </div>
                                <span className="rx__card-date">🗓️ {rx.date}</span>
                            </div>

                            {/* Diagnosis */}
                            <div className="rx__diagnosis">
                                <span className="rx__diagnosis-label">Diagnosis</span>
                                <span className="rx__diagnosis-value">{rx.diagnosis}</span>
                            </div>

                            {/* Medicines table */}
                            <div className="rx__meds-section">
                                <div className="rx__meds-label">💊 Medicines</div>
                                <div className="rx__meds-table">
                                    <div className="rx__meds-row rx__meds-row--header">
                                        <span>Medicine</span>
                                        <span>Dosage</span>
                                        <span>Frequency</span>
                                        <span>Duration</span>
                                    </div>
                                    {rx.medicines.map((m, i) => (
                                        <div key={i} className="rx__meds-row">
                                            <span className="rx__med-name">{m.name}</span>
                                            <span className="rx__med-dosage">{m.dosage}</span>
                                            <span className="rx__med-freq">{m.frequency}</span>
                                            <span className="rx__med-dur">{m.duration}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notes (shown when expanded) */}
                            {isExpanded && (
                                <div className="rx__notes">
                                    <span className="rx__notes-label">📝 Doctor's Notes</span>
                                    <p>{rx.notes}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="rx__actions">
                                <button
                                    className="rx__btn rx__btn--primary"
                                    onClick={() => toggleExpand(rx.id)}
                                >
                                    {isExpanded ? '▲ Hide Details' : '▼ View Details'}
                                </button>
                                <button className="rx__btn rx__btn--outline">
                                    📥 Download PDF
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Prescriptions;
