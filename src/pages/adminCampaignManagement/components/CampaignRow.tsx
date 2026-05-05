import React from 'react';
import { CalendarClock, Eye } from 'lucide-react';
import { AdminGetCampaignResponse } from '../../../types/admin';
import { CampaignActionType } from '../constants';
import { AdminCampaignManagementCopy } from '../translations';
import { canRescheduleCampaign } from '../utils';
import CampaignActionButtons from './CampaignActionButtons';
import CampaignStatusBadge from './CampaignStatusBadge';

interface CampaignRowProps {
  campaign: AdminGetCampaignResponse;
  copy: AdminCampaignManagementCopy;
  isActionSubmitting: boolean;
  formatDateTime: (value?: string | null) => string;
  resolveStatusLabel: (status?: string | null) => string;
  columnAlignClass: 'text-left' | 'text-right';
  onSelectAction: (
    campaign: AdminGetCampaignResponse,
    action: CampaignActionType
  ) => void;
  onOpenDetails: (campaign: AdminGetCampaignResponse) => void;
  onOpenReschedule: (campaign: AdminGetCampaignResponse) => void;
}

const CampaignRow: React.FC<CampaignRowProps> = ({
  campaign,
  copy,
  isActionSubmitting,
  formatDateTime,
  resolveStatusLabel,
  columnAlignClass,
  onSelectAction,
  onOpenDetails,
  onOpenReschedule,
}) => {
  const detailsLabel = copy.table.actions.details;
  const rescheduleLabel = copy.table.actions.reschedule;
  const reschedulable = canRescheduleCampaign(campaign.status);

  return (
    <tr className='odd:bg-white even:bg-gray-50'>
      <td className={`border px-2 py-2 align-top ${columnAlignClass}`}>
        {campaign.id}
      </td>
      <td className={`border px-2 py-2 align-top ${columnAlignClass}`}>
        {formatDateTime(campaign.scheduleat)}
      </td>
      <td className={`border px-2 py-2 align-top ${columnAlignClass}`}>
        <CampaignStatusBadge label={resolveStatusLabel(campaign.status)} />
      </td>
      <td
        className={`border px-2 py-2 align-top whitespace-nowrap ${columnAlignClass}`}
      >
        <CampaignActionButtons
          campaign={campaign}
          submitting={isActionSubmitting}
          copy={copy}
          onSelectAction={onSelectAction}
        />
      </td>
      <td className={`border px-2 py-2 align-top ${columnAlignClass}`}>
        <button
          className='inline-flex items-center rounded border border-gray-300 p-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
          title={rescheduleLabel}
          aria-label={rescheduleLabel}
          onClick={() => onOpenReschedule(campaign)}
          disabled={!reschedulable}
        >
          <CalendarClock className='h-4 w-4' />
        </button>
      </td>
      <td className={`border px-2 py-2 align-top ${columnAlignClass}`}>
        <button
          className='inline-flex items-center rounded border border-gray-300 p-2 text-gray-700 transition hover:bg-gray-100'
          title={detailsLabel}
          aria-label={detailsLabel}
          onClick={() => onOpenDetails(campaign)}
        >
          <Eye className='h-4 w-4' />
        </button>
      </td>
      <td
        className={`border px-2 py-2 align-top whitespace-pre-wrap break-words ${columnAlignClass}`}
      >
        {campaign.title || ''}
      </td>
      <td
        className={`border px-2 py-2 align-top whitespace-pre-wrap break-words ${columnAlignClass}`}
      >
        {campaign.adlink || ''}
      </td>
      <td
        className={`border px-2 py-2 align-top whitespace-pre-wrap break-words ${columnAlignClass}`}
      >
        {campaign.content || ''}
      </td>
    </tr>
  );
};

export default CampaignRow;
