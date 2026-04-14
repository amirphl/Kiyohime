import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { PlatformKey } from '../types/platformSettings';
import { usePlatformSettings } from './settings/usePlatformSettings';
import PlatformSelector from './settings/components/PlatformSelector';
import PlatformSettingsTable from './settings/components/PlatformSettingsTable';
import PlatformSettingsForm from './settings/components/PlatformSettingsForm';
import PlatformSettingsModal from './settings/components/PlatformSettingsModal';
import { settingsTranslations } from './settings/translations';

const SettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const t =
    settingsTranslations[language as keyof typeof settingsTranslations] ||
    settingsTranslations.en;
  const { accessToken } = useAuth();
  const { showError } = useToast();

  const {
    state,
    setPlatform,
    setForm,
    createSetting,
    uploadMultimedia,
    isUploading,
    openEdit,
    closeEdit,
  } = usePlatformSettings(accessToken);

  const platformOptions: Array<{ value: PlatformKey; label: string }> = [
    {
      value: 'rubika',
      label: t.settings.platforms.rubika,
    },
    { value: 'bale', label: t.settings.platforms.bale },
    {
      value: 'splus',
      label: t.settings.platforms.splus,
    },
  ];

  const filteredItems = state.items.filter(
    item => item.platform === state.selectedPlatform
  );

  return (
    <div className='p-8'>
      <div className='max-w-6xl mx-auto space-y-8'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-bold text-gray-900'>
            {t.settings.title}
          </h1>
          <p className='text-sm text-gray-600'>
            {t.settings.subtitle}
          </p>
        </div>

        <div className='space-y-6'>
          <div className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
            <h2 className='text-lg font-semibold text-gray-900'>
              {t.settings.platformSectionTitle}
            </h2>
            <PlatformSelector
              value={state.selectedPlatform}
              onChange={setPlatform}
              options={platformOptions}
              label={t.settings.platformSelection}
            />
          </div>

          <PlatformSettingsTable
            items={filteredItems}
            accessToken={accessToken}
            onEdit={openEdit}
            onError={showError}
            labels={{
              id: t.settings.table.id,
              name: t.settings.table.name,
              description: t.settings.table.description,
              multimediaPreview: t.settings.table.preview,
              status: t.settings.table.status,
              statusInitialized: t.settings.status.initialized,
              statusInProgress: t.settings.status.inProgress,
              statusActive: t.settings.status.active,
              statusInactive: t.settings.status.inactive,
              actions: t.settings.table.actions,
              edit: t.settings.table.edit,
              empty: t.settings.table.empty,
            }}
          />
          {state.listLoading && (
            <div className='text-xs text-gray-500'>Loading…</div>
          )}
          {state.listError && (
            <div className='text-xs text-red-600'>{state.listError}</div>
          )}

          <PlatformSettingsForm
            name={state.form.name}
            description={state.form.description}
            fileName={state.form.fileName}
            multimediaUuid={state.form.multimediaUuid}
            isUploading={isUploading}
            isSubmitting={state.createLoading}
            onNameChange={value => setForm({ name: value })}
            onDescriptionChange={value => setForm({ description: value })}
            onUploadFile={uploadMultimedia}
            onClearFile={() =>
              setForm({ multimediaUuid: null, fileName: null })
            }
            onSubmit={createSetting}
            onError={showError}
            labels={{
              title: t.settings.create.title,
              name: t.settings.create.name,
              description: t.settings.create.description,
              upload: t.settings.create.upload,
              uploadHelp: t.settings.create.uploadHelp,
              remove: t.settings.create.remove,
              submit: t.settings.create.submit,
              uploading: t.settings.create.uploading,
              fileSelected: t.settings.create.fileSelected,
              noFile: t.settings.create.noFile,
            }}
          />
        </div>
      </div>

      <PlatformSettingsModal
        isOpen={!!state.editItem}
        item={state.editItem}
        onClose={closeEdit}
        labels={{
          title: t.settings.edit.title,
          name: t.settings.edit.name,
          description: t.settings.edit.description,
          status: t.settings.edit.status,
          platform: t.settings.edit.platform,
          close: t.settings.edit.close,
          note: t.settings.edit.note,
        }}
      />
    </div>
  );
};

export default SettingsPage;
