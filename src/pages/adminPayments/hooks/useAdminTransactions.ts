import { useCallback, useEffect, useRef, useState } from 'react';
import { adminPaymentsApi } from '../api';
import {
  AdminListTransactionsParams,
  AdminListTransactionsResponse,
} from '../../../types/payments';

const DEFAULT_PAGINATION = {
  current_page: 1,
  page_size: 20,
  total_items: 0,
  total_pages: 1,
  has_next: false,
  has_previous: false,
};

export const useAdminTransactions = (
  initialParams: AdminListTransactionsParams = {}
) => {
  const [data, setData] = useState<AdminListTransactionsResponse>({
    items: [],
    pagination: DEFAULT_PAGINATION,
  });
  const [loading, setLoading] = useState(false);
  const paramsRef = useRef<AdminListTransactionsParams>({
    page: initialParams.page || 1,
    page_size: initialParams.page_size || 20,
    ...initialParams,
  });
  const requestIdRef = useRef(0);

  const fetchTransactions = useCallback(
    async (overrides?: AdminListTransactionsParams) => {
      if (overrides) {
        paramsRef.current = { ...paramsRef.current, ...overrides };
      }
      const requestId = ++requestIdRef.current;
      setLoading(true);

      try {
        const res = await adminPaymentsApi.listTransactions(paramsRef.current);
        if (!res.success || !res.data) {
          return res;
        }
        if (requestId === requestIdRef.current) {
          setData({
            items: res.data.items || [],
            pagination: res.data.pagination || DEFAULT_PAGINATION,
          });
        }
        return res;
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    data,
    loading,
    params: paramsRef.current,
    refresh: fetchTransactions,
    setInvoiceAttached: (transactionUuid: string, invoiceUuid: string) => {
      setData(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.uuid === transactionUuid
            ? { ...item, customer_invoice_uuid: invoiceUuid }
            : item
        ),
      }));
    },
  };
};
