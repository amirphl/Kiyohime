import React, { useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { PlatformKey } from '../types/platformSettings';
import { usePlatformSettings } from './platformSettings/usePlatformSettings';
import PlatformSelector from './platformSettings/components/PlatformSelector';
import PlatformSettingsTable from './platformSettings/components/PlatformSettingsTable';
import PlatformSettingsForm from './platformSettings/components/PlatformSettingsForm';
import PlatformSettingsModal from './platformSettings/components/PlatformSettingsModal';
import { settingsTranslations } from './platformSettings/translations';
import { config } from '../config/environment';
import { consumeSettingsPlatformIntent } from '../utils/platformSettingsNavigation';

const PlatformSettingsPage: React.FC = () => {
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
    uploadBusinessLicense,
    isBusinessLicenseUploading,
    openEdit,
    closeEdit,
  } = usePlatformSettings(accessToken, {
    createSuccessToast: t.settings.create.successToast,
    errorCodes: t.settings.errorCodes,
    validation: t.settings.validation,
  });

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

  useEffect(() => {
    if (!config.features.autoSelectMissingPlatformSettings) return;
    const platformIntent = consumeSettingsPlatformIntent();
    if (!platformIntent || platformIntent === state.selectedPlatform) return;
    setPlatform(platformIntent);
  }, [setPlatform, state.selectedPlatform]);

  return (
    <div className='p-8'>
      <div className='max-w-6xl mx-auto space-y-8'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-bold text-gray-900'>
            {t.settings.title}
          </h1>
          <p className='text-sm text-gray-600'>{t.settings.subtitle}</p>
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
              website: t.settings.table.website,
              multimediaPreview: t.settings.table.preview,
              download: t.settings.table.download,
              downloading: t.settings.table.downloading,
              downloadFailed: t.settings.table.downloadFailed,
              businessLicense: t.settings.table.businessLicense,
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
            website={state.form.website}
            fileName={state.form.fileName}
            multimediaUuid={state.form.multimediaUuid}
            businessLicenseFileName={state.form.businessLicenseFileName}
            businessLicenseUuid={state.form.businessLicenseUuid}
            isUploading={isUploading}
            isBusinessLicenseUploading={isBusinessLicenseUploading}
            isSubmitting={state.createLoading}
            onNameChange={value => setForm({ name: value })}
            onDescriptionChange={value => setForm({ description: value })}
            onWebsiteChange={value => setForm({ website: value })}
            onUploadFile={uploadMultimedia}
            onClearFile={() =>
              setForm({ multimediaUuid: null, fileName: null })
            }
            onUploadBusinessLicense={uploadBusinessLicense}
            onClearBusinessLicense={() =>
              setForm({
                businessLicenseUuid: null,
                businessLicenseFileName: null,
              })
            }
            onSubmit={createSetting}
            onError={showError}
            labels={{
              title: t.settings.create.title,
              name: t.settings.create.name,
              description: t.settings.create.description,
              website: t.settings.create.website,
              upload: t.settings.create.upload,
              uploadHelp: t.settings.create.uploadHelp,
              businessLicense: t.settings.create.businessLicense,
              businessLicenseHelp: t.settings.create.businessLicenseHelp,
              remove: t.settings.create.remove,
              submit: t.settings.create.submit,
              uploading: t.settings.create.uploading,
              fileSelected: t.settings.create.fileSelected,
              noFile: t.settings.create.noFile,
              validation: {
                nameRequired: t.settings.validation.nameRequired,
                descriptionRequired: t.settings.validation.descriptionRequired,
                multimediaRequired: t.settings.validation.multimediaRequired,
                invalidFileType: t.settings.validation.invalidFileType,
                fileTooLarge: t.settings.validation.fileTooLarge,
              },
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
          website: t.settings.edit.website,
          businessLicense: t.settings.edit.businessLicense,
          status: t.settings.edit.status,
          platform: t.settings.edit.platform,
          close: t.settings.edit.close,
          note: t.settings.edit.note,
        }}
      />
    </div>
  );
};

export default PlatformSettingsPage;
