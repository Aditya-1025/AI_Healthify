import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';
import './PatientDashboard.css';

/* ───── Sample data ───── */
const vitals = [
    { id: 1, icon: '❤️', label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal', color: 'heart' },
    { id: 2, icon: '🩸', label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal', color: 'bp' },
    { id: 3, icon: '⚖️', label: 'BMI', value: '22.4', unit: 'kg/m²', status: 'normal', color: 'bmi' },
    { id: 4, icon: '😴', label: 'Sleep', value: '7.2', unit: 'hrs/night', status: 'normal', color: 'sleep' },
];

const upcomingAppointments = [
    { id: 1, day: '27', month: 'Feb', doctor: 'Dr. Anil Gupta', specialty: 'Cardiology', time: '09:30 AM' },
    { id: 2, day: '03', month: 'Mar', doctor: 'Dr. Meena Iyer', specialty: 'General Checkup', time: '11:00 AM' },
    { id: 3, day: '10', month: 'Mar', doctor: 'Dr. Rakesh Singh', specialty: 'Dermatology', time: '02:30 PM' },
];

const medications = [
    { id: 1, icon: '💊', name: 'Metformin 500mg', dosage: '1 tablet twice daily', timing: 'morning', timingLabel: 'Morning & Evening' },
    { id: 2, icon: '💉', name: 'Insulin Glargine', dosage: '10 units before bedtime', timing: 'night', timingLabel: 'Night' },
    { id: 3, icon: '🩹', name: 'Amlodipine 5mg', dosage: '1 tablet once daily', timing: 'morning', timingLabel: 'Morning' },
    { id: 4, icon: '💊', name: 'Atorvastatin 10mg', dosage: '1 tablet at night', timing: 'night', timingLabel: 'Night' },
];

const healthGoals = [
    { id: 1, icon: '🚶', label: 'Daily Steps', current: 6840, target: 10000, unit: 'steps', barColor: 'steps' },
    { id: 2, icon: '💧', label: 'Water Intake', current: 5, target: 8, unit: 'glasses', barColor: 'water' },
    { id: 3, icon: '🔥', label: 'Calories Burnt', current: 320, target: 500, unit: 'kcal', barColor: 'calories' },
];

/* ───── Component ───── */
const PatientDashboard = () => {
    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <section className="pdash">
            {/* ---- Header ---- */}
            <div className="pdash__header">
                <div className="pdash__greeting">
                    <h2>Hi, Priya 👋</h2>
                    <p>Let&apos;s check on your health today.</p>
                </div>
                <span className="pdash__date-badge">🗓️ {today}</span>
            </div>

            {/* ---- Vitals ---- */}
            <div className="pdash__vitals">
                {vitals.map((v) => (
                    <Card key={v.id} className="vital-card" size="compact">
                        <div className={`vital-card__icon vital-card__icon--${v.color}`}>
                            {v.icon}
                        </div>
                        <div className="vital-card__data">
                            <div className="vital-card__label">{v.label}</div>
                            <div className="vital-card__value">{v.value}</div>
                            <div className="vital-card__unit">{v.unit}</div>
                            <span className={`vital-card__status vital-card__status--${v.status}`}>
                                {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* ---- Body: Appointments + Medications ---- */}
            <div className="pdash__body">
                {/* Appointments */}
                <Card>
                    <div className="pdash__section-header">
                        <h3>My Appointments</h3>
                        <Link to="/patient/my-appointments" className="pdash__section-link">View all →</Link>
                    </div>
                    <div className="pdash-appt">
                        {upcomingAppointments.map((a) => (
                            <div key={a.id} className="pdash-appt__item">
                                <div className="pdash-appt__date">
                                    <span className="pdash-appt__date-day">{a.day}</span>
                                    <span className="pdash-appt__date-month">{a.month}</span>
                                </div>
                                <div className="pdash-appt__info">
                                    <h4>{a.doctor}</h4>
                                    <p>{a.specialty}</p>
                                </div>
                                <span className="pdash-appt__time">{a.time}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Medications */}
                <Card>
                    <div className="pdash__section-header">
                        <h3>My Medications</h3>
                        <Link to="/patient/medications" className="pdash__section-link">Manage →</Link>
                    </div>
                    <div className="pdash-meds">
                        {medications.map((m) => (
                            <Link key={m.id} to="/patient/medications" className="med-item">
                                <span className="med-item__icon">{m.icon}</span>
                                <div className="med-item__details">
                                    <div className="med-item__name">{m.name}</div>
                                    <div className="med-item__dosage">{m.dosage}</div>
                                </div>
                                <span className={`med-item__timing med-item__timing--${m.timing}`}>
                                    {m.timingLabel}
                                </span>
                            </Link>
                        ))}
                    </div>
                </Card>
            </div>

            {/* ---- Health Goals ---- */}
            <div className="pdash__goals">
                <Card>
                    <div className="pdash__section-header">
                        <h3>Today&apos;s Health Goals</h3>
                    </div>
                    <div className="goals-grid">
                        {healthGoals.map((g) => {
                            const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
                            return (
                                <div key={g.id} className="goal-item">
                                    <div className="goal-item__icon">{g.icon}</div>
                                    <div className="goal-item__label">{g.label}</div>
                                    <div className="goal-item__progress">
                                        <div
                                            className={`goal-item__bar goal-item__bar--${g.barColor}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <div className="goal-item__text">
                                        {g.current.toLocaleString()} / {g.target.toLocaleString()} {g.unit} ({pct}%)
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </section>
    );
};

export default PatientDashboard;

