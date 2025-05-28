import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCampaign } from '../../hooks/useCampaign';

const CampaignContentStep: React.FC = () => {
  const { t } = useTranslation();
  const { campaignData, updateContent } = useCampaign();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('campaign.content.title')}
        </h2>
        <p className="text-gray-600">
          {t('campaign.content.subtitle')}
        </p>
      </div>

      {/* Content Form */}
      <div className="space-y-6">
        {/* Message Text */}
        <div className="space-y-4">
          <label htmlFor="messageText" className="block text-sm font-medium text-gray-700">
            {t('campaign.content.messageText')}
          </label>
          <textarea
            id="messageText"
            rows={6}
            value={campaignData.content.messageText || ''}
            onChange={(e) => updateContent({ messageText: e.target.value })}
            placeholder={t('campaign.content.messageTextPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 resize-none"
          />
          <div className="text-sm text-gray-500">
            {t('campaign.content.characterLimit', { current: campaignData.content.messageText?.length || 0, max: 160 })}
          </div>
        </div>

        {/* Template Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            {t('campaign.content.template')}
          </label>
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
            >
              <div className="font-medium text-gray-900 mb-1">
                {t('campaign.content.welcomeTemplate')}
              </div>
              <div className="text-sm text-gray-600">
                {t('campaign.content.welcomeTemplateDesc')}
              </div>
            </button>
            
            <button
              type="button"
              className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
            >
              <div className="font-medium text-gray-900 mb-1">
                {t('campaign.content.promotionTemplate')}
              </div>
              <div className="text-sm text-gray-600">
                {t('campaign.content.promotionTemplateDesc')}
              </div>
            </button>
            
            <button
              type="button"
              className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
            >
              <div className="font-medium text-gray-900 mb-1">
                {t('campaign.content.reminderTemplate')}
              </div>
              <div className="text-sm text-gray-600">
                {t('campaign.content.reminderTemplateDesc')}
              </div>
            </button>
          </div>
        </div>

        {/* Message Preview */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            {t('campaign.content.preview')}
          </label>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-2">
              {t('campaign.content.previewLabel')}
            </div>
            <div className="text-gray-900 whitespace-pre-wrap">
              {campaignData.content.messageText || t('campaign.content.noMessage')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignContentStep; 