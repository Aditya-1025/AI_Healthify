import React, { createContext, useContext, useState, useCallback } from 'react';

/* ──────────────────────────────────────────────
   AppointmentsContext
   Global state for ALL appointments (patient + doctor).
   Provides:
     - appointments       (full list)
     - upcoming           (status !== 'Completed' & !== 'Cancelled' & !== 'Rejected')
     - past               (status === 'Completed')
     - addAppointment(appt)
     - updateAppointmentStatus(id, newStatus)
   ────────────────────────────────────────────── */

const AppointmentsContext = createContext(null);

/* ── Seed data ── */
const SEED_APPOINTMENTS = [
    { id: 1, day: '27', month: 'Feb', patientName: 'Priya Sharma', doctor: 'Dr. Anil Gupta', specialty: 'Cardiology', time: '09:30 AM', status: 'Confirmed', reason: 'Chest discomfort' },
    { id: 2, day: '03', month: 'Mar', patientName: 'Rahul Verma', doctor: 'Dr. Meena Iyer', specialty: 'General Checkup', time: '11:00 AM', status: 'Pending', reason: 'Routine checkup' },
    { id: 3, day: '10', month: 'Mar', patientName: 'Sneha Patil', doctor: 'Dr. Rakesh Singh', specialty: 'Dermatology', time: '02:30 PM', status: 'Pending', reason: 'Skin rash' },
    { id: 4, day: '12', month: 'Mar', patientName: 'Amit Deshmukh', doctor: 'Dr. Anil Gupta', specialty: 'Cardiology', time: '10:00 AM', status: 'Pending', reason: 'Post-surgery follow-up' },
    { id: 5, day: '14', month: 'Mar', patientName: 'Neha Kulkarni', doctor: 'Dr. Anil Gupta', specialty: 'Cardiology', time: '02:00 PM', status: 'Pending', reason: 'Heart palpitations' },
    { id: 6, day: '15', month: 'Mar', patientName: 'Vikram Rao', doctor: 'Dr. Anil Gupta', specialty: 'Cardiology', time: '11:30 AM', status: 'Pending', reason: 'BP monitoring review' },
    { id: 7, day: '05', month: 'Mar', patientName: 'Sneha Patil', doctor: 'Dr. Anil Gupta', specialty: 'Cardiology', time: '03:00 PM', status: 'Rejected', reason: 'Duplicate booking' },
    { id: 101, day: '14', month: 'Feb', patientName: 'Amit Deshmukh', doctor: 'Dr. Sonia Patel', specialty: 'General Medicine', time: '10:00 AM', status: 'Completed', reason: 'Fever follow-up' },
    { id: 102, day: '01', month: 'Feb', patientName: 'Neha Kulkarni', doctor: 'Dr. Arjun Mehta', specialty: 'Orthopedics', time: '03:00 PM', status: 'Completed', reason: 'Knee pain' },
    { id: 103, day: '18', month: 'Jan', patientName: 'Vikram Rao', doctor: 'Dr. Priya Sharma', specialty: 'ENT', time: '11:30 AM', status: 'Completed', reason: 'Ear infection' },
];

/* Helper: extract short month name from a date string */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let nextId = 200;

export const AppointmentsProvider = ({ children }) => {
    const [appointments, setAppointments] = useState(SEED_APPOINTMENTS);

    /**
     * Add a new appointment.
     * Expects: { doctor, specialty, date (YYYY-MM-DD), time, reason?, patientName? }
     * New appointments default to status "Pending".
     */
    const addAppointment = useCallback((appt) => {
        const dateObj = new Date(appt.date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = MONTHS[dateObj.getMonth()];

        const newAppt = {
            id: ++nextId,
            day,
            month,
            patientName: appt.patientName || 'Patient',
            doctor: appt.doctor,
            specialty: appt.specialty || 'General',
            time: appt.time,
            status: 'Pending',
            reason: appt.reason || '',
            bookedAt: new Date().toISOString(),
        };

        setAppointments(prev => [newAppt, ...prev]);
        return newAppt;
    }, []);

    /**
     * Update an appointment's status.
     * Valid statuses: "Pending" | "Confirmed" | "Rejected" | "Completed" | "Cancelled"
     */
    const updateAppointmentStatus = useCallback((id, newStatus) => {
        setAppointments(prev =>
            prev.map(a => (a.id === id ? { ...a, status: newStatus } : a))
        );
    }, []);

    /**
     * Reschedule an appointment — updates date, time, and sets status to "Confirmed".
     * Expects: id, date (YYYY-MM-DD string), time (display string like "10:00 AM")
     */
    const rescheduleAppointment = useCallback((id, date, time) => {
        const dateObj = new Date(date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = MONTHS[dateObj.getMonth()];
        setAppointments(prev =>
            prev.map(a =>
                a.id === id ? { ...a, day, month, time, status: 'Confirmed' } : a
            )
        );
    }, []);

    /* Derived lists */
    const upcoming = appointments.filter(
        a => a.status !== 'Completed' && a.status !== 'Cancelled' && a.status !== 'Rejected'
    );
    const past = appointments.filter(a => a.status === 'Completed');

    return (
        <AppointmentsContext.Provider
            value={{ appointments, upcoming, past, addAppointment, updateAppointmentStatus, rescheduleAppointment }}
        >
            {children}
        </AppointmentsContext.Provider>
    );
};

/** Convenience hook */
export const useAppointments = () => {
    const ctx = useContext(AppointmentsContext);
    if (!ctx) throw new Error('useAppointments must be used inside <AppointmentsProvider>');
    return ctx;
};

export default AppointmentsContext;
