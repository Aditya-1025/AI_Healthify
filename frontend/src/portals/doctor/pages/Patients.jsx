import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import './Patients.css';

/* ───── Sample data (swap with real API later) ───── */
const PATIENTS = [
    { id: 1, name: 'Priya Sharma', age: 34, gender: 'Female', phone: '+91 98765 43210', email: 'priya.sharma@email.com', lastVisit: 'Feb 14, 2026', status: 'Active', conditions: ['Hypertension', 'Diabetes'] },
    { id: 2, name: 'Rahul Verma', age: 28, gender: 'Male', phone: '+91 87654 32109', email: 'rahul.verma@email.com', lastVisit: 'Feb 20, 2026', status: 'Active', conditions: ['Asthma'] },
    { id: 3, name: 'Sneha Patil', age: 45, gender: 'Female', phone: '+91 76543 21098', email: 'sneha.patil@email.com', lastVisit: 'Jan 30, 2026', status: 'Active', conditions: ['Migraine', 'Anxiety'] },
    { id: 4, name: 'Amit Deshmukh', age: 52, gender: 'Male', phone: '+91 65432 10987', email: 'amit.d@email.com', lastVisit: 'Feb 22, 2026', status: 'Follow-up', conditions: ['Cardiac'] },
    { id: 5, name: 'Neha Kulkarni', age: 31, gender: 'Female', phone: '+91 54321 09876', email: 'neha.k@email.com', lastVisit: 'Feb 10, 2026', status: 'Inactive', conditions: [] },
    { id: 6, name: 'Vikram Rao', age: 40, gender: 'Male', phone: '+91 43210 98765', email: 'vikram.r@email.com', lastVisit: 'Jan 18, 2026', status: 'Active', conditions: ['ENT'] },
];

const STATUS_COLORS = {
    Active: 'pts-status--active',
    'Follow-up': 'pts-status--followup',
    Inactive: 'pts-status--inactive',
};

const Patients = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const filtered = PATIENTS.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        p.conditions.some(c => c.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <section className="pts">
            {/* ── Header ── */}
            <div className="pts__header">
                <div className="pts__header-icon">🩺</div>
                <div>
                    <h2>Patient Records</h2>
                    <p>Manage patient records, view histories, and track conditions.</p>
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="pts__stats">
                <div className="pts__stat-card">
                    <span className="pts__stat-num">{PATIENTS.length}</span>
                    <span className="pts__stat-label">Total Patients</span>
                </div>
                <div className="pts__stat-card">
                    <span className="pts__stat-num">{PATIENTS.filter(p => p.status === 'Active').length}</span>
                    <span className="pts__stat-label">Active</span>
                </div>
                <div className="pts__stat-card">
                    <span className="pts__stat-num">{PATIENTS.filter(p => p.status === 'Follow-up').length}</span>
                    <span className="pts__stat-label">Follow-up</span>
                </div>
            </div>

            {/* ── Search ── */}
            <div className="pts__search-row">
                <input
                    className="pts__search"
                    type="text"
                    placeholder="🔍 Search patients by name, email, or condition…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* ── Table ── */}
            <Card>
                <div className="pts__table-wrap">
                    <table className="pts__table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Age / Gender</th>
                                <th>Contact</th>
                                <th>Conditions</th>
                                <th>Last Visit</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="pts__empty">
                                        No patients match your search.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((p) => (
                                    <tr key={p.id} className="pts__row pts__row--clickable" onClick={() => navigate(`/doctor/patients/${p.id}`)} title={`View ${p.name}'s details`}>
                                        <td>
                                            <div className="pts__name-cell">
                                                <div className="pts__avatar">{p.name.charAt(0)}</div>
                                                <div>
                                                    <div className="pts__name">{p.name}</div>
                                                    <div className="pts__email">{p.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{p.age} / {p.gender}</td>
                                        <td className="pts__phone">{p.phone}</td>
                                        <td>
                                            <div className="pts__conditions">
                                                {p.conditions.length > 0
                                                    ? p.conditions.map(c => (
                                                        <span key={c} className="pts__condition-tag">{c}</span>
                                                    ))
                                                    : <span className="pts__no-cond">None</span>
                                                }
                                            </div>
                                        </td>
                                        <td className="pts__last-visit">{p.lastVisit}</td>
                                        <td>
                                            <span className={`pts-status ${STATUS_COLORS[p.status] || ''}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </section>
    );
};

export default Patients;
