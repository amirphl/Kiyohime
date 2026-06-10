import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AdminPlatformBasePriceItem,
  AdminUpdatePlatformBasePriceRequest,
} from '../../types/admin';
import { adminPlatformSettingsApi } from './api';

type UseAdminPlatformBasePricesParams = {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  errors: {
    listFailed: string;
    updateFailed: string;
    invalidPrice: string;
  };
  success: {
    updated: string;
  };
};

const SUPPORTED_PLATFORMS: AdminUpdatePlatformBasePriceRequest['platform'][] = [
  'sms',
  'rubika',
  'bale',
  'splus',
];

export const useAdminPlatformBasePrices = ({
  onError,
  onSuccess,
  errors,
  success,
}: UseAdminPlatformBasePricesParams) => {
  const [items, setItems] = useState<AdminPlatformBasePriceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftPriceByPlatform, setDraftPriceByPlatform] = useState<
    Record<string, string>
  >({});
  const [updatingByPlatform, setUpdatingByPlatform] = useState<
    Record<string, boolean>
  >({});
  const didInitRef = useRef(false);
  const onErrorRef = useRef(onError);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onErrorRef.current = onError;
    onSuccessRef.current = onSuccess;
  }, [onError, onSuccess]);

  const normalizeItems = useCallback((list: AdminPlatformBasePriceItem[]) => {
    const byPlatform = new Map<string, AdminPlatformBasePriceItem>();
    list.forEach(item => {
      if (!item?.platform) return;
      byPlatform.set(String(item.platform).toLowerCase(), item);
    });

    SUPPORTED_PLATFORMS.forEach(platform => {
      if (!byPlatform.has(platform)) {
        byPlatform.set(platform, { platform, price: 0 });
      }
    });

    return SUPPORTED_PLATFORMS.map(
      platform => byPlatform.get(platform) || { platform, price: 0 }
    );
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminPlatformSettingsApi.listBasePrices();
      if (!res.success || !res.data) {
        const message = res.message || errors.listFailed;
        setError(message);
        onErrorRef.current(message);
        setItems(normalizeItems([]));
        return;
      }
      setItems(normalizeItems(res.data.items || []));
    } catch {
      setError(errors.listFailed);
      onErrorRef.current(errors.listFailed);
      setItems(normalizeItems([]));
    } finally {
      setLoading(false);
    }
  }, [errors.listFailed, normalizeItems]);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    load();
  }, [load]);

  const setDraftPrice = useCallback((platform: string, value: string) => {
    setDraftPriceByPlatform(prev => ({ ...prev, [platform]: value }));
  }, []);

  const getDraftPrice = useCallback(
    (platform: string, currentPrice: number) => {
      if (draftPriceByPlatform[platform] !== undefined) {
        return draftPriceByPlatform[platform];
      }
      return String(currentPrice || '');
    },
    [draftPriceByPlatform]
  );

  const updatePrice = useCallback(
    async (platform: AdminUpdatePlatformBasePriceRequest['platform']) => {
      if (updatingByPlatform[platform]) return;
      const currentPrice =
        items.find(item => item.platform.toLowerCase() === platform)?.price || 0;
      const rawValue =
        draftPriceByPlatform[platform] !== undefined
          ? draftPriceByPlatform[platform]
          : String(currentPrice);
      const parsed = Number(rawValue);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        onErrorRef.current(errors.invalidPrice);
        return;
      }

      setError(null);
      setUpdatingByPlatform(prev => ({ ...prev, [platform]: true }));
      try {
        const res = await adminPlatformSettingsApi.updateBasePrice({
          platform,
          price: Math.round(parsed),
        });
        if (!res.success || !res.data) {
          onErrorRef.current(res.message || errors.updateFailed);
          return;
        }
        const nextPrice = Number(res.data.price || Math.round(parsed));
        setItems(prev =>
          prev.map(item =>
            item.platform.toLowerCase() === platform
              ? { ...item, price: nextPrice }
              : item
          )
        );
        setDraftPriceByPlatform(prev => ({
          ...prev,
          [platform]: String(nextPrice),
        }));
        onSuccessRef.current(res.message || success.updated);
      } catch {
        onErrorRef.current(errors.updateFailed);
      } finally {
        setUpdatingByPlatform(prev => ({ ...prev, [platform]: false }));
      }
    },
    [
      draftPriceByPlatform,
      errors.invalidPrice,
      errors.updateFailed,
      items,
      success.updated,
      updatingByPlatform,
    ]
  );

  return {
    items,
    loading,
    error,
    load,
    setDraftPrice,
    getDraftPrice,
    updatePrice,
    updatingByPlatform,
  };
};
