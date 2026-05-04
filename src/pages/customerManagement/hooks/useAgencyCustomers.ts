import { useCallback, useEffect, useRef, useState } from 'react';
import apiService from '../../../services/api';
import { AgencyCustomerListItem } from '../../../types/agency';

export interface AgencyCustomerOption {
  customer_id: number;
  representative_first_name: string;
  representative_last_name: string;
  company_name?: string | null;
}

export const useAgencyCustomers = (
  accessToken: string | null,
  onError?: (msg: string) => void
) => {
  const onErrorRef = useRef(onError);
  const [customers, setCustomers] = useState<AgencyCustomerOption[]>([]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const fetchCustomers = useCallback(async () => {
    if (!accessToken) {
      setCustomers([]);
      return;
    }
    try {
      apiService.setAccessToken(accessToken);
      const res = await apiService.listAgencyCustomers();
      if (res.success && res.data) {
        const normalized: AgencyCustomerOption[] = (res.data.items || [])
          .filter(
            (item: AgencyCustomerListItem) =>
              Number.isFinite(item.customer_id) && item.customer_id > 0
          )
          .map((item: AgencyCustomerListItem) => ({
            customer_id: item.customer_id,
            representative_first_name:
              item.representative_first_name?.trim() || '',
            representative_last_name:
              item.representative_last_name?.trim() || '',
            company_name: item.company_name,
          }));
        setCustomers(normalized);
      } else {
        const msg = res.message || 'Failed to list customers';
        onErrorRef.current?.(msg);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Network error';
      onErrorRef.current?.(msg);
    }
  }, [accessToken]);

  return { customers, fetchCustomers };
};

export type UseAgencyCustomersReturn = ReturnType<typeof useAgencyCustomers>;
