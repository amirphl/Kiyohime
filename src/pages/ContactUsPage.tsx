import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';

const ContactUsPage: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className='max-w-2xl w-full bg-white shadow rounded-lg p-6 sm:p-8'>
        <h1 className='text-2xl font-bold mb-4'>{t('contact.title')}</h1>
        <div className='space-y-3 text-gray-700'>
          <p>{t('contact.companyName')}</p>
          <p>{t('contact.address')}</p>
          <p>{t('contact.postalCode')}</p>
          <p>
            <a href='mailto:info@jazebeh.ir' className='text-blue-600 hover:underline'>
              {t('contact.email')}
            </a>
          </p>
          <p>{t('contact.phone')}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage; 