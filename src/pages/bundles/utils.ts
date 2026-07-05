import { hasUidPlaceholder } from '../../components/campaign/content/useLinkUidPlaceholder';
import {
  BundleCreateFormValues,
  BundleListItem,
  CreateBundleRequest,
} from '../../types/bundle';

export const BUNDLE_TOAST_DURATION_MS = 3000;

export const INITIAL_BUNDLE_FORM_VALUES: BundleCreateFormValues = {
  title: '',
  objective: '',
  targetAudiencePersona: '',
  description: '',
  insertLink: false,
  link: '',
  shortLinkDomain: null,
  customerName: '',
  jobCategory: '',
  job: '',
};

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

export const getBundleTotalRecordsCount = (
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

export const mapBundleToFormValues = (
  bundle: BundleListItem
): BundleCreateFormValues => {
  const link = bundle.adlink?.trim() || '';

  return {
    title: bundle.title?.trim() || '',
    objective: bundle.objective?.trim() || '',
    targetAudiencePersona: bundle.target_audience_persona?.trim() || '',
    description: bundle.description?.trim() || '',
    insertLink: Boolean(link),
    link,
    shortLinkDomain: getBundleShortLinkDomain(bundle),
    customerName: bundle.target_customer_name?.trim() || '',
    jobCategory: bundle.job_category?.trim() || '',
    job: bundle.job?.trim() || '',
  };
};

export const buildBundleCreatePayload = (
  values: BundleCreateFormValues
): CreateBundleRequest => ({
  title: values.title.trim(),
  objective: values.objective.trim(),
  target_audience_persona: values.targetAudiencePersona.trim(),
  adlink:
    values.insertLink && values.link.trim() ? values.link.trim() : undefined,
  short_link_domain:
    values.shortLinkDomain && values.shortLinkDomain.trim()
      ? values.shortLinkDomain.trim()
      : undefined,
  description: values.description.trim() || undefined,
  target_customer_name: values.customerName.trim() || undefined,
  job_category: values.jobCategory.trim() || undefined,
  job: values.job.trim() || undefined,
});

export const hasBundleTrackingPlaceholder = (
  bundle: BundleListItem
): boolean => {
  const link = bundle.adlink?.trim();
  return Boolean(link && hasUidPlaceholder(link));
};
