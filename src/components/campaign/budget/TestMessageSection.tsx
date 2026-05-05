import React from 'react';
import { CheckCircle2, Circle, Send } from 'lucide-react';
import { useCampaign } from '../../../hooks/useCampaign';
import { useAuth } from '../../../hooks/useAuth';
import { useLanguage } from '../../../hooks/useLanguage';
import { PlatformSettingsItem } from '../../../types/platformSettings';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { budgetI18n } from './budgetTranslations';
import { useCampaignTestMessage } from './useCampaignTestMessage';

interface TestMessageSectionProps {
  activePlatformSettings: PlatformSettingsItem[];
}

const TestMessageSection: React.FC<TestMessageSectionProps> = ({
  activePlatformSettings,
}) => {
  const { campaignData } = useCampaign();
  const { accessToken } = useAuth();
  const { language } = useLanguage();
  const normalizedLanguage: 'en' | 'fa' = language === 'fa' ? 'fa' : 'en';
  const t = budgetI18n[normalizedLanguage];
  const platform = campaignData.segment.platform || 'sms';

  const { isSending, checks, sendTestMessage } = useCampaignTestMessage({
    campaignData,
    activePlatformSettings,
    accessToken,
    language,
  });

  const requirementItems = [
    {
      key: 'content',
      passed: checks.hasContent,
      label: t.testMessageRequirementContent,
    },
    {
      key: 'adlink',
      passed: checks.hasAdlinkWhenEnabled,
      label: t.testMessageRequirementAdlink,
    },
    {
      key: 'platform-settings',
      passed: checks.hasActivePlatformSettingsForNonSms,
      label:
        platform === 'sms'
          ? t.testMessageRequirementPlatformSettingsNotNeeded
          : t.testMessageRequirementPlatformSettings,
    },
    {
      key: 'line-number',
      passed: checks.hasLineNumberForSms,
      label:
        platform === 'sms'
          ? t.testMessageRequirementLineNumber
          : t.testMessageRequirementLineNumberNotNeeded,
    },
  ];

  return (
    <Card>
      <div className='space-y-4'>
        <div className='space-y-1'>
          <h3 className='text-lg font-medium text-gray-900 flex items-center gap-2'>
            <Send className='h-5 w-5 text-primary-600' />
            {t.testMessageTitle}
          </h3>
          <p className='text-sm text-gray-600'>{t.testMessageDescription}</p>
        </div>

        <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2'>
          {requirementItems.map(item => (
            <div
              key={item.key}
              className='flex items-center gap-2 text-sm text-gray-700'
            >
              {item.passed ? (
                <CheckCircle2 className='h-4 w-4 text-green-600 shrink-0' />
              ) : (
                <Circle className='h-4 w-4 text-gray-400 shrink-0' />
              )}
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            onClick={sendTestMessage}
            disabled={isSending}
          >
            {isSending ? t.testMessageSending : t.testMessageSendAction}
          </Button>
          <span className='text-xs text-gray-500'>
            {t.testMessageNoSideEffect}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TestMessageSection;
