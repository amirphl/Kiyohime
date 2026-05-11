import React, { useMemo, useState } from 'react';
import { CampaignPlatform, GetCampaignResponse } from '../../../types/campaign';
import { ReportsCopy } from '../translations';
import { apiService } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import { downloadBlob } from '../../wallet/utils/download';

interface ReportDetailsModalProps {
  campaign: GetCampaignResponse;
  onClose: () => void;
  onFixAndRestart: () => void;
  formatDateTime: (iso?: string) => string;
  copy: ReportsCopy;
}

// --- Sub-components ---

const STATUS_COLORS: Record<string, string> = {
  initiated: 'bg-slate-100 text-slate-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  'waiting-for-approval': 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
  running: 'bg-indigo-100 text-indigo-700',
  cancelled: 'bg-slate-100 text-slate-500',
  'cancelled-by-admin': 'bg-slate-100 text-slate-500',
  expired: 'bg-orange-100 text-orange-700',
  executed: 'bg-green-100 text-green-700',
};

const StatusBadge: React.FC<{ status: string; label: string }> = ({
  status,
  label,
}) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status] ?? 'bg-slate-100 text-slate-600'}`}
  >
    {label}
  </span>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className='space-y-3'>
    <div className='flex items-center gap-3'>
      <h4 className='text-xs font-semibold uppercase tracking-widest text-slate-400 whitespace-nowrap'>
        {title}
      </h4>
      <div className='flex-1 h-px bg-slate-100' />
    </div>
    {children}
  </div>
);

const InfoGrid: React.FC<{ children: React.ReactNode; cols?: 2 | 3 }> = ({
  children,
  cols = 2,
}) => (
  <div
    className={`grid grid-cols-1 gap-3 ${cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
  >
    {children}
  </div>
);

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className='rounded-xl border border-slate-100 bg-slate-50 px-4 py-3'>
    <p className='text-xs text-slate-400 mb-1'>{label}</p>
    <div className='text-sm font-medium text-slate-800 break-words'>
      {value ?? '—'}
    </div>
  </div>
);

