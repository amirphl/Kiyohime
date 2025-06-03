import React from 'react';
import { Wallet, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import Button from '../components/ui/Button';

const WalletPage: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/dashboard'}
                className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors ${
                  isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                }`}
              >
                <ArrowLeft className="h-5 w-5" />
                <span>{t('dashboard.title')}</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                <Wallet className="h-6 w-6 mr-2 text-primary-600" />
                {t('wallet.title')}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {t('wallet.comingSoon')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('wallet.comingSoonMessage')}
            </p>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              variant="primary"
            >
              {t('wallet.backToDashboard')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage; 