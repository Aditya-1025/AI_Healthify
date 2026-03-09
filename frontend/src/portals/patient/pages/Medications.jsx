import React, { useState } from 'react';
import './Medications.css';

/* ───── Mock active medications (swap with GET /patient/medications later) ───── */
const INITIAL_MEDICATIONS = [
    {
        id: 1,
        name: 'Paracetamol',
        dosage: '500mg',
        doctor: 'Dr. Anil Gupta',
        frequency: 'Twice daily',
        instructions: 'Take after meals',
        slots: [
            { time: '8:00 AM', label: 'Morning', taken: true },
            { time: '2:00 PM', label: 'Afternoon', taken: false },
            { time: '8:00 PM', label: 'Night', taken: false },
        ],
    },
    {
        id: 2,
        name: 'Amoxicillin',
        dosage: '250mg',
        doctor: 'Dr. Meena Iyer',
        frequency: 'Three times daily',
        instructions: 'Take with water before meals',
        slots: [
            { time: '8:00 AM', label: 'Morning', taken: false },
            { time: '2:00 PM', label: 'Afternoon', taken: false },
            { time: '8:00 PM', label: 'Night', taken: false },
        ],
    },
    {
        id: 3,
        name: 'Metformin',
        dosage: '500mg',
        doctor: 'Dr. Anil Gupta',
        frequency: 'Twice daily',
        instructions: 'Take with breakfast and dinner',
        slots: [
            { time: '8:00 AM', label: 'Morning', taken: true },
            { time: '8:00 PM', label: 'Night', taken: true },
        ],
    },
    {
        id: 4,
        name: 'Amlodipine',
        dosage: '5mg',
        doctor: 'Dr. Rakesh Singh',
        frequency: 'Once daily',
        instructions: 'Take in the morning',
        slots: [
            { time: '8:00 AM', label: 'Morning', taken: false },
        ],
    },
];

/* ───── Mock medicine history ───── */
const MEDICINE_HISTORY = [
    {
        id: 101,
        name: 'Azithromycin',
        dosage: '500mg',
        doctor: 'Dr. Meena Iyer',
        specialization: 'General Medicine',
        frequency: 'Once daily',
        startDate: 'Jan 15, 2026',
        endDate: 'Jan 19, 2026',
        duration: '5 days',
        diagnosis: 'Bacterial throat infection',
        adherence: 100,
    },
    {
        id: 102,
        name: 'Ibuprofen',
        dosage: '400mg',
        doctor: 'Dr. Rakesh Singh',
        specialization: 'Orthopedics',
        frequency: 'Twice daily',
        startDate: 'Dec 1, 2025',
        endDate: 'Dec 14, 2025',
        duration: '14 days',
        diagnosis: 'Lower back pain',
        adherence: 92,
    },
    {
        id: 103,
        name: 'Cetirizine',
        dosage: '10mg',
        doctor: 'Dr. Anil Gupta',
        specialization: 'General Medicine',
        frequency: 'Once daily (night)',
        startDate: 'Nov 10, 2025',
        endDate: 'Nov 24, 2025',
        duration: '14 days',
        diagnosis: 'Seasonal allergy',
        adherence: 86,
    },
    {
        id: 104,
        name: 'Omeprazole',
        dosage: '20mg',
        doctor: 'Dr. Meena Iyer',
        specialization: 'Gastroenterology',
        frequency: 'Once daily (morning)',
        startDate: 'Oct 5, 2025',
        endDate: 'Nov 4, 2025',
        duration: '30 days',
        diagnosis: 'Acid reflux / GERD',
        adherence: 97,
    },
];

