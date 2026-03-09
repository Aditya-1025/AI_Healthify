import React, { useEffect, useRef } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import './MedicineReminderPopup.css';

/* ──────────────────────────────────────────────
   MedicineReminderPopup
   Slides in from bottom-right when a medicine
   reminder is triggered. Auto-dismisses after 10s.
   ────────────────────────────────────────────── */

const MedicineReminderPopup = () => {
    const { activeReminder, dismissReminder, addNotification } = useNotifications();
    const timerRef = useRef(null);

    /* Auto-dismiss after 10 seconds */
    useEffect(() => {
        if (activeReminder) {
            timerRef.current = setTimeout(() => {
                dismissReminder();
            }, 10000);
        }
        return () => clearTimeout(timerRef.current);
    }, [activeReminder, dismissReminder]);

    if (!activeReminder) return null;

    const handleTaken = () => {
        addNotification({
            type: 'medicine',
            message: `✅ You took ${activeReminder.name} ${activeReminder.dosage}`,
        });
        dismissReminder();
    };

    const handleSnooze = () => {
        addNotification({
            type: 'medicine',
            message: `⏰ Snoozed reminder for ${activeReminder.name} — will remind again later`,
        });
        dismissReminder();
    };

    return (
        <div className="med-popup">
            <div className="med-popup__card">
                {/* Close button */}
                <button className="med-popup__close" onClick={dismissReminder}>✕</button>

                {/* Icon + Header */}
                <div className="med-popup__header">
                    <div className="med-popup__icon-ring">
                        <span className="med-popup__icon">💊</span>
                    </div>
                    <div>
                        <h4 className="med-popup__title">Medication Reminder</h4>
                        <p className="med-popup__time">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                    </div>
                </div>

                {/* Medicine info */}
                <div className="med-popup__body">
                    <p className="med-popup__message">
                        Time to take <strong>{activeReminder.name} {activeReminder.dosage}</strong>
                    </p>
                    {activeReminder.instructions && (
                        <p className="med-popup__instructions">📝 {activeReminder.instructions}</p>
                    )}
                </div>

                {/* Auto-dismiss progress bar */}
                <div className="med-popup__progress">
                    <div className="med-popup__progress-bar" />
                </div>

                {/* Actions */}
                <div className="med-popup__actions">
                    <button className="med-popup__btn med-popup__btn--taken" onClick={handleTaken}>
                        ✓ Mark as Taken
                    </button>
                    <button className="med-popup__btn med-popup__btn--snooze" onClick={handleSnooze}>
                        ⏰ Snooze
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MedicineReminderPopup;
