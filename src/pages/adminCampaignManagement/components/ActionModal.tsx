import React from 'react';
import { AdminGetCampaignResponse } from '../../../types/admin';
import { AdminCampaignManagementCopy } from '../translations';

interface ActionModalProps {
  actionType: 'approve' | 'reject' | 'cancel' | null;
  actionCampaign: AdminGetCampaignResponse | null;
  actionComment: string;
  actionError: string | null;
  actionSubmitting: boolean;
  copy: AdminCampaignManagementCopy;
  onClose: () => void;
  onCommentChange: (value: string) => void;
  onSubmit: () => void;
}

const ActionModal: React.FC<ActionModalProps> = ({
  actionType,
  actionCampaign,
  actionComment,
  actionError,
  actionSubmitting,
  copy,
  onClose,
  onCommentChange,
  onSubmit,
}) => {
  if (!actionType || !actionCampaign) return null;

  const isCommentRequired = actionType === 'reject' || actionType === 'cancel';
  const modalTitle =
    actionType === 'approve'
      ? copy.modal.approveTitle
      : actionType === 'reject'
        ? copy.modal.rejectTitle
        : copy.modal.cancelTitle;
  const submitText =
    actionType === 'approve'
      ? copy.modal.approve
      : actionType === 'reject'
        ? copy.modal.reject
        : copy.modal.cancel;
  const submitClass =
    actionType === 'approve'
      ? 'bg-green-600 hover:bg-green-700'
      : actionType === 'reject'
        ? 'bg-red-600 hover:bg-red-700'
        : 'bg-amber-600 hover:bg-amber-700';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{modalTitle}</h2>
          <button className="text-gray-500" onClick={onClose} aria-label={copy.modal.closeLabel}>
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-gray-700">
            <div>
              <span className="font-medium">{copy.modal.uuid}:</span>{' '}
              <span className="font-mono break-all">{actionCampaign.uuid}</span>
            </div>
            <div>
              <span className="font-medium">{copy.modal.title}:</span> {actionCampaign.title || '-'}
            </div>
            <div>
              <span className="font-medium">{copy.modal.currentStatus}:</span> {actionCampaign.status}
            </div>
            <div>
              <span className="font-medium">{copy.modal.platform}:</span> {actionCampaign.platform || '-'}
            </div>
            <div>
              <span className="font-medium">{copy.modal.platformSettingsId}:</span>{' '}
              {typeof actionCampaign.platformSettingsId === 'number' ? actionCampaign.platformSettingsId : '-'}
            </div>
            <div>
              <span className="font-medium">{copy.modal.mediaUuid}:</span> {actionCampaign.mediaUuid || '-'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {isCommentRequired ? copy.modal.commentLabelRequired : copy.modal.commentLabelOptional}
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 min-h-[100px]"
              value={actionComment}
              onChange={(e) => onCommentChange(e.target.value)}
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1">{copy.modal.maxChars}</div>
          </div>

          {actionError && <div className="text-sm text-red-600">{actionError}</div>}

          <div className="flex justify-end gap-3 pt-2">
            <button className="px-4 py-2 rounded border" onClick={onClose} disabled={actionSubmitting}>
              {copy.common.cancel}
            </button>
            <button
              className={`${submitClass} text-white px-4 py-2 rounded disabled:opacity-60`}
              onClick={onSubmit}
              disabled={actionSubmitting || (isCommentRequired && !actionComment.trim())}
            >
              {actionSubmitting ? copy.modal.submitting : submitText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
