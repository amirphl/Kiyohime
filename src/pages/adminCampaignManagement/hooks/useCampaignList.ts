import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AdminGetCampaignResponse,
  AdminListCampaignsFilter,
  AdminListCampaignsResponse,
} from '../../../types/admin';
import { adminCampaignManagementApi } from '../api';
import { AdminCampaignManagementCopy } from '../translations';

interface UseCampaignListOptions {
  copy: AdminCampaignManagementCopy;
  showError: (message: string) => void;
}

export const useCampaignList = ({
  copy,
  showError,
}: UseCampaignListOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<AdminGetCampaignResponse[]>([]);

  const requestIdRef = useRef(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadCampaigns = useCallback(
    async (filters: AdminListCampaignsFilter = {}) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      if (mountedRef.current) {
        setLoading(true);
        setError(null);
      }

      try {
        const response =
          await adminCampaignManagementApi.listCampaigns(filters);

        if (!mountedRef.current || requestId !== requestIdRef.current) {
          return false;
        }

        if (!response.success) {
          const message = response.message || copy.errors.listFailed;
          setError(message);
          setItems([]);
          showError(message);
          return false;
        }

        const data = (response.data || {
          items: [],
        }) as AdminListCampaignsResponse;

        setItems(Array.isArray(data.items) ? data.items : []);
        return true;
      } catch (err) {
        if (!mountedRef.current || requestId !== requestIdRef.current) {
          return false;
        }

        const fallbackMessage = copy.errors.listFailed;
        const message =
          err instanceof Error && err.message ? err.message : fallbackMessage;

        setError(message);
        setItems([]);
        showError(message);
        return false;
      } finally {
        if (mountedRef.current && requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [copy.errors.listFailed, showError]
  );

  return {
    items,
    loading,
    error,
    setItems,
    setError,
    loadCampaigns,
  };
};
