import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import { useNavigation } from '../contexts/NavigationContext';
import { ROUTES } from '../config/routes';
import {
  AdminPlatformSettingsItem,
  AdminPlatformSettingsStatus,
} from '../types/admin';
import { adminPlatformSettingsApi } from './adminPlatformSettings/api';
import {
  adminPlatformSettingsTranslations,
} from './adminPlatformSettings/translations';
import PlatformSettingsTable from './adminPlatformSettings/components/PlatformSettingsTable';
import StatusChangeModal from './adminPlatformSettings/components/StatusChangeModal';
import MetadataModal from './adminPlatformSettings/components/MetadataModal';
import { useAdminMultimedia } from './adminPlatformSettings/useAdminMultimedia';
import { useAdminPlatformSettingsMetadata } from './adminPlatformSettings/useAdminPlatformSettingsMetadata';

const AdminPlatformSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const copy = useMemo(
    () =>
      adminPlatformSettingsTranslations[
        language as keyof typeof adminPlatformSettingsTranslations
      ] || adminPlatformSettingsTranslations.en,
    [language]
  );
  const { showError, showSuccess } = useToast();
  const { navigate } = useNavigation();
  const didInitRef = useRef(false);

  const [items, setItems] = useState<AdminPlatformSettingsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AdminPlatformSettingsItem | null>(null);
  const [nextStatus, setNextStatus] = useState<'in-progress' | 'active' | 'inactive' | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [metadataModalOpen, setMetadataModalOpen] = useState(false);
  const [metadataItem, setMetadataItem] = useState<AdminPlatformSettingsItem | null>(null);
  const multimediaUuids = useMemo(
    () =>
      items
        .map(item => item.multimedia_uuid || '')
        .filter((uuid): uuid is string => Boolean(uuid)),
    [items]
  );
  const {
    previewsByUuid,
    previewLoadingByUuid,
    downloadLoadingByUuid,
    downloadByUuid,
  } = useAdminMultimedia({
    multimediaUuids,
    onPreviewError: showError,
    onDownloadError: showError,
    previewErrorFallback: copy.errors.previewFailed,
    downloadErrorFallback: copy.errors.downloadFailed,
  });
  const {
    getForm: getMetadataForm,
    setKey: setMetadataKey,
    setValue: setMetadataValue,
    submit: submitMetadata,
    loadingById: metadataLoadingById,
    keyOptions: metadataKeyOptions,
  } = useAdminPlatformSettingsMetadata({
    onError: showError,
    onSuccess: showSuccess,
    onMetadataUpdated: (id, metadata) => {
      setItems(prev =>
        prev.map(item => (item.id === id ? { ...item, metadata } : item))
      );
    },
    errors: {
      keyRequired: copy.errors.metadataKeyRequired,
      valueRequired: copy.errors.metadataValueRequired,
      updateFailed: copy.errors.metadataUpdateFailed,
    },
    success: {
      metadataUpdated: copy.success.metadataUpdated,
    },
  });

  const statusLabel = (status: AdminPlatformSettingsStatus): string => {
    switch (status) {
      case 'initialized':
        return copy.statuses.initialized;
      case 'in-progress':
        return copy.statuses.inProgress;
      case 'active':
        return copy.statuses.active;
      case 'inactive':
        return copy.statuses.inactive;
      default:
        return status || copy.common.emptyValue;
    }
  };

  const formatDateTime = (iso?: string | null) => {
    if (!iso) return copy.common.emptyValue;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return copy.common.emptyValue;
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
      }).format(d);
    }
    return d.toLocaleString();
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await adminPlatformSettingsApi.list();
    setLoading(false);
    if (!res.success) {
      const msg = res.message || copy.errors.listFailed;
      setError(msg);
      showError(msg);
      setItems([]);
      return;
    }
    setItems(res.data?.items || []);
  }, [copy.errors.listFailed, showError]);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    load();
  }, [load]);

  const openStatusModal = (item: AdminPlatformSettingsItem) => {
    setSelectedItem(item);
    setNextStatus('');
    setModalOpen(true);
  };

  const closeStatusModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setNextStatus('');
    setSubmitting(false);
  };

  const openMetadataModal = (item: AdminPlatformSettingsItem) => {
    setMetadataItem(item);
    setMetadataModalOpen(true);
  };

  const closeMetadataModal = () => {
    setMetadataItem(null);
    setMetadataModalOpen(false);
  };

  const submitStatusChange = async () => {
    if (!selectedItem) return;
    if (!nextStatus) {
      showError(copy.errors.invalidTargetStatus);
      return;
    }
    setSubmitting(true);
    const res = await adminPlatformSettingsApi.changeStatus({
      id: selectedItem.id,
      status: nextStatus,
    });
    setSubmitting(false);
    if (!res.success) {
      const msg = res.message || copy.errors.updateFailed;
      showError(msg);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.id === selectedItem.id
          ? { ...item, status: res.data?.status || nextStatus }
          : item
      )
    );
    showSuccess(res.message || copy.success.statusUpdated);
    closeStatusModal();
  };

  return (
    <div className='p-4'>
      <div className='max-w-[1600px] mx-auto space-y-4'>
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='text-2xl font-semibold'>{copy.title}</h1>
            <p className='text-sm text-gray-600 mt-1'>{copy.subtitle}</p>
          </div>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              className='rounded border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
              onClick={() => navigate(ROUTES.ADMIN_SARDIS.path)}
            >
              {copy.backToSardis}
            </button>
            <button
              type='button'
              className='rounded border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 hover:bg-blue-100'
              onClick={load}
              disabled={loading}
            >
              {copy.refresh}
            </button>
          </div>
        </div>

        <PlatformSettingsTable
          items={items}
          loading={loading}
          error={error}
          copy={copy}
          onOpenStatusModal={openStatusModal}
          previewsByUuid={previewsByUuid}
          previewLoadingByUuid={previewLoadingByUuid}
          downloadLoadingByUuid={downloadLoadingByUuid}
          onDownloadMultimedia={downloadByUuid}
          onOpenMetadataModal={openMetadataModal}
          metadataLoadingById={metadataLoadingById}
          metadataKeyOptions={metadataKeyOptions}
          getMetadataForm={getMetadataForm}
          onMetadataKeyChange={setMetadataKey}
          onMetadataValueChange={setMetadataValue}
          onAttachMetadata={submitMetadata}
          statusLabel={statusLabel}
          formatDateTime={formatDateTime}
        />
      </div>

      <StatusChangeModal
        isOpen={modalOpen}
        item={selectedItem}
        value={nextStatus}
        onValueChange={setNextStatus}
        submitting={submitting}
        copy={copy}
        onClose={closeStatusModal}
        onConfirm={submitStatusChange}
        statusLabel={statusLabel}
      />
      <MetadataModal
        isOpen={metadataModalOpen}
        item={metadataItem}
        copy={copy}
        onClose={closeMetadataModal}
      />
    </div>
  );
};

export default AdminPlatformSettingsPage;
