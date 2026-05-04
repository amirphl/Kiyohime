import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AdminPagePriceItem,
  AdminUpdatePagePriceRequest,
} from '../../types/admin';
import { adminPlatformSettingsApi } from './api';

type UseAdminPagePricesParams = {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  errors: {
    listFailed: string;
    updateFailed: string;
    invalidPrice: string;
    validationFailed: string;
    platformRequired: string;
    platformInvalid: string;
    priceInvalid: string;
    insertFailed: string;
    unauthorized: string;
    network: string;
    invalidRequest: string;
  };
  success: {
    updated: string;
  };
};

const SUPPORTED_PLATFORMS: AdminUpdatePagePriceRequest['platform'][] = [
  'sms',
  'rubika',
  'bale',
  'splus',
];

const normalizePlatformKey = (platform: string): string =>
  platform.trim().toLowerCase();

const toTimestamp = (value?: string): number => {
  if (!value) return 0;
  const ts = new Date(value).getTime();
  return Number.isFinite(ts) ? ts : 0;
};

const normalizeItems = (items: AdminPagePriceItem[]): AdminPagePriceItem[] => {
  const byPlatform = new Map<string, AdminPagePriceItem>();
  items.forEach(item => {
    if (!item?.platform) return;
    const key = normalizePlatformKey(item.platform);
    const prev = byPlatform.get(key);
    if (!prev) {
      byPlatform.set(key, item);
      return;
    }
    const prevDate = toTimestamp(prev.created_at);
    const nextDate = toTimestamp(item.created_at);
    if (nextDate >= prevDate) {
      byPlatform.set(key, item);
    }
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

const getErrorMessage = (
  code: string | undefined,
  fallback: string,
  messages: UseAdminPagePricesParams['errors']
): string => {
  switch (code) {
    case 'VALIDATION_ERROR':
      return messages.validationFailed;
    case 'PAGE_PRICE_PLATFORM_REQUIRED':
      return messages.platformRequired;
    case 'PAGE_PRICE_PLATFORM_INVALID':
      return messages.platformInvalid;
    case 'PAGE_PRICE_INVALID':
      return messages.priceInvalid;
    case 'PAGE_PRICE_INSERT_FAILED':
      return messages.insertFailed;
    case 'UNAUTHORIZED':
      return messages.unauthorized;
    case 'NETWORK_ERROR':
      return messages.network;
    case 'INVALID_REQUEST':
      return messages.invalidRequest;
    default:
      return fallback;
  }
};

const isSupportedPlatform = (
  platform: string
): platform is AdminUpdatePagePriceRequest['platform'] =>
  SUPPORTED_PLATFORMS.includes(
    normalizePlatformKey(platform) as AdminUpdatePagePriceRequest['platform']
  );

export const useAdminPagePrices = ({
  onError,
  onSuccess,
  errors,
  success,
}: UseAdminPagePricesParams) => {
  const [items, setItems] = useState<AdminPagePriceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftPriceByPlatform, setDraftPriceByPlatform] = useState<
    Record<string, string>
  >({});
  const [updatingByPlatform, setUpdatingByPlatform] = useState<
    Record<string, boolean>
  >({});
  const didInitRef = useRef(false);
  const mountedRef = useRef(true);

  const onErrorRef = useRef(onError);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onErrorRef.current = onError;
    onSuccessRef.current = onSuccess;
  }, [onError, onSuccess]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (mountedRef.current) {
      setLoading(true);
      setError(null);
    }
    try {
      const res = await adminPlatformSettingsApi.listPagePrices();
      if (!res.success || !res.data) {
        const fallbackMessage = res.message || errors.listFailed;
        const mappedMessage = getErrorMessage(
          res.error?.code,
          fallbackMessage,
          errors
        );
        if (mountedRef.current) {
          setError(mappedMessage);
        }
        onErrorRef.current(mappedMessage);
        if (mountedRef.current) {
          setItems(normalizeItems([]));
        }
        return;
      }
      if (mountedRef.current) {
        setItems(normalizeItems(res.data.items || []));
      }
    } catch {
      if (mountedRef.current) {
        setError(errors.listFailed);
      }
      onErrorRef.current(errors.listFailed);
      if (mountedRef.current) {
        setItems(normalizeItems([]));
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [errors]);

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
      return String(currentPrice || 0);
    },
    [draftPriceByPlatform]
  );

  const priceMap = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach(item =>
      map.set(normalizePlatformKey(item.platform), item.price || 0)
    );
    return map;
  }, [items]);

  const updatePrice = useCallback(
    async (platform: AdminUpdatePagePriceRequest['platform']) => {
      const platformKey = normalizePlatformKey(platform);
      if (!isSupportedPlatform(platformKey)) {
        onErrorRef.current(errors.platformInvalid);
        return;
      }
      if (updatingByPlatform[platformKey]) return;

      const currentPrice = priceMap.get(platformKey) || 0;
      const draft =
        draftPriceByPlatform[platformKey] !== undefined
          ? draftPriceByPlatform[platformKey]
          : String(currentPrice);

      const parsedPrice = Number(draft);
      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        onErrorRef.current(errors.invalidPrice);
        return;
      }

      if (mountedRef.current) {
        setError(null);
        setUpdatingByPlatform(prev => ({ ...prev, [platformKey]: true }));
      }

      try {
        const payload: AdminUpdatePagePriceRequest = {
          platform: platformKey,
          price: Math.round(parsedPrice),
        };

        const res = await adminPlatformSettingsApi.updatePagePrice(payload);
        if (!res.success || !res.data) {
          const fallbackMessage = res.message || errors.updateFailed;
          onErrorRef.current(
            getErrorMessage(res.error?.code, fallbackMessage, errors)
          );
          return;
        }

        const nextPrice = Number(res.data.price || Math.round(parsedPrice));
        const nextCreatedAt = res.data.created_at;

        if (mountedRef.current) {
          setItems(prev =>
            normalizeItems(
              prev.map(item =>
                normalizePlatformKey(item.platform) === platformKey
                  ? { ...item, price: nextPrice, created_at: nextCreatedAt }
                  : item
              )
            )
          );

          setDraftPriceByPlatform(prev => ({
            ...prev,
            [platformKey]: String(nextPrice),
          }));
        }
        onSuccessRef.current(res.message || success.updated);
      } catch {
        onErrorRef.current(errors.updateFailed);
      } finally {
        if (mountedRef.current) {
          setUpdatingByPlatform(prev => ({ ...prev, [platformKey]: false }));
        }
      }
    },
    [
      draftPriceByPlatform,
      errors,
      priceMap,
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
