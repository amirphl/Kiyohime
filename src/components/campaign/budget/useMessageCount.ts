import { useState, useCallback, useRef, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { useToast } from '../../../hooks/useToast';
import { CampaignData } from '../../../types/campaign';
import { useAuth } from '../../../hooks/useAuth';

export const useMessageCount = (campaignData: CampaignData) => {
    const [messageCount, setMessageCount] = useState<number | undefined>(undefined);
    const [maxMessageCount, setMaxMessageCount] = useState<number | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);
    const [lastApiCall, setLastApiCall] = useState<number>(0);
    const { accessToken } = useAuth();

    const { showToast } = useToast();
    const requestInFlightRef = useRef(false);
    const initialCalculatedRef = useRef(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        apiService.setAccessToken(accessToken || null);
    }, [accessToken]);

    // API call for message count calculation
    const calculateMessageCount = useCallback(async (currentLineNumber?: string, currentBudget?: number) => {
        if (hasError) return;

        const lineNumber = currentLineNumber || campaignData.content.lineNumber;
        const budget = currentBudget || campaignData.budget.totalBudget;

        if (!lineNumber || budget <= 0) return;
        if (requestInFlightRef.current) return;

        requestInFlightRef.current = true;
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiService.calculateCampaignCost({
                title: campaignData.level.campaignTitle,
                level1: campaignData.level.level1,
                level2s: campaignData.level.level2s,
                level3s: campaignData.level.level3s,
                tags: campaignData.level.tags,
                adlink: campaignData.content.link,
                content: campaignData.content.text,
                scheduleat: campaignData.content.scheduleAt,
                line_number: lineNumber,
                budget: budget,
                short_link_domain: campaignData.content.shortLinkDomain || 'jo1n.ir',
                job_category: campaignData.level.jobCategory || undefined,
                job: campaignData.level.job || undefined,
            });

            if (response.success && response.data) {
                setMessageCount(response.data.msg_target);
                setMaxMessageCount(response.data.max_msg_target);
                setError(null);
                setHasError(false);
                setLastApiCall(Date.now());
            } else {
                const errorMessage = response.message || 'Failed to calculate message count';
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
    }, [
        hasError,
        campaignData.level.campaignTitle,
        campaignData.level.level1,
        campaignData.level.level2s,
        campaignData.level.level3s,
        campaignData.content.link,
        campaignData.content.text,
        campaignData.content.scheduleAt,
        campaignData.content.lineNumber,
        campaignData.budget.totalBudget,
        campaignData.level.tags,
        campaignData.level.jobCategory,
        campaignData.level.job,
        showToast
    ]);

    // Debounced calculation
    const calculateDebounced = useCallback((lineNumber?: string, budget?: number) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            calculateMessageCount(lineNumber, budget);
        }, 1000);
    }, [calculateMessageCount]);

    // One-time initial calculate if both fields are pre-filled
    useEffect(() => {
        if (initialCalculatedRef.current) return;
        if (campaignData.content.lineNumber && campaignData.budget.totalBudget > 0) {
            initialCalculatedRef.current = true;
            calculateMessageCount(campaignData.content.lineNumber, campaignData.budget.totalBudget);
        }
    }, [campaignData.content.lineNumber, campaignData.budget.totalBudget, calculateMessageCount]);

    // Reset error flag when user makes changes
    useEffect(() => {
        if (hasError) {
            setHasError(false);
            setError(null);
        }
    }, [hasError, campaignData.content.lineNumber, campaignData.budget.totalBudget]);

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
        error,
        lastApiCall,
        calculateMessageCount,
        calculateDebounced,
    };
}; 
