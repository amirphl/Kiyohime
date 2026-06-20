import { useState, useCallback, useRef, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { useToast } from '../../../hooks/useToast';
import { CampaignData } from '../../../types/campaign';
import { useAuth } from '../../../hooks/useAuth';
import { useLanguage } from '../../../hooks/useLanguage';
import { budgetI18n } from './budgetTranslations';

export const useMessageCount = (campaignData: CampaignData) => {
  const [messageCount, setMessageCount] = useState<number | undefined>(
    undefined
  );
  const [maxMessageCount, setMaxMessageCount] = useState<number | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isQueued, setIsQueued] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [lastApiCall, setLastApiCall] = useState<number>(0);
  const { accessToken } = useAuth();
  const { language } = useLanguage();
  const t = budgetI18n[language as keyof typeof budgetI18n] || budgetI18n.en;
  const { showToast } = useToast();
  const requestInFlightRef = useRef(false);
  const initialCalculatedRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const resetMessageCount = useCallback(() => {
    setMessageCount(undefined);
    setMaxMessageCount(undefined);
    setError(null);
    setHasError(false);
    setLastApiCall(0);
    setIsQueued(false);
  }, []);

  useEffect(() => {
    apiService.setAccessToken(accessToken || null);
  }, [accessToken]);

  const resolveCampaignId = useCallback(() => {
    if (typeof campaignData.id === 'number' && campaignData.id > 0) {
      return campaignData.id;
    }
    return null;
  }, [campaignData.id]);

  // API call for message count calculation
  const calculateMessageCount = useCallback(
    async (currentLineNumber?: string, currentBudget?: number) => {
      void currentLineNumber;
      setIsQueued(false);

      if (hasError) return;

      const budget = currentBudget || campaignData.budget.totalBudget;

      if (budget <= 0) return;
      if (requestInFlightRef.current) return;

      const campaignId = resolveCampaignId();
      if (!campaignId || campaignId <= 0) {
        const errorMessage = t.campaignIdRequiredForCostCalculation;
        setError(errorMessage);
        setHasError(true);
        showToast('error', errorMessage);
        return;
      }

      requestInFlightRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiService.calculateCampaignCost({
          campaign_id: campaignId,
          budget,
        });

        if (response.success && response.data) {
          setMessageCount(response.data.msg_target);
          setMaxMessageCount(response.data.max_msg_target);
          setError(null);
          setHasError(false);
          setLastApiCall(Date.now());
        } else {
          const errorMessage =
            response.message || 'Failed to calculate message count';
          setError(errorMessage);
          setMessageCount(undefined);
          setHasError(true);
          showToast('error', errorMessage);
        }
      } catch (error) {
        console.error('Error calculating message count:', error);
        const errorMessage = 'Network error while calculating message count';
        setError(errorMessage);
        setMessageCount(undefined);
        setHasError(true);
        showToast('error', errorMessage);
      } finally {
        setIsLoading(false);
        requestInFlightRef.current = false;
      }
    },
    [campaignData, hasError, resolveCampaignId, showToast, t]
  );

  // Debounced calculation
  const calculateDebounced = useCallback(
    (lineNumber?: string, budget?: number) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      setIsQueued(true);
      debounceRef.current = setTimeout(() => {
        calculateMessageCount(lineNumber, budget);
      }, 1000);
    },
    [calculateMessageCount]
  );

  // One-time initial calculate if both fields are pre-filled
  useEffect(() => {
    if (initialCalculatedRef.current) return;
    const platform = campaignData.segment.platform || 'sms';
    const hasIdentifier =
      platform === 'sms'
        ? !!campaignData.content.lineNumber
        : !!campaignData.content.platformSettingsId;
    if (hasIdentifier && campaignData.budget.totalBudget > 0) {
      initialCalculatedRef.current = true;
      calculateMessageCount(
        campaignData.content.lineNumber,
        campaignData.budget.totalBudget
      );
    }
  }, [
    campaignData.segment.platform,
    campaignData.content.lineNumber,
    campaignData.content.platformSettingsId,
    campaignData.budget.totalBudget,
    calculateMessageCount,
  ]);

  // Reset error flag when user makes changes
  useEffect(() => {
    if (hasError) {
      setHasError(false);
      setError(null);
    }
    setIsQueued(false);
  }, [
    hasError,
    campaignData.content.lineNumber,
    campaignData.content.platformSettingsId,
    campaignData.budget.totalBudget,
  ]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    messageCount,
    maxMessageCount,
    isLoading,
    isQueued,
    error,
    lastApiCall,
    calculateMessageCount,
    calculateDebounced,
    resetMessageCount,
  };
};
