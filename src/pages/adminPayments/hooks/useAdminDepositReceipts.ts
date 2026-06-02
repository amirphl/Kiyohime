import { useCallback, useEffect, useRef, useState } from 'react';
import { adminPaymentsApi } from '../api';
import {
  AdminListDepositReceiptsParams,
  DepositReceiptItem,
} from '../../../types/payments';

export const useAdminDepositReceipts = (initialParams: AdminListDepositReceiptsParams = {}) => {
  const [items, setItems] = useState<DepositReceiptItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paramsRef = useRef<AdminListDepositReceiptsParams>(initialParams);
  const inFlight = useRef(false);

  const fetchReceipts = useCallback(async (overrides?: AdminListDepositReceiptsParams) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);
    if (overrides) paramsRef.current = { ...paramsRef.current, ...overrides };
    try {
      const res = await adminPaymentsApi.listDepositReceipts(paramsRef.current);
      if (!res.success || !res.data) {
        setError(res.message || 'Failed to load deposit receipts');
        setItems([]);
      } else {
        setItems(res.data.items || []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }, []);

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

export type UseAdminDepositReceiptsReturn = ReturnType<typeof useAdminDepositReceipts>;
