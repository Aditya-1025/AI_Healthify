import React, { createContext, useContext, useState, useCallback } from 'react';

/* ──────────────────────────────────────────────
   SymptomContext
   Stores the latest symptom-analysis result so that
   other patient-portal features (AI assistant, etc.)
   can reference what the user last analyzed.
   ────────────────────────────────────────────── */

const SymptomContext = createContext(null);

/**
 * Shape of `analysisResult`:
 * {
 *   symptoms:        string[]        – selected symptom IDs
 *   description:     string          – free-text description
 *   severity:        'mild' | 'moderate' | 'severe'
 *   duration:        string
 *   conditions:      { name: string, likelihood: 'high'|'medium'|'low' }[]
 *   riskLevel:       'low' | 'moderate' | 'high'
 *   recommendations: string[]
 *   analyzedAt:      string          – ISO timestamp
 * }
 */

export const SymptomProvider = ({ children }) => {
    const [analysisResult, setAnalysisResult] = useState(null);

    /** Call after analysis completes in SymptomChecker */
    const saveAnalysis = useCallback((result) => {
        setAnalysisResult({
            ...result,
            analyzedAt: new Date().toISOString(),
        });
    }, []);

    /** Optionally clear when user starts a new check */
    const clearAnalysis = useCallback(() => {
        setAnalysisResult(null);
    }, []);

    return (
        <SymptomContext.Provider value={{ analysisResult, saveAnalysis, clearAnalysis }}>
            {children}
        </SymptomContext.Provider>
    );
};

/** Convenience hook */
export const useSymptoms = () => {
    const ctx = useContext(SymptomContext);
    if (!ctx) throw new Error('useSymptoms must be used inside <SymptomProvider>');
    return ctx;
};

export default SymptomContext;
