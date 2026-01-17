import { useCallback, useEffect, useRef, useState } from 'react';
import apiService from '../../../services/api';

export interface DiscountHistoryItem {
  discount_rate: number;
  created_at: string;
  expires_at?: string | null;
  total_sent: number;
  agency_share_with_tax: number;
}

export const useDiscountHistory = (accessToken: string | null, onError?: (msg: string) => void) => {
  const onErrorRef = useRef(onError);
  const [items, setItems] = useState<DiscountHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const fetchHistory = useCallback(
    async (customerId: number) => {
      setLoading(true);
      setError(null);
      try {
        if (accessToken) apiService.setAccessToken(accessToken);
        const res = await apiService.listAgencyCustomerDiscounts(customerId);
        if (res.success && res.data) {
          setItems(res.data.items || []);
        } else {
          const msg = res.message || 'Failed to load history';
          setError(msg);
          onErrorRef.current?.(msg);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Network error';
        setError(msg);
        onErrorRef.current?.(msg);
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  const reset = () => {
    setItems([]);
    setError(null);
  };

  return { items, loading, error, fetchHistory, reset };
};

export type UseDiscountHistoryReturn = ReturnType<typeof useDiscountHistory>;
