import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslation } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // Funcția pentru traduceri
  toggleLanguage: () => void; // Comutare rapidă între RO și RU
}

// Creăm contextul
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Cheia pentru stocare locală
const LANGUAGE_STORAGE_KEY = 'mpl-language-preference';

// Provider-ul de limbă pentru întreaga aplicație
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inițializăm limba cu preferința salvată sau cu limba implicită
  const getSavedLanguage = (): Language => {
    if (typeof window === 'undefined') return 'ro'; // Default pentru SSR
    
    const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLang === 'ro' || savedLang === 'ru') {
      return savedLang;
    }
    
    // Verificăm limba browserului pentru utilizatorii noi
    const browserLang = navigator.language || (navigator as any).userLanguage || '';
    if (browserLang.startsWith('ru')) {
      return 'ru';
    }
    
    return 'ro'; // Limba implicită
  };
  
  const [language, setLanguageState] = useState<Language>(getSavedLanguage);
  
  // Salvăm preferința de limbă
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  };
  
  // Comutare rapidă între RO și RU
  const toggleLanguage = () => {
    setLanguage(language === 'ro' ? 'ru' : 'ro');
  };
  
  // Funcția de traducere
  const t = (key: string): string => {
    return getTranslation(key, language);
  };
  
  // Actualizăm atributul lang al HTML pentru SEO
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.lang = language;
  }, [language]);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizat pentru a folosi contextul de limbă
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};