import React, { useState } from 'react';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import './HealthTrends.css';

/* ───── Mock data (swap with GET /patient/vitals-history later) ───── */
const heartRateData = [
    { day: 'Mon', rate: 72 },
    { day: 'Tue', rate: 75 },
    { day: 'Wed', rate: 68 },
    { day: 'Thu', rate: 74 },
    { day: 'Fri', rate: 71 },
    { day: 'Sat', rate: 69 },
    { day: 'Sun', rate: 72 },
];

const bpData = [
    { day: 'Mon', systolic: 120, diastolic: 80 },
    { day: 'Tue', systolic: 125, diastolic: 82 },
    { day: 'Wed', systolic: 118, diastolic: 78 },
    { day: 'Thu', systolic: 122, diastolic: 81 },
    { day: 'Fri', systolic: 119, diastolic: 79 },
    { day: 'Sat', systolic: 121, diastolic: 80 },
    { day: 'Sun', systolic: 120, diastolic: 80 },
];

const sleepData = [
    { day: 'Mon', hours: 7.2, quality: 82 },
    { day: 'Tue', hours: 6.5, quality: 68 },
    { day: 'Wed', hours: 8.0, quality: 91 },
    { day: 'Thu', hours: 7.0, quality: 76 },
    { day: 'Fri', hours: 6.8, quality: 72 },
    { day: 'Sat', hours: 8.5, quality: 95 },
    { day: 'Sun', hours: 7.5, quality: 85 },
];

const bmiData = [
    { week: 'W1', bmi: 23.1 },
    { week: 'W2', bmi: 22.9 },
    { week: 'W3', bmi: 22.7 },
    { week: 'W4', bmi: 22.5 },
    { week: 'W5', bmi: 22.4 },
    { week: 'W6', bmi: 22.3 },
    { week: 'W7', bmi: 22.4 },
];

/* ───── Constants ───── */
const TEAL = '#2a9d8f';
const TEAL_LIGHT = 'rgba(42, 157, 143, 0.15)';
const INFO = '#457b9d';
const DANGER = '#e76f51';
const WARNING = '#f4a261';
const GREEN = '#16a34a';

const periods = ['7 Days', '14 Days', '30 Days'];

/* ───── Custom tooltip ───── */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="ht__tooltip">
            <p className="ht__tooltip-label">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="ht__tooltip-value" style={{ color: p.color }}>
                    {p.name}: <strong>{p.value}</strong>
                </p>
            ))}
        </div>
    );
};

