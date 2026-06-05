import { AdminCampaignManagementCopy } from './translations';
import {
  ACTIONABLE_COMMENT_REQUIRED,
  CANCELLABLE_STATUSES,
  CampaignActionType,
  RESCHEDULABLE_STATUSES,
  WAITING_FOR_APPROVAL_STATUSES,
} from './constants';

const STATUS_TO_TRANSLATION_KEY: Record<
  string,
  keyof AdminCampaignManagementCopy['filters']['statuses']
> = {
  initiated: 'initiated',
  'in-progress': 'inProgress',
  in_progress: 'inProgress',
  waiting_for_approval: 'waitingForApproval',
  'waiting-for-approval': 'waitingForApproval',
  approved: 'approved',
  rejected: 'rejected',
  running: 'running',
  cancelled: 'cancelled',
  cancelled_by_admin: 'cancelledByAdmin',
  'cancelled-by-admin': 'cancelledByAdmin',
  expired: 'expired',
  executed: 'executed',
};

const normalizeStatus = (status?: string | null): string =>
  (status || '').trim().toLowerCase();

const hasMissedScheduleDeadline = (scheduleAt?: string | null): boolean => {
  if (!scheduleAt) return false;

  const parsed = new Date(scheduleAt);
  if (Number.isNaN(parsed.getTime())) return false;

  return parsed.getTime() < Date.now();
};

const isExpiredCampaign = (status?: string | null): boolean =>
  normalizeStatus(status) === 'expired';

export const canApproveOrRejectCampaign = (status?: string | null): boolean =>
  WAITING_FOR_APPROVAL_STATUSES.has(normalizeStatus(status));

export const canCancelCampaign = (
  status?: string | null,
  scheduleAt?: string | null
): boolean =>
  CANCELLABLE_STATUSES.has(normalizeStatus(status)) ||
  isExpiredCampaign(status) ||
  hasMissedScheduleDeadline(scheduleAt);

export const canRescheduleCampaign = (
  status?: string | null,
  scheduleAt?: string | null
): boolean =>
  RESCHEDULABLE_STATUSES.has(normalizeStatus(status)) ||
  isExpiredCampaign(status) ||
  hasMissedScheduleDeadline(scheduleAt);

export const requiresComment = (actionType: CampaignActionType): boolean =>
  ACTIONABLE_COMMENT_REQUIRED.includes(actionType);

export const getActionResultStatus = (
  actionType: CampaignActionType
): string => {
  if (actionType === 'approve') return 'approved';
  if (actionType === 'reject') return 'rejected';
  return 'cancelled-by-admin';
};

export const getTranslatedStatus = (
  status: string | null | undefined,
  copy: AdminCampaignManagementCopy
): string => {
  if (!status) return copy.common.unknown;

  const normalized = normalizeStatus(status);
  const statusKey = STATUS_TO_TRANSLATION_KEY[normalized];
  if (!statusKey) return status;

  return copy.filters.statuses[statusKey];
};

export const formatCampaignDateTime = (
  value: string | null | undefined,
  language: 'en' | 'fa'
): string => {
  if (!value) return '';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

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
    }).format(parsed);
  }

  return parsed.toLocaleString();
};

export const formatCount = (value?: number | null): string =>
  typeof value === 'number' && Number.isFinite(value)
    ? value.toLocaleString()
    : '';

export const formatCostPerMessage = (
  budget?: number | null,
  numAudience?: number | null
): string => {
  if (
    typeof budget !== 'number' ||
    !Number.isFinite(budget) ||
    typeof numAudience !== 'number' ||
    !Number.isFinite(numAudience) ||
    numAudience <= 0
  ) {
    return '';
  }

  return (budget / numAudience).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
};

export const joinTextList = (value?: string[] | null): string =>
  Array.isArray(value) && value.length > 0 ? value.join(', ') : '';

export const truncateText = (
  value: string | null | undefined,
  maxLength = 48
): string => {
  if (!value) return '';

  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;

  return `${normalized.slice(0, maxLength - 1)}…`;
};

export const getLineNumberOrPlatformSettings = (
  lineNumber?: string | null,
  platformSettingsName?: string | null,
  platformSettingsId?: number | null
): string => {
  if (lineNumber?.trim()) return lineNumber.trim();
  if (platformSettingsName?.trim()) return platformSettingsName.trim();
  if (typeof platformSettingsId === 'number') return String(platformSettingsId);
  return '';
};

export const parseDateTimeLocalToIso = (
  value: string,
  errorMessage: string
): { value?: string; error?: string } => {
  if (!value) return {};

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { error: errorMessage };
  }

  return { value: parsed.toISOString() };
};

export const toDateTimeLocalInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}`;
};
