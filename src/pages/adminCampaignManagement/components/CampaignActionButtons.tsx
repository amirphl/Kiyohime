import React from 'react';
import { AdminGetCampaignResponse } from '../../../types/admin';
import { CampaignActionType } from '../constants';
import { AdminCampaignManagementCopy } from '../translations';
import { canApproveOrRejectCampaign, canCancelCampaign } from '../utils';

interface CampaignActionButtonsProps {
  campaign: AdminGetCampaignResponse;
  submitting: boolean;
  copy: AdminCampaignManagementCopy;
  onSelectAction: (
    campaign: AdminGetCampaignResponse,
    action: CampaignActionType
  ) => void;
}

const CampaignActionButtons: React.FC<CampaignActionButtonsProps> = ({
  campaign,
  submitting,
  copy,
  onSelectAction,
}) => {
  const canApproveOrReject = canApproveOrRejectCampaign(campaign.status);
  const canCancel = canCancelCampaign(campaign.status);

  return (
    <div className='flex gap-2'>
      <button
        className='rounded bg-green-600 px-3 py-1 text-white disabled:opacity-60'
        onClick={() => onSelectAction(campaign, 'approve')}
        disabled={submitting || !canApproveOrReject}
      >
        {copy.table.actions.approve}
      </button>
      <button
        className='rounded bg-red-600 px-3 py-1 text-white disabled:opacity-60'
        onClick={() => onSelectAction(campaign, 'reject')}
        disabled={submitting || !canApproveOrReject}
      >
        {copy.table.actions.reject}
      </button>
      <button
        className='rounded bg-amber-600 px-3 py-1 text-white disabled:opacity-60'
        onClick={() => onSelectAction(campaign, 'cancel')}
        disabled={submitting || !canCancel}
      >
        {copy.table.actions.cancel}
      </button>
    </div>
  );
};

export default CampaignActionButtons;
