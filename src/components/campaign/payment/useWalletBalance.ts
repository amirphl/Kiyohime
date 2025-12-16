import { useState, useCallback, useEffect } from 'react';
import { apiService } from '../../../services/api';

export const useWalletBalance = (totalBudget: number, totalCost: number | undefined, onUpdatePayment: (data: any) => void) => {
    const [walletBalance, setWalletBalance] = useState<number | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasEnoughBalance, setHasEnoughBalance] = useState<boolean | undefined>(undefined);
    const [balanceChecked, setBalanceChecked] = useState(false);

    const getWalletBalance = useCallback(async () => {
        if (balanceChecked) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiService.getWalletBalance();

            if (response.success && response.data) {
                const free = Number(response.data.free || 0);
                const credit = Number((response.data as any).credit || 0);
                const balance = free + credit;
                setWalletBalance(balance);
                if (totalBudget > 0) {
                    const hasEnough = balance >= totalBudget;
                    setHasEnoughBalance(hasEnough);
                    onUpdatePayment({ hasEnoughBalance: hasEnough });
                }
                setBalanceChecked(true);
            } else {
                const errorMessage = response.message || 'Failed to get wallet balance';
                setError(errorMessage);
                setWalletBalance(undefined);
                setHasEnoughBalance(undefined);
                onUpdatePayment({ hasEnoughBalance: false });
                setBalanceChecked(true);
            }
        } catch (error) {
            const errorMessage = 'Network error while getting wallet balance';
            setError(errorMessage);
            setWalletBalance(undefined);
            setHasEnoughBalance(undefined);
            onUpdatePayment({ hasEnoughBalance: false });
            setBalanceChecked(true);
        } finally {
            setIsLoading(false);
        }
    }, [balanceChecked, totalBudget, onUpdatePayment]);

    // Recompute sufficiency when total cost or wallet balance changes
    useEffect(() => {
        if (walletBalance !== undefined && totalCost !== undefined) {
            const hasEnough = walletBalance >= totalCost;
            setHasEnoughBalance(hasEnough);
            onUpdatePayment({ hasEnoughBalance: hasEnough });
        }
    }, [walletBalance, totalCost, onUpdatePayment]);

    return {
        walletBalance,
        isLoading,
        error,
        hasEnoughBalance,
        balanceChecked,
        getWalletBalance,
    };
}; 