import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import { contactI18n } from '../locales/contact';

const ContactUsPage: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { language } = useLanguage();
  const contactT = contactI18n[language as keyof typeof contactI18n] || contactI18n.en;

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className='max-w-2xl w-full bg-white shadow rounded-lg p-6 sm:p-8'>
        <h1 className='text-2xl font-bold mb-4'>{contactT.title}</h1>
        <div className='space-y-3 text-gray-700'>
          <p>{contactT.companyName}</p>
          <p>{contactT.address}</p>
          <p>{contactT.postalCode}</p>
          <p>
            <a href='mailto:info@jazebeh.ir' className='text-blue-600 hover:underline'>
              {contactT.email}
            </a>
          </p>
          <p>{contactT.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage; 