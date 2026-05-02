import React from 'react';
import ModalShell from './ModalShell';
import { AdminCustomerManagementCopy } from '../translations';
import { AdminGetCampaignResponse } from '../../../types/admin';

interface CampaignDetailsModalProps {
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  campaign: AdminGetCampaignResponse | null;
  copy: AdminCustomerManagementCopy;
  onClose: () => void;
  formatDateTime: (iso?: string | null) => string;
  formatNumber: (n?: number | null) => string;
}

const CampaignDetailsModal: React.FC<CampaignDetailsModalProps> = ({
  isOpen,
  loading,
  error,
  campaign,
  copy,
  onClose,
  formatDateTime,
  formatNumber,
}) => {
  const fields = copy.campaignDetails;
  const statsValue = campaign?.statistics
    ? JSON.stringify(campaign.statistics, null, 2)
    : null;

  return (
    <ModalShell
      isOpen={isOpen}
      title={copy.modals.campaignTitle}
      onClose={onClose}
      maxWidthClassName="max-w-5xl"
    >
      {loading && (
        <div className="text-sm text-gray-500">{copy.common.loading}</div>
      )}
      {error && !loading && (
        <div className="text-sm text-red-600">{error}</div>
      )}
      {!loading && !error && campaign && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoItem label={fields.id} value={campaign.id} />
          <InfoItem label={fields.uuid} value={campaign.uuid} />
          <InfoItem label={fields.status} value={campaign.status} />
          <InfoItem label={fields.platform} value={campaign.platform || '-'} />
          <InfoItem
            label={fields.platformSettingsId}
            value={typeof campaign.platformSettingsId === 'number' ? campaign.platformSettingsId : '-'}
          />
          <InfoItem label={fields.mediaUuid} value={campaign.mediaUuid || '-'} />
          <InfoItem label={fields.created} value={formatDateTime(campaign.created_at)} />
          <InfoItem label={fields.updated} value={formatDateTime(campaign.updated_at)} />
          <InfoItem label={fields.title} value={campaign.title || '-'} />
          <InfoItem label={fields.level1} value={campaign.level1 || '-'} />
          <InfoItem
            label={fields.level2s}
            value={Array.isArray(campaign.level2s) && campaign.level2s.length ? campaign.level2s.join(', ') : '-'}
          />
          <InfoItem
            label={fields.level3s}
            value={Array.isArray(campaign.level3s) && campaign.level3s.length ? campaign.level3s.join(', ') : '-'}
          />
          <InfoItem
            label={fields.tags}
            value={Array.isArray(campaign.tags) && campaign.tags.length ? campaign.tags.join(', ') : '-'}
          />
          <InfoItem label={fields.sex} value={campaign.sex || '-'} />
          <InfoItem
            label={fields.cities}
            value={Array.isArray(campaign.city) && campaign.city.length ? campaign.city.join(', ') : '-'}
          />
          <InfoItem label={fields.adLink} value={campaign.adlink || '-'} />
          <InfoItem label={fields.content} value={campaign.content || '-'} />
          <InfoItem label={fields.shortLinkDomain} value={campaign.short_link_domain || '-'} />
          <InfoItem label={fields.jobCategory} value={campaign.job_category || '-'} />
          <InfoItem label={fields.job} value={campaign.job || '-'} />
          <InfoItem label={fields.schedule} value={formatDateTime(campaign.scheduleat)} />
          <InfoItem label={fields.lineNumber} value={campaign.line_number || '-'} />
          <InfoItem label={fields.budget} value={formatNumber(campaign.budget)} />
          <InfoItem label={fields.comment} value={campaign.comment || '-'} />
          <InfoItem
            label={fields.statistics}
            value={statsValue ? <pre className="whitespace-pre-wrap break-words text-xs">{statsValue}</pre> : '-'}
          />
          <InfoItem label={fields.totalClicks} value={formatNumber(campaign.total_clicks)} />
          <InfoItem
            label={fields.clickRate}
            value={typeof campaign.click_rate === 'number' ? `${(campaign.click_rate * 100).toFixed(2)}%` : '-'}
          />
          <InfoItem
            label={fields.segmentPriceFactor}
            value={typeof campaign.segment_price_factor === 'number' ? campaign.segment_price_factor : '-'}
          />
          <InfoItem
            label={fields.lineNumberPriceFactor}
            value={typeof campaign.line_number_price_factor === 'number' ? campaign.line_number_price_factor : '-'}
          />
        </div>
      )}
    </ModalShell>
  );
};

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
    <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
    <div className="mt-1 text-sm text-gray-900 break-words">{value}</div>
  </div>
);

export default CampaignDetailsModal;
