import { useState, useCallback, useRef } from 'react';
import { apiService } from '../../../services/api';
import { CampaignData } from '../../../types/campaign';

export const useCostCalculation = (campaignData: CampaignData, onUpdatePayment: (data: any) => void) => {
    const [total, setTotal] = useState<number | undefined>(undefined);
    const [messageCount, setMessageCount] = useState<number | undefined>(undefined);
    const [lastCalculation, setLastCalculation] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Guards to avoid duplicate API calls
    const requestInFlightRef = useRef(false);
    const triggeredKeyRef = useRef<string | null>(null);

    const calculateCosts = useCallback(async () => {
        const title = campaignData.level.campaignTitle;
        const level1 = campaignData.level.level1;
        const level2s = campaignData.level.level2s || [];
        const level3s = campaignData.level.level3s || [];
        const tags = campaignData.level.tags || [];
        const adlink = campaignData.content.link;
        const content = campaignData.content.text;
        const scheduleat = campaignData.content.scheduleAt;
        const line_number = campaignData.budget.lineNumber;
        const budget = campaignData.budget.totalBudget;

        if (!title || !level1 || !content || !budget || !line_number) {
            return;
        }

        // Build selection key to avoid duplicates
        const selectionKey = [
            title,
            level1,
            [...level2s].sort().join(','),
            [...level3s].sort().join(','),
            [...tags].sort().join(','),
            adlink || '',
            content,
            scheduleat || '',
            line_number,
            String(budget),
        ].join('|');

        if (requestInFlightRef.current || triggeredKeyRef.current === selectionKey) {
            return;
        }
        requestInFlightRef.current = true;

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiService.calculateCampaignCost({
                title,
                level1,
                level2s,
                level3s,
                tags,
                adlink,
                content,
                scheduleat,
                line_number,
                budget,
            });

            if (response.success && response.data) {
                setTotal(response.data.total_cost);
                setMessageCount(response.data.msg_target);
                setLastCalculation(Date.now());
                onUpdatePayment({ total: response.data.total_cost, finalCost: response.data.total_cost });
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
    }, [campaignData, onUpdatePayment]);

    return {
        total,
        messageCount,
        lastCalculation,
        isLoading,
        error,
        calculateCosts,
    };
}; 