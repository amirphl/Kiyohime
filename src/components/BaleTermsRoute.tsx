import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import BaleTermsPage from '../pages/platformSettings/BaleTermsPage';
import { settingsTranslations } from '../pages/platformSettings/translations';

const BaleTermsRoute: React.FC = () => {
  const { language } = useLanguage();
  const settingsT =
    settingsTranslations[language as keyof typeof settingsTranslations] ||
    settingsTranslations.en;

  return (
    <div className='p-8'>
      <div className='max-w-4xl mx-auto'>
        <BaleTermsPage
          title={settingsT.settings.baleTerms.title}
          content={settingsT.settings.baleTerms.content}
        />
      </div>
    </div>
  );
};

export default BaleTermsRoute;
