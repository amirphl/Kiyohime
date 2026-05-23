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
  const [targetPhoneNumber, setTargetPhoneNumber] = React.useState('');
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
    targetPhoneNumber,
  });

  const handleTargetPhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTargetPhoneNumber(event.target.value.replace(/\D/g, '').slice(0, 10));
  };

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

        <div className='space-y-2'>
          <label
            htmlFor='test-message-target-phone'
            className='block text-sm font-medium text-gray-700'
          >
            {t.testMessageTargetPhoneLabel}
            <span className='text-red-500 ml-1'>*</span>
          </label>
          <div
            className='flex max-w-sm flex-row rounded-md shadow-sm'
            dir='ltr'
          >
            <span className='inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-600'>
              +98
            </span>
            <input
              id='test-message-target-phone'
              type='tel'
              inputMode='numeric'
              autoComplete='tel'
              dir='ltr'
              value={targetPhoneNumber}
              onChange={handleTargetPhoneNumberChange}
              placeholder='9xxxxxxxxx'
              className='block w-full rounded-r-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500'
            />
          </div>
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
