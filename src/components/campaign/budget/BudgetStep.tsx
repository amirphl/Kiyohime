import React, { useCallback, useRef } from 'react';
import { DollarSign } from 'lucide-react';
import { useCampaign } from '../../../hooks/useCampaign';
import { useLanguage } from '../../../hooks/useLanguage';
import { useAuth } from '../../../hooks/useAuth';
import StepHeader from '../../ui/StepHeader';
import Button from '../../ui/Button';
import BudgetInputCard from './BudgetInputCard';
import BudgetSelector from './BudgetSelector';
import MessageCountCard from './MessageCountCard';
import { useMessageCount } from './useMessageCount';
import { usePlatformSettingsList } from '../../../hooks/usePlatformSettingsList';
import { budgetI18n } from './budgetTranslations';

const BudgetStep: React.FC = () => {
  const { campaignData, updateBudget } = useCampaign();
  const platform = campaignData.level.platform || 'sms';
  const { language } = useLanguage();
  const t = budgetI18n[language as keyof typeof budgetI18n] || budgetI18n.en;
  const { accessToken } = useAuth();
  usePlatformSettingsList(accessToken, platform === 'sms' ? 'bale' : platform);
  const currencyLabel = language === 'en' ? 'Toman' : 'تومان';
  const MIN_TEXT_BUDGET = 100000;
  const MAX_BUDGET = 160000000;
  const BUDGET_STEP = 100000;

  // Debouncing ref for budget field
  const budgetDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate message count
  const {
    messageCount,
    maxMessageCount,
    isLoading: isLoadingMessageCount,
    error: messageCountError,
    calculateDebounced,
    resetMessageCount,
  } = useMessageCount(campaignData);

  const handleTotalBudgetChange = (value: number) => {
    const numeric = Number.isFinite(value) ? value : 0;
    const normalized = Math.max(0, numeric);
    updateBudget({ totalBudget: normalized });
    if (
      normalized >= MIN_TEXT_BUDGET &&
      normalized <= MAX_BUDGET &&
      ((platform === 'sms' && campaignData.content.lineNumber) ||
        (platform !== 'sms' && campaignData.content.platformSettingsId))
    ) {
      calculateDebounced(campaignData.content.lineNumber, normalized);
    }
    if (budgetDebounceRef.current) {
      clearTimeout(budgetDebounceRef.current);
    }
  };

  const handlePercentBudgetChange = useCallback(
    (percent: number, amount: number) => {
      if (percent <= 0) return;
      const rounded = Math.max(0, Math.floor(amount / 1000) * 1000);
      updateBudget({ totalBudget: rounded });
      if (
        rounded >= MIN_TEXT_BUDGET &&
        rounded <= MAX_BUDGET &&
        ((platform === 'sms' && campaignData.content.lineNumber) ||
          (platform !== 'sms' && campaignData.content.platformSettingsId))
      ) {
        calculateDebounced(campaignData.content.lineNumber, rounded);
      }
    },
    [
      MAX_BUDGET,
      campaignData.content.lineNumber,
      campaignData.content.platformSettingsId,
      calculateDebounced,
      platform,
      updateBudget,
    ]
  );

  const handleReset = () => {
    if (budgetDebounceRef.current) {
      clearTimeout(budgetDebounceRef.current);
      budgetDebounceRef.current = null;
    }
    resetMessageCount();
    updateBudget({
      totalBudget: 0,
      estimatedMessages: undefined,
    });
  };

  return (
    <div className='space-y-8'>
      <StepHeader
        title={t.title}
        subtitle={''}
        icon={<DollarSign className='h-6 w-6 text-primary-600' />}
      />

      <div className='space-y-6'>
        {/* Budget selector based on user balance */}
        <BudgetSelector
          accessToken={accessToken}
          initialPercent={10}
          onChange={handlePercentBudgetChange}
        />

        {/* Total Budget and Message Count side-by-side */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Total Budget */}
          <BudgetInputCard
            value={campaignData.budget.totalBudget}
            onChange={handleTotalBudgetChange}
            title={t.campaignBudget}
            label={''}
            placeholder={t.budgetPlaceholder}
            helpText={t.budgetHelp}
            validationMessage={t.budgetValidation}
            currencyLabel={currencyLabel}
            budgetLabel={t.budget}
            min={MIN_TEXT_BUDGET}
            max={MAX_BUDGET}
            step={BUDGET_STEP}
          />

          {/* Message Count Calculation */}
          <MessageCountCard
            messageCount={messageCount}
            maxMessageCount={maxMessageCount}
            isLoading={isLoadingMessageCount}
            error={messageCountError}
            lineNumber={
              platform === 'sms'
                ? campaignData.content.lineNumber || ''
                : campaignData.content.platformSettingsId
                  ? String(campaignData.content.platformSettingsId)
                  : ''
            }
            totalBudget={campaignData.budget.totalBudget}
            title={t.estimatedMessages}
            calculatingLabel={t.calculatingMessageCount}
            messagesLabel={t.messages}
            calculatingText={t.calculating}
            enterBudgetText={t.enterBudgetToSee}
            sentLabel={t.sentCountLabel}
            capacityLabel={t.capacityCountLabel}
          />
        </div>

        <div className='flex items-center'>
          <Button variant='outline' onClick={handleReset}>
            {t.reset}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BudgetStep;
