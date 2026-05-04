import { useCallback, useEffect, useRef, useState } from 'react';
import apiService from '../../../services/api';
import { normalizeCustomerId } from '../utils';

export interface AgencyDiscountItem {
  customer_id: number;
  representative_first_name: string;
  representative_last_name: string;
  company_name?: string | null;
  discount_rate: number;
  created_at: string;
}

export const useAgencyDiscounts = (
  accessToken: string | null,
  onError?: (msg: string) => void
) => {
  const onErrorRef = useRef(onError);
  const [discounts, setDiscounts] = useState<AgencyDiscountItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const fetchDiscounts = useCallback(async () => {
    if (!accessToken) {
      setDiscounts([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      apiService.setAccessToken(accessToken);
      const res = await apiService.listAgencyActiveDiscounts();
      if (res.success && res.data) {
        const normalized = (res.data.items || [])
          .map(item => {
            const rawItem = item as AgencyDiscountItem & {
              customerId?: unknown;
              id?: unknown;
            };
            const customerId = normalizeCustomerId(rawItem.customer_id);
            if (!customerId) return null;
            return {
              ...item,
              customer_id: customerId,
            };
          })
          .filter((item): item is AgencyDiscountItem => item !== null);
        setDiscounts(normalized);
      } else {
        const msg = res.message || 'Failed to load discounts';
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
  }, [accessToken]);

  return { discounts, loading, error, fetchDiscounts };
};

export type UseAgencyDiscountsReturn = ReturnType<typeof useAgencyDiscounts>;
