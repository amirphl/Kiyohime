import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AdminPlatformBasePriceItem,
  AdminUpdatePlatformBasePriceRequest,
} from '../../../types/admin';
import { adminSegmentPriceFactorsApi } from '../api';
import { normalizePlatformKey } from '../utils';

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

const normalizeItems = (
  items: AdminPlatformBasePriceItem[]
): AdminPlatformBasePriceItem[] => {
  const byPlatform = new Map<string, AdminPlatformBasePriceItem>();

  items.forEach(item => {
    if (!item?.platform) return;
    byPlatform.set(normalizePlatformKey(item.platform), item);
  });

  SUPPORTED_PLATFORMS.forEach(platform => {
    if (!byPlatform.has(platform)) {
      byPlatform.set(platform, { platform, price: 0 });
    }
  });

  return SUPPORTED_PLATFORMS.map(
    platform => byPlatform.get(platform) || { platform, price: 0 }
  );
};

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

  const mountedRef = useRef(false);
  const didInitRef = useRef(false);
  const onErrorRef = useRef(onError);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    onErrorRef.current = onError;
    onSuccessRef.current = onSuccess;
  }, [onError, onSuccess]);

  const load = useCallback(async () => {
    if (mountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await adminSegmentPriceFactorsApi.listBasePrices();
      if (!response.success || !response.data) {
        const message = response.message || errors.listFailed;
        if (mountedRef.current) {
          setError(message);
          setItems(normalizeItems([]));
        }
        onErrorRef.current(message);
        return;
      }

      if (mountedRef.current) {
        setItems(normalizeItems(response.data.items || []));
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : errors.listFailed;
      if (mountedRef.current) {
        setError(message);
        setItems(normalizeItems([]));
      }
      onErrorRef.current(message);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [errors.listFailed]);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    load();
  }, [load]);

  const setDraftPrice = useCallback((platform: string, value: string) => {
    const key = normalizePlatformKey(platform);
    setDraftPriceByPlatform(prev => ({ ...prev, [key]: value }));
  }, []);

  const getDraftPrice = useCallback(
    (platform: string, currentPrice: number) => {
      const key = normalizePlatformKey(platform);
      if (draftPriceByPlatform[key] !== undefined) {
        return draftPriceByPlatform[key];
      }

      return String(currentPrice || '');
    },
    [draftPriceByPlatform]
  );

  const updatePrice = useCallback(
    async (platform: AdminUpdatePlatformBasePriceRequest['platform']) => {
      const platformKey = normalizePlatformKey(platform);
      if (updatingByPlatform[platformKey]) return;

      const currentPrice =
        items.find(item => normalizePlatformKey(item.platform) === platformKey)
          ?.price || 0;
      const rawValue =
        draftPriceByPlatform[platformKey] !== undefined
          ? draftPriceByPlatform[platformKey]
          : String(currentPrice);
      const parsedValue = Number(rawValue);

      if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
        onErrorRef.current(errors.invalidPrice);
        return;
      }

      if (mountedRef.current) {
        setError(null);
        setUpdatingByPlatform(prev => ({ ...prev, [platformKey]: true }));
      }

      try {
        const response = await adminSegmentPriceFactorsApi.updateBasePrice({
          platform,
          price: Math.round(parsedValue),
        });

        if (!response.success || !response.data) {
          onErrorRef.current(response.message || errors.updateFailed);
          return;
        }

        const nextPrice = Number(response.data.price || Math.round(parsedValue));
        if (mountedRef.current) {
          setItems(prev =>
            prev.map(item =>
              normalizePlatformKey(item.platform) === platformKey
                ? { ...item, price: nextPrice }
                : item
            )
          );
          setDraftPriceByPlatform(prev => ({
            ...prev,
            [platformKey]: String(nextPrice),
          }));
        }
        onSuccessRef.current(response.message || success.updated);
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : errors.updateFailed;
        onErrorRef.current(message);
      } finally {
        if (mountedRef.current) {
          setUpdatingByPlatform(prev => ({ ...prev, [platformKey]: false }));
        }
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
