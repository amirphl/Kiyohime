import React from 'react';
import { GetSMSCampaignResponse } from '../../../types/campaign';
import { ReportsCopy } from '../translations';

interface ReportDetailsModalProps {
  campaign: GetSMSCampaignResponse;
  onClose: () => void;
  onFixAndRestart: () => void;
  formatDateTime: (iso?: string) => string;
  copy: ReportsCopy;
}

const infoRow = (label: string, value: React.ReactNode) => (
  <div className="flex flex-col gap-1 p-3 rounded-xl border border-slate-100 bg-slate-50/70">
    <span className="text-xs uppercase tracking-wide text-slate-500">
      {label}
    </span>
    <span className="text-sm text-slate-900 break-words">{value}</span>
  </div>
);

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  campaign,
  onClose,
  onFixAndRestart,
  formatDateTime,
  copy,
}) => {
  const statusLabel = (status: string) => copy.statuses[status] || status;
  const normalizeList = (value?: string[] | string) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') return [value];
    return [];
  };

  const level1 = campaign.level1;
  const level2s = normalizeList(campaign.level2s as any);
  const level3s = normalizeList(
    (campaign.level3s as any)
  );
  const statisticEntries = campaign.statistics
    ? Object.entries(campaign.statistics)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-slate-900/70 backdrop-blur-sm">
      <div className="relative flex w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-primary-500 via-indigo-500 to-emerald-500" />
        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between px-6 pt-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {copy.modal.details}
              </p>
              <h3 className="text-2xl font-semibold text-slate-900">
                {campaign.title || '-'}
              </h3>
              <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {statusLabel(campaign.status)}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition text-xl"
              aria-label={copy.modal.close}
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {campaign.status === 'rejected' && campaign.comment && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-rose-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  {copy.modal.rejected}
                </div>
                <p className="mt-2 text-sm text-rose-800 whitespace-pre-wrap break-words">
                  {campaign.comment}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {infoRow(copy.table.status, statusLabel(campaign.status))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {infoRow(
                copy.table.createdAt,
                formatDateTime(campaign.created_at)
              )}
              {infoRow(
                copy.modal.scheduleAt,
                formatDateTime(campaign.scheduleat)
              )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {copy.table.segment}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* {infoRow(
                  copy.modal.level1,
                  <span className="whitespace-pre-wrap break-words">
                    {level1 || '-'}
                  </span>
                )}
                {infoRow(
                  copy.modal.level2,
                  level2s.length ? (
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-900">
                      {level2s.map((item, idx) => (
                        <li
                          key={`${item}-${idx}`}
                          className="whitespace-pre-wrap break-words"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    '-'
                  )
                )} */}
                {infoRow(
                  // copy.modal.level3,
                  '',
                  level3s.length ? (
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-900">
                      {(level3s as string[]).map((item, idx) => (
                        <li
                          key={`${item}-${idx}`}
                          className="whitespace-pre-wrap break-words"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    '-'
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {infoRow(copy.table.title, campaign.title || '-')}
              {infoRow(
                copy.modal.adlink,
                campaign.adlink ? (
                  <a
                    href={campaign.adlink}
                    className="text-primary-600 hover:underline break-all"
                  >
                    {campaign.adlink}
                  </a>
                ) : (
                  '-'
                )
              )}
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                {copy.table.text}
              </div>
              <p className="text-sm text-slate-900 whitespace-pre-wrap break-words leading-relaxed">
                {campaign.content || '-'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {infoRow(copy.modal.lineNumber, campaign.line_number || '-')}
              {infoRow(
                copy.modal.linePriceFactor,
                campaign.line_price_factor ?? '-'
              )}
              {infoRow(copy.modal.budget, campaign.budget ?? '-')}
              {infoRow(copy.modal.numAudience, campaign.num_audience ?? '-')}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                {copy.modal.comment}
              </div>
              <p className="text-sm text-slate-900 whitespace-pre-wrap break-words leading-relaxed">
                {campaign.comment || '-'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {copy.modal.statistics}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* <div className="sm:col-span-2">
                  <div className="flex flex-col gap-2">
                    {statisticEntries.length ? (
                      statisticEntries.map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2"
                        >
                          <span className="text-xs uppercase tracking-wide text-slate-500">
                            {key}
                          </span>
                          <span className="text-sm text-slate-900 break-words text-right">
                            {typeof value === 'object' && value !== null
                              ? JSON.stringify(value)
                              : value ?? '-'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500">-</div>
                    )}
                  </div>
                </div> */}
                <div className="flex flex-col gap-3">
                  {infoRow(copy.modal.totalClicks, campaign.total_clicks ?? '-')}
                  {infoRow(copy.modal.clickRate, campaign.click_rate ?? '-')}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                {copy.modal.linkShortener}
              </div>
              <p className="text-sm text-slate-900 whitespace-pre-wrap break-words leading-relaxed">
                {'https://j0in.ir'}
              </p>
            </div>
          </div>

          <div className="px-6 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 bg-slate-50/60">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition shadow-sm"
            >
              {copy.modal.close}
            </button>
            {campaign.status === 'rejected' && (
              <button
                onClick={onFixAndRestart}
                className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition"
              >
                {copy.modal.fixAndRestart}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
