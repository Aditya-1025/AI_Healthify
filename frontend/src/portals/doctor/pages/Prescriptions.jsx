import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Prescriptions.css';

/* ───── Mock patient list (swap with API later) ───── */
const PATIENTS = [
    { id: 1, name: 'Priya Sharma', age: 34, gender: 'Female' },
    { id: 2, name: 'Rahul Verma', age: 28, gender: 'Male' },
    { id: 3, name: 'Sneha Patil', age: 45, gender: 'Female' },
    { id: 4, name: 'Amit Deshmukh', age: 52, gender: 'Male' },
    { id: 5, name: 'Neha Kulkarni', age: 31, gender: 'Female' },
    { id: 6, name: 'Vikram Rao', age: 40, gender: 'Male' },
];

const FREQUENCY_OPTIONS = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Morning only',
    'Night only',
    'Before meals',
    'After meals',
    'As needed',
];

const emptyMedicine = () => ({
    id: Date.now(),
    name: '',
    dosage: '',
    frequency: 'Twice daily',
    duration: '',
});

/* ───── Recent prescriptions (mock history) ───── */
const RECENT_PRESCRIPTIONS = [
    {
        id: 1,
        patient: 'Priya Sharma',
        diagnosis: 'Hypertension',
        date: 'Mar 5, 2026',
        medicines: 2,
        status: 'Active',
    },
    {
        id: 2,
        patient: 'Rahul Verma',
        diagnosis: 'Viral Infection',
        date: 'Mar 3, 2026',
        medicines: 3,
        status: 'Active',
    },
    {
        id: 3,
        patient: 'Sneha Patil',
        diagnosis: 'Migraine',
        date: 'Feb 28, 2026',
        medicines: 2,
        status: 'Completed',
    },
    {
        id: 4,
        patient: 'Amit Deshmukh',
        diagnosis: 'Cardiac Follow-up',
        date: 'Feb 25, 2026',
        medicines: 4,
        status: 'Active',
    },
];

