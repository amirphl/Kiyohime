import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCampaign } from '../../hooks/useCampaign';

const CampaignBudgetStep: React.FC = () => {
  const { t } = useTranslation();
  const { campaignData, updateBudget } = useCampaign();

  const handleTotalBudgetChange = (value: number) => {
    const totalBudget = value;
    const costPerMessage = campaignData.budget.costPerMessage;
    const estimatedMessages = Math.floor(totalBudget / costPerMessage);
    const maxSpend = totalBudget;

    updateBudget({
      totalBudget,
      estimatedMessages,
      maxSpend,
    });
  };

  const handleCostPerMessageChange = (value: number) => {
    const costPerMessage = value;
    const totalBudget = campaignData.budget.totalBudget;
    const estimatedMessages = totalBudget > 0 ? Math.floor(totalBudget / costPerMessage) : 0;
    const maxSpend = totalBudget;

    updateBudget({
      costPerMessage,
      estimatedMessages,
      maxSpend,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('campaign.budget.title')}
        </h2>
        <p className="text-gray-600">
          {t('campaign.budget.subtitle')}
        </p>
      </div>

      {/* Budget Form */}
      <div className="space-y-6">
        {/* Total Budget */}
        <div className="space-y-4">
          <label htmlFor="totalBudget" className="block text-sm font-medium text-gray-700">
            {t('campaign.budget.totalBudget')}
          </label>
          <div className="relative">
            <input
              type="number"
              id="totalBudget"
              min="0"
              step="1000"
              value={campaignData.budget.totalBudget || ''}
              onChange={(e) => handleTotalBudgetChange(Number(e.target.value) || 0)}
              placeholder={t('campaign.budget.totalBudgetPlaceholder')}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {t('campaign.budget.totalBudgetHelp')}
          </div>
        </div>

        {/* Cost Per Message */}
        <div className="space-y-4">
          <label htmlFor="costPerMessage" className="block text-sm font-medium text-gray-700">
            {t('campaign.budget.costPerMessage')}
          </label>
          <div className="relative">
            <input
              type="number"
              id="costPerMessage"
              min="1"
              max="1000"
              step="1"
              value={campaignData.budget.costPerMessage || ''}
              onChange={(e) => handleCostPerMessageChange(Number(e.target.value) || 0)}
              placeholder={t('campaign.budget.costPerMessagePlaceholder')}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">¢</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {t('campaign.budget.costPerMessageHelp')}
          </div>
        </div>

        {/* Budget Summary */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            {t('campaign.budget.summary')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-primary-600">
                ${campaignData.budget.totalBudget?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-600">
                {t('campaign.budget.totalBudget')}
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {campaignData.budget.estimatedMessages?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-600">
                {t('campaign.budget.estimatedMessages')}
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                ${campaignData.budget.maxSpend?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-600">
                {t('campaign.budget.maxSpend')}
              </div>
            </div>
          </div>
        </div>

        {/* Budget Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                {t('campaign.budget.tipsTitle')}
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>{t('campaign.budget.tip1')}</li>
                  <li>{t('campaign.budget.tip2')}</li>
                  <li>{t('campaign.budget.tip3')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBudgetStep; 