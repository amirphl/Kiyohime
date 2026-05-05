import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ROUTES } from '../config/routes';
import { useNavigation } from '../contexts/NavigationContext';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import {
  AdminGetCampaignResponse,
  AdminListCampaignsFilter,
} from '../types/admin';
import ActionModal from './adminCampaignManagement/components/ActionModal';
import CampaignDetailsModal from './adminCampaignManagement/components/CampaignDetailsModal';
import RescheduleCampaignModal from './adminCampaignManagement/components/RescheduleCampaignModal';
import CampaignsTable from './adminCampaignManagement/components/CampaignsTable';
import FiltersBar from './adminCampaignManagement/components/FiltersBar';
import { CampaignActionType } from './adminCampaignManagement/constants';
import { useCampaignActions } from './adminCampaignManagement/hooks/useCampaignActions';
import { useCampaignFilters } from './adminCampaignManagement/hooks/useCampaignFilters';
import { useCampaignList } from './adminCampaignManagement/hooks/useCampaignList';
import { useCampaignReschedule } from './adminCampaignManagement/hooks/useCampaignReschedule';
import { getAdminCampaignManagementCopy } from './adminCampaignManagement/translations';
import {
  formatCampaignDateTime,
  getActionResultStatus,
  getTranslatedStatus,
} from './adminCampaignManagement/utils';

const AdminCampaignsPage: React.FC = () => {
  const { language } = useLanguage();
  const copy = useMemo(
    () => getAdminCampaignManagementCopy(language),
    [language]
  );
  const { showError, showSuccess } = useToast();
  const { navigate } = useNavigation();

  const { items, loading, error, setItems, setError, loadCampaigns } =
    useCampaignList({
      copy,
      showError,
    });

  const {
    title,
    status,
    start,
    end,
    setTitle,
    setStatus,
    setStart,
    setEnd,
    statusOptions,
    getAppliedParams,
  } = useCampaignFilters({
    copy,
    onInvalid: message => {
      setError(message);
      showError(message);
    },
  });

  const didInitRef = useRef(false);
  const [detailsCampaign, setDetailsCampaign] =
    useState<AdminGetCampaignResponse | null>(null);

  const runLoadCampaigns = useCallback(
    async (filters: AdminListCampaignsFilter) => {
      await loadCampaigns(filters);
    },
    [loadCampaigns]
  );

  const handleActionSuccess = useCallback(
    (campaignUuid: string, actionType: CampaignActionType) => {
      const nextStatus = getActionResultStatus(actionType);
      setItems(current =>
        current.map(item =>
          item.uuid === campaignUuid
            ? {
                ...item,
                status: nextStatus,
              }
            : item
        )
      );
    },
    [setItems]
  );

  const {
    actionCampaign,
    actionType,
    actionComment,
    actionError,
    actionSubmitting,
    setActionComment,
    openActionModal,
    closeActionModal,
    submitAction,
  } = useCampaignActions({
    copy,
    showError,
    onActionSuccess: (campaign, nextAction) => {
      handleActionSuccess(campaign.uuid, nextAction);
    },
  });

  const {
    campaign: rescheduleCampaign,
    selectedDate: rescheduleSelectedDate,
    enInputValue: rescheduleEnInputValue,
    minFutureDate,
    minLocalDateTimeValue,
    validationError: rescheduleValidationError,
    confirmOpen: rescheduleConfirmOpen,
    submitting: rescheduleSubmitting,
    openRescheduleModal,
    closeRescheduleModal,
    onEnDateTimeChange,
    onFaDateTimeChange,
    requestRescheduleConfirmation,
    cancelConfirmation,
    submitReschedule,
  } = useCampaignReschedule({
    copy,
    showError,
    showSuccess,
    onRescheduled: (campaignUuid, scheduleAtUtc) => {
      setItems(current =>
        current.map(item =>
          item.uuid === campaignUuid
            ? {
                ...item,
                scheduleat: scheduleAtUtc,
              }
            : item
        )
      );
    },
  });

  const resolveStatusLabel = useCallback(
    (rawStatus?: string | null) => getTranslatedStatus(rawStatus, copy),
    [copy]
  );

  const formatDateTime = useCallback(
    (value?: string | null) => formatCampaignDateTime(value, language),
    [language]
  );
  const columnAlignClass = language === 'fa' ? 'text-right' : 'text-left';

  const handleApplyFilters = useCallback(async () => {
    const params = getAppliedParams();
    if (!params) return;

    await runLoadCampaigns(params);
  }, [getAppliedParams, runLoadCampaigns]);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    runLoadCampaigns({});
  }, [runLoadCampaigns]);

  return (
    <div className='mx-auto max-w-[1400px] p-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>{copy.title}</h1>
        <button
          className='rounded bg-gray-200 px-3 py-2 text-gray-800 hover:bg-gray-300'
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
        onApply={handleApplyFilters}
      />

      <CampaignsTable
        items={items}
        loading={loading}
        error={error}
        copy={copy}
        formatDateTime={formatDateTime}
        resolveStatusLabel={resolveStatusLabel}
        isActionSubmitting={actionSubmitting}
        columnAlignClass={columnAlignClass}
        onSelectAction={openActionModal}
        onOpenDetails={setDetailsCampaign}
        onOpenReschedule={openRescheduleModal}
      />

      <ActionModal
        actionType={actionType}
        actionCampaign={actionCampaign}
        actionComment={actionComment}
        actionError={actionError}
        actionSubmitting={actionSubmitting}
        copy={copy}
        resolveStatusLabel={resolveStatusLabel}
        formatDateTime={formatDateTime}
        onClose={closeActionModal}
        onCommentChange={setActionComment}
        onSubmit={submitAction}
      />

      <CampaignDetailsModal
        campaign={detailsCampaign}
        copy={copy}
        resolveStatusLabel={resolveStatusLabel}
        formatDateTime={formatDateTime}
        onClose={() => setDetailsCampaign(null)}
      />

      <RescheduleCampaignModal
        language={language}
        campaign={rescheduleCampaign}
        selectedDate={rescheduleSelectedDate}
        enInputValue={rescheduleEnInputValue}
        minFutureDate={minFutureDate}
        minLocalDateTimeValue={minLocalDateTimeValue}
        validationError={rescheduleValidationError}
        confirmOpen={rescheduleConfirmOpen}
        submitting={rescheduleSubmitting}
        copy={copy}
        formatDateTime={formatDateTime}
        onClose={closeRescheduleModal}
        onEnDateTimeChange={onEnDateTimeChange}
        onFaDateTimeChange={onFaDateTimeChange}
        onRequestConfirm={requestRescheduleConfirmation}
        onCancelConfirm={cancelConfirmation}
        onConfirmSubmit={submitReschedule}
      />
    </div>
  );
};

export default AdminCampaignsPage;
