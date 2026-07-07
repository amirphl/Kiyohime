import React, { useState } from 'react';
import {
  CampaignData,
  CampaignPlatform,
  GetCampaignResponse,
} from '../../../types/campaign';
import { ReportsCopy } from '../translations';
import { useCancelCampaign } from '../hooks/useCancelCampaign';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import { apiService } from '../../../services/api';
import { ROUTES } from '../../../config/routes';
import {
  getShortLinkDomainOrDefault,
  normalizeLinkPlaceholder,
} from '../../../utils/campaignUtils';
import { prepareCampaignCreationDraft } from '../../../utils/campaignCreationDraft';
import {
  formatPercentValue,
  toNumericValue,
} from './reportDetails/reportDetailsUtils';

const getAggregatedTotalSent = (campaign: GetCampaignResponse): string => {
  const aggregated = toNumericValue(campaign.statistics?.aggregatedTotalSent);
  if (aggregated !== null) return String(aggregated);

  return '-';
};

const getLevel3DisplayValue = (campaign: GetCampaignResponse): string => {
  if (Array.isArray(campaign.level3s) && campaign.level3s.length > 0) {
    return campaign.level3s.join(', ');
  }

  return typeof campaign.level3s === 'string' ? campaign.level3s : '-';
};

interface CampaignsTableProps {
  items: GetCampaignResponse[];
  copy: ReportsCopy;
  formatDateTime: (iso?: string) => string;
  onDetails: (campaign: GetCampaignResponse) => void;
  truncateText: (text: string, max?: number) => string;
  bulkHideMode: boolean;
  bulkUnhideMode: boolean;
  selectedCampaignIds: number[];
  onToggleCampaignSelection: (campaignId: number, selected: boolean) => void;
}

