import React from 'react';
import {
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  Target,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Target className='h-8 w-8' />,
      title: t('home.features.targeted.title'),
      description: t('home.features.targeted.description'),
    },
    {
      icon: <Users className='h-8 w-8' />,
      title: t('home.features.segmentation.title'),
      description: t('home.features.segmentation.description'),
    },
    {
      icon: <BarChart3 className='h-8 w-8' />,
      title: t('home.features.analytics.title'),
      description: t('home.features.analytics.description'),
    },
    {
      icon: <Shield className='h-8 w-8' />,
      title: t('home.features.compliance.title'),
      description: t('home.features.compliance.description'),
    },
  ];

  const stats = [
    { number: '10K+', label: t('home.stats.customers') },
    { number: '1M+', label: t('home.stats.messages') },
    { number: '99.9%', label: t('home.stats.delivery') },
    { number: '24/7', label: t('home.stats.support') },
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/signin';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16'>
          <div className='text-center'>
            <div className='mb-8'>
              <div className='inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6'>
                <Zap className='h-4 w-4 mr-2' />
                {t('home.hero.badge')}
              </div>
            </div>

            <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
              {t('home.hero.title')}
            </h1>

            <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto'>
              {t('home.hero.subtitle')}
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button
                onClick={handleGetStarted}
                className={`btn-primary text-lg px-8 py-4 flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}
              >
                <span>{t('home.hero.cta')}</span>
                <ArrowRight
                  className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`}
                />
              </button>

              <button
                onClick={() => (window.location.href = '/signin')}
                className='btn-secondary text-lg px-8 py-4'
              >
                {t('home.hero.signin')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center'>
                <div className='text-3xl md:text-4xl font-bold text-primary-600 mb-2'>
                  {stat.number}
                </div>
                <div className='text-gray-600'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              {t('home.features.title')}
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow'
              >
                <div className='text-primary-600 mb-4'>{feature.icon}</div>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                  {feature.title}
                </h3>
                <p className='text-gray-600'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id='how-it-works' className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              {t('home.howItWorks.title')}
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              {t('home.howItWorks.subtitle')}
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6'>
                <span className='text-2xl font-bold text-primary-600'>1</span>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                {t('home.howItWorks.step1.title')}
              </h3>
              <p className='text-gray-600'>
                {t('home.howItWorks.step1.description')}
              </p>
            </div>

            <div className='text-center'>
              <div className='bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6'>
                <span className='text-2xl font-bold text-primary-600'>2</span>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                {t('home.howItWorks.step2.title')}
              </h3>
              <p className='text-gray-600'>
                {t('home.howItWorks.step2.description')}
              </p>
            </div>

            <div className='text-center'>
              <div className='bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6'>
                <span className='text-2xl font-bold text-primary-600'>3</span>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                {t('home.howItWorks.step3.title')}
              </h3>
              <p className='text-gray-600'>
                {t('home.howItWorks.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-primary-600'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
            {t('home.cta.title')}
          </h2>
          <p className='text-xl text-primary-100 mb-8'>
            {t('home.cta.subtitle')}
          </p>
          <button
            onClick={handleGetStarted}
            className={`bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center mx-auto ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}
          >
            <span>{t('home.cta.button')}</span>
            <ArrowRight className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
