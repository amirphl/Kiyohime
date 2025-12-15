import React, { useRef } from 'react';
import { DollarSign } from 'lucide-react';
import { useCampaign } from '../../../hooks/useCampaign';
import { useLanguage } from '../../../hooks/useLanguage';
import { useAuth } from '../../../hooks/useAuth';
import StepHeader from '../../ui/StepHeader';
import LineNumberCard from './LineNumberCard';
import BudgetInputCard from './BudgetInputCard';
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

    // Debouncing ref for budget field
    const budgetDebounceRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch line numbers
    const {
        lineNumberOptions,
        isLoading: isLoadingLineNumbers,
        error: lineNumbersError
    } = useLineNumbers(accessToken);

    // Calculate message count
    const {
        messageCount,
        maxMessageCount,
        isLoading: isLoadingMessageCount,
        error: messageCountError,
        lastApiCall,
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
        updateBudget({ totalBudget: value });
        if (budgetDebounceRef.current) {
            clearTimeout(budgetDebounceRef.current);
        }
        if (value > 0 && campaignData.budget.lineNumber) {
            calculateDebounced(campaignData.budget.lineNumber, value);
        }
    };

    return (
        <div className="space-y-8">
            <StepHeader
                title={t.title}
                subtitle={t.subtitle}
                icon={<DollarSign className="h-6 w-6 text-primary-600" />}
            />

            <div className="space-y-6">
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
                    helpText={t.lineNumberHelp}
                />

                {/* Total Budget and Message Count side-by-side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Budget */}
                    <BudgetInputCard
                        value={campaignData.budget.totalBudget}
                        onChange={handleTotalBudgetChange}
                        title={t.totalBudget}
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
                        lastApiCall={lastApiCall}
                        lineNumber={campaignData.budget.lineNumber}
                        totalBudget={campaignData.budget.totalBudget}
                        title={t.estimatedMessages}
                        calculatingLabel={t.calculatingMessageCount}
                        messagesLabel={t.messages}
                        messageCountHelpText={t.messageCountHelp}
                        calculatingText={t.calculating}
                        enterBudgetText={t.enterBudgetToSee}
                        lastUpdatedLabel={t.lastUpdated}
                    />
                </div>
            </div>
        </div>
    );
};

export default BudgetStep; 