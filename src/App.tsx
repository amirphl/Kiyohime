import Header from './components/Header';
import Footer from './components/Footer';
import AuthRouter from './components/AuthRouter';
import EnvironmentBanner from './components/EnvironmentBanner';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider } from './hooks/useLanguage';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <EnvironmentBanner />
          <Header />
          <main className="flex-1">
            <AuthRouter />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App; 