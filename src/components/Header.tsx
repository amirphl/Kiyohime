import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import DynamicBrand from './DynamicBrand';
import LanguageSwitcher from './LanguageSwitcher';
import { headerI18n } from '../locales/header';

const Header: React.FC = () => {
  const { isRTL } = useLanguage();
  const { isAuthenticated, manualLogout } = useAuth();
  const { language } = useLanguage();
  const headerT = headerI18n[language as keyof typeof headerI18n] || headerI18n.en;


  const handleLogout = () => {
    manualLogout();
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
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo and Brand */}
          <div className='flex items-center'>
            <button
              onClick={handleHome}
              className='flex items-center space-x-3 hover:opacity-80 transition-opacity'
            >
              <DynamicBrand />
            </button>
          </div>

          {/* Navigation Links - Only show on homepage */}
          {window.location.pathname === '/' && (
            <nav className='hidden md:flex items-center space-x-8'>
              <a
                href='#features'
                className='text-gray-700 hover:text-primary-600 transition-colors'
              >
                {headerT.features}
              </a>
              <a
                href='#how-it-works'
                className='text-gray-700 hover:text-primary-600 transition-colors'
              >
                {headerT.howItWorks}
              </a>
              <a
                href='/pricing'
                className='text-gray-700 hover:text-primary-600 transition-colors'
              >
                {headerT.pricing}
              </a>
            </nav>
          )}

          {/* Right side - Language switcher and auth buttons */}
          <div
            className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}
          >
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div
                className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}
              >
                <button
                  onClick={handleDashboard}
                  className='text-gray-700 hover:text-primary-600 transition-colors font-medium'
                >
                  {headerT.dashboard}
                </button>
                <button onClick={handleLogout} className='btn-secondary'>
                  {headerT.logout}
                </button>
              </div>
            ) : (
              <div
                className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}
              >
                <button
                  onClick={handleSignIn}
                  className='text-gray-700 hover:text-primary-600 transition-colors font-medium'
                >
                  {headerT.signin}
                </button>
                <button
                  onClick={() => (window.location.href = '/signup')}
                  className='btn-primary'
                >
                  {headerT.signup}
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
