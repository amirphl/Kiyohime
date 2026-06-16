import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';

type BundleOption = { value: string; label: string };

let bundlesCache: Array<BundleOption> | null = null;
let bundlesFetchInFlight: Promise<Array<BundleOption>> | null = null;

export const resetBundlesCache = () => {
  bundlesCache = null;
  bundlesFetchInFlight = null;
};

export const useBundles = (accessToken: string | null) => {
  const [bundleOptions, setBundleOptions] = useState<Array<BundleOption>>(
    bundlesCache ?? []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    apiService.setAccessToken(accessToken);

    if (bundlesCache) {
      setBundleOptions(bundlesCache);
      return;
    }

    if (bundlesFetchInFlight) {
      setIsLoading(true);
      setError(null);
      bundlesFetchInFlight
        .then(opts => {
          setBundleOptions(opts);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message || 'FETCH_FAILED');
          setIsLoading(false);
        });
      return;
    }

    setIsLoading(true);
    setError(null);

    bundlesFetchInFlight = (async () => {
      const res = await apiService.listBundles({ page: 1, limit: 100 });
      if (!res.success || !res.data) {
        throw new Error(res.error?.code || res.message || 'FETCH_FAILED');
      }
      return (res.data.items || [])
        .map(item => ({
          value: String(item.id || ''),
          label: item.title || String(item.id || ''),
        }))
        .filter(opt => opt.value);
    })();

    bundlesFetchInFlight
      .then(opts => {
        bundlesCache = opts;
        setBundleOptions(opts);
      })
      .catch(err => {
        setError(err.message || 'FETCH_FAILED');
      })
      .finally(() => {
        setIsLoading(false);
        bundlesFetchInFlight = null;
      });
  }, [accessToken]);

  return { bundleOptions, isLoading, error };
};
