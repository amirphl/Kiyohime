import React from 'react';
import { AdminGetCampaignResponse } from '../../../types/admin';
import { CampaignActionType } from '../constants';
import { AdminCampaignManagementCopy } from '../translations';
import CampaignRow from './CampaignRow';

interface CampaignsTableProps {
  items: AdminGetCampaignResponse[];
  loading: boolean;
  error: string | null;
  copy: AdminCampaignManagementCopy;
  formatDateTime: (value?: string | null) => string;
  resolveStatusLabel: (status?: string | null) => string;
  isActionSubmitting: boolean;
  columnAlignClass: 'text-left' | 'text-right';
  onSelectAction: (
    campaign: AdminGetCampaignResponse,
    action: CampaignActionType
  ) => void;
  onOpenDetails: (campaign: AdminGetCampaignResponse) => void;
  onOpenReschedule: (campaign: AdminGetCampaignResponse) => void;
}

const HEADERS: Array<keyof AdminCampaignManagementCopy['table']['headers']> = [
  'id',
  'scheduleAt',
  'status',
  'actions',
  'reschedule',
  'details',
  'title',
  'adLink',
  'content',
];

const TABLE_COL_SPAN = HEADERS.length;

const CampaignsTable: React.FC<CampaignsTableProps> = ({
  items,
  loading,
  error,
  copy,
  formatDateTime,
  resolveStatusLabel,
  isActionSubmitting,
  columnAlignClass,
  onSelectAction,
  onOpenDetails,
  onOpenReschedule,
}) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-[1900px] table-fixed border text-sm'>
        <colgroup>
          <col className='w-[90px]' />
          <col className='w-[200px]' />
          <col className='w-[170px]' />
          <col className='w-[230px]' />
          <col className='w-[130px]' />
          <col className='w-[120px]' />
          <col className='w-[320px]' />
          <col className='w-[320px]' />
          <col className='w-[330px]' />
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
          {!loading && error ? (
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
            items.map(campaign => (
              <CampaignRow
                key={campaign.uuid}
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
        </tbody>
      </table>
    </div>
  );
};

export default CampaignsTable;