// --- Main component ---

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  campaign,
  onClose,
  onFixAndRestart,
  formatDateTime,
  copy,
}) => {
  const { accessToken } = useAuth();
  const { showError } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const level3s = useMemo((): string[] => {
    const val = campaign.level3s;
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && (val as string).trim()) return [val];
    return [];
  }, [campaign.level3s]);

  const platform: CampaignPlatform = campaign.platform ?? 'sms';
  const isSms = platform === 'sms';
  const hasAdlink =
    typeof campaign.adlink === 'string' && campaign.adlink.trim() !== '';

  const shortLinkDisplay = campaign.short_link_domain
    ? `${campaign.short_link_domain}/xxxxxx`
    : '';
  const displayContent = campaign.content
    ? campaign.content.replace(/🔗/g, shortLinkDisplay)
    : '';

  const hasTrackingResults = useMemo(() => {
    const value = campaign.statistics?.trackingResults;
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value);
  }, [campaign.statistics]);

  const toNumericStat = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && (value as string).trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return null;
  };

  const totalRecords = toNumericStat(
    campaign.statistics?.aggregatedTotalRecords
  );
  const totalSent = toNumericStat(campaign.statistics?.aggregatedTotalSent);
  const totalFailed =
    totalRecords !== null && totalSent !== null
      ? totalRecords - totalSent
      : null;

  const channelValue = isSms
    ? campaign.line_number || '—'
    : campaign.platform_settings_name || '—';

  const getExportErrorMessage = (message?: string): string => {
    const code = (message || '').trim().toUpperCase();
    if (code.includes('MISSING_CAMPAIGN_UUID'))
      return copy.modal.exportMissingCampaignUuid;
    if (code.includes('INVALID_CAMPAIGN_UUID'))
      return copy.modal.exportInvalidCampaignUuid;
    if (code.includes('UNAUTHORIZED')) return copy.modal.exportUnauthorized;
    if (code.includes('FORBIDDEN')) return copy.modal.exportForbidden;
    if (code.includes('NOT_FOUND')) return copy.modal.exportNotFound;
    return copy.modal.exportError;
  };

  const handleExportReport = async () => {
    if (isExporting) return;
    if (!campaign.uuid) {
      showError(copy.modal.exportMissingCampaignUuid);
      return;
    }
    setIsExporting(true);
    try {
      apiService.setAccessToken(accessToken || null);
      const res = await apiService.exportCampaignReport(campaign.uuid);
      if (!res.success || !res.blob) {
        showError(getExportErrorMessage(res.message));
        return;
      }
      downloadBlob(
        res.blob,
        res.filename || `campaign_report_${campaign.uuid}.xlsx`
      );
    } catch {
      showError(copy.modal.exportError);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-slate-900/70 backdrop-blur-sm'>
      <div className='relative flex w-full max-w-2xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl overflow-hidden'>
        <div className='h-1 bg-gradient-to-r from-primary-500 via-indigo-500 to-emerald-500 flex-shrink-0' />

        {/* Header */}
        <div className='flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0'>
          <div className='flex-1 min-w-0 pr-4'>
            <p className='text-base font-semibold text-slate-900 truncate'>
              {campaign.title || '—'}
            </p>
            <div className='flex flex-wrap items-center gap-2 mt-1.5'>
              <StatusBadge
                status={campaign.status}
                label={copy.statuses[campaign.status] || campaign.status}
              />
              <span className='text-xs text-slate-400 font-mono'>
                {campaign.uuid}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className='flex-shrink-0 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition'
            aria-label={copy.modal.close}
          >
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className='flex-1 overflow-y-auto px-6 py-5 space-y-6 min-h-0'>
          {/* Rejection notice */}
          {campaign.status === 'rejected' && campaign.comment && (
            <div className='rounded-xl border border-rose-200 bg-rose-50 px-4 py-3'>
              <p className='text-xs font-semibold text-rose-600 uppercase tracking-wide mb-1'>
                {copy.modal.rejected}
              </p>
              <p className='text-sm text-rose-800 whitespace-pre-wrap break-words'>
                {campaign.comment}
              </p>
            </div>
          )}

          {/* Overview */}
          <Section title={copy.modal.details}>
            <InfoGrid>
              <InfoItem
                label={copy.table.createdAt}
                value={formatDateTime(campaign.created_at)}
              />
              <InfoItem
                label={copy.modal.scheduleAt}
                value={formatDateTime(campaign.scheduleat)}
              />
              <InfoItem
                label={copy.modal.platform}
                value={copy.platforms[platform] ?? platform}
              />
            </InfoGrid>
          </Section>

          {/* Segment */}
          <Section title={copy.table.segment}>
            <div className='rounded-xl border border-slate-100 bg-slate-50 px-4 py-3'>
              {level3s.length > 0 ? (
                <ul className='space-y-1.5'>
                  {level3s.map((item, idx) => (
                    <li
                      key={`${item}-${idx}`}
                      className='flex items-start gap-2 text-sm text-slate-800'
                    >
                      <span className='mt-2 w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0' />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className='text-sm text-slate-400'>—</span>
              )}
            </div>
          </Section>

          {/* Ad Link */}
          {hasAdlink && (
            <Section title={copy.table.adlink}>
              <div className='rounded-xl border border-slate-100 bg-slate-50 px-4 py-3'>
                <a
                  href={campaign.adlink}
                  className='text-sm text-primary-600 hover:underline break-all'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {campaign.adlink}
                </a>
              </div>
            </Section>
          )}

          {/* Message Text */}
          <Section title={copy.table.text}>
            <div className='rounded-xl border border-slate-100 bg-slate-50 px-4 py-3'>
              <p className='text-sm text-slate-800 whitespace-pre-wrap break-words leading-relaxed'>
                {displayContent ? `${displayContent}\nلغو۱۱` : '—'}
              </p>
            </div>
          </Section>

          {/* Pricing & Budget */}
          <Section title={copy.modal.pricing}>
            <InfoGrid>
              <InfoItem label={copy.modal.lineNumber} value={channelValue} />
              <InfoItem
                label={copy.modal.linePriceFactor}
                value={campaign.line_price_factor ?? '—'}
              />
              <InfoItem
                label={copy.modal.segmentPriceFactor}
                value={campaign.segment_price_factor ?? '—'}
              />
              <InfoItem
                label={copy.modal.budget}
                value={campaign.budget ?? '—'}
              />
            </InfoGrid>
          </Section>

          {/* Statistics */}
          <Section title={copy.modal.statistics}>
            <InfoGrid>
              <InfoItem
                label={copy.modal.totalSentRecords}
                value={totalRecords ?? '—'}
              />
              <InfoItem
                label={copy.modal.totalSentSuccessfully}
                value={totalSent ?? '—'}
              />
              <InfoItem
                label={copy.modal.totalFailedRecords}
                value={totalFailed ?? '—'}
              />
              <InfoItem label={copy.modal.inactiveChannelNumbers} value='—' />
              {hasAdlink && (
                <InfoItem
                  label={copy.modal.totalClicks}
                  value={
                    typeof campaign.total_clicks === 'number'
                      ? campaign.total_clicks.toFixed(2)
                      : '—'
                  }
                />
              )}
              {hasAdlink && (
                <InfoItem
                  label={copy.modal.clickRate}
                  value={
                    typeof campaign.click_rate === 'number'
                      ? `${(campaign.click_rate * 100).toFixed(2)}%`
                      : '—'
                  }
                />
              )}
            </InfoGrid>
          </Section>

          {/* Link Shortener */}
          {hasAdlink && campaign.short_link_domain && (
            <Section title={copy.modal.linkShortener}>
              <div className='rounded-xl border border-slate-100 bg-slate-50 px-4 py-3'>
                <span className='text-sm text-slate-800'>
                  {campaign.short_link_domain}
                </span>
              </div>
            </Section>
          )}

          {/* Admin Comment */}
          <Section title={copy.modal.comment}>
            <div className='rounded-xl border border-slate-100 bg-slate-50 px-4 py-3'>
              <p className='text-sm text-slate-800 whitespace-pre-wrap break-words'>
                {campaign.comment || '—'}
              </p>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0'>
          <div className='flex items-center gap-2'>
            <button
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm'
            >
              {copy.modal.close}
            </button>
            {hasTrackingResults && (
              <button
                onClick={handleExportReport}
                disabled={isExporting}
                className='px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isExporting
                  ? copy.modal.exportingReport
                  : copy.modal.exportReport}
              </button>
            )}
          </div>
          {campaign.status === 'rejected' && (
            <button
              onClick={onFixAndRestart}
              className='px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition'
            >
              {copy.modal.fixAndRestart}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
