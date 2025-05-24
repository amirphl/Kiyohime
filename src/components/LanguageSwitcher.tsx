import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, isRTL } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-100 ${
          language === 'en' ? 'bg-primary-100 text-primary-700' : 'text-gray-700'
        } ${isRTL ? 'space-x-reverse' : ''}`}
      >
        <span>EN</span>
      </button>
      <button
        onClick={() => setLanguage('fa')}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-100 ${
          language === 'fa' ? 'bg-primary-100 text-primary-700' : 'text-gray-700'
        } ${isRTL ? 'space-x-reverse' : ''}`}
      >
        <span>فا</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher; 