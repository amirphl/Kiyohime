import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import DynamicBrand from './DynamicBrand';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleSignIn = () => {
    window.location.href = '/signin';
  };

  const handleDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handleHome = () => {
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button
              onClick={handleHome}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <DynamicBrand />
            </button>
          </div>

          {/* Navigation Links - Only show on homepage */}
          {window.location.pathname === '/' && (
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-600 transition-colors">
                {t('header.features')}
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors">
                {t('header.howItWorks')}
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition-colors">
                {t('header.pricing')}
              </a>
            </nav>
          )}

          {/* Right side - Language switcher and auth buttons */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <LanguageSwitcher />
            
            {isAuthenticated ? (
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <button
                  onClick={handleDashboard}
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  {t('header.dashboard')}
                </button>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  {t('header.logout')}
                </button>
              </div>
            ) : (
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <button
                  onClick={handleSignIn}
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  {t('header.signin')}
                </button>
                <button
                  onClick={() => window.location.href = '/signup'}
                  className="btn-primary"
                >
                  {t('header.signup')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 