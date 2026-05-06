import { useCallback, useEffect, useRef, useState } from 'react';
import { adminPaymentsApi } from '../api';
import {
  AdminListDepositReceiptsParams,
  DepositReceiptItem,
} from '../../../types/payments';

export const useAdminDepositReceipts = (
  initialParams: AdminListDepositReceiptsParams = {}
) => {
  const [items, setItems] = useState<DepositReceiptItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paramsRef = useRef<AdminListDepositReceiptsParams>(initialParams);
  const requestIdRef = useRef(0);

  const fetchReceipts = useCallback(
    async (overrides?: AdminListDepositReceiptsParams) => {
      if (overrides) paramsRef.current = { ...paramsRef.current, ...overrides };
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);
      try {
        const res = await adminPaymentsApi.listDepositReceipts(
          paramsRef.current
        );
        if (requestId !== requestIdRef.current) return;
        if (!res.success || !res.data) {
          setError(res.message || 'Failed to load deposit receipts');
          setItems([]);
        } else {
          setItems(res.data.items || []);
        }
      } catch (e) {
        if (requestId !== requestIdRef.current) return;
        setError(e instanceof Error ? e.message : 'Network error');
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  return {
    items,
    loading,
    error,
    refresh: fetchReceipts,
    params: paramsRef.current,
    mutateStatus: (uuid: string, status: string) =>
      setItems(prev =>
        prev.map(item => (item.uuid === uuid ? { ...item, status } : item))
      ),
  };
};

export type UseAdminDepositReceiptsReturn = ReturnType<
  typeof useAdminDepositReceipts
>;
