import { useState, useCallback, useRef, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { CampaignData } from '../../../types/campaign';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import { useLanguage } from '../../../hooks/useLanguage';
import { paymentI18n } from './paymentTranslations';

export const useCostCalculation = (
  campaignData: CampaignData,
  onUpdatePayment: (data: any) => void
) => {
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [messageCount, setMessageCount] = useState<number | undefined>(
    undefined
  );
  const [lastCalculation, setLastCalculation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();
  const { language } = useLanguage();
  const t = paymentI18n[language as keyof typeof paymentI18n] || paymentI18n.en;
  const { showToast } = useToast();

  // Guards to avoid duplicate API calls
  const requestInFlightRef = useRef(false);
  const triggeredKeyRef = useRef<string | null>(null);

  // Keep API client synced with latest token
  useEffect(() => {
    apiService.setAccessToken(accessToken || null);
  }, [accessToken]);

  const calculateCosts = useCallback(async () => {
    const platform = campaignData.segment.platform || 'sms';
    const title = campaignData.segment.campaignTitle;
    const level1 = campaignData.segment.level1;
    const level2s = campaignData.segment.level2s || [];
    const level3s = campaignData.segment.level3s || [];
    const target_audience_excel_file_uuid =
      campaignData.segment.targetAudienceExcelFileUuid || null;
    const tags = campaignData.segment.tags || [];
    const adlink = campaignData.content.link;
    const content = campaignData.content.text;
    const scheduleat = campaignData.content.scheduleAt;
    const line_number = campaignData.content.lineNumber;
    const platform_settings_id = campaignData.content.platformSettingsId;
    const budget = campaignData.budget.totalBudget;
    const campaignId = campaignData.id;

    if (!title || !level1 || !content || !budget) {
      return;
    }
    if (!campaignId || campaignId <= 0) {
      const errorMessage = t.campaignIdRequiredForCostCalculation;
      setError(errorMessage);
      showToast('error', errorMessage);
      return;
    }

    if (platform === 'sms' && !line_number) {
      return;
    }

    if (platform !== 'sms' && !platform_settings_id) {
      return;
    }

    // Build selection key to avoid duplicates
    const selectionKey = [
      platform,
      title,
      level1,
      [...level2s].sort().join(','),
      [...level3s].sort().join(','),
      target_audience_excel_file_uuid || '',
      [...tags].sort().join(','),
      adlink || '',
      content,
      scheduleat || '',
      line_number || '',
      platform_settings_id ? String(platform_settings_id) : '',
      String(budget),
    ].join('|');

    if (
      requestInFlightRef.current ||
      triggeredKeyRef.current === selectionKey
    ) {
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
        setTotal(response.data.total_cost);
        setMessageCount(response.data.msg_target);
        setLastCalculation(Date.now());
        onUpdatePayment({
          total: response.data.total_cost,
          finalCost: response.data.total_cost,
        });
        triggeredKeyRef.current = selectionKey;
      } else {
        setError(response.message || 'Failed to calculate costs.');
      }
    } catch (error) {
      setError('Failed to calculate costs due to an unexpected error.');
    } finally {
      setIsLoading(false);
      requestInFlightRef.current = false;
    }
  }, [campaignData, onUpdatePayment, showToast, t]);

  return {
    total,
    messageCount,
    lastCalculation,
    isLoading,
    error,
    calculateCosts,
  };
};
