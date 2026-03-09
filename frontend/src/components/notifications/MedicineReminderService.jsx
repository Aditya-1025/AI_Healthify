import { useEffect, useRef } from 'react';
import { useNotifications } from '../../context/NotificationContext';

/* ──────────────────────────────────────────────
   MedicineReminderService
   Checks every 60 seconds if the current time matches
   any medication schedule. If so, fires a notification
   and shows the reminder popup.
   ────────────────────────────────────────────── */

/* Active medications with schedule (mirrors Medications.jsx) */
const ACTIVE_MEDICATIONS = [
    { id: 1, name: 'Paracetamol', dosage: '500mg', instructions: 'Take after meals', slots: ['08:00', '14:00', '20:00'] },
    { id: 2, name: 'Amoxicillin', dosage: '250mg', instructions: 'Take with water before meals', slots: ['08:00', '14:00', '20:00'] },
    { id: 3, name: 'Metformin', dosage: '500mg', instructions: 'Take with breakfast and dinner', slots: ['08:00', '20:00'] },
    { id: 4, name: 'Amlodipine', dosage: '5mg', instructions: 'Take in the morning', slots: ['08:00'] },
];

/* Convert current time to HH:mm */
const getCurrentHHMM = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const MedicineReminderService = () => {
    const { addNotification, setActiveReminder, activeReminder } = useNotifications();
    const firedRef = useRef(new Set()); // tracks already-fired reminders for today

    useEffect(() => {
        /* Run the check immediately on mount, then every 60 seconds */
        const check = () => {
            const currentTime = getCurrentHHMM();
            ACTIVE_MEDICATIONS.forEach((med) => {
                med.slots.forEach((slot) => {
                    const key = `${med.id}-${slot}-${new Date().toDateString()}`;
                    if (slot === currentTime && !firedRef.current.has(key)) {
                        firedRef.current.add(key);

                        /* Fire notification */
                        addNotification({
                            type: 'medicine',
                            message: `Time to take ${med.name} ${med.dosage}`,
                        });

                        /* Show popup (only if none already visible) */
                        if (!activeReminder) {
                            setActiveReminder({
                                medId: med.id,
                                name: med.name,
                                dosage: med.dosage,
                                instructions: med.instructions,
                            });
                        }
                    }
                });
            });
        };

        check(); // initial check
        const interval = setInterval(check, 60000); // every 60 seconds
        return () => clearInterval(interval);
    }, [addNotification, setActiveReminder, activeReminder]);

    /* This component renders nothing — it's a service */
    return null;
};

export default MedicineReminderService;
