import { useCallback, useEffect, useRef, useState } from 'react';
import apiService from '../../../services/api';

export interface AgencyCustomerOption {
  customer_id: number;
  representative_first_name: string;
  representative_last_name: string;
  company_name?: string | null;
}

export const useAgencyCustomers = (accessToken: string | null, onError?: (msg: string) => void) => {
  const onErrorRef = useRef(onError);
  const [customers, setCustomers] = useState<AgencyCustomerOption[]>([]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const fetchCustomers = useCallback(async () => {
    try {
      if (accessToken) apiService.setAccessToken(accessToken);
      const res = await apiService.listAgencyCustomers();
      if (res.success && res.data) {
        setCustomers(res.data.items || []);
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
