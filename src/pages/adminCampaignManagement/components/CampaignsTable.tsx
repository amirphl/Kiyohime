import React from 'react';
import { AdminGetCampaignResponse } from '../../../types/admin';
import { CampaignActionType } from '../constants';
import { AdminCampaignManagementCopy } from '../translations';
import CampaignRow from './CampaignRow';

interface CampaignsTableProps {
  items: AdminGetCampaignResponse[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  copy: AdminCampaignManagementCopy;
  formatDateTime: (value?: string | null) => string;
  resolveStatusLabel: (status?: string | null) => string;
  isActionSubmitting: boolean;
  columnAlignClass: 'text-left' | 'text-right';
  loadMoreRef: (node: HTMLTableRowElement | null) => void;
  onRetryLoadMore: () => void;
  onSelectAction: (
    campaign: AdminGetCampaignResponse,
    action: CampaignActionType
  ) => void;
  onOpenDetails: (campaign: AdminGetCampaignResponse) => void;
  onOpenReschedule: (campaign: AdminGetCampaignResponse) => void;
}

const HEADERS: Array<keyof AdminCampaignManagementCopy['table']['headers']> = [
  'row',
  'id',
  'customerFullName',
  'scheduleAt',
  'status',
  'actions',
  'reschedule',
  'details',
  'content',
  'adLink',
  'platform',
  'numAudience',
  'costPerMessage',
  'title',
  'level3s',
  'tags',
  'updatedAt',
  'lineNumber',
  'comment',
  'agencyName',
];

const TABLE_COL_SPAN = HEADERS.length;

const CampaignsTable: React.FC<CampaignsTableProps> = ({
  items,
  loading,
  loadingMore,
  error,
  hasMore,
  copy,
  formatDateTime,
  resolveStatusLabel,
  isActionSubmitting,
  columnAlignClass,
  loadMoreRef,
  onRetryLoadMore,
  onSelectAction,
  onOpenDetails,
  onOpenReschedule,
}) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-[2800px] table-fixed border text-sm'>
        <colgroup>
          <col className='w-[70px]' />
          <col className='w-[110px]' />
          <col className='w-[220px]' />
          <col className='w-[180px]' />
          <col className='w-[150px]' />
          <col className='w-[230px]' />
          <col className='w-[100px]' />
          <col className='w-[90px]' />
          <col className='w-[320px]' />
          <col className='w-[300px]' />
          <col className='w-[120px]' />
          <col className='w-[130px]' />
          <col className='w-[140px]' />
          <col className='w-[240px]' />
          <col className='w-[260px]' />
          <col className='w-[220px]' />
          <col className='w-[180px]' />
          <col className='w-[240px]' />
          <col className='w-[260px]' />
          <col className='w-[220px]' />
        </colgroup>
        <thead className='bg-gray-50'>
          <tr>
            {HEADERS.map(headerKey => (
              <th
                key={headerKey}
                className={`border px-2 py-2 align-top ${columnAlignClass}`}
              >
                {copy.table.headers[headerKey]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && items.length === 0 ? (
            <tr>
              <td
                colSpan={TABLE_COL_SPAN}
                className='py-6 text-center text-gray-500'
              >
                {copy.common.loading}
              </td>
            </tr>
          ) : !loading && error && items.length === 0 ? (
            <tr>
              <td
                colSpan={TABLE_COL_SPAN}
                className='py-6 text-center text-red-600'
              >
                {error}
              </td>
            </tr>
          ) : !loading && items.length === 0 ? (
            <tr>
              <td colSpan={TABLE_COL_SPAN} className='py-6 text-center'>
                {copy.table.noData}
              </td>
            </tr>
          ) : (
            items.map((campaign, index) => (
              <CampaignRow
                key={campaign.uuid}
                rowNumber={index + 1}
                campaign={campaign}
                copy={copy}
                isActionSubmitting={isActionSubmitting}
                formatDateTime={formatDateTime}
                resolveStatusLabel={resolveStatusLabel}
                columnAlignClass={columnAlignClass}
                onSelectAction={onSelectAction}
                onOpenDetails={onOpenDetails}
                onOpenReschedule={onOpenReschedule}
              />
            ))
          )}

          {items.length > 0 && error ? (
            <tr>
              <td
                colSpan={TABLE_COL_SPAN}
                className='py-3 text-center text-sm text-red-600'
              >
                <div className='flex items-center justify-center gap-3'>
                  <span>{error}</span>
                  {hasMore ? (
                    <button
                      type='button'
                      className='rounded border border-red-300 px-3 py-1 text-red-700 transition hover:bg-red-50'
                      onClick={onRetryLoadMore}
                    >
                      {copy.common.retry}
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ) : null}

          {items.length > 0 && hasMore && !error ? (
            <tr ref={loadMoreRef}>
              <td colSpan={TABLE_COL_SPAN} className='py-4 text-center text-sm'>
                {loadingMore ? copy.common.loadingMore : ''}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignsTable;
