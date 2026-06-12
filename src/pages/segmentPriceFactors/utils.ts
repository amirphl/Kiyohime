import {
  AdminUpdatePagePriceRequest,
  AdminUpdatePlatformBasePriceRequest,
} from '../../types/admin';

export const SEGMENT_PRICE_FACTOR_PLATFORMS = [
  'sms',
  'rubika',
  'bale',
  'splus',
] as const;

export type SegmentPriceFactorPlatform =
  (typeof SEGMENT_PRICE_FACTOR_PLATFORMS)[number];

export const isSegmentPriceFactorPlatform = (
  value: string
): value is SegmentPriceFactorPlatform =>
  SEGMENT_PRICE_FACTOR_PLATFORMS.includes(value as SegmentPriceFactorPlatform);

export const normalizePlatformKey = (platform: string): string =>
  platform.trim().toLowerCase();

export const toTimestamp = (value?: string): number => {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

export const formatDateTime = (
  value: string | null | undefined,
  language: string,
  emptyValue: string
): string => {
  if (!value) return emptyValue;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return emptyValue;

  if (language === 'fa') {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  }

  return date.toLocaleString(undefined, { hour12: false });
};

export type PricePlatform = AdminUpdatePlatformBasePriceRequest['platform'];
export type PagePricePlatform = AdminUpdatePagePriceRequest['platform'];
