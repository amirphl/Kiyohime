import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthRouter from './components/AuthRouter';
import EnvironmentBanner from './components/EnvironmentBanner';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider } from './hooks/useLanguage';
import { ToastProvider } from './components/ToastContainer';
import { AuthProvider } from './hooks/useAuth';

function App() {
  // Check if we're on the homepage
  const isHomePage = window.location.pathname === '/';
  const isAuthPage = [
    '/signin',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
  ].includes(window.location.pathname);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <div className='min-h-screen bg-gray-50 flex flex-col'>
              <EnvironmentBanner />
              {/* Only show Header on homepage and auth pages */}
              {(isHomePage || isAuthPage) && <Header />}
              <main className='flex-1'>
                <AuthRouter />
              </main>
              {/* Only show Footer on homepage */}
              {isHomePage && <Footer />}
            </div>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