const Medications = () => {
    const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
    const [activeTab, setActiveTab] = useState('active');

    /* Mark a specific time-slot as taken */
    const markAsTaken = (medId, slotIndex) => {
        setMedications((prev) =>
            prev.map((med) => {
                if (med.id !== medId) return med;
                const slots = med.slots.map((s, i) =>
                    i === slotIndex ? { ...s, taken: true } : s
                );
                return { ...med, slots };
            })
        );
    };

    /* Mark ALL remaining slots for a medication as taken */
    const markAllTaken = (medId) => {
        setMedications((prev) =>
            prev.map((med) => {
                if (med.id !== medId) return med;
                return { ...med, slots: med.slots.map((s) => ({ ...s, taken: true })) };
            })
        );
    };

    /* Progress helpers */
    const takenCount = (med) => med.slots.filter((s) => s.taken).length;
    const totalSlots = (med) => med.slots.length;
    const pct = (med) => Math.round((takenCount(med) / totalSlots(med)) * 100);
    const allTaken = (med) => med.slots.every((s) => s.taken);

    /* Page-level stats */
    const totalMeds = medications.length;
    const totalDoses = medications.reduce((s, m) => s + m.slots.length, 0);
    const takenDoses = medications.reduce((s, m) => s + takenCount(m), 0);
    const overallPct = totalDoses ? Math.round((takenDoses / totalDoses) * 100) : 0;

    return (
        <section className="meds">
            {/* ── Header ── */}
            <div className="meds__header">
                <div className="meds__header-icon">💊</div>
                <div>
                    <h2>Medication Reminders</h2>
                    <p>Track your daily medications and never miss a dose.</p>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="meds__tabs">
                <button
                    className={`meds__tab ${activeTab === 'active' ? 'meds__tab--active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    💊 Active Medicines
                    <span className="meds__tab-count">{totalMeds}</span>
                </button>
                <button
                    className={`meds__tab ${activeTab === 'history' ? 'meds__tab--active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    📋 Medicine History
                    <span className="meds__tab-count">{MEDICINE_HISTORY.length}</span>
                </button>
            </div>

            {/* ───────── Active Medicines Tab ───────── */}
            {activeTab === 'active' && (
                <>
                    {/* ── Stats strip ── */}
                    <div className="meds__stats">
                        <div className="meds__stat">
                            <span className="meds__stat-num">{totalMeds}</span>
                            <span className="meds__stat-label">Medications</span>
                        </div>
                        <div className="meds__stat">
                            <span className="meds__stat-num">{takenDoses}/{totalDoses}</span>
                            <span className="meds__stat-label">Doses Taken</span>
                        </div>
                        <div className="meds__stat">
                            <div className="meds__stat-ring">
                                <svg viewBox="0 0 36 36" className="meds__ring-svg">
                                    <path
                                        className="meds__ring-bg"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                        className="meds__ring-fg"
                                        strokeDasharray={`${overallPct}, 100`}
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                </svg>
                                <span className="meds__ring-text">{overallPct}%</span>
                            </div>
                            <span className="meds__stat-label">Adherence</span>
                        </div>
                    </div>

                    {/* ── Cards grid ── */}
                    <div className="meds__grid">
                        {medications.map((med) => (
                            <div
                                key={med.id}
                                className={`meds__card ${allTaken(med) ? 'meds__card--done' : ''}`}
                            >
                                {/* Card header */}
                                <div className="meds__card-top">
                                    <div className="meds__card-pill">💊</div>
                                    <div className="meds__card-info">
                                        <h3 className="meds__card-name">{med.name} <span>{med.dosage}</span></h3>
                                        <p className="meds__card-doctor">Prescribed by {med.doctor}</p>
                                    </div>
                                    {allTaken(med) && (
                                        <span className="meds__badge meds__badge--done">✓ Complete</span>
                                    )}
                                </div>

                                {/* Instructions */}
                                <p className="meds__card-instructions">
                                    📝 {med.instructions} &middot; {med.frequency}
                                </p>

                                {/* Progress bar */}
                                <div className="meds__progress-row">
                                    <div className="meds__progress-bar">
                                        <div
                                            className="meds__progress-fill"
                                            style={{ width: `${pct(med)}%` }}
                                        />
                                    </div>
                                    <span className="meds__progress-text">
                                        {takenCount(med)}/{totalSlots(med)}
                                    </span>
                                </div>

                                {/* Time slots */}
                                <div className="meds__slots">
                                    {med.slots.map((slot, i) => (
                                        <div
                                            key={i}
                                            className={`meds__slot ${slot.taken ? 'meds__slot--taken' : ''}`}
                                        >
                                            <div className="meds__slot-left">
                                                <span className="meds__slot-icon">
                                                    {slot.taken ? '✅' : '⏰'}
                                                </span>
                                                <div>
                                                    <span className="meds__slot-time">{slot.time}</span>
                                                    <span className="meds__slot-label">{slot.label}</span>
                                                </div>
                                            </div>

                                            {slot.taken ? (
                                                <span className="meds__badge meds__badge--taken">Taken</span>
                                            ) : (
                                                <button
                                                    className="meds__take-btn"
                                                    onClick={() => markAsTaken(med.id, i)}
                                                >
                                                    Mark Taken
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Mark all button */}
                                {!allTaken(med) && (
                                    <button
                                        className="meds__mark-all"
                                        onClick={() => markAllTaken(med.id)}
                                    >
                                        ✓ Mark All as Taken
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ───────── Medicine History Tab ───────── */}
            {activeTab === 'history' && (
                <div className="meds__history">
                    <div className="meds__history-grid">
                        {MEDICINE_HISTORY.map((h) => (
                            <div key={h.id} className="meds__hcard">
                                {/* Header */}
                                <div className="meds__hcard-top">
                                    <div className="meds__hcard-pill">💊</div>
                                    <div className="meds__hcard-info">
                                        <h3 className="meds__hcard-name">{h.name} <span>{h.dosage}</span></h3>
                                        <p className="meds__hcard-doctor">
                                            👨‍⚕️ {h.doctor}
                                            <span className="meds__hcard-spec"> · {h.specialization}</span>
                                        </p>
                                    </div>
                                    <span className="meds__badge meds__badge--completed">✓ Completed</span>
                                </div>

                                {/* Diagnosis */}
                                <div className="meds__hcard-diagnosis">
                                    <span className="meds__hcard-diag-label">Diagnosis</span>
                                    <span className="meds__hcard-diag-value">{h.diagnosis}</span>
                                </div>

                                {/* Details grid */}
                                <div className="meds__hcard-details">
                                    <div className="meds__hcard-detail">
                                        <span className="meds__hcard-detail-label">Frequency</span>
                                        <span className="meds__hcard-detail-value">{h.frequency}</span>
                                    </div>
                                    <div className="meds__hcard-detail">
                                        <span className="meds__hcard-detail-label">Duration</span>
                                        <span className="meds__hcard-detail-value">{h.duration}</span>
                                    </div>
                                    <div className="meds__hcard-detail">
                                        <span className="meds__hcard-detail-label">Start Date</span>
                                        <span className="meds__hcard-detail-value">{h.startDate}</span>
                                    </div>
                                    <div className="meds__hcard-detail">
                                        <span className="meds__hcard-detail-label">End Date</span>
                                        <span className="meds__hcard-detail-value">{h.endDate}</span>
                                    </div>
                                </div>

                                {/* Adherence bar */}
                                <div className="meds__hcard-adherence">
                                    <div className="meds__hcard-adh-row">
                                        <span className="meds__hcard-adh-label">Adherence</span>
                                        <span className="meds__hcard-adh-pct">{h.adherence}%</span>
                                    </div>
                                    <div className="meds__progress-bar">
                                        <div
                                            className="meds__progress-fill meds__progress-fill--history"
                                            style={{ width: `${h.adherence}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Medications;
