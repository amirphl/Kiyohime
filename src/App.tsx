import React from 'react';
import './index.css';
import AuthRouter from './components/AuthRouter';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import { LanguageProvider } from './hooks/useLanguage';
import { ToastProvider } from './components/ToastContainer';
import { AuthProvider } from './hooks/useAuth';
import { CampaignProvider } from './hooks/useCampaign';
import { NavigationProvider } from './contexts/NavigationContext';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CampaignProvider>
          <NavigationProvider>
            <ToastProvider>
              <div className='min-h-screen bg-gray-50 flex flex-col'>
                <Header />
                <div className='flex-1 flex'>
                  {/* Global sidebar shown on all pages */}
                  <Sidebar />
                  <main className='flex-1'>
                    <AuthRouter />
                  </main>
                </div>
                <Footer />
              </div>
            </ToastProvider>
          </NavigationProvider>
        </CampaignProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
