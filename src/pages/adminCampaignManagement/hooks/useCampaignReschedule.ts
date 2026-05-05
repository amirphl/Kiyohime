import { useCallback, useState } from 'react';
import { AdminGetCampaignResponse } from '../../../types/admin';
import {
  RESCHEDULE_HOUR_END,
  RESCHEDULE_HOUR_START,
  RESCHEDULE_MIN_LEAD_MINUTES,
} from '../constants';
import { adminCampaignManagementApi } from '../api';
import { AdminCampaignManagementCopy } from '../translations';
import { canRescheduleCampaign, toDateTimeLocalInputValue } from '../utils';

interface UseCampaignRescheduleOptions {
  copy: AdminCampaignManagementCopy;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  onRescheduled: (campaignUuid: string, scheduleAtUtc: string) => void;
}

const isValidDate = (value: Date | null): value is Date =>
  Boolean(value && !Number.isNaN(value.getTime()));

const normalizeToRescheduleWindow = (date: Date): Date => {
  const next = new Date(date);

  if (next.getHours() < RESCHEDULE_HOUR_START) {
    next.setHours(RESCHEDULE_HOUR_START, 0, 0, 0);
    return next;
  }

  if (next.getHours() > RESCHEDULE_HOUR_END) {
    next.setDate(next.getDate() + 1);
    next.setHours(RESCHEDULE_HOUR_START, 0, 0, 0);
    return next;
  }

  return next;
};

