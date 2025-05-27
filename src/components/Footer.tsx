import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import DynamicBrand from './DynamicBrand';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <footer className='bg-gray-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='col-span-1 md:col-span-2'>
            <div className='mb-4'>
              <DynamicBrand showSubtitle={true} />
            </div>
            <p className='text-gray-400 mb-4 max-w-md'>
              {t('footer.description')}
            </p>
            <div
              className={`flex ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}
            >
              <button className='text-gray-400 hover:text-white transition-colors duration-200'>
                <Mail className='w-5 h-5' />
              </button>
              <button className='text-gray-400 hover:text-white transition-colors duration-200'>
                <Phone className='w-5 h-5' />
              </button>
              <button className='text-gray-400 hover:text-white transition-colors duration-200'>
                <MapPin className='w-5 h-5' />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>
              {t('footer.quickLinks')}
            </h4>
            <ul className='space-y-2'>
              <li>
                <button className='text-gray-400 hover:text-white transition-colors duration-200'>
                  {t('header.dashboard')}
                </button>
              </li>
              <li>
                <button className='text-gray-400 hover:text-white transition-colors duration-200'>
                  {t('header.campaigns')}
                </button>
              </li>
              <li>
                <button className='text-gray-400 hover:text-white transition-colors duration-200'>
                  {t('header.analytics')}
                </button>
              </li>
              <li>
                <button className='text-gray-400 hover:text-white transition-colors duration-200'>
                  {t('header.support')}
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>
              {t('footer.support')}
            </h4>
            <ul className='space-y-2'>
              <li>
                <button className='text-gray-400 hover:text-white transition-colors duration-200'>
                  {t('footer.helpCenter')}
                </button>
              </li>
              <li>
                <button className='text-gray-400 hover:text-white transition-colors duration-200'>
                  {t('footer.contactUs')}
                </button>
              </li>
              <li>
                <button className='text-gray-400 hover:text-white transition-colors duration-200'>
                  {t('footer.privacyPolicy')}
                </button>
              </li>
              <li>
                <button className='text-gray-400 hover:text-white transition-colors duration-200'>
                  {t('footer.termsOfService')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-gray-800 mt-8 pt-8 text-center'>
          <p className='text-gray-400'>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