const CampaignsTable: React.FC<CampaignsTableProps> = ({
  items,
  copy,
  formatDateTime,
  onDetails,
  truncateText,
  bulkHideMode,
  bulkUnhideMode,
  selectedCampaignIds,
  onToggleCampaignSelection,
}) => {
  const bulkSelectionMode = bulkHideMode || bulkUnhideMode;
  const selectionColumnLabel = bulkUnhideMode
    ? copy.bulkUnhide.selectionColumn
    : copy.bulkHide.selectionColumn;
  const statusLabel = (status: string) => copy.statuses[status] || status;
  const { cancelCampaign, cancelling, cancelled } = useCancelCampaign(copy);
  const { accessToken } = useAuth();
  const { showError, showSuccess } = useToast();
  const [cloning, setCloning] = useState<Record<string, boolean>>({});
  const [resuming, setResuming] = useState<Record<string, boolean>>({});

  const canClone = (status: string) =>
    status !== 'initiated' && status !== 'in-progress';
  const canResume = (status: string) =>
    status === 'initiated' || status === 'in-progress';

  const normalizeCampaignToDraft = (
    campaign: GetCampaignResponse
  ): CampaignData => {
    const platformValue: CampaignPlatform = campaign.platform ?? 'sms';
    const capacityValue =
      typeof campaign.num_audience === 'number' ? campaign.num_audience : 0;

    const segment: CampaignData['segment'] = {
      campaignTitle: campaign.title || '',
      level1: campaign.level1 || '',
      level2s: Array.isArray(campaign.level2s) ? campaign.level2s : [],
      level3s: Array.isArray(campaign.level3s) ? campaign.level3s : [],
      targetAudienceExcelFileUuid:
        campaign.target_audience_excel_file_uuid ?? null,
      platform: platformValue,
      tags: Array.isArray(campaign.tags) ? campaign.tags : [],
      capacityTooLow: capacityValue > 0 && capacityValue < 500,
      capacity: capacityValue,
      audienceGrades: Array.isArray(campaign.audience_grades)
        ? campaign.audience_grades
        : [],
      jobCategory: campaign.job_category || '',
      job: campaign.job || '',
      bundleId: campaign.bundle_id ?? null,
      phase: campaign.phase ?? undefined,
    };

    const content: CampaignData['content'] = {
      insertLink: !!campaign.adlink,
      link: campaign.adlink || '',
      text: normalizeLinkPlaceholder(campaign.content || ''),
      scheduleAt: campaign.scheduleat || undefined,
      shortLinkDomain: campaign.adlink
        ? getShortLinkDomainOrDefault(campaign.short_link_domain)
        : null,
      lineNumber: campaign.line_number || '',
      platformSettingsId:
        platformValue === 'sms'
          ? null
          : (campaign.platform_settings_id ?? null),
      mediaUuid: platformValue === 'sms' ? null : (campaign.media_uuid ?? null),
    };

    const budget: CampaignData['budget'] = {
      totalBudget: typeof campaign.budget === 'number' ? campaign.budget : 0,
      estimatedMessages:
        typeof campaign.num_audience === 'number'
          ? campaign.num_audience
          : undefined,
    };

    return {
      id:
        typeof campaign.id === 'number' && campaign.id > 0
          ? campaign.id
          : undefined,
      uuid: campaign.uuid || '',
      segment,
      content,
      budget,
      payment: { paymentMethod: '', termsAccepted: false },
    };
  };

  const handleClone = async (campaign: GetCampaignResponse) => {
    if (!canClone(campaign.status)) {
      showError(copy.clone.notAllowed);
      return;
    }
    const ok = window.confirm(copy.clone.confirm);
    if (!ok) return;
    if (!accessToken) {
      showError(copy.clone.error);
      return;
    }
    setCloning(prev => ({ ...prev, [campaign.uuid]: true }));
    try {
      apiService.setAccessToken(accessToken);
      const cloneRes = await apiService.cloneCampaign(campaign.uuid);
      if (!cloneRes.success || !cloneRes.data?.uuid) {
        throw new Error(cloneRes.message || copy.clone.error);
      }
      const clonedDraft: CampaignData = {
        ...normalizeCampaignToDraft(campaign),
        id:
          typeof cloneRes.data.id === 'number' && cloneRes.data.id > 0
            ? cloneRes.data.id
            : undefined,
        uuid: cloneRes.data.uuid,
      };
      prepareCampaignCreationDraft(clonedDraft);
      showSuccess(copy.clone.success);
      window.location.href = ROUTES.CAMPAIGN_CREATION.path;
    } catch (e) {
      const message = e instanceof Error ? e.message : copy.clone.error;
      showError(message);
    } finally {
      setCloning(prev => ({ ...prev, [campaign.uuid]: false }));
    }
  };

  const handleResume = (campaign: GetCampaignResponse) => {
    if (!canResume(campaign.status)) {
      showError(copy.resume.notAllowed);
      return;
    }
    const confirmed = window.confirm(copy.resume.confirm);
    if (!confirmed) return;
    setResuming(prev => ({ ...prev, [campaign.uuid]: true }));
    try {
      const draft = normalizeCampaignToDraft(campaign);
      prepareCampaignCreationDraft(draft);
      showSuccess(copy.resume.success);
      window.location.href = ROUTES.CAMPAIGN_CREATION.path;
    } catch (err) {
      const message = err instanceof Error ? err.message : copy.resume.error;
      showError(message);
    } finally {
      setResuming(prev => ({ ...prev, [campaign.uuid]: false }));
    }
  };

  const th =
    'px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500';
  const td = 'px-4 py-3 text-center text-sm text-gray-900 align-top';
  const actionButtonCls =
    'w-full rounded px-3 py-1 text-sm text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50';
  const selectedCampaignIdSet = new Set(selectedCampaignIds);

  return (
    <div className='rounded-lg border border-gray-200 bg-white shadow-sm'>
      <div className='p-6'>
        <div className='overflow-x-auto'>
          <table className='min-w-full table-fixed divide-y divide-gray-200'>
            <colgroup>
              {bulkSelectionMode ? <col className='w-16' /> : null}
              <col className='w-40' />
              <col className='w-44' />
              <col className='w-28' />
              <col className='w-52' />
              <col className='w-28' />
              <col className='w-28' />
              <col className='w-40' />
              <col className='w-32' />
              <col className='w-72' />
            </colgroup>
            <thead className='bg-gray-50'>
              <tr>
                {bulkSelectionMode ? (
                  <th className={th}>{selectionColumnLabel}</th>
                ) : null}
                <th className={th}>{copy.table.bundleTitle}</th>
                <th className={th}>{copy.table.campaignTitle}</th>
                <th className={th}>{copy.table.platform}</th>
                <th className={th}>{copy.table.level3}</th>
                <th className={th}>{copy.table.aggregatedTotalSent}</th>
                <th className={th}>{copy.table.clickRate}</th>
                <th className={th}>{copy.table.scheduledAt}</th>
                <th className={th}>{copy.table.status}</th>
                <th className={th}>{copy.table.actions}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {items.map(campaign => (
                <tr key={campaign.uuid} className='hover:bg-gray-50'>
                  {bulkSelectionMode ? (
                    <td className={td}>
                      {campaign.id ? (
                        <input
                          type='checkbox'
                          checked={selectedCampaignIdSet.has(campaign.id)}
                          onChange={event =>
                            onToggleCampaignSelection(
                              campaign.id as number,
                              event.target.checked
                            )
                          }
                          className='h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500'
                          aria-label={`${selectionColumnLabel} ${campaign.title || campaign.uuid}`}
                        />
                      ) : (
                        '-'
                      )}
                    </td>
                  ) : null}
                  <td className={td}>
                    <span
                      className='block truncate'
                      title={campaign.bundle_title || '-'}
                    >
                      {campaign.bundle_title || '-'}
                    </span>
                  </td>
                  <td className={td}>
                    <span
                      className='block truncate font-medium text-gray-900'
                      title={campaign.title || '-'}
                    >
                      {truncateText(campaign.title || '', 40)}
                    </span>
                  </td>
                  <td className={td}>
                    {copy.platforms[campaign.platform ?? 'sms'] ??
                      campaign.platform ??
                      copy.platforms.sms}
                  </td>
                  <td className={td}>
                    <span
                      className='block truncate'
                      title={getLevel3DisplayValue(campaign)}
                    >
                      {getLevel3DisplayValue(campaign)}
                    </span>
                  </td>
                  <td className={td}>{getAggregatedTotalSent(campaign)}</td>
                  <td className={td}>
                    {formatPercentValue(campaign.click_rate)}
                  </td>
                  <td className={td}>{formatDateTime(campaign.scheduleat)}</td>
                  <td className={td}>
                    <span className='block font-medium text-gray-900'>
                      {statusLabel(campaign.status)}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-sm text-center align-top'>
                    <div className='flex flex-col gap-2'>
                      <button
                        type='button'
                        onClick={() => onDetails(campaign)}
                        className='w-full rounded border border-primary-200 bg-primary-50 px-3 py-1.5 font-medium text-primary-700 transition hover:border-primary-300 hover:bg-primary-100'
                      >
                        {copy.table.details}
                      </button>
                      {(campaign.status === 'waiting-for-approval' ||
                        campaign.status === 'approved') &&
                      campaign.id ? (
                        <button
                          type='button'
                          onClick={() => cancelCampaign(campaign)}
                          disabled={
                            cancelling[campaign.id] || cancelled[campaign.id]
                          }
                          className={`${actionButtonCls} bg-amber-600 hover:bg-amber-700`}
                        >
                          {cancelled[campaign.id]
                            ? copy.modal.cancelled
                            : cancelling[campaign.id]
                              ? copy.modal.cancelling
                              : copy.modal.cancel}
                        </button>
                      ) : null}

                      {canClone(campaign.status) ? (
                        <button
                          type='button'
                          onClick={() => handleClone(campaign)}
                          disabled={cloning[campaign.uuid]}
                          className={`${actionButtonCls} bg-blue-600 hover:bg-blue-700`}
                        >
                          {cloning[campaign.uuid]
                            ? copy.loading
                            : copy.clone.button}
                        </button>
                      ) : null}

                      {canResume(campaign.status) ? (
                        <button
                          type='button'
                          onClick={() => handleResume(campaign)}
                          disabled={resuming[campaign.uuid]}
                          className={`${actionButtonCls} bg-emerald-600 hover:bg-emerald-700`}
                        >
                          {resuming[campaign.uuid]
                            ? copy.loading
                            : copy.resume.button}
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignsTable;