export const useCampaignReschedule = ({
  copy,
  showError,
  showSuccess,
  onRescheduled,
}: UseCampaignRescheduleOptions) => {
  const [campaign, setCampaign] = useState<AdminGetCampaignResponse | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [enInputValue, setEnInputValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingScheduleAtUtc, setPendingScheduleAtUtc] = useState<
    string | null
  >(null);
  const [submitting, setSubmitting] = useState(false);

  const minFutureDate = normalizeToRescheduleWindow(
    new Date(Date.now() + RESCHEDULE_MIN_LEAD_MINUTES * 60 * 1000)
  );
  const minLocalDateTimeValue = toDateTimeLocalInputValue(minFutureDate);

  const mapErrorByCode = useCallback(
    (code?: string) => {
      switch ((code || '').trim().toUpperCase()) {
        case 'CAMPAIGN_NOT_FOUND':
          return copy.errors.rescheduleCampaignNotFound;
        case 'INVALID_STATE':
          return copy.errors.rescheduleInvalidState;
        case 'SCHEDULE_TIME_REQUIRED':
          return copy.errors.rescheduleDateRequired;
        case 'SCHEDULE_TIME_TOO_CLOSE_TO_CURRENT':
        case 'SCHEDULE_TIME_TOO_SOON':
          return copy.errors.rescheduleDateTooSoon;
        case 'SCHEDULE_TIME_OUTSIDE_WINDOW':
          return copy.errors.rescheduleOutsideAllowedHours;
        case 'SCHEDULE_TIME_MUST_BE_UTC':
          return copy.errors.rescheduleUtcRequired;
        case 'VALIDATION_ERROR':
        case 'INVALID_REQUEST':
        case 'ADMIN_RESCHEDULE_CAMPAIGN_FAILED':
          return copy.errors.rescheduleValidationFailed;
        case 'UNAUTHORIZED':
          return copy.errors.unauthorized;
        case 'NETWORK_ERROR':
          return copy.errors.network;
        default:
          return copy.errors.rescheduleFailed;
      }
    },
    [copy.errors]
  );

  const openRescheduleModal = useCallback(
    (nextCampaign: AdminGetCampaignResponse) => {
      const parsed = nextCampaign.scheduleat
        ? new Date(nextCampaign.scheduleat)
        : null;
      const minimumBase = new Date(
        Date.now() + RESCHEDULE_MIN_LEAD_MINUTES * 60 * 1000
      );

      const base = isValidDate(parsed)
        ? new Date(Math.max(parsed.getTime(), minimumBase.getTime()))
        : minimumBase;
      const normalized = normalizeToRescheduleWindow(base);

      setCampaign(nextCampaign);
      setSelectedDate(normalized);
      setEnInputValue(toDateTimeLocalInputValue(normalized));
      setValidationError(null);
      setConfirmOpen(false);
      setPendingScheduleAtUtc(null);
      setSubmitting(false);
    },
    []
  );

  const closeRescheduleModal = useCallback(() => {
    setCampaign(null);
    setSelectedDate(null);
    setEnInputValue('');
    setValidationError(null);
    setConfirmOpen(false);
    setPendingScheduleAtUtc(null);
    setSubmitting(false);
  }, []);

  const onEnDateTimeChange = useCallback((value: string) => {
    setEnInputValue(value);
    setValidationError(null);

    if (!value) {
      setSelectedDate(null);
      return;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      setSelectedDate(null);
      return;
    }

    setSelectedDate(parsed);
  }, []);

  const onFaDateTimeChange = useCallback((value: unknown) => {
    setValidationError(null);

    if (!value) {
      setSelectedDate(null);
      setEnInputValue('');
      return;
    }

    try {
      const jsDate =
        typeof value === 'object' && value && 'toDate' in (value as object)
          ? (value as { toDate: () => Date }).toDate()
          : new Date(value as string | number | Date);

      if (Number.isNaN(jsDate.getTime())) {
        setSelectedDate(null);
        setEnInputValue('');
        return;
      }

      setSelectedDate(jsDate);
      setEnInputValue(toDateTimeLocalInputValue(jsDate));
    } catch {
      setSelectedDate(null);
      setEnInputValue('');
    }
  }, []);

  const validateSelection = useCallback((): string | null => {
    if (!selectedDate || Number.isNaN(selectedDate.getTime())) {
      return copy.errors.rescheduleDateRequired;
    }

    const hour = selectedDate.getHours();
    if (hour < RESCHEDULE_HOUR_START || hour > RESCHEDULE_HOUR_END) {
      return copy.errors.rescheduleOutsideAllowedHours;
    }

    const minMs = Date.now() + RESCHEDULE_MIN_LEAD_MINUTES * 60 * 1000;
    if (selectedDate.getTime() < minMs) {
      return copy.errors.rescheduleDateTooSoon;
    }

    return null;
  }, [selectedDate, copy.errors]);

  const requestRescheduleConfirmation = useCallback(() => {
    if (campaign && !canRescheduleCampaign(campaign.status)) {
      setValidationError(copy.errors.rescheduleNotAllowed);
      showError(copy.errors.rescheduleNotAllowed);
      return;
    }

    const validationMessage = validateSelection();
    if (validationMessage) {
      setValidationError(validationMessage);
      showError(validationMessage);
      return;
    }

    if (!selectedDate) return;

    setPendingScheduleAtUtc(selectedDate.toISOString());
    setConfirmOpen(true);
  }, [
    campaign,
    copy.errors.rescheduleNotAllowed,
    selectedDate,
    showError,
    validateSelection,
  ]);

  const cancelConfirmation = useCallback(() => {
    if (submitting) return;
    setConfirmOpen(false);
  }, [submitting]);

  const submitReschedule = useCallback(async () => {
    if (!campaign || !pendingScheduleAtUtc || submitting) return;

    const campaignId =
      typeof campaign.id === 'number' && campaign.id > 0 ? campaign.id : null;
    if (!campaignId) {
      showError(copy.errors.missingNumericId);
      return;
    }

    setSubmitting(true);

    try {
      const response = await adminCampaignManagementApi.rescheduleCampaign({
        campaign_id: campaignId,
        schedule_at: pendingScheduleAtUtc,
      });

      if (!response.success) {
        const message =
          mapErrorByCode(response.error?.code) ||
          response.message ||
          copy.errors.rescheduleFailed;
        setValidationError(message);
        showError(message);
        return;
      }

      onRescheduled(campaign.uuid, pendingScheduleAtUtc);
      showSuccess(response.message || copy.modal.rescheduleSuccess);
      closeRescheduleModal();
    } catch {
      const message = copy.errors.network;
      setValidationError(message);
      showError(message);
    } finally {
      setSubmitting(false);
    }
  }, [
    campaign,
    closeRescheduleModal,
    copy.errors.missingNumericId,
    copy.errors.network,
    copy.errors.rescheduleFailed,
    copy.modal.rescheduleSuccess,
    mapErrorByCode,
    onRescheduled,
    pendingScheduleAtUtc,
    showError,
    showSuccess,
    submitting,
  ]);

  return {
    campaign,
    selectedDate,
    enInputValue,
    minFutureDate,
    minLocalDateTimeValue,
    validationError,
    confirmOpen,
    submitting,
    openRescheduleModal,
    closeRescheduleModal,
    onEnDateTimeChange,
    onFaDateTimeChange,
    requestRescheduleConfirmation,
    cancelConfirmation,
    submitReschedule,
  };
};
