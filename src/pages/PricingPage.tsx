import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { DollarSign, TrendingUp, Users, Zap } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

interface PricingPlan {
  name: string;
  description: string;
  discount: string;
  icon: React.ReactNode;
  featured?: boolean;
  features: string[];
}

const PricingPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { navigate } = useNavigation();

  const isRTL = language === 'fa';

  const pricingPlans: PricingPlan[] = [
    {
      name: t('pricing.plans.basic.name') || 'Basic',
      description: t('pricing.plans.basic.description') || 'Perfect for small businesses getting started',
      discount: t('pricing.plans.basic.discount') || '5% discount',
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      features: [
        t('pricing.plans.basic.features.campaigns') || 'Up to 10 active campaigns',
        t('pricing.plans.basic.features.segments') || 'Basic segmentation',
        t('pricing.plans.basic.features.analytics') || 'Standard analytics',
        t('pricing.plans.basic.features.support') || 'Email support',
      ]
    },
    {
      name: t('pricing.plans.pro.name') || 'Pro',
      description: t('pricing.plans.pro.description') || 'For growing businesses with advanced needs',
      discount: t('pricing.plans.pro.discount') || '10% discount',
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      featured: true,
      features: [
        t('pricing.plans.pro.features.campaigns') || 'Up to 50 active campaigns',
        t('pricing.plans.pro.features.segments') || 'Advanced segmentation',
        t('pricing.plans.pro.features.analytics') || 'Advanced analytics & tracking',
        t('pricing.plans.pro.features.automation') || 'Marketing automation',
        t('pricing.plans.pro.features.support') || 'Priority support',
      ]
    },
    {
      name: t('pricing.plans.enterprise.name') || 'Enterprise',
      description: t('pricing.plans.enterprise.description') || 'Custom solutions for large organizations',
      discount: t('pricing.plans.enterprise.discount') || '15% discount',
      icon: <Users className="h-8 w-8 text-purple-600" />,
      features: [
        t('pricing.plans.enterprise.features.campaigns') || 'Unlimited campaigns',
        t('pricing.plans.enterprise.features.segments') || 'Custom segmentation',
        t('pricing.plans.enterprise.features.analytics') || 'Enterprise analytics',
        t('pricing.plans.enterprise.features.automation') || 'Full automation suite',
        t('pricing.plans.enterprise.features.support') || 'Dedicated account manager',
        t('pricing.plans.enterprise.features.custom') || 'Custom integrations',
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t('pricing.title') || 'Pricing'}</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              {t('pricing.subtitle') || 'Simple, transparent pricing that grows with you'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction Card */}
        <Card className="mb-12">
          <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="flex-shrink-0">
              <DollarSign className="h-12 w-12 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('pricing.intro.title') || 'How Pricing Works'}
              </h2>
              <p className={`text-gray-700 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('pricing.intro.description')}
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="font-semibold text-blue-900 mb-2">
                    {t('pricing.intro.payAsYouGo.title') || 'Pay As You Go'}
                  </div>
                  <div className="text-sm text-blue-700">
                    {t('pricing.intro.payAsYouGo.description') || 'Charged based on actual usage'}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="font-semibold text-green-900 mb-2">
                    {t('pricing.intro.transparent.title') || 'Transparent Fees'}
                  </div>
                  <div className="text-sm text-green-700">
                    {t('pricing.intro.transparent.description') || '10% tax included in all transactions'}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="font-semibold text-purple-900 mb-2">
                    {t('pricing.intro.volume.title') || 'Volume Discounts'}
                  </div>
                  <div className="text-sm text-purple-700">
                    {t('pricing.intro.volume.description') || 'Save more with higher credit purchases'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Pricing Plans */}
        {/* <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t('pricing.plans.title') || 'Choose Your Plan'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.featured ? 'ring-2 ring-primary-500 shadow-xl' : ''}`}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      {t('pricing.plans.popular') || 'Popular'}
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-3xl font-bold text-red-600">{plan.discount}</div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-gray-700`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.featured ? 'primary' : 'outline'}
                  className="w-full"
                  onClick={() => navigate('/signup')}
                >
                  {t('pricing.plans.getStarted') || 'Get Started'}
                </Button>
              </Card>
            ))}
          </div>
        </div> */}

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold mb-4">
              {t('pricing.cta.title') || 'Ready to get started?'}
            </h2>
            <p className="text-xl text-primary-100 mb-6">
              {t('pricing.cta.description') || 'Create your account today and start your first campaign'}
            </p>
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              <Button
                variant="outline"
                className="bg-white text-red-600 hover:bg-gray-100 border-white"
                onClick={() => navigate('/signup')}
              >
                {t('pricing.cta.signup') || 'Sign Up Now'}
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600"
                onClick={() => navigate('/contact')}
              >
                {t('pricing.cta.contact') || 'Contact Sales'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PricingPage; 