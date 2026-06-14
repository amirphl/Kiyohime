import { useCallback, useMemo, useState } from 'react';
import { AdminListCampaignsFilter } from '../../../types/admin';
import {
  CAMPAIGN_STATUSES,
  DEFAULT_CAMPAIGN_STATUS_FILTER,
} from '../constants';
import { AdminCampaignManagementCopy } from '../translations';

type CampaignFilterStatus = AdminListCampaignsFilter['status'];
type CampaignFilterStatusValue = NonNullable<CampaignFilterStatus>;

export interface CampaignStatusOption {
  value: CampaignFilterStatusValue | '';
  label: string;
}

const statusKeyByFilterValue: Record<
  CampaignFilterStatusValue,
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
  const [status, setStatus] = useState<CampaignFilterStatus>(
    DEFAULT_CAMPAIGN_STATUS_FILTER
  );
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

    if (start) {
      const parsedStart = new Date(start);
      if (Number.isNaN(parsedStart.getTime())) {
        return { error: copy.errors.invalidStartDate };
      }
      params.start_date = parsedStart.toISOString();
    }

    if (end) {
      const parsedEnd = new Date(end);
      if (Number.isNaN(parsedEnd.getTime())) {
        return { error: copy.errors.invalidEndDate };
      }
      params.end_date = parsedEnd.toISOString();
    }

    if (
      params.start_date &&
      params.end_date &&
      new Date(params.start_date).getTime() >
        new Date(params.end_date).getTime()
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
