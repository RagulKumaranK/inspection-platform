import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    // {/* LANGUAGE: Currently English only, ready for i18n integration */}
    // {/* LANGUAGE: Future support for Hindi and Telugu */}
    const [language, setLanguage] = useState('en');

    // {/* LANGUAGE: This will be replaced with i18n translation function */}
    const t = (key) => {
        // Placeholder for future translation implementation
        return key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
