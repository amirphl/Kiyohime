import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, isRTL } = useLanguage();

  return (
    <div className='flex items-center space-x-2'>
      <button
        disabled={true}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 opacity-50 cursor-not-allowed ${
          language === 'en'
            ? 'bg-gray-100 text-gray-700'
            : 'text-gray-500'
        } ${isRTL ? 'space-x-reverse' : ''}`}
      >
        <span>EN</span>
      </button>
      <button
        disabled={true}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 opacity-50 cursor-not-allowed ${
          language === 'fa'
            ? 'bg-gray-100 text-gray-700'
            : 'text-gray-500'
        } ${isRTL ? 'space-x-reverse' : ''}`}
      >
        <span>فا</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
