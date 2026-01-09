import React, { useCallback, useRef } from 'react';
import { DollarSign } from 'lucide-react';
import { useCampaign } from '../../../hooks/useCampaign';
import { useLanguage } from '../../../hooks/useLanguage';
import { useAuth } from '../../../hooks/useAuth';
import StepHeader from '../../ui/StepHeader';
import LineNumberCard from './LineNumberCard';
import BudgetInputCard from './BudgetInputCard';
import BudgetSelector from './BudgetSelector';
import MessageCountCard from './MessageCountCard';
import { useLineNumbers } from './useLineNumbers';
import { useMessageCount } from './useMessageCount';
import { budgetI18n } from './budgetTranslations';

const BudgetStep: React.FC = () => {
  const { campaignData, updateBudget } = useCampaign();
  const { language } = useLanguage();
  const t = budgetI18n[language as keyof typeof budgetI18n] || budgetI18n.en;
  const { accessToken } = useAuth();
  const currencyLabel = language === 'en' ? 'Toman' : 'تومان';
  const MIN_TEXT_BUDGET = 1000;
  const MAX_BUDGET = 160000000;

  // Debouncing ref for budget field
  const budgetDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch line numbers
  const {
    lineNumberOptions,
    isLoading: isLoadingLineNumbers,
    error: lineNumbersError,
  } = useLineNumbers(accessToken);

  // Calculate message count
  const {
    messageCount,
    maxMessageCount,
    isLoading: isLoadingMessageCount,
    error: messageCountError,
    calculateDebounced,
  } = useMessageCount(campaignData);

  const handleLineNumberChange = (value: string) => {
    updateBudget({ lineNumber: value });
    if (budgetDebounceRef.current) {
      clearTimeout(budgetDebounceRef.current);
    }
    if (value && campaignData.budget.totalBudget > 0) {
      calculateDebounced(value, campaignData.budget.totalBudget);
    }
  };

  const handleTotalBudgetChange = (value: number) => {
    const numeric = Number.isFinite(value) ? value : 0;
    const clamped = Math.max(MIN_TEXT_BUDGET, Math.min(MAX_BUDGET, numeric));
    updateBudget({ totalBudget: clamped });
    if (clamped > 0 && campaignData.budget.lineNumber) {
      calculateDebounced(campaignData.budget.lineNumber, clamped);
    }
    if (budgetDebounceRef.current) {
      clearTimeout(budgetDebounceRef.current);
    }
  };

  const handlePercentBudgetChange = useCallback(
    (percent: number, amount: number) => {
      // Round to nearest 1000 and cap at MAX_BUDGET; percent already limited to balance
      const rounded = Math.max(0, Math.floor(amount / 1000) * 1000);
      const clamped = Math.min(MAX_BUDGET, rounded);
      updateBudget({ totalBudget: clamped });
      if (clamped > 0 && campaignData.budget.lineNumber) {
        calculateDebounced(campaignData.budget.lineNumber, clamped);
      }
    },
    [
      MAX_BUDGET,
      campaignData.budget.lineNumber,
      calculateDebounced,
      updateBudget,
    ]
  );

  return (
    <div className='space-y-8'>
      <StepHeader
        title={t.title}
        subtitle={''}
        icon={<DollarSign className='h-6 w-6 text-primary-600' />}
      />

      <div className='space-y-6'>
        {/* Line Number Selection */}
        <LineNumberCard
          value={campaignData.budget.lineNumber || ''}
          options={lineNumberOptions}
          isLoading={isLoadingLineNumbers}
          error={lineNumbersError}
          onChange={handleLineNumberChange}
          title={t.lineNumber}
          label={t.selectLineNumber}
          placeholder={t.lineNumberPlaceholder}
          helpText={''}
          priceFactorLabel={t.linePriceFactor}
        />

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
            title={''}
            label={t.campaignBudget}
            placeholder={t.budgetPlaceholder}
            helpText={t.budgetHelp}
            validationMessage={t.budgetValidation}
            currencyLabel={currencyLabel}
            budgetLabel={t.budget}
          />

          {/* Message Count Calculation */}
          <MessageCountCard
            messageCount={messageCount}
            maxMessageCount={maxMessageCount}
            isLoading={isLoadingMessageCount}
            error={messageCountError}
            lineNumber={campaignData.budget.lineNumber}
            totalBudget={campaignData.budget.totalBudget}
            title={t.estimatedMessages}
            calculatingLabel={t.calculatingMessageCount}
            messagesLabel={t.messages}
            calculatingText={t.calculating}
            enterBudgetText={t.enterBudgetToSee}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetStep;
