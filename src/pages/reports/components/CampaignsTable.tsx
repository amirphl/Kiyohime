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
  clearLevelSelection,
  saveLevelSelection,
} from '../../../types/segment';

const getChannelDisplay = (c: GetCampaignResponse): string => {
  if (!c.platform || c.platform === 'sms') return c.line_number || '-';
  return c.platform_settings_name || '-';
};

interface CampaignsTableProps {
  items: GetCampaignResponse[];
  copy: ReportsCopy;
  formatDateTime: (iso?: string) => string;
  onDetails: (campaign: GetCampaignResponse) => void;
  truncateText: (text: string, max?: number) => string;
}

const CampaignsTable: React.FC<CampaignsTableProps> = ({
  items,
  copy,
  formatDateTime,
  onDetails,
  truncateText,
}) => {
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
      jobCategory: campaign.job_category || '',
      job: campaign.job || '',
    };

    const content: CampaignData['content'] = {
      insertLink: !!campaign.adlink,
      link: campaign.adlink || '',
      text: campaign.content || '',
      scheduleAt: campaign.scheduleat || undefined,
      shortLinkDomain: campaign.short_link_domain || 'jo1n.ir',
      lineNumber: campaign.line_number || '',
      platformSettingsId:
        platformValue === 'sms'
          ? null
          : ((campaign as any).platform_settings_id ?? null),
      mediaUuid:
        platformValue === 'sms' ? null : ((campaign as any).media_uuid ?? null),
    };

    const budget: CampaignData['budget'] = {
      totalBudget: typeof campaign.budget === 'number' ? campaign.budget : 0,
      estimatedMessages:
        typeof campaign.num_audience === 'number'
          ? campaign.num_audience
          : undefined,
    };

    return {
      uuid: campaign.uuid || '',
      segment,
      content,
      budget,
      payment: { paymentMethod: '', termsAccepted: false },
    };
  };

  const persistDraft = (draft: CampaignData) => {
    localStorage.setItem('campaign_creation_data', JSON.stringify(draft));
    localStorage.setItem('campaign_creation_step', '1');
    saveLevelSelection({
      campaignTitle: draft.segment.campaignTitle || '',
      level1s: draft.segment.level1 ? [draft.segment.level1] : [],
      level2s: draft.segment.level2s || [],
      level3s: draft.segment.level3s || [],
      targetAudienceExcelFileUuid:
        draft.segment.targetAudienceExcelFileUuid ?? null,
      metadata: {},
      tags: draft.segment.tags || [],
      count: draft.segment.capacity || 0,
      lastUpdated: new Date().toISOString(),
    });
  };

  const prepareCampaignCreationDraft = (draft: CampaignData) => {
    clearLevelSelection();
    localStorage.removeItem('campaign_creation_data');
    localStorage.removeItem('campaign_creation_step');
    persistDraft(draft);
  };

  const handleClone = async (c: GetCampaignResponse) => {
    if (!canClone(c.status)) {
      showError(copy.clone.notAllowed);
      return;
    }
    const ok = window.confirm(copy.clone.confirm);
    if (!ok) return;
    if (!accessToken) {
      showError(copy.clone.error);
      return;
    }
    setCloning(prev => ({ ...prev, [c.uuid]: true }));
    try {
      apiService.setAccessToken(accessToken);
      const cloneRes = await apiService.cloneCampaign(c.uuid);
      if (!cloneRes.success || !cloneRes.data?.uuid) {
        throw new Error(cloneRes.message || copy.clone.error);
      }
      const clonedDraft: CampaignData = {
        ...normalizeCampaignToDraft(c),
        uuid: cloneRes.data.uuid,
      };
      prepareCampaignCreationDraft(clonedDraft);
      showSuccess(copy.clone.success);
      window.location.href = ROUTES.CAMPAIGN_CREATION.path;
    } catch (e) {
      const message = e instanceof Error ? e.message : copy.clone.error;
      showError(message);
    } finally {
      setCloning(prev => ({ ...prev, [c.uuid]: false }));
    }
  };

  const handleResume = (c: GetCampaignResponse) => {
    if (!canResume(c.status)) {
      showError(copy.resume.notAllowed);
      return;
    }
    const confirmed = window.confirm(copy.resume.confirm);
    if (!confirmed) return;
    setResuming(prev => ({ ...prev, [c.uuid]: true }));
    try {
      const draft = normalizeCampaignToDraft(c);
      prepareCampaignCreationDraft(draft);
      showSuccess(copy.resume.success);
      window.location.href = ROUTES.CAMPAIGN_CREATION.path;
    } catch (err) {
      const message = err instanceof Error ? err.message : copy.resume.error;
      showError(message);
    } finally {
      setResuming(prev => ({ ...prev, [c.uuid]: false }));
    }
  };

  const th =
    'px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider';
  const td = 'px-4 py-2 text-sm text-gray-900 text-center';

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
      <div className='p-6'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className={th}>{copy.table.row}</th>
                <th className={th}>{copy.table.title}</th>
                <th className={th}>{copy.table.platform}</th>
                <th className={th}>{copy.table.lineNumber}</th>
                <th className={th}>{copy.table.segment}</th>
                <th className={th}>{copy.table.numAudience}</th>
                <th className={th}>{copy.table.sent}</th>
                <th className={th}>{copy.table.status}</th>
                <th className={th}>{copy.table.createdAt}</th>
                <th className={th}>{copy.table.scheduleAt}</th>
                <th className={th}>{copy.table.actions}</th>
                <th className={th}>{copy.table.details}</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {items.map((c, idx) => (
                <tr key={c.uuid}>
                  <td className={td}>{idx + 1}</td>
                  <td className='px-4 py-2 text-sm text-gray-700 text-center'>
                    {truncateText(c.title || '')}
                  </td>
                  <td className={td}>
                    {copy.platforms[c.platform ?? 'sms'] ??
                      c.platform ??
                      copy.platforms.sms}
                  </td>
                  <td className={td}>{getChannelDisplay(c)}</td>
                  <td className={td}>
                    {Array.isArray(c.level3s)
                      ? c.level3s.join(', ')
                      : c.level3s || '-'}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-500 text-center'>
                    {c.num_audience || '-'}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-500 text-center'>
                    {c.statistics?.aggregatedTotalSent ?? '-'}
                  </td>
                  <td className={td}>{statusLabel(c.status)}</td>
                  <td className={td}>{formatDateTime(c.created_at)}</td>
                  <td className={td}>{formatDateTime(c.scheduleat)}</td>
                  <td className='px-4 py-2 text-center text-sm text-gray-900'>
                    <div className='flex flex-col items-center gap-2'>
                      {(c.status === 'waiting-for-approval' ||
                        c.status === 'approved') &&
                      c.id ? (
                        <button
                          onClick={() => cancelCampaign(c)}
                          disabled={cancelling[c.id] || cancelled[c.id]}
                          className='px-3 py-1 text-sm rounded bg-amber-600 text-white shadow-sm hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition w-full'
                        >
                          {cancelled[c.id]
                            ? copy.modal.cancelled
                            : cancelling[c.id]
                              ? copy.modal.cancelling
                              : copy.modal.cancel}
                        </button>
                      ) : (
                        <span className='text-gray-400 w-full text-center'>
                          -
                        </span>
                      )}
                      {canClone(c.status) && (
                        <button
                          onClick={() => handleClone(c)}
                          disabled={cloning[c.uuid]}
                          className='px-3 py-1 text-sm rounded bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition w-full'
                        >
                          {cloning[c.uuid] ? copy.loading : copy.clone.button}
                        </button>
                      )}
                      {canResume(c.status) && (
                        <button
                          onClick={() => handleResume(c)}
                          disabled={resuming[c.uuid]}
                          className='px-3 py-1 text-sm rounded bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition w-full'
                        >
                          {resuming[c.uuid] ? copy.loading : copy.resume.button}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className='px-4 py-2 text-center'>
                    <button
                      onClick={() => onDetails(c)}
                      className='px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 shadow-sm'
                    >
                      {copy.table.details}
                    </button>
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
