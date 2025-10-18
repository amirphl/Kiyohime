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
import { useAuth } from '../../hooks/useAuth';

// Module-level cache and in-flight promise to avoid duplicate fetches
let activeLineNumbersCache: Array<{ value: string; label: string }> | null = null;
let activeLineNumbersFetchInFlight: Promise<Array<{ value: string; label: string }>> | null = null;

const CampaignBudgetStep: React.FC = () => {
  const { t } = useTranslation();
  const { campaignData, updateBudget } = useCampaign();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const { accessToken } = useAuth();
  const currencyLabel = language === 'en' ? 'Toman' : 'تومان';
  
  // State for message count calculation
  const [messageCount, setMessageCount] = useState<number | undefined>(undefined);
  const [maxMessageCount, setMaxMessageCount] = useState<number | undefined>(undefined);
  const [isLoadingMessageCount, setIsLoadingMessageCount] = useState(false);
  const [messageCountError, setMessageCountError] = useState<string | null>(null);
  const [hasMessageCountError, setHasMessageCountError] = useState(false);
  const [lastApiCall, setLastApiCall] = useState<number>(0);

  // Line numbers state
  const [lineNumberOptions, setLineNumberOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoadingLineNumbers, setIsLoadingLineNumbers] = useState(false);
  const [lineNumbersError, setLineNumbersError] = useState<string | null>(null);
  
  // Debouncing for budget field
  const budgetDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const initialCostCalculatedRef = useRef(false);
  const messageCountRequestInFlightRef = useRef(false);

  // Fetch active line numbers once with token
  useEffect(() => {
    if (!accessToken) return;
    if (activeLineNumbersCache) {
      setLineNumberOptions(activeLineNumbersCache);
      return;
    }
    if (activeLineNumbersFetchInFlight) {
      setIsLoadingLineNumbers(true);
      setLineNumbersError(null);
      activeLineNumbersFetchInFlight
        .then(opts => {
          setLineNumberOptions(opts);
          setIsLoadingLineNumbers(false);
        })
        .catch(err => {
          setLineNumbersError('Failed to load line numbers');
          setIsLoadingLineNumbers(false);
          showToast('error', 'Failed to load line numbers');
        });
      return;
    }

    setIsLoadingLineNumbers(true);
    setLineNumbersError(null);
    activeLineNumbersFetchInFlight = (async () => {
      const res = await apiService.listActiveLineNumbers();
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to load line numbers');
      }
      const items = (res.data.items || []) as Array<{ line_number: string }>;
      const opts = items.map(it => ({ value: it.line_number, label: it.line_number }));
      return opts;
    })();

    activeLineNumbersFetchInFlight
      .then(opts => {
        activeLineNumbersCache = opts;
        setLineNumberOptions(opts);
      })
      .catch(err => {
        setLineNumbersError('Failed to load line numbers');
        showToast('error', 'Failed to load line numbers');
      })
      .finally(() => {
        setIsLoadingLineNumbers(false);
        activeLineNumbersFetchInFlight = null;
      });
  }, [accessToken, showToast]);

  // API call for message count calculation
  const calculateMessageCount = useCallback(async (currentLineNumber?: string, currentBudget?: number) => {
    if (hasMessageCountError) {
      return;
    }

    const lineNumber = currentLineNumber || campaignData.budget.lineNumber;
    const budget = currentBudget || campaignData.budget.totalBudget;

    if (!lineNumber || budget <= 0) {
      return;
    }

    if (messageCountRequestInFlightRef.current) {
      return;
    }
    messageCountRequestInFlightRef.current = true;
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
        tags: campaignData.segment.tags,
      });

      if (response.success && response.data) {
        setMessageCount(response.data.msg_target);
        setMaxMessageCount(response.data.max_msg_target);
        setMessageCountError(null);
        setHasMessageCountError(false);
        setLastApiCall(Date.now());
      } else {
        const errorMessage = response.message || 'Failed to calculate message count';
        setMessageCountError(errorMessage);
        setMessageCount(undefined);
        setHasMessageCountError(true);
        showToast('error', errorMessage);
      }
    } catch (error) {
      console.error('Error calculating message count:', error);
      const errorMessage = 'Network error while calculating message count';
      setMessageCountError(errorMessage);
      setMessageCount(undefined);
      setHasMessageCountError(true);
      showToast('error', errorMessage);
    } finally {
      setIsLoadingMessageCount(false);
      messageCountRequestInFlightRef.current = false;
    }
  }, [hasMessageCountError, campaignData.segment.campaignTitle, campaignData.segment.segment, campaignData.segment.subsegments, campaignData.segment.sex, campaignData.segment.city, campaignData.content.link, campaignData.content.text, campaignData.content.scheduleAt, showToast, campaignData.budget.lineNumber, campaignData.budget.totalBudget]);
  
  // One-time initial calculate if both line number and budget are pre-filled
  useEffect(() => {
    if (initialCostCalculatedRef.current) return;
    if (campaignData.budget.lineNumber && campaignData.budget.totalBudget > 0) {
      initialCostCalculatedRef.current = true;
      calculateMessageCount(campaignData.budget.lineNumber, campaignData.budget.totalBudget);
    }
  }, [campaignData.budget.lineNumber, campaignData.budget.totalBudget, calculateMessageCount]);
  
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
    updateBudget({ lineNumber: value });
    if (budgetDebounceRef.current) {
      clearTimeout(budgetDebounceRef.current);
    }
    if (value && campaignData.budget.totalBudget > 0) {
      budgetDebounceRef.current = setTimeout(() => {
        calculateMessageCount(value, campaignData.budget.totalBudget);
      }, 1000);
    }
  };

  const handleTotalBudgetChange = (value: number) => {
    updateBudget({ totalBudget: value });
    if (budgetDebounceRef.current) {
      clearTimeout(budgetDebounceRef.current);
    }
    if (value > 0 && campaignData.budget.lineNumber) {
      budgetDebounceRef.current = setTimeout(() => {
        calculateMessageCount(campaignData.budget.lineNumber, value);
      }, 1000);
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
        icon={<DollarSign className="h-6 w-6 text-red-600" />}
      />

      <div className="space-y-6">
        {/* Line Number Selection */}
        <Card>
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-red-600" />
              {t('campaign.budget.lineNumber')}
            </h3>
            
            {lineNumbersError ? (
              <div className="text-red-600 text-sm">{lineNumbersError}</div>
            ) : (
            <FormField
              id="lineNumber"
                label={isLoadingLineNumbers ? t('common.loading') : t('campaign.budget.selectLineNumber')}
              type="select"
                options={lineNumberOptions}
              value={campaignData.budget.lineNumber || ''}
              onChange={handleLineNumberChange}
              required
              placeholder={t('campaign.budget.lineNumberPlaceholder')}
            />
            )}
            
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
                <DollarSign className="h-5 w-5 mr-2 text-red-600" />
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
                <MessageSquare className="h-5 w-5 mr-2 text-red-600" />
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
                    <div className="text-2xl font-bold text-red-600">
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
      </div>
    </div>
  );
};

export default CampaignBudgetStep; 