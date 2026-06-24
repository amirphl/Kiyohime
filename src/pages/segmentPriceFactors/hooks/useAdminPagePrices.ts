import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AdminPagePriceItem,
  AdminUpdatePagePriceRequest,
} from '../../../types/admin';
import { adminSegmentPriceFactorsApi } from '../api';
import {
  isSegmentPriceFactorPlatform,
  normalizePlatformKey,
  SEGMENT_PRICE_FACTOR_PLATFORMS,
  toTimestamp,
} from '../utils';

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

const normalizeItems = (items: AdminPagePriceItem[]): AdminPagePriceItem[] => {
  const byPlatform = new Map<string, AdminPagePriceItem>();

  items.forEach(item => {
    if (!item?.platform) return;

    const key = normalizePlatformKey(item.platform);
    const previous = byPlatform.get(key);
    if (!previous) {
      byPlatform.set(key, item);
      return;
    }

    if (toTimestamp(item.created_at) >= toTimestamp(previous.created_at)) {
      byPlatform.set(key, item);
    }
  });

  SEGMENT_PRICE_FACTOR_PLATFORMS.forEach(platform => {
    if (!byPlatform.has(platform)) {
      byPlatform.set(platform, { platform, price: 0 });
    }
  });

  return SEGMENT_PRICE_FACTOR_PLATFORMS.map(
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
      const response = await adminSegmentPriceFactorsApi.listPagePrices();
      if (!response.success || !response.data) {
        const fallbackMessage = response.message || errors.listFailed;
        const message = getErrorMessage(
          response.error?.code,
          fallbackMessage,
          errors
        );
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
  }, [errors]);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    load();
  }, [load]);

  const setDraftPrice = useCallback((platform: string, value: string) => {
    setDraftPriceByPlatform(prev => ({
      ...prev,
      [normalizePlatformKey(platform)]: value,
    }));
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
    const nextMap = new Map<string, number>();
    items.forEach(item => {
      nextMap.set(normalizePlatformKey(item.platform), item.price || 0);
    });
    return nextMap;
  }, [items]);

  const updatePrice = useCallback(
    async (platform: AdminUpdatePagePriceRequest['platform']) => {
      const platformKey = normalizePlatformKey(platform);
      if (!isSegmentPriceFactorPlatform(platformKey)) {
        onErrorRef.current(errors.platformInvalid);
        return;
      }
      if (updatingByPlatform[platformKey]) return;

      const currentPrice = priceMap.get(platformKey) || 0;
      const draftValue =
        draftPriceByPlatform[platformKey] !== undefined
          ? draftPriceByPlatform[platformKey]
          : String(currentPrice);
      const parsedPrice = Number(draftValue);

      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        onErrorRef.current(errors.invalidPrice);
        return;
      }

      if (mountedRef.current) {
        setError(null);
        setUpdatingByPlatform(prev => ({ ...prev, [platformKey]: true }));
      }

      try {
        const response = await adminSegmentPriceFactorsApi.updatePagePrice({
          platform,
          price: Math.round(parsedPrice),
        });

        if (!response.success || !response.data) {
          const fallbackMessage = response.message || errors.updateFailed;
          onErrorRef.current(
            getErrorMessage(response.error?.code, fallbackMessage, errors)
          );
          return;
        }

        const nextPrice = Number(
          response.data.price || Math.round(parsedPrice)
        );
        const nextCreatedAt = response.data.created_at;

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
