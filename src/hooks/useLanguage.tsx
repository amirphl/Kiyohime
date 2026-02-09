import { useState, useEffect, createContext, useContext } from 'react';

export type Language = 'en' | 'fa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  languageSwitchEnabled: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const languageSwitchEnabled =
    process.env.REACT_APP_ENABLE_LANGUAGE_SWITCH !== 'false';
  const defaultLanguageEnv =
    process.env.REACT_APP_DEFAULT_LANGUAGE === 'en' ? 'en' : 'fa';

  const [language, setLanguageState] = useState<Language>(() => {
    if (!languageSwitchEnabled) return defaultLanguageEnv;
    const stored = localStorage.getItem('language');
    if (stored === 'fa' || stored === 'en') {
      return stored as Language;
    }
    return defaultLanguageEnv;
  });

  const setLanguage = (lang: Language) => {
    if (!languageSwitchEnabled) return;
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
  };

  const isRTL = language === 'fa';

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute(
      'dir',
      language === 'fa' ? 'rtl' : 'ltr'
    );
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, isRTL, languageSwitchEnabled }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
