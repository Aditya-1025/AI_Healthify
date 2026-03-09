import React, { useState } from 'react';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

/* ──────────────────────────────────────────────
   HealthTrendsPanel
   Patient vitals charts for the doctor's view.

   Future: replace mock data with GET /patients/:id/vitals
   ────────────────────────────────────────────── */

/* ── Colors ── */
const TEAL = '#2a9d8f';
const INFO = '#457b9d';
const DANGER = '#e76f51';
const GREEN = '#16a34a';

/* ── Mock data (API-ready — swap with fetch) ── */
const heartRateData = [
    { day: 'Mon', rate: 74 }, { day: 'Tue', rate: 78 },
    { day: 'Wed', rate: 72 }, { day: 'Thu', rate: 80 },
    { day: 'Fri', rate: 76 }, { day: 'Sat', rate: 71 },
    { day: 'Sun', rate: 73 },
];

const bpData = [
    { day: 'Mon', systolic: 132, diastolic: 86 },
    { day: 'Tue', systolic: 128, diastolic: 84 },
    { day: 'Wed', systolic: 135, diastolic: 88 },
    { day: 'Thu', systolic: 130, diastolic: 85 },
    { day: 'Fri', systolic: 126, diastolic: 82 },
    { day: 'Sat', systolic: 122, diastolic: 80 },
    { day: 'Sun', systolic: 124, diastolic: 81 },
];

const sleepData = [
    { day: 'Mon', hours: 6.2 }, { day: 'Tue', hours: 5.8 },
    { day: 'Wed', hours: 7.4 }, { day: 'Thu', hours: 6.0 },
    { day: 'Fri', hours: 5.5 }, { day: 'Sat', hours: 8.1 },
    { day: 'Sun', hours: 7.0 },
];

const bmiData = [
    { week: 'W1', bmi: 24.2 }, { week: 'W2', bmi: 24.0 },
    { week: 'W3', bmi: 23.8 }, { week: 'W4', bmi: 23.9 },
    { week: 'W5', bmi: 23.7 }, { week: 'W6', bmi: 23.5 },
    { week: 'W7', bmi: 23.6 },
];

const periods = ['7 Days', '14 Days', '30 Days'];

/* ── Tooltip ── */
const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="htp__tooltip">
            <p className="htp__tooltip-label">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="htp__tooltip-value" style={{ color: p.color }}>
                    {p.name}: <strong>{p.value}</strong>
                </p>
            ))}
        </div>
    );
};