/* ───── Component ───── */
const HealthTrends = () => {
    const [activePeriod, setActivePeriod] = useState('7 Days');

    /* Summary stats */
    const avgHR = Math.round(heartRateData.reduce((s, d) => s + d.rate, 0) / heartRateData.length);
    const avgSleep = (sleepData.reduce((s, d) => s + d.hours, 0) / sleepData.length).toFixed(1);
    const latestBMI = bmiData[bmiData.length - 1].bmi;
    const avgBP = `${Math.round(bpData.reduce((s, d) => s + d.systolic, 0) / bpData.length)}/${Math.round(bpData.reduce((s, d) => s + d.diastolic, 0) / bpData.length)}`;

    return (
        <section className="ht">
            {/* ── Header ── */}
            <div className="ht__header">
                <div className="ht__header-icon">📊</div>
                <div>
                    <h2>Health Trends</h2>
                    <p>Track how your vitals change over time.</p>
                </div>
                <div className="ht__period-toggle">
                    {periods.map((p) => (
                        <button
                            key={p}
                            className={`ht__period-btn ${activePeriod === p ? 'ht__period-btn--active' : ''}`}
                            onClick={() => setActivePeriod(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Summary cards ── */}
            <div className="ht__summary">
                <div className="ht__summary-card">
                    <span className="ht__summary-icon">❤️</span>
                    <div>
                        <span className="ht__summary-value">{avgHR} <small>bpm</small></span>
                        <span className="ht__summary-label">Avg Heart Rate</span>
                    </div>
                </div>
                <div className="ht__summary-card">
                    <span className="ht__summary-icon">🩸</span>
                    <div>
                        <span className="ht__summary-value">{avgBP} <small>mmHg</small></span>
                        <span className="ht__summary-label">Avg Blood Pressure</span>
                    </div>
                </div>
                <div className="ht__summary-card">
                    <span className="ht__summary-icon">😴</span>
                    <div>
                        <span className="ht__summary-value">{avgSleep} <small>hrs</small></span>
                        <span className="ht__summary-label">Avg Sleep</span>
                    </div>
                </div>
                <div className="ht__summary-card">
                    <span className="ht__summary-icon">⚖️</span>
                    <div>
                        <span className="ht__summary-value">{latestBMI} <small>kg/m²</small></span>
                        <span className="ht__summary-label">Latest BMI</span>
                    </div>
                </div>
            </div>

            {/* ── Charts grid ── */}
            <div className="ht__grid">
                {/* Heart Rate */}
                <div className="ht__chart-card">
                    <div className="ht__chart-header">
                        <h3>❤️ Heart Rate</h3>
                        <span className="ht__chart-tag ht__chart-tag--normal">Normal</span>
                    </div>
                    <div className="ht__chart-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={heartRateData}>
                                <defs>
                                    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={DANGER} stopOpacity={0.2} />
                                        <stop offset="95%" stopColor={DANGER} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                <YAxis domain={[60, 85]} tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="rate"
                                    name="Heart Rate"
                                    stroke={DANGER}
                                    strokeWidth={2.5}
                                    fill="url(#hrGrad)"
                                    dot={{ r: 4, fill: DANGER }}
                                    activeDot={{ r: 6 }}
                                    animationDuration={800}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Blood Pressure */}
                <div className="ht__chart-card">
                    <div className="ht__chart-header">
                        <h3>🩸 Blood Pressure</h3>
                        <span className="ht__chart-tag ht__chart-tag--normal">Normal</span>
                    </div>
                    <div className="ht__chart-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={bpData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                <YAxis domain={[70, 135]} tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                                <Line
                                    type="monotone"
                                    dataKey="systolic"
                                    name="Systolic"
                                    stroke={DANGER}
                                    strokeWidth={2.5}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                    animationDuration={800}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="diastolic"
                                    name="Diastolic"
                                    stroke={INFO}
                                    strokeWidth={2.5}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                    animationDuration={800}
                                    animationBegin={200}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sleep */}
                <div className="ht__chart-card">
                    <div className="ht__chart-header">
                        <h3>😴 Sleep Hours</h3>
                        <span className="ht__chart-tag ht__chart-tag--good">Good</span>
                    </div>
                    <div className="ht__chart-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={sleepData} barSize={32}>
                                <defs>
                                    <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={TEAL} stopOpacity={0.9} />
                                        <stop offset="95%" stopColor={INFO} stopOpacity={0.7} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="hours"
                                    name="Sleep Hours"
                                    fill="url(#sleepGrad)"
                                    radius={[6, 6, 0, 0]}
                                    animationDuration={800}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* BMI */}
                <div className="ht__chart-card">
                    <div className="ht__chart-header">
                        <h3>⚖️ BMI Progress</h3>
                        <span className="ht__chart-tag ht__chart-tag--normal">Healthy</span>
                    </div>
                    <div className="ht__chart-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={bmiData}>
                                <defs>
                                    <linearGradient id="bmiGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={GREEN} stopOpacity={0.2} />
                                        <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                                <YAxis domain={[21, 24]} tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="bmi"
                                    name="BMI"
                                    stroke={GREEN}
                                    strokeWidth={2.5}
                                    fill="url(#bmiGrad)"
                                    dot={{ r: 4, fill: GREEN }}
                                    activeDot={{ r: 6 }}
                                    animationDuration={800}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HealthTrends;
