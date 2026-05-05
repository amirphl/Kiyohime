import { useCallback, useEffect, useRef, useState } from 'react';
import {
  apiService,
  PagePriceItem,
  PlatformBasePriceItem,
} from '../../services/api';

type PricingPlatformKey = 'sms' | 'rubika' | 'bale' | 'splus';

export type PricingRowDraft = {
  segmentPriceFactor: string;
  numPages: string;
  platformBasePrice: string;
  lineNumberPriceFactor: string;
  pagePrice: string;
};

const SUPPORTED_PLATFORMS: PricingPlatformKey[] = [
  'sms',
  'rubika',
  'bale',
  'splus',
];

const buildPricingDrafts = (
  basePriceItems: PlatformBasePriceItem[],
  pagePriceItems: PagePriceItem[]
): Record<PricingPlatformKey, PricingRowDraft> => {
  const baseByPlatform = new Map(
    basePriceItems.map(item => [
      String(item.platform).toLowerCase(),
      item.price || 0,
    ])
  );
  const pageByPlatform = new Map(
    pagePriceItems.map(item => [
      String(item.platform).toLowerCase(),
      item.price || 0,
    ])
  );

  return SUPPORTED_PLATFORMS.reduce(
    (acc, platform) => {
      acc[platform] = {
        segmentPriceFactor: '1',
        numPages: '1',
        platformBasePrice: String(baseByPlatform.get(platform) ?? 0),
        lineNumberPriceFactor: '1',
        pagePrice: String(pageByPlatform.get(platform) ?? 0),
      };
      return acc;
    },
    {} as Record<PricingPlatformKey, PricingRowDraft>
  );
};

type UseDashboardPricingCalculationParams = {
  accessToken: string | null;
  showError: (message: string) => void;
  i18nErrors: {
    basePriceListFailed: string;
    pagePriceListFailed: string;
    unauthorized: string;
    network: string;
    generic: string;
  };
};

const mapPricingErrorMessage = (
  code: string | undefined,
  fallback: string,
  i18nErrors: UseDashboardPricingCalculationParams['i18nErrors']
) => {
  switch (code) {
    case 'UNAUTHORIZED':
      return i18nErrors.unauthorized;
    case 'NETWORK_ERROR':
      return i18nErrors.network;
    case 'PLATFORM_BASE_PRICE_LIST_FAILED':
      return i18nErrors.basePriceListFailed;
    case 'PAGE_PRICE_LIST_FAILED':
      return i18nErrors.pagePriceListFailed;
    default:
      return fallback || i18nErrors.generic;
  }
};

export const useDashboardPricingCalculation = ({
  accessToken,
  showError,
  i18nErrors,
}: UseDashboardPricingCalculationParams) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<
    Record<PricingPlatformKey, PricingRowDraft>
  >(() => buildPricingDrafts([], []));
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    hasLoadedRef.current = false;
    isLoadingRef.current = false;
    setDrafts(buildPricingDrafts([], []));
  }, [accessToken]);

  const loadOnce = useCallback(async () => {
    if (hasLoadedRef.current || isLoadingRef.current) return;

    apiService.setAccessToken(accessToken);

    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const [baseRes, pageRes] = await Promise.all([
        apiService.getPlatformBasePrices(),
        apiService.getPagePrices(),
      ]);

      if (!baseRes.success) {
        const msg = mapPricingErrorMessage(
          baseRes.error?.code,
          baseRes.message || i18nErrors.basePriceListFailed,
          i18nErrors
        );
        setError(msg);
        showError(msg);
        return;
      }

      if (!pageRes.success) {
        const msg = mapPricingErrorMessage(
          pageRes.error?.code,
          pageRes.message || i18nErrors.pagePriceListFailed,
          i18nErrors
        );
        setError(msg);
        showError(msg);
        return;
      }

      setDrafts(
        buildPricingDrafts(baseRes.data?.items || [], pageRes.data?.items || [])
      );
      hasLoadedRef.current = true;
    } catch {
      const msg = i18nErrors.generic;
      setError(msg);
      showError(msg);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, [accessToken, showError, i18nErrors]);

  const setDraftValue = useCallback(
    (
      platform: PricingPlatformKey,
      key: keyof PricingRowDraft,
      value: string
    ) => {
      setDrafts(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          [key]: value,
        },
      }));
    },
    []
  );

  return {
    loading,
    error,
    drafts,
    loadOnce,
    setDraftValue,
    supportedPlatforms: SUPPORTED_PLATFORMS,
  };
};
