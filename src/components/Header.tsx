import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';
import DynamicBrand from './DynamicBrand';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <DynamicBrand />

          {/* Navigation */}
          <nav className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
            <button className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
              {t('header.dashboard')}
            </button>
            <button className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
              {t('header.campaigns')}
            </button>
            <button className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
              {t('header.analytics')}
            </button>
            <button className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
              {t('header.support')}
            </button>
          </nav>

          {/* User Menu */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <LanguageSwitcher />
            <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200">
              <BarChart3 className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 