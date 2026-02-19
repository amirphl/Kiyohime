import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import DynamicBrand from './DynamicBrand';
import LanguageSwitcher from './LanguageSwitcher';
import { headerI18n } from '../locales/header';
import { useTheme } from '../hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

const Header: React.FC = () => {
  const { isRTL, language } = useLanguage();
  const { isAuthenticated, manualLogout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const t = headerI18n[language as keyof typeof headerI18n] || headerI18n.en;


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

          {/* Navigation Links - Only show on homepage when not authenticated */}
          {window.location.pathname === '/' && !isAuthenticated && (
            <nav className='hidden md:flex items-center space-x-8'>
              <a
                href='#features'
                className='text-gray-700 hover:text-primary-600 transition-colors'
              >
                {t.features}
              </a>
              <a
                href='#how-it-works'
                className='text-gray-700 hover:text-primary-600 transition-colors'
              >
                {t.howItWorks}
              </a>
              <a
                href='/pricing'
                className='text-gray-700 hover:text-primary-600 transition-colors'
              >
                {t.pricing}
              </a>
            </nav>
          )}

          {/* Right side - Language switcher and auth buttons */}
          <div
            className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}
          >
            <button
              onClick={toggleTheme}
              className={`flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
              aria-label={t.darkMode}
            >
              {theme === 'dark' ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
              <span>{t.darkMode}</span>
            </button>
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div
                className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}
              >
                <button
                  onClick={handleDashboard}
                  className='text-gray-700 hover:text-primary-600 transition-colors font-medium'
                >
                  {t.dashboard}
                </button>
                <button onClick={handleLogout} className='btn-secondary'>
                  {t.logout}
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
                  {t.signin}
                </button>
                <button
                  onClick={() => (window.location.href = '/signup')}
                  className='btn-primary'
                >
                  {t.signup}
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
