import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import { useNavigation } from '../contexts/NavigationContext';
import { ROUTES } from '../config/routes';
import {
  AdminGetCampaignResponse,
  AdminListCampaignsFilter,
  AdminListCampaignsResponse,
} from '../types/admin';
import { adminCampaignManagementApi } from './adminCampaignManagement/api';
import { getAdminCampaignManagementCopy } from './adminCampaignManagement/translations';
import FiltersBar from './adminCampaignManagement/components/FiltersBar';
import CampaignsTable from './adminCampaignManagement/components/CampaignsTable';
import ActionModal from './adminCampaignManagement/components/ActionModal';

const isWaitingForApproval = (status?: string | null): boolean =>
  status === 'waiting_for_approval' || status === 'waiting-for-approval';
const isApproved = (status?: string | null): boolean => status === 'approved';

const AdminCampaignsPage: React.FC = () => {
  const { language } = useLanguage();
  const copy = useMemo(() => getAdminCampaignManagementCopy(language), [language]);
  const { showError } = useToast();
  const { navigate } = useNavigation();

  const didInitRef = useRef(false);
  const listInFlightRef = useRef(false);

  const [title, setTitle] = useState<string>('');
  const [status, setStatus] = useState<AdminListCampaignsFilter['status']>();
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<AdminGetCampaignResponse[]>([]);

  const [actionCampaign, setActionCampaign] = useState<AdminGetCampaignResponse | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'cancel' | null>(null);
  const [actionComment, setActionComment] = useState<string>('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSubmitting, setActionSubmitting] = useState<boolean>(false);

  const statusOptions = useMemo(
    () => [
      { value: '', label: copy.filters.all },
      { value: 'initiated', label: copy.filters.statuses.initiated },
      { value: 'in-progress', label: copy.filters.statuses.inProgress },
      { value: 'waiting-for-approval', label: copy.filters.statuses.waitingForApproval },
      { value: 'approved', label: copy.filters.statuses.approved },
      { value: 'rejected', label: copy.filters.statuses.rejected },
    ] as Array<{ value: AdminListCampaignsFilter['status'] | ''; label: string }>,
    [copy]
  );

  const formatDateTime = useCallback(
    (value?: string | null) => {
      if (!value) return '';
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return value;
      if (language === 'fa') {
        return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
          timeZone: 'Asia/Tehran',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(parsed);
      }
      return parsed.toLocaleString();
    },
    [language]
  );

  const buildParams = useCallback((): AdminListCampaignsFilter => {
    const params: AdminListCampaignsFilter = {};
    if (title.trim()) params.title = title.trim();
    if (status) params.status = status;

    if (start) {
      const startDate = new Date(start);
      if (!Number.isNaN(startDate.getTime())) params.start_date = startDate.toISOString();
    }
    if (end) {
      const endDate = new Date(end);
      if (!Number.isNaN(endDate.getTime())) params.end_date = endDate.toISOString();
    }

    return params;
  }, [title, status, start, end]);

  const loadCampaigns = useCallback(
    async (useFilters: boolean) => {
      if (listInFlightRef.current) return;
      listInFlightRef.current = true;
      setLoading(true);
      setError(null);

      const response = await adminCampaignManagementApi.listCampaigns(useFilters ? buildParams() : {});

      listInFlightRef.current = false;
      setLoading(false);

      if (!response.success) {
        const message = response.message || copy.errors.listFailed;
        setError(message);
        setItems([]);
        showError(message);
        return;
      }

      const data = (response.data || { items: [] }) as AdminListCampaignsResponse;
      setItems(Array.isArray(data.items) ? data.items : []);
    },
    [buildParams, copy.errors.listFailed, showError]
  );

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    loadCampaigns(false);
  }, [loadCampaigns]);

  const openActionModal = useCallback(
    (campaign: AdminGetCampaignResponse, action: 'approve' | 'reject' | 'cancel') => {
      setActionCampaign(campaign);
      setActionType(action);
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

    const campaignId = typeof actionCampaign.id === 'number' && actionCampaign.id > 0 ? actionCampaign.id : null;
    if (!campaignId) {
      setActionError(copy.errors.missingNumericId);
      showError(copy.errors.missingNumericId);
      return;
    }

    setActionSubmitting(true);
    setActionError(null);

    const trimmedComment = actionComment.trim();
    if ((actionType === 'reject' || actionType === 'cancel') && !trimmedComment) {
      setActionSubmitting(false);
      setActionError(copy.modal.commentLabelRequired);
      showError(copy.modal.commentLabelRequired);
      return;
    }

    const response =
      actionType === 'approve'
        ? await adminCampaignManagementApi.approveCampaign(campaignId, trimmedComment || undefined)
        : actionType === 'reject'
          ? await adminCampaignManagementApi.rejectCampaign(campaignId, trimmedComment)
          : await adminCampaignManagementApi.cancelCampaign({
            campaign_id: campaignId,
            comment: trimmedComment,
          });

    setActionSubmitting(false);

    if (!response.success) {
      const message =
        response.message ||
        (actionType === 'approve'
          ? copy.errors.approveFailed
          : actionType === 'reject'
            ? copy.errors.rejectFailed
            : copy.errors.cancelFailed);
      setActionError(message);
      showError(message);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.uuid === actionCampaign.uuid
          ? {
              ...item,
              status:
                actionType === 'approve'
                  ? 'approved'
                  : actionType === 'reject'
                    ? 'rejected'
                    : 'cancelled',
            }
          : item
      )
    );

    closeActionModal();
  }, [
    actionCampaign,
    actionComment,
    actionSubmitting,
    actionType,
    closeActionModal,
    copy.errors.approveFailed,
    copy.errors.cancelFailed,
    copy.errors.missingNumericId,
    copy.errors.rejectFailed,
    copy.modal.commentLabelRequired,
    showError,
  ]);

  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{copy.title}</h1>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded"
          onClick={() => navigate(ROUTES.ADMIN_SARDIS.path)}
        >
          {copy.backToSardis}
        </button>
      </div>

      <FiltersBar
        title={title}
        status={status}
        start={start}
        end={end}
        loading={loading}
        copy={copy}
        statusOptions={statusOptions}
        onTitleChange={setTitle}
        onStatusChange={setStatus}
        onStartChange={setStart}
        onEndChange={setEnd}
        onApply={() => loadCampaigns(true)}
      />

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <CampaignsTable
        items={items}
        loading={loading}
        error={error}
        copy={copy}
        formatDateTime={formatDateTime}
        canApproveOrReject={isWaitingForApproval}
        canCancel={isApproved}
        isActionSubmitting={actionSubmitting}
        onApprove={(campaign) => openActionModal(campaign, 'approve')}
        onReject={(campaign) => openActionModal(campaign, 'reject')}
        onCancel={(campaign) => openActionModal(campaign, 'cancel')}
      />

      <ActionModal
        actionType={actionType}
        actionCampaign={actionCampaign}
        actionComment={actionComment}
        actionError={actionError}
        actionSubmitting={actionSubmitting}
        copy={copy}
        onClose={closeActionModal}
        onCommentChange={setActionComment}
        onSubmit={submitAction}
      />
    </div>
  );
};

export default AdminCampaignsPage;
