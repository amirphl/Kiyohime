import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DollarSign, Phone, MessageSquare } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCampaign } from '../../hooks/useCampaign';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import StepHeader from '../ui/StepHeader';
import Card from '../ui/Card';
import FormField from '../ui/FormField';

const CampaignBudgetStep: React.FC = () => {
  const { t } = useTranslation();
  const { campaignData, updateBudget } = useCampaign();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const currencyLabel = language === 'en' ? 'Toman' : 'تومان';
  
  // State for message count calculation
  const [messageCount, setMessageCount] = useState<number | undefined>(undefined);
  const [maxMessageCount, setMaxMessageCount] = useState<number | undefined>(undefined);
  const [isLoadingMessageCount, setIsLoadingMessageCount] = useState(false);
  const [messageCountError, setMessageCountError] = useState<string | null>(null);
  const [hasMessageCountError, setHasMessageCountError] = useState(false);
  const [lastApiCall, setLastApiCall] = useState<number>(0);
  
  // Debouncing for budget field
  const budgetDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Test data for line numbers
  const lineNumbers = [
    { value: 'line_1', label: t('campaign.budget.line1') },
    { value: 'line_2', label: t('campaign.budget.line2') },
    { value: 'line_3', label: t('campaign.budget.line3') },
    { value: 'line_4', label: t('campaign.budget.line4') },
    { value: 'line_5', label: t('campaign.budget.line5') },
  ];

  // API call for message count calculation
  const calculateMessageCount = useCallback(async (currentLineNumber?: string, currentBudget?: number) => {
    // Don't send request if we have a message count error
    if (hasMessageCountError) {
      return;
    }

    // Use passed values or fall back to current state
    const lineNumber = currentLineNumber || campaignData.budget.lineNumber;
    const budget = currentBudget || campaignData.budget.totalBudget;

    if (!lineNumber || budget <= 0) {
      return;
    }

    setIsLoadingMessageCount(true);
    setMessageCountError(null);

    try {
      const response = await apiService.calculateCampaignCost({
        title: campaignData.segment.campaignTitle,
        segment: campaignData.segment.segment,
        subsegment: campaignData.segment.subsegments,
        sex: campaignData.segment.sex,
        city: campaignData.segment.city,
        adlink: campaignData.content.link,
        content: campaignData.content.text,
        scheduleat: campaignData.content.scheduleAt,
        line_number: lineNumber,
        budget: budget,
      });

      if (response.success && response.data) {
        setMessageCount(response.data.msg_target);
        setMaxMessageCount(response.data.max_msg_target);
        setMessageCountError(null);
        setHasMessageCountError(false); // Clear error flag on success
        setLastApiCall(Date.now());
        console.log('✅ Message count calculated:', response.data.msg_target);
      } else {
        const errorMessage = response.message || 'Failed to calculate message count';
        setMessageCountError(errorMessage);
        setMessageCount(undefined);
        setHasMessageCountError(true); // Set error flag to prevent further requests
        showToast('error', errorMessage);
      }
    } catch (error) {
      console.error('Error calculating message count:', error);
      const errorMessage = 'Network error while calculating message count';
      setMessageCountError(errorMessage);
      setMessageCount(undefined);
      setHasMessageCountError(true); // Set error flag to prevent further requests
      showToast('error', errorMessage);
    } finally {
      setIsLoadingMessageCount(false);
    }
  }, [hasMessageCountError, campaignData.segment.campaignTitle, campaignData.segment.segment, campaignData.segment.subsegments, campaignData.segment.sex, campaignData.segment.city, campaignData.content.link, campaignData.content.text, campaignData.content.scheduleAt, showToast]);
  
  // Reset error flag when user makes changes to budget fields
  useEffect(() => {
    if (hasMessageCountError) {
      setHasMessageCountError(false);
      setMessageCountError(null);
    }
  }, [hasMessageCountError, campaignData.budget.lineNumber, campaignData.budget.totalBudget]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (budgetDebounceRef.current) {
        clearTimeout(budgetDebounceRef.current);
      }
    };
  }, []);

  const handleLineNumberChange = (value: string) => {
    console.log('🔧 Line number changed to:', value, 'Current budget:', campaignData.budget.totalBudget);
    updateBudget({ lineNumber: value });
    
    // Only calculate if we have both line number and budget
    // Pass the new value directly to ensure we use the latest
    if (value && campaignData.budget.totalBudget > 0) {
      console.log('✅ Line number change: Both fields have values, scheduling API call');
      setTimeout(() => {
        calculateMessageCount(value, campaignData.budget.totalBudget);
      }, 1000);
    } else {
      console.log('⚠️ Line number change: Missing budget value, skipping API call');
    }
  };

  const handleTotalBudgetChange = (value: number) => {
    console.log('💰 Budget changed to:', value, 'Current line number:', campaignData.budget.lineNumber);
    updateBudget({ totalBudget: value });
    
    // Clear any existing timeout
    if (budgetDebounceRef.current) {
      clearTimeout(budgetDebounceRef.current);
    }
    
    // Only calculate if we have both line number and budget
    // Pass the new value directly to ensure we use the latest
    if (value > 0 && campaignData.budget.lineNumber) {
      console.log('✅ Budget change: Both fields have values, scheduling API call');
      budgetDebounceRef.current = setTimeout(() => {
        calculateMessageCount(campaignData.budget.lineNumber, value);
      }, 1000);
    } else {
      console.log('⚠️ Budget change: Missing line number value, skipping API call');
    }
  };

  // Format budget with Toman currency
  const formatBudget = (budget: number) => {
    return `${budget.toLocaleString()} ${currencyLabel}`;
  };

  return (
    <div className="space-y-8">
      <StepHeader
        title={t('campaign.budget.title')}
        subtitle={t('campaign.budget.subtitle')}
        icon={<DollarSign className="h-6 w-6 text-primary-600" />}
      />

      <div className="space-y-6">
        {/* Line Number Selection */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-primary-600" />
              {t('campaign.budget.lineNumber')}
            </h3>
            
            <FormField
              id="lineNumber"
              label={t('campaign.budget.selectLineNumber')}
              type="select"
              options={lineNumbers}
              value={campaignData.budget.lineNumber || ''}
              onChange={handleLineNumberChange}
              required
              placeholder={t('campaign.budget.lineNumberPlaceholder')}
            />
            
            <div className="text-sm text-gray-500">
              {t('campaign.budget.lineNumberHelp')}
            </div>
          </div>
        </Card>

        {/* Total Budget and Estimated Messages side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Budget */}
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary-600" />
                {t('campaign.budget.totalBudget')}
              </h3>
              <FormField
                id="totalBudget"
                label={t('campaign.budget.campaignBudget')}
                type="number"
                placeholder={t('campaign.budget.budgetPlaceholder')}
                value={campaignData.budget.totalBudget || ''}
                onChange={handleTotalBudgetChange}
                validation={{ min: 1, max: 100000000000, step: 1000, message: t('campaign.budget.budgetValidation') }}
                required
              />
              {campaignData.budget.totalBudget > 0 && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <span className="font-medium">{t('campaign.budget.budget')}:</span> {formatBudget(campaignData.budget.totalBudget)}
                </div>
              )}
              <div className="text-sm text-gray-500">{t('campaign.budget.budgetHelp')}</div>
            </div>
          </Card>

          {/* Message Count Calculation */}
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary-600" />
                {t('campaign.budget.estimatedMessages')}
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                {isLoadingMessageCount ? (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    <span>{t('campaign.budget.calculatingMessageCount')}</span>
                  </div>
                ) : messageCount !== undefined ? (
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary-600">
                      {messageCount.toLocaleString()}{typeof maxMessageCount === 'number' ? ` / ${maxMessageCount.toLocaleString()}` : ''} {t('campaign.budget.messages')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t('campaign.budget.messageCountHelp')}
                    </div>
                    {lastApiCall > 0 && (
                      <div className="text-xs text-gray-500">
                        {t('campaign.budget.lastUpdated', { time: new Date(lastApiCall).toLocaleTimeString() })}
                      </div>
                    )}
                  </div>
                ) : messageCountError ? (
                  <div className="text-red-600 text-center">{messageCountError}</div>
                ) : (
                  <div className="text-gray-500 text-center">
                    {campaignData.budget.lineNumber && campaignData.budget.totalBudget > 0 ? t('campaign.budget.calculating') : t('campaign.budget.enterBudgetToSee')}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500">{t('campaign.budget.messageCountHelp')}</div>
            </div>
          </Card>
        </div>

        {/* Budget Summary */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary-600" />
              {t('campaign.budget.budgetSummary')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">{t('campaign.budget.selectedLine')}</div>
                <div className="text-lg font-semibold text-gray-900">
                  {campaignData.budget.lineNumber ? 
                    lineNumbers.find(l => l.value === campaignData.budget.lineNumber)?.label || 'Unknown' :
                    t('campaign.budget.notSelected')
                  }
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">{t('campaign.budget.totalBudgetLabel')}</div>
                <div className="text-lg font-semibold text-gray-900">
                  {campaignData.budget.totalBudget > 0 ? 
                    formatBudget(campaignData.budget.totalBudget) : 
                    t('campaign.budget.notSet')
                  }
                </div>
              </div>
            </div>
            
            {messageCount !== undefined && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-800">
                  <span className="font-medium">{t('campaign.budget.estimatedReach')}</span> {t('campaign.budget.estimatedReachMessage', { count: messageCount.toLocaleString() })}
                </div>
              </div>
            )}
            
            <div className="text-sm text-gray-500 text-center">
              {t('campaign.budget.budgetSummaryHelp')}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CampaignBudgetStep; 