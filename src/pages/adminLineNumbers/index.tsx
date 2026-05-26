import React, { useMemo } from 'react';
import { ROUTES } from '../../config/routes';
import { useNavigation } from '../../contexts/NavigationContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import CreateLineNumberModal from './components/CreateLineNumberModal';
import LineNumbersReportTable from './components/LineNumbersReportTable';
import LineNumbersTable from './components/LineNumbersTable';
import { useAdminLineNumbersData } from './hooks/useAdminLineNumbersData';
import { useLineNumberCreateForm } from './hooks/useLineNumberCreateForm';
import { adminLineNumbersTranslations } from './translations';

const AdminLineNumbersPage: React.FC = () => {
  const { language } = useLanguage();
  const { navigate } = useNavigation();
  const { showError, showSuccess } = useToast();

  const copy = useMemo(
    () =>
      adminLineNumbersTranslations[
        language as keyof typeof adminLineNumbersTranslations
      ] || adminLineNumbersTranslations.en,
    [language]
  );

  const {
    lineNumbers,
    lineNumbersLoading,
    lineNumbersError,
    report,
    reportLoading,
    reportError,
    hasOrderChanges,
    savingOrder,
    refreshAll,
    reorderLineNumber,
    saveOrder,
    reloadLineNumbers,
  } = useAdminLineNumbersData({
    copy,
    onError: showError,
    onSuccess: showSuccess,
  });

  const {
    values,
    formError,
    isCreateModalOpen,
    isConfirmModalOpen,
    isSubmitting,
    openCreateModal,
    closeCreateModal,
    closeConfirmModal,
    updateValue,
    submitForConfirmation,
    confirmCreate,
  } = useLineNumberCreateForm({
    copy,
    onError: showError,
    onSuccess: showSuccess,
    onCreated: async () => {
      await reloadLineNumbers(false);
    },
  });

  return (
    <div className='p-4'>
      <div className='mb-4 flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-xl font-semibold text-gray-900'>{copy.title}</h1>
          <p className='mt-1 text-sm text-gray-500'>{copy.subtitle}</p>
        </div>
        <button
          type='button'
          className='rounded bg-gray-200 px-3 py-2 text-gray-800 transition-colors hover:bg-gray-300'
          onClick={() => navigate(ROUTES.ADMIN_SARDIS.path)}
        >
          {copy.backToSardis}
        </button>
      </div>

      <div className='flex items-center gap-2'>
        <button
          type='button'
          className='rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
          onClick={openCreateModal}
        >
          {copy.createNew}
        </button>
        <button
          type='button'
          className='rounded border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50'
          onClick={() => void refreshAll(true)}
        >
          {copy.refresh}
        </button>
      </div>

      <LineNumbersTable
        copy={copy}
        items={lineNumbers}
        loading={lineNumbersLoading}
        error={lineNumbersError}
        hasOrderChanges={hasOrderChanges}
        savingOrder={savingOrder}
        onReorder={reorderLineNumber}
        onSaveOrder={() => void saveOrder()}
      />

      <LineNumbersReportTable
        copy={copy}
        items={report}
        loading={reportLoading}
        error={reportError}
      />

      <CreateLineNumberModal
        copy={copy}
        values={values}
        formError={formError}
        isOpen={isCreateModalOpen}
        isConfirmOpen={isConfirmModalOpen}
        isSubmitting={isSubmitting}
        onClose={closeCreateModal}
        onCloseConfirm={closeConfirmModal}
        onSubmit={submitForConfirmation}
        onConfirm={() => void confirmCreate()}
        onChange={updateValue}
      />
    </div>
  );
};

export default AdminLineNumbersPage;

