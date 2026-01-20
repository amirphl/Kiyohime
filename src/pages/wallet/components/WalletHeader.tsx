import React from 'react';
import { ArrowLeft, Wallet } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../hooks/useLanguage';
import { useTranslation } from '../../../hooks/useTranslation';
import { WalletCopy } from '../translations';

interface WalletHeaderProps {
  onBack: () => void;
  copy: WalletCopy;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({ onBack, copy }) => {
  const { isRTL } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <Button
              variant='ghost'
              onClick={onBack}
              className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors ${
                isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
              }`}
            >
              <ArrowLeft className='h-5 w-5' />
              <span>{t('dashboard.title')}</span>
            </Button>
          </div>

          <div className='flex items-center space-x-4'>
            <h1 className='text-xl font-semibold text-gray-900 flex items-center'>
              <Wallet className='h-6 w-6 mr-2 text-primary-600' />
              {copy.title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletHeader;
