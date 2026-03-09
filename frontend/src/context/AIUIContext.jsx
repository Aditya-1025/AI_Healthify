import React, { createContext, useContext, useState, useCallback } from 'react';

/* ──────────────────────────────────────────────
   AIUIContext
   Controls the global floating AI panel visibility.
   Provides:
     - isOpen       (boolean)
     - openAI()     (opens panel)
     - closeAI()    (closes panel)
     - toggleAI()   (toggles panel)
   ────────────────────────────────────────────── */

const AIUIContext = createContext(null);

export const AIUIProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openAI = useCallback(() => setIsOpen(true), []);
    const closeAI = useCallback(() => setIsOpen(false), []);
    const toggleAI = useCallback(() => setIsOpen(prev => !prev), []);

    return (
        <AIUIContext.Provider value={{ isOpen, openAI, closeAI, toggleAI }}>
            {children}
        </AIUIContext.Provider>
    );
};

/** Convenience hook */
export const useAIUI = () => {
    const ctx = useContext(AIUIContext);
    if (!ctx) throw new Error('useAIUI must be used inside <AIUIProvider>');
    return ctx;
};

export default AIUIContext;
