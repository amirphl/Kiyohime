import { hasUidPlaceholder } from '../../components/campaign/content/useLinkUidPlaceholder';
import { BundleListItem } from '../../types/bundle';

export const BUNDLE_TOAST_DURATION_MS = 3000;

const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export const toNumericBundleStat = (value: unknown): number | null =>
  toFiniteNumber(value);

export const getBundleTitle = (
  bundle: BundleListItem,
  unknownLabel: string
): string => {
  const value = bundle.title.trim();
  return value || unknownLabel;
};

export const getBundleObjective = (
  bundle: BundleListItem,
  unknownLabel: string
): string => {
  const value = bundle.objective.trim();
  return value || unknownLabel;
};

export const getBundlePersona = (
  bundle: BundleListItem,
  unknownLabel: string
): string => {
  const value = bundle.target_audience_persona.trim();
  return value || unknownLabel;
};

export const getBundleCustomerName = (bundle: BundleListItem): string =>
  getBundleTargetCustomerName(bundle) || '-';

export const getBundleTargetCustomerName = (bundle: BundleListItem): string => {
  return bundle.target_customer_name?.trim() || '';
};

export const getBundleCategory = (
  bundle: BundleListItem,
  unknownLabel: string
): string => {
  const value = bundle.job_category?.trim() || bundle.job?.trim();
  return value || unknownLabel;
};

export const getBundleJobCategory = (bundle: BundleListItem): string => {
  return bundle.job_category?.trim() || '';
};

export const getBundleJob = (bundle: BundleListItem): string => {
  return bundle.job?.trim() || '';
};

export const getBundleDeliveredCount = (
  bundle: BundleListItem
): number | null => toFiniteNumber(bundle.statistics?.aggregatedTotalRecords);

export const getBundleSentCount = (bundle: BundleListItem): number | null =>
  toFiniteNumber(bundle.statistics?.aggregatedTotalSent);

export const getBundleClicksCount = (bundle: BundleListItem): number | null =>
  toFiniteNumber(bundle.statistics?.aggregatedTotalClicks);

export const getBundleTotalCampaigns = (
  bundle: BundleListItem
): number | null => toFiniteNumber(bundle.statistics?.totalCampaigns);

export const getBundleTestCampaigns = (bundle: BundleListItem): number | null =>
  toFiniteNumber(bundle.statistics?.totalCampaignsPhaseTest);

export const getBundleExecutionCampaigns = (
  bundle: BundleListItem
): number | null =>
  toFiniteNumber(bundle.statistics?.totalCampaignsPhaseExecution);

export const getBundleClickRate = (bundle: BundleListItem): number | null => {
  const clicks = getBundleClicksCount(bundle);
  const sent = getBundleSentCount(bundle);
  if (clicks === null || sent === null || sent <= 0) {
    return null;
  }
  return clicks / sent;
};

export const formatBundleNumber = (
  value: number | null,
  locale: 'en-US' | 'fa-IR'
): string => {
  if (value === null) return '-';
  return value.toLocaleString(locale);
};

export const formatBundleRate = (
  value: number | null,
  locale: 'en-US' | 'fa-IR',
  emptyValue: string
): string => {
  if (value === null) return emptyValue;
  return `${(value * 100).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
};

export const getBundleShortLinkDomain = (
  bundle: BundleListItem
): string | null => {
  const value = bundle.short_link_domain?.trim();
  return value || null;
};

export const hasBundleTrackingPlaceholder = (
  bundle: BundleListItem
): boolean => {
  const link = bundle.adlink?.trim();
  return Boolean(link && hasUidPlaceholder(link));
};