const Prescriptions = () => {
    const navigate = useNavigate();

    /* ── Form state ── */
    const [selectedPatient, setSelectedPatient] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [medicines, setMedicines] = useState([emptyMedicine()]);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('create'); // 'create' | 'recent'

    /* ── Medicine CRUD ── */
    const addMedicine = () => setMedicines([...medicines, emptyMedicine()]);

    const removeMedicine = (id) => {
        if (medicines.length > 1) {
            setMedicines(medicines.filter((m) => m.id !== id));
        }
    };

    const updateMedicine = (id, field, value) => {
        setMedicines(
            medicines.map((m) => (m.id === id ? { ...m, [field]: value } : m))
        );
    };

    /* ── Submit ── */
    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);

        /* Reset form */
        setSelectedPatient('');
        setDiagnosis('');
        setNotes('');
        setMedicines([emptyMedicine()]);
    };

    const handleCancel = () => {
        setSelectedPatient('');
        setDiagnosis('');
        setNotes('');
        setMedicines([emptyMedicine()]);
    };

    const selectedPatientData = PATIENTS.find(
        (p) => String(p.id) === selectedPatient
    );

    return (
        <section className="drx">
            {/* ── Header ── */}
            <div className="drx__header">
                <div className="drx__header-icon">📝</div>
                <div>
                    <h2>Prescriptions</h2>
                    <p>Write and manage prescriptions for your patients</p>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="drx__tabs">
                <button
                    className={`drx__tab ${activeTab === 'create' ? 'drx__tab--active' : ''}`}
                    onClick={() => setActiveTab('create')}
                >
                    ✍️ Create Prescription
                </button>
                <button
                    className={`drx__tab ${activeTab === 'recent' ? 'drx__tab--active' : ''}`}
                    onClick={() => setActiveTab('recent')}
                >
                    📋 Recent Prescriptions
                    <span className="drx__tab-count">{RECENT_PRESCRIPTIONS.length}</span>
                </button>
            </div>

            {/* ── Success message ── */}
            {success && (
                <div className="drx__success">
                    <span className="drx__success-icon">✅</span>
                    <div>
                        <strong>Prescription saved successfully!</strong>
                        <p>The prescription has been created and will be available in the patient's portal.</p>
                    </div>
                </div>
            )}

            {/* ══════════════ CREATE TAB ══════════════ */}
            {activeTab === 'create' && (
                <form className="drx__form" onSubmit={handleSubmit}>
                    <div className="drx__form-grid">
                        {/* ── Left column: patient & diagnosis ── */}
                        <div className="drx__form-left">
                            <div className="drx__card">
                                <div className="drx__card-head">
                                    <span className="drx__card-head-icon">👤</span>
                                    <h3>Patient Information</h3>
                                </div>

                                <div className="drx__field">
                                    <label htmlFor="drx-patient">Select Patient</label>
                                    <select
                                        id="drx-patient"
                                        className="drx__select"
                                        value={selectedPatient}
                                        onChange={(e) => setSelectedPatient(e.target.value)}
                                        required
                                    >
                                        <option value="">Choose a patient…</option>
                                        {PATIENTS.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} — {p.age}y, {p.gender}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Patient preview */}
                                {selectedPatientData && (
                                    <div className="drx__patient-preview">
                                        <div className="drx__patient-avatar">
                                            {selectedPatientData.name
                                                .split(' ')
                                                .map((w) => w[0])
                                                .join('')}
                                        </div>
                                        <div>
                                            <strong>{selectedPatientData.name}</strong>
                                            <span>
                                                {selectedPatientData.age} years · {selectedPatientData.gender}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="drx__field">
                                    <label htmlFor="drx-diagnosis">Diagnosis</label>
                                    <textarea
                                        id="drx-diagnosis"
                                        className="drx__textarea"
                                        placeholder="e.g. Hypertension, Viral Infection…"
                                        rows={3}
                                        value={diagnosis}
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="drx__field">
                                    <label htmlFor="drx-notes">Additional Notes <span className="drx__optional">(optional)</span></label>
                                    <textarea
                                        id="drx-notes"
                                        className="drx__textarea"
                                        placeholder="Special instructions, follow-up details…"
                                        rows={2}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Right column: medicines ── */}
                        <div className="drx__form-right">
                            <div className="drx__card">
                                <div className="drx__card-head">
                                    <span className="drx__card-head-icon">💊</span>
                                    <h3>Medicines</h3>
                                    <span className="drx__badge">{medicines.length}</span>
                                </div>

                                <div className="drx__medicines-list">
                                    {medicines.map((med, index) => (
                                        <div key={med.id} className="drx__med-row">
                                            <div className="drx__med-row-header">
                                                <span className="drx__med-num">#{index + 1}</span>
                                                {medicines.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="drx__med-remove"
                                                        onClick={() => removeMedicine(med.id)}
                                                        title="Remove medicine"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>

                                            <div className="drx__med-fields">
                                                <div className="drx__field drx__field--half">
                                                    <label>Medicine Name</label>
                                                    <input
                                                        type="text"
                                                        className="drx__input"
                                                        placeholder="e.g. Metformin"
                                                        value={med.name}
                                                        onChange={(e) =>
                                                            updateMedicine(med.id, 'name', e.target.value)
                                                        }
                                                        required
                                                    />
                                                </div>

                                                <div className="drx__field drx__field--half">
                                                    <label>Dosage</label>
                                                    <input
                                                        type="text"
                                                        className="drx__input"
                                                        placeholder="e.g. 500mg"
                                                        value={med.dosage}
                                                        onChange={(e) =>
                                                            updateMedicine(med.id, 'dosage', e.target.value)
                                                        }
                                                        required
                                                    />
                                                </div>

                                                <div className="drx__field drx__field--half">
                                                    <label>Frequency</label>
                                                    <select
                                                        className="drx__select"
                                                        value={med.frequency}
                                                        onChange={(e) =>
                                                            updateMedicine(med.id, 'frequency', e.target.value)
                                                        }
                                                    >
                                                        {FREQUENCY_OPTIONS.map((f) => (
                                                            <option key={f} value={f}>
                                                                {f}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="drx__field drx__field--half">
                                                    <label>Duration (days)</label>
                                                    <input
                                                        type="number"
                                                        className="drx__input"
                                                        placeholder="e.g. 30"
                                                        min="1"
                                                        value={med.duration}
                                                        onChange={(e) =>
                                                            updateMedicine(med.id, 'duration', e.target.value)
                                                        }
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    className="drx__add-med"
                                    onClick={addMedicine}
                                >
                                    <span>＋</span> Add Medicine
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="drx__actions">
                        <button type="button" className="drx__btn drx__btn--cancel" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="drx__btn drx__btn--save">
                            💾 Save Prescription
                        </button>
                    </div>
                </form>
            )}

            {/* ══════════════ RECENT TAB ══════════════ */}
            {activeTab === 'recent' && (
                <div className="drx__recent">
                    <div className="drx__recent-grid">
                        {RECENT_PRESCRIPTIONS.map((rx) => (
                            <div key={rx.id} className="drx__rx-card">
                                <div className="drx__rx-top">
                                    <div className="drx__rx-avatar">
                                        {rx.patient
                                            .split(' ')
                                            .map((w) => w[0])
                                            .join('')}
                                    </div>
                                    <div className="drx__rx-info">
                                        <h4>{rx.patient}</h4>
                                        <p>{rx.diagnosis}</p>
                                    </div>
                                    <span
                                        className={`drx__rx-status ${rx.status === 'Active'
                                            ? 'drx__rx-status--active'
                                            : 'drx__rx-status--completed'
                                            }`}
                                    >
                                        {rx.status === 'Active' ? '● ' : '✓ '}
                                        {rx.status}
                                    </span>
                                </div>

                                <div className="drx__rx-details">
                                    <div className="drx__rx-detail">
                                        <span className="drx__rx-detail-label">Date</span>
                                        <span className="drx__rx-detail-value">{rx.date}</span>
                                    </div>
                                    <div className="drx__rx-detail">
                                        <span className="drx__rx-detail-label">Medicines</span>
                                        <span className="drx__rx-detail-value">{rx.medicines} items</span>
                                    </div>
                                </div>

                                <div className="drx__rx-actions">
                                    <button className="drx__rx-btn" onClick={() => navigate(`/doctor/prescriptions/${rx.id}`)}>View Details</button>
                                    <button className="drx__rx-btn drx__rx-btn--outline">Print</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Prescriptions;
