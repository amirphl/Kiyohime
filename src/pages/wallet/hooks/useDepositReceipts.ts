import { useCallback, useEffect, useRef, useState } from 'react';
import apiService from '../../../services/api';
import {
  ListDepositReceiptsResponse,
  DepositReceiptItem,
} from '../../../types/payments';

export const useDepositReceipts = (accessToken?: string | null, lang?: string) => {
  const [items, setItems] = useState<DepositReceiptItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialRef = useRef(false);
  const isFetchingRef = useRef(false);

  const fetchReceipts = useCallback(
    async (overrideLang?: string) => {
      if (!accessToken) return;
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);
      apiService.setAccessToken(accessToken);
      try {
        const resp = await apiService.listDepositReceipts(overrideLang || lang);
        if (resp.success && resp.data) {
          const data = resp.data as ListDepositReceiptsResponse;
          setItems(data.items || []);
        } else {
          setError(resp.message || 'Failed to load deposit receipts');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Network error');
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [accessToken, lang]
  );

  useEffect(() => {
    if (!accessToken || initialRef.current) return;
    initialRef.current = true;
    fetchReceipts();
  }, [accessToken, fetchReceipts]);

  return { items, loading, error, refresh: fetchReceipts };
};

export type UseDepositReceiptsReturn = ReturnType<typeof useDepositReceipts>;
