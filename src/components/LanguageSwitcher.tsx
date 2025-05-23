import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, isRTL } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fa' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-100 ${
        isRTL ? 'space-x-reverse' : ''
      }`}
      title={language === 'en' ? 'Switch to فارسی' : 'Switch to English'}
    >
      <Globe className="w-4 h-4" />
      <span>{language === 'en' ? 'فا' : 'EN'}</span>
    </button>
  );
};

export default LanguageSwitcher; 