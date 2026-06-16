import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useLanguage } from '../../../hooks/useLanguage';
import apiService from '../../../services/api';
import { BundleListItem } from '../../../types/bundle';
import { getApiErrorMessage } from '../../../utils/errorHandler';
import bundlesApi from '../api';
import { BundlesCopy } from '../translations';

interface UseBundleDetailsOptions {
  bundleId: number | null;
  copy: BundlesCopy;
}

export const useBundleDetails = ({
  bundleId,
  copy,
}: UseBundleDetailsOptions) => {
  const { accessToken } = useAuth();
  const { language } = useLanguage();
  const [bundle, setBundle] = useState<BundleListItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const normalizedBundleId = useMemo(
    () => (bundleId && bundleId > 0 ? bundleId : null),
    [bundleId]
  );

  const normalizeBundleDetails = (data: unknown): BundleListItem | null => {
    if (!data || typeof data !== 'object') {
      return null;
    }

    const maybeWrapped = data as { item?: BundleListItem | null };
    if (maybeWrapped.item && typeof maybeWrapped.item === 'object') {
      return maybeWrapped.item;
    }

    return data as BundleListItem;
  };

  const fetchBundle = useCallback(async () => {
    if (!accessToken) {
      setBundle(null);
      setError(copy.messages.authRequired);
      return;
    }

    if (!normalizedBundleId) {
      setBundle(null);
      setError(copy.messages.missingBundleId);
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setLoading(true);
    setError(null);

    try {
      apiService.setAccessToken(accessToken);
      const response = await bundlesApi.get(normalizedBundleId);

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (!response.success || !response.data) {
        setBundle(null);
        setError(
          getApiErrorMessage(response, language, copy.messages.detailLoadFailed)
        );
        return;
      }

      const normalizedBundle = normalizeBundleDetails(response.data);
      if (!normalizedBundle) {
        setBundle(null);
        setError(copy.messages.detailLoadFailed);
        return;
      }

      setBundle(normalizedBundle);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setBundle(null);
      setError(
        err instanceof Error ? err.message : copy.messages.detailLoadFailed
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [
    accessToken,
    copy.messages.authRequired,
    copy.messages.detailLoadFailed,
    copy.messages.missingBundleId,
    language,
    normalizedBundleId,
  ]);

  useEffect(() => {
    fetchBundle();
  }, [fetchBundle]);

  return {
    bundle,
    loading,
    error,
    retry: fetchBundle,
  };
};
