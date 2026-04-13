import { useEffect, useMemo, useRef, useState } from 'react';
import { apiService } from '../services/api';
import { useToast } from './useToast';
import { PlatformKey, PlatformSettingsItem } from '../types/platformSettings';

type Option = { value: string; label: string };

let platformSettingsCache: PlatformSettingsItem[] | null = null;
let platformSettingsFetchInFlight: Promise<PlatformSettingsItem[]> | null = null;
let fetchAttempted = false;

export const usePlatformSettingsList = (accessToken: string | null, platform: PlatformKey) => {
  const [items, setItems] = useState<PlatformSettingsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const showToastRef = useRef(showToast);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  useEffect(() => {
    if (!accessToken) return;

    apiService.setAccessToken(accessToken);

    if (platformSettingsCache) {
      setItems(platformSettingsCache);
      return;
    }

    if (fetchAttempted && !platformSettingsFetchInFlight) {
      setError('Failed to load platform settings');
      return;
    }

    if (platformSettingsFetchInFlight) {
      setIsLoading(true);
      setError(null);
      platformSettingsFetchInFlight
        .then(data => {
          setItems(data);
          setIsLoading(false);
        })
        .catch(() => {
          setError('Failed to load platform settings');
          setIsLoading(false);
        });
      return;
    }

    if (fetchAttempted) return;

    fetchAttempted = true;
    setIsLoading(true);
    setError(null);
    platformSettingsFetchInFlight = (async () => {
      const res = await apiService.listPlatformSettings();
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to load platform settings');
      }
      return res.data.items || [];
    })();

    platformSettingsFetchInFlight
      .then(data => {
        platformSettingsCache = data;
        setItems(data);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load platform settings';
        setError(message);
        showToastRef.current('error', message);
      })
      .finally(() => {
        setIsLoading(false);
        platformSettingsFetchInFlight = null;
      });
  }, [accessToken]);

  const filteredItems = useMemo(() => {
    const normalizedPlatform = platform.trim().toLowerCase();
    return items.filter(item => {
      console.log('Checking item platform:', item.platform, 'against', normalizedPlatform);
      return item.platform?.trim().toLowerCase() === normalizedPlatform;
    });
  }, [items, platform]);

  const options = useMemo<Option[]>(
    () =>
      filteredItems
        .filter(item => item.name && item.id)
        .map(item => ({
          value: String(item.id),
          label: item.name as string,
        })),
    [filteredItems]
  );

  return { items: filteredItems, options, isLoading, error };
};
