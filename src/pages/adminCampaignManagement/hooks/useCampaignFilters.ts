import { useCallback, useMemo, useState } from 'react';
import { AdminListCampaignsFilter } from '../../../types/admin';
import { CAMPAIGN_STATUSES } from '../constants';
import { AdminCampaignManagementCopy } from '../translations';
import { parseDateTimeLocalToIso } from '../utils';

type CampaignFilterStatus = NonNullable<AdminListCampaignsFilter['status']>;

export interface CampaignStatusOption {
  value: CampaignFilterStatus | '';
  label: string;
}

const statusKeyByFilterValue: Record<
  CampaignFilterStatus,
  keyof AdminCampaignManagementCopy['filters']['statuses']
> = {
  initiated: 'initiated',
  'in-progress': 'inProgress',
  'waiting-for-approval': 'waitingForApproval',
  approved: 'approved',
  rejected: 'rejected',
  running: 'running',
  cancelled: 'cancelled',
  'cancelled-by-admin': 'cancelledByAdmin',
  expired: 'expired',
  executed: 'executed',
};

interface UseCampaignFiltersOptions {
  copy: AdminCampaignManagementCopy;
  onInvalid: (message: string) => void;
}

interface BuildResult {
  params?: AdminListCampaignsFilter;
  error?: string;
}

export const useCampaignFilters = ({
  copy,
  onInvalid,
}: UseCampaignFiltersOptions) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<CampaignFilterStatus>();
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const statusOptions = useMemo<CampaignStatusOption[]>(() => {
    const options: CampaignStatusOption[] = [
      {
        value: '',
        label: copy.filters.all,
      },
    ];

    for (const value of CAMPAIGN_STATUSES) {
      if (!value) continue;

      options.push({
        value,
        label: copy.filters.statuses[statusKeyByFilterValue[value]],
      });
    }

    return options;
  }, [copy]);

  const buildParams = useCallback((): BuildResult => {
    const params: AdminListCampaignsFilter = {};

    if (title.trim()) {
      params.title = title.trim();
    }

    if (status) {
      params.status = status;
    }

    const parsedStart = parseDateTimeLocalToIso(
      start,
      copy.errors.invalidStartDate
    );
    if (parsedStart.error) return { error: parsedStart.error };
    if (parsedStart.value) params.start_date = parsedStart.value;

    const parsedEnd = parseDateTimeLocalToIso(end, copy.errors.invalidEndDate);
    if (parsedEnd.error) return { error: parsedEnd.error };
    if (parsedEnd.value) params.end_date = parsedEnd.value;

    if (
      params.start_date &&
      params.end_date &&
      params.start_date > params.end_date
    ) {
      return { error: copy.errors.invalidDateRange };
    }

    return { params };
  }, [title, status, start, end, copy.errors]);

  const getAppliedParams = useCallback((): AdminListCampaignsFilter | null => {
    const result = buildParams();

    if (result.error) {
      onInvalid(result.error);
      return null;
    }

    return result.params || {};
  }, [buildParams, onInvalid]);

  return {
    title,
    status,
    start,
    end,
    setTitle,
    setStatus,
    setStart,
    setEnd,
    statusOptions,
    getAppliedParams,
  };
};
