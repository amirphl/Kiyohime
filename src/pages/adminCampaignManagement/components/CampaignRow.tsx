import React from 'react';
import { CalendarClock, Eye } from 'lucide-react';
import { AdminGetCampaignResponse } from '../../../types/admin';
import { CampaignActionType } from '../constants';
import { AdminCampaignManagementCopy } from '../translations';
import {
  canRescheduleCampaign,
  formatCostPerMessage,
  formatCount,
  getLineNumberOrPlatformSettings,
  joinTextList,
} from '../utils';
import CampaignActionButtons from './CampaignActionButtons';
import CampaignStatusBadge from './CampaignStatusBadge';
import TruncatedTableCell from './TruncatedTableCell';

interface CampaignRowProps {
  rowNumber: number;
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
  rowNumber,
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
  const level3sText = joinTextList(campaign.level3s);
  const tagsText = joinTextList(campaign.tags);
  const lineNumberText = getLineNumberOrPlatformSettings(
    campaign.line_number,
    campaign.platform_settings_name,
    campaign.platform_settings_id
  );

  return (
    <tr className='odd:bg-white even:bg-gray-50'>
      <td className={`border px-2 py-2 align-top ${columnAlignClass}`}>
        {rowNumber}
      </td>
      <td className={`border px-2 py-2 align-top ${columnAlignClass}`}>
        {campaign.id}
      </td>
      <TruncatedTableCell
        value={campaign.customer_full_name}
        emptyLabel={copy.common.notAvailable}
        alignClass={columnAlignClass}
      />
      <td className={`border px-2 py-2 align-top ${columnAlignClass}`}>
        {formatDateTime(campaign.scheduleat) || copy.common.notAvailable}
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
      <TruncatedTableCell
        value={campaign.content}
        emptyLabel={copy.common.notAvailable}
        alignClass={columnAlignClass}
        maxLength={56}
      />
      <TruncatedTableCell
        value={campaign.adlink}
        emptyLabel={copy.common.notAvailable}
        alignClass={columnAlignClass}
        maxLength={56}
      />
      <td className={`border px-2 py-2 align-top ${columnAlignClass}`}>
        {campaign.platform || copy.common.notAvailable}
      </td>
      <td className={`border px-2 py-2 align-top ${columnAlignClass}`}>
        {formatCount(campaign.num_audience) || copy.common.notAvailable}
      </td>
      <td className={`border px-2 py-2 align-top ${columnAlignClass}`}>
        {formatCostPerMessage(campaign.budget, campaign.num_audience) ||
          copy.common.notAvailable}
      </td>
      <TruncatedTableCell
        value={campaign.title}
        emptyLabel={copy.common.notAvailable}
        alignClass={columnAlignClass}
      />
      <TruncatedTableCell
        value={level3sText}
        emptyLabel={copy.common.notAvailable}
        alignClass={columnAlignClass}
      />
      <TruncatedTableCell
        value={tagsText}
        emptyLabel={copy.common.notAvailable}
        alignClass={columnAlignClass}
      />
      <td className={`border px-2 py-2 align-top ${columnAlignClass}`}>
        {formatDateTime(campaign.updated_at) || copy.common.notAvailable}
      </td>
      <TruncatedTableCell
        value={lineNumberText}
        emptyLabel={copy.common.notAvailable}
        alignClass={columnAlignClass}
      />
      <TruncatedTableCell
        value={campaign.comment}
        emptyLabel={copy.common.notAvailable}
        alignClass={columnAlignClass}
      />
      <TruncatedTableCell
        value={campaign.agency_full_name}
        emptyLabel={copy.common.notAvailable}
        alignClass={columnAlignClass}
      />
    </tr>
  );
};

export default CampaignRow;
