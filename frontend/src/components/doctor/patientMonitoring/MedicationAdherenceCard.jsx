import React from 'react';

/* ──────────────────────────────────────────────
   MedicationAdherenceCard
   Shows medicine adherence with progress bars.

   Future: replace mock data with GET /patients/:id/medication-adherence
   ────────────────────────────────────────────── */

/* ── Mock data ── */
const MOCK_ADHERENCE = [
    {
        id: 1,
        name: 'Metformin',
        dosage: '500mg',
        frequency: '2x daily',
        startDate: 'Feb 10, 2026',
        endDate: 'May 10, 2026',
        adherence: 88,
    },
    {
        id: 2,
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: '1x daily',
        startDate: 'Feb 10, 2026',
        endDate: 'Apr 10, 2026',
        adherence: 72,
    },
    {
        id: 3,
        name: 'Atorvastatin',
        dosage: '10mg',
        frequency: '1x daily (night)',
        startDate: 'Jan 5, 2026',
        endDate: 'Apr 5, 2026',
        adherence: 95,
    },
    {
        id: 4,
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: '2x daily',
        startDate: 'Mar 1, 2026',
        endDate: 'Mar 10, 2026',
        adherence: 82,
    },
];

const getBarColor = (pct) => {
    if (pct >= 90) return '#16a34a';   // green
    if (pct >= 75) return '#2a9d8f';   // teal
    if (pct >= 50) return '#f4a261';   // orange
    return '#e76f51';                   // red
};

const getLabel = (pct) => {
    if (pct >= 90) return { text: 'Excellent', cls: 'mac__badge--green' };
    if (pct >= 75) return { text: 'Good', cls: 'mac__badge--teal' };
    if (pct >= 50) return { text: 'Moderate', cls: 'mac__badge--orange' };
    return { text: 'Low', cls: 'mac__badge--red' };
};

const MedicationAdherenceCard = () => {
    const overallAvg = Math.round(
        MOCK_ADHERENCE.reduce((s, m) => s + m.adherence, 0) / MOCK_ADHERENCE.length,
    );

    return (
        <div className="mac">
            {/* Header */}
            <div className="mac__header">
                <div className="mac__header-left">
                    <span className="mac__header-icon">💊</span>
                    <div>
                        <h3 className="mac__title">Medication Adherence</h3>
                        <p className="mac__subtitle">Tracking how consistently medicines are taken</p>
                    </div>
                </div>
                <div className="mac__overall">
                    <span className="mac__overall-pct" style={{ color: getBarColor(overallAvg) }}>
                        {overallAvg}%
                    </span>
                    <span className="mac__overall-label">Overall</span>
                </div>
            </div>

            {/* Cards */}
            <div className="mac__list">
                {MOCK_ADHERENCE.map((med) => {
                    const badge = getLabel(med.adherence);
                    return (
                        <div key={med.id} className="mac__item">
                            <div className="mac__item-top">
                                <div>
                                    <span className="mac__item-name">{med.name}</span>
                                    <span className={`mac__badge ${badge.cls}`}>{badge.text}</span>
                                </div>
                                <span className="mac__item-pct">{med.adherence}%</span>
                            </div>

                            {/* Progress bar */}
                            <div className="mac__bar-track">
                                <div
                                    className="mac__bar-fill"
                                    style={{
                                        width: `${med.adherence}%`,
                                        background: getBarColor(med.adherence),
                                    }}
                                />
                            </div>

                            {/* Meta row */}
                            <div className="mac__item-meta">
                                <span>{med.dosage} · {med.frequency}</span>
                                <span>{med.startDate} → {med.endDate}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MedicationAdherenceCard;
