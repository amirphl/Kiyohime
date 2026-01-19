import { useCallback, useEffect, useRef, useState } from 'react';
import apiService from '../../../services/api';
import {
  TransactionHistoryItem,
  TransactionHistoryResponse,
} from '../../../types/payments';

export const useWalletHistory = (accessToken?: string | null) => {
  const [items, setItems] = useState<TransactionHistoryItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const initialRef = useRef<boolean>(false);
  const isFetchingRef = useRef<boolean>(false);

  const fetchPage = useCallback(
    async (pageToFetch: number) => {
      if (isFetchingRef.current) return;
      if (!accessToken) return;
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);
      apiService.setAccessToken(accessToken);
      try {
        const resp = await apiService.getPaymentHistory({
          page: pageToFetch,
          page_size: 20,
        });
        if (resp.success && resp.data) {
          const data = resp.data as TransactionHistoryResponse;
          setItems(data.items);
          setHasNext(data.pagination.has_next);
        } else {
          setError(resp.message || 'Failed to load history');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Network error');
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [accessToken]
  );

  useEffect(() => {
    if (!accessToken || initialRef.current) return;
    initialRef.current = true;
    fetchPage(1);
  }, [accessToken, fetchPage]);

  const goNext = () => {
    if (loading || !hasNext) return;
    const next = page + 1;
    setPage(next);
    fetchPage(next);
  };

  const goPrev = () => {
    if (loading || page === 1) return;
    const prev = Math.max(1, page - 1);
    setPage(prev);
    fetchPage(prev);
  };

  return {
    items,
    page,
    hasNext,
    loading,
    error,
    fetchPage,
    goNext,
    goPrev,
  };
};

export type UseWalletHistoryReturn = ReturnType<typeof useWalletHistory>;
