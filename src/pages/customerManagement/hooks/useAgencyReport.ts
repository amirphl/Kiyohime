import { useCallback, useEffect, useRef, useState } from 'react';
import apiService from '../../../services/api';

interface AgencyReportItem {
  customer_id?: number;
  representative_first_name: string;
  representative_last_name: string;
  company_name: string;
  total_sent: number;
  total_agency_share_with_tax: number;
}

interface FetchParams {
  startDate?: string;
  endDate?: string;
  name?: string;
}

export const useAgencyReport = (accessToken: string | null, onError?: (msg: string) => void) => {
  const onErrorRef = useRef(onError);
  const [items, setItems] = useState<AgencyReportItem[]>([]);
  const [sumTotalSent, setSumTotalSent] = useState<number>(0);
  const [sumTotalShare, setSumTotalShare] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const fetchReport = useCallback(
    async (params: FetchParams, invalidRangeMessage?: string) => {
      setLoading(true);
      setError(null);
      try {
        const { startDate, endDate, name } = params;
        if (startDate && endDate) {
          const startMs = new Date(startDate).getTime();
          const endMs = new Date(endDate).getTime();
          if (!(endMs > startMs)) {
            const msg = invalidRangeMessage || 'Invalid date range';
            setError(msg);
            onErrorRef.current?.(msg);
            setLoading(false);
            return;
          }
        }
        if (accessToken) apiService.setAccessToken(accessToken);
        const res = await apiService.getAgencyCustomerReport({
          start_date: startDate,
          end_date: endDate,
          name: name || undefined,
        });
        if (res.success && res.data) {
          setItems(res.data.items || []);
          setSumTotalSent(res.data.sum_total_sent || 0);
          setSumTotalShare(res.data.sum_total_agency_share_with_tax || 0);
        } else {
          const msg = res.message || 'Failed to load report';
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

  return { items, sumTotalSent, sumTotalShare, loading, error, fetchReport };
};

export type UseAgencyReportReturn = ReturnType<typeof useAgencyReport>;
