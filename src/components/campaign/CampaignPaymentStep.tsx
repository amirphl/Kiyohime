import React from 'react';
import { CreditCard, Wallet, Banknote } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCampaign } from '../../hooks/useCampaign';

const CampaignPaymentStep: React.FC = () => {
  const { t } = useTranslation();
  const { campaignData, updatePayment } = useCampaign();

  const paymentMethods = [
    {
      id: 'credit_card',
      name: t('campaign.payment.creditCard'),
      description: t('campaign.payment.creditCardDesc'),
      icon: CreditCard,
    },
    {
      id: 'wallet',
      name: t('campaign.payment.wallet'),
      description: t('campaign.payment.walletDesc'),
      icon: Wallet,
    },
    {
      id: 'bank_transfer',
      name: t('campaign.payment.bankTransfer'),
      description: t('campaign.payment.bankTransferDesc'),
      icon: Banknote,
    },
  ];

  const handlePaymentMethodChange = (method: string) => {
    updatePayment({ paymentMethod: method });
  };

  const handleTermsToggle = () => {
    updatePayment({ termsAccepted: !campaignData.payment.termsAccepted });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('campaign.payment.title')}
        </h2>
        <p className="text-gray-600">
          {t('campaign.payment.subtitle')}
        </p>
      </div>

      {/* Payment Form */}
      <div className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            {t('campaign.payment.paymentMethod')}
          </label>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handlePaymentMethodChange(method.id)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                    campaignData.payment.paymentMethod === method.id
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-6 w-6" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {method.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {method.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Campaign Summary */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            {t('campaign.payment.campaignSummary')}
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('campaign.payment.targetAudience')}</span>
              <span className="text-gray-900">
                {campaignData.segment.customerType || t('campaign.payment.notSpecified')}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('campaign.payment.messageLength')}</span>
              <span className="text-gray-900">
                {campaignData.content.messageText?.length || 0} {t('campaign.payment.characters')}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('campaign.payment.totalBudget')}</span>
              <span className="text-gray-900">
                ${campaignData.budget.totalBudget?.toLocaleString() || '0'}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('campaign.payment.estimatedMessages')}</span>
              <span className="text-gray-900">
                {campaignData.budget.estimatedMessages?.toLocaleString() || '0'}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('campaign.payment.costPerMessage')}</span>
              <span className="text-gray-900">
                ¢{campaignData.budget.costPerMessage || '0'}
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-base font-medium">
              <span className="text-gray-900">{t('campaign.payment.totalCost')}</span>
              <span className="text-primary-600">
                ${campaignData.budget.maxSpend?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={campaignData.payment.termsAccepted || false}
              onChange={handleTermsToggle}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
            />
            <div className="text-sm">
              <label htmlFor="termsAccepted" className="text-gray-700">
                {t('campaign.payment.termsLabel')}
              </label>
              <p className="text-gray-500 mt-1">
                {t('campaign.payment.termsDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                {t('campaign.payment.securityTitle')}
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>{t('campaign.payment.securityDescription')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPaymentStep; 