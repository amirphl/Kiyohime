import { useCallback, useState } from 'react';
import { AdminGetCampaignResponse } from '../../../types/admin';
import { adminCampaignManagementApi } from '../api';
import { CampaignActionType } from '../constants';
import { AdminCampaignManagementCopy } from '../translations';
import { requiresComment } from '../utils';

interface UseCampaignActionsOptions {
  copy: AdminCampaignManagementCopy;
  showError: (message: string) => void;
  onActionSuccess: (
    campaign: AdminGetCampaignResponse,
    action: CampaignActionType
  ) => void;
}

export const useCampaignActions = ({
  copy,
  showError,
  onActionSuccess,
}: UseCampaignActionsOptions) => {
  const [actionCampaign, setActionCampaign] =
    useState<AdminGetCampaignResponse | null>(null);
  const [actionType, setActionType] = useState<CampaignActionType | null>(null);
  const [actionComment, setActionComment] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const openActionModal = useCallback(
    (campaign: AdminGetCampaignResponse, nextAction: CampaignActionType) => {
      setActionCampaign(campaign);
      setActionType(nextAction);
      setActionComment('');
      setActionError(null);
    },
    []
  );

  const closeActionModal = useCallback(() => {
    setActionCampaign(null);
    setActionType(null);
    setActionComment('');
    setActionError(null);
    setActionSubmitting(false);
  }, []);

  const submitAction = useCallback(async () => {
    if (!actionCampaign || !actionType || actionSubmitting) return;

    const campaignId =
      typeof actionCampaign.id === 'number' && actionCampaign.id > 0
        ? actionCampaign.id
        : null;

    if (!campaignId) {
      setActionError(copy.errors.missingNumericId);
      showError(copy.errors.missingNumericId);
      return;
    }

    const trimmedComment = actionComment.trim();
    if (requiresComment(actionType) && !trimmedComment) {
      setActionError(copy.errors.commentRequired);
      showError(copy.errors.commentRequired);
      return;
    }

    setActionSubmitting(true);
    setActionError(null);

    try {
      const response =
        actionType === 'approve'
          ? await adminCampaignManagementApi.approveCampaign(
              campaignId,
              trimmedComment || undefined
            )
          : actionType === 'reject'
            ? await adminCampaignManagementApi.rejectCampaign(
                campaignId,
                trimmedComment
              )
            : await adminCampaignManagementApi.cancelCampaign({
                campaign_id: campaignId,
                comment: trimmedComment,
              });

      if (!response.success) {
        const fallback =
          actionType === 'approve'
            ? copy.errors.approveFailed
            : actionType === 'reject'
              ? copy.errors.rejectFailed
              : copy.errors.cancelFailed;

        const message = response.message || fallback;
        setActionError(message);
        showError(message);
        return;
      }

      onActionSuccess(actionCampaign, actionType);
      closeActionModal();
    } catch (err) {
      const fallback =
        actionType === 'approve'
          ? copy.errors.approveFailed
          : actionType === 'reject'
            ? copy.errors.rejectFailed
            : copy.errors.cancelFailed;

      const message =
        err instanceof Error && err.message ? err.message : fallback;

      setActionError(message);
      showError(message);
    } finally {
      setActionSubmitting(false);
    }
  }, [
    actionCampaign,
    actionComment,
    actionSubmitting,
    actionType,
    closeActionModal,
    copy.errors,
    onActionSuccess,
    showError,
  ]);

  return {
    actionCampaign,
    actionType,
    actionComment,
    actionError,
    actionSubmitting,
    setActionComment,
    openActionModal,
    closeActionModal,
    submitAction,
  };
};