const HealthTrendsPanel = ({ patientName }) => {
    const [activePeriod, setActivePeriod] = useState('7 Days');

    const avgHR = Math.round(heartRateData.reduce((s, d) => s + d.rate, 0) / heartRateData.length);
    const avgSleep = (sleepData.reduce((s, d) => s + d.hours, 0) / sleepData.length).toFixed(1);
    const latestBMI = bmiData[bmiData.length - 1].bmi;
    const avgSys = Math.round(bpData.reduce((s, d) => s + d.systolic, 0) / bpData.length);
    const avgDia = Math.round(bpData.reduce((s, d) => s + d.diastolic, 0) / bpData.length);

    return (
        <div className="htp">
            {/* Header */}
            <div className="htp__header">
                <div className="htp__header-left">
                    <span className="htp__header-icon">📊</span>
                    <div>
                        <h3 className="htp__title">Health Trends</h3>
                        <p className="htp__subtitle">
                            Vitals overview for {patientName || 'this patient'}
                        </p>
                    </div>
                </div>
                <div className="htp__period-toggle">
                    {periods.map((p) => (
                        <button
                            key={p}
                            className={`htp__period-btn ${activePeriod === p ? 'htp__period-btn--active' : ''}`}
                            onClick={() => setActivePeriod(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary strip */}
            <div className="htp__summary">
                <div className="htp__summary-item">
                    <span className="htp__summary-emoji">❤️</span>
                    <strong>{avgHR} <small>bpm</small></strong>
                    <span>Avg HR</span>
                </div>
                <div className="htp__summary-item">
                    <span className="htp__summary-emoji">🩸</span>
                    <strong>{avgSys}/{avgDia} <small>mmHg</small></strong>
                    <span>Avg BP</span>
                </div>
                <div className="htp__summary-item">
                    <span className="htp__summary-emoji">😴</span>
                    <strong>{avgSleep} <small>hrs</small></strong>
                    <span>Avg Sleep</span>
                </div>
                <div className="htp__summary-item">
                    <span className="htp__summary-emoji">⚖️</span>
                    <strong>{latestBMI} <small>kg/m²</small></strong>
                    <span>Latest BMI</span>
                </div>
            </div>

            {/* Charts grid */}
            <div className="htp__charts">
                {/* Heart Rate */}
                <div className="htp__chart-card">
                    <div className="htp__chart-head">
                        <h4>❤️ Heart Rate</h4>
                        <span className="htp__chart-tag htp__chart-tag--normal">Normal</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={heartRateData}>
                            <defs>
                                <linearGradient id="docHrGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={DANGER} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={DANGER} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                            <YAxis domain={[60, 90]} tick={{ fontSize: 11 }} />
                            <Tooltip content={<ChartTooltip />} />
                            <Area type="monotone" dataKey="rate" name="Heart Rate"
                                stroke={DANGER} strokeWidth={2.5}
                                fill="url(#docHrGrad)"
                                dot={{ r: 3, fill: DANGER }} activeDot={{ r: 5 }}
                                animationDuration={800} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Blood Pressure */}
                <div className="htp__chart-card">
                    <div className="htp__chart-head">
                        <h4>🩸 Blood Pressure</h4>
                        <span className="htp__chart-tag htp__chart-tag--caution">Elevated</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={bpData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                            <YAxis domain={[70, 145]} tick={{ fontSize: 11 }} />
                            <Tooltip content={<ChartTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                            <Line type="monotone" dataKey="systolic" name="Systolic"
                                stroke={DANGER} strokeWidth={2.5}
                                dot={{ r: 3 }} activeDot={{ r: 5 }}
                                animationDuration={800} />
                            <Line type="monotone" dataKey="diastolic" name="Diastolic"
                                stroke={INFO} strokeWidth={2.5}
                                dot={{ r: 3 }} activeDot={{ r: 5 }}
                                animationDuration={800} animationBegin={200} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Sleep */}
                <div className="htp__chart-card">
                    <div className="htp__chart-head">
                        <h4>😴 Sleep Hours</h4>
                        <span className="htp__chart-tag htp__chart-tag--low">Below Avg</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={sleepData} barSize={28}>
                            <defs>
                                <linearGradient id="docSleepGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={TEAL} stopOpacity={0.9} />
                                    <stop offset="95%" stopColor={INFO} stopOpacity={0.7} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="hours" name="Sleep Hours"
                                fill="url(#docSleepGrad)"
                                radius={[5, 5, 0, 0]}
                                animationDuration={800} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* BMI */}
                <div className="htp__chart-card">
                    <div className="htp__chart-head">
                        <h4>⚖️ BMI Progress</h4>
                        <span className="htp__chart-tag htp__chart-tag--normal">Healthy</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={bmiData}>
                            <defs>
                                <linearGradient id="docBmiGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={GREEN} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                            <YAxis domain={[22, 25]} tick={{ fontSize: 11 }} />
                            <Tooltip content={<ChartTooltip />} />
                            <Area type="monotone" dataKey="bmi" name="BMI"
                                stroke={GREEN} strokeWidth={2.5}
                                fill="url(#docBmiGrad)"
                                dot={{ r: 3, fill: GREEN }} activeDot={{ r: 5 }}
                                animationDuration={800} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default HealthTrendsPanel;
