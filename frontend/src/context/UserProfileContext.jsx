import React, { createContext, useContext, useState, useCallback } from 'react';

/* ──────────────────────────────────────────────────────────
   UserProfileContext
   Stores profile data for both patient and doctor roles.

   Future API integration:
     GET  /user/profile           → fetchProfile()
     POST /user/profile/update    → updateProfile()
     POST /user/profile/photo     → uploadProfilePhoto()
   ────────────────────────────────────────────────────────── */

const INITIAL_PATIENT_PROFILE = {
    role: 'patient',
    initials: 'PS',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1992-06-15',
    gender: 'Female',
    bloodGroup: 'B+',
    height: '165 cm',
    weight: '68 kg',
    emergencyContact: 'Ravi Sharma — +91 99887 76655',
    photo: null,
};

const INITIAL_DOCTOR_PROFILE = {
    role: 'doctor',
    initials: 'DR',
    fullName: 'Dr. Anil Gupta',
    email: 'dr.gupta@healthify.com',
    phone: '+91 98765 00001',
    specialization: 'Cardiology',
    yearsOfExperience: 14,
    hospital: 'Healthify Heart & Care Hospital',
    licenseNumber: 'MCI-2012-48721',
    consultationFee: '₹800',
    photo: null,
};

const UserProfileContext = createContext(null);

export const UserProfileProvider = ({ children }) => {
    const [patientProfile, setPatientProfile] = useState(INITIAL_PATIENT_PROFILE);
    const [doctorProfile, setDoctorProfile] = useState(INITIAL_DOCTOR_PROFILE);

    /* ── Get profile for a role ── */
    const getProfile = useCallback(
        (role) => (role === 'doctor' ? doctorProfile : patientProfile),
        [patientProfile, doctorProfile],
    );

    /* ── Update profile fields ──
       Future: POST /user/profile/update */
    const updateProfile = useCallback((role, updates) => {
        if (role === 'doctor') {
            setDoctorProfile((prev) => ({ ...prev, ...updates }));
        } else {
            setPatientProfile((prev) => ({ ...prev, ...updates }));
        }
    }, []);

    /* ── Upload / change profile photo ──
       Future: POST /user/profile/photo
       Currently uses a data-URL from FileReader */
    const uploadProfilePhoto = useCallback((role, file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result;
                if (role === 'doctor') {
                    setDoctorProfile((prev) => ({ ...prev, photo: dataUrl }));
                } else {
                    setPatientProfile((prev) => ({ ...prev, photo: dataUrl }));
                }
                resolve(dataUrl);
            };
            reader.readAsDataURL(file);
        });
    }, []);

    return (
        <UserProfileContext.Provider
            value={{ getProfile, updateProfile, uploadProfilePhoto, patientProfile, doctorProfile }}
        >
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = () => {
    const ctx = useContext(UserProfileContext);
    if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
    return ctx;
};

export default UserProfileContext;
