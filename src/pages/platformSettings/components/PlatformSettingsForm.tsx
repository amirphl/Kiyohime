import React, { useRef } from 'react';
import Button from '../../../components/ui/Button';

interface PlatformSettingsFormProps {
  name: string;
  description: string;
  website: string;
  fileName: string | null;
  multimediaUuid: string | null;
  businessLicenseFileName: string | null;
  businessLicenseUuid: string | null;
  isUploading: boolean;
  isBusinessLicenseUploading: boolean;
  isSubmitting: boolean;
  labels: {
    title: string;
    name: string;
    description: string;
    website: string;
    upload: string;
    uploadHelp: string;
    businessLicense: string;
    businessLicenseHelp: string;
    remove: string;
    submit: string;
    uploading: string;
    fileSelected: string;
    noFile: string;
    validation: {
      nameRequired: string;
      descriptionRequired: string;
      multimediaRequired: string;
      invalidFileType: string;
      fileTooLarge: string;
    };
  };
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onWebsiteChange: (value: string) => void;
  onUploadFile: (file: File) => void;
  onClearFile: () => void;
  onUploadBusinessLicense: (file: File) => void;
  onClearBusinessLicense: () => void;
  onSubmit: () => void;
  onError: (message: string) => void;
}

const MULTIMEDIA_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-matroska',
];

const BUSINESS_LICENSE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
];

const MAX_FILE_BYTES = 100 * 1024 * 1024;

interface FileUploadRowProps {
  inputRef: React.RefObject<HTMLInputElement>;
  accept: string;
  fileName: string | null;
  isUploading: boolean;
  labels: {
    upload: string;
    uploading: string;
    fileSelected: string;
    noFile: string;
    remove: string;
  };
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

const FileUploadRow: React.FC<FileUploadRowProps> = ({
  inputRef,
  accept,
  fileName,
  isUploading,
  labels,
  onFileChange,
  onClear,
}) => (
  <div className='flex flex-wrap items-center gap-3'>
    <input
      ref={inputRef}
      type='file'
      accept={accept}
      className='hidden'
      onChange={onFileChange}
    />
    <Button
      variant='outline'
      size='sm'
      onClick={() => inputRef.current?.click()}
      disabled={isUploading}
    >
      {isUploading ? labels.uploading : labels.upload}
    </Button>
    <span className='text-sm text-gray-600'>
      {fileName ? `${labels.fileSelected}: ${fileName}` : labels.noFile}
    </span>
    {fileName && (
      <Button variant='ghost' size='sm' onClick={onClear}>
        {labels.remove}
      </Button>
    )}
  </div>
);

const PlatformSettingsForm: React.FC<PlatformSettingsFormProps> = ({
  name,
  description,
  website,
  fileName,
  multimediaUuid,
  businessLicenseFileName,
  businessLicenseUuid,
  isUploading,
  isBusinessLicenseUploading,
  isSubmitting,
  labels,
  onNameChange,
  onDescriptionChange,
  onWebsiteChange,
  onUploadFile,
  onClearFile,
  onUploadBusinessLicense,
  onClearBusinessLicense,
  onSubmit,
  onError,
}) => {
  const multimediaInputRef = useRef<HTMLInputElement>(null);
  const businessLicenseInputRef = useRef<HTMLInputElement>(null);

  const makeFileChangeHandler =
    (allowedTypes: string[], onUpload: (file: File) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!allowedTypes.includes(file.type)) {
        onError(labels.validation.invalidFileType);
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        onError(labels.validation.fileTooLarge);
        return;
      }
      onUpload(file);
      event.target.value = '';
    };

  const handleSubmit = () => {
    if (!name.trim()) {
      onError(labels.validation.nameRequired);
      return;
    }
    if (!description.trim()) {
      onError(labels.validation.descriptionRequired);
      return;
    }
    if (!multimediaUuid) {
      onError(labels.validation.multimediaRequired);
      return;
    }
    onSubmit();
  };

  const uploadLabels = {
    upload: labels.upload,
    uploading: labels.uploading,
    fileSelected: labels.fileSelected,
    noFile: labels.noFile,
    remove: labels.remove,
  };

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
      <div className='text-lg font-medium text-gray-900'>{labels.title}</div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {labels.name}
        </label>
        <input
          type='text'
          value={name}
          onChange={e => onNameChange(e.target.value)}
          required
          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500'
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {labels.description}
        </label>
        <textarea
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          rows={4}
          required
          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500'
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {labels.website}
        </label>
        <input
          type='url'
          value={website}
          onChange={e => onWebsiteChange(e.target.value)}
          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500'
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {labels.upload}
        </label>
        <FileUploadRow
          inputRef={multimediaInputRef}
          accept='image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm,video/x-matroska'
          fileName={fileName}
          isUploading={isUploading}
          labels={uploadLabels}
          onFileChange={makeFileChangeHandler(MULTIMEDIA_TYPES, onUploadFile)}
          onClear={onClearFile}
        />
        <p className='text-xs text-gray-500'>{labels.uploadHelp}</p>
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {labels.businessLicense}
        </label>
        <FileUploadRow
          inputRef={businessLicenseInputRef}
          accept='image/jpeg,image/png,image/gif,image/webp,application/pdf'
          fileName={businessLicenseFileName}
          isUploading={isBusinessLicenseUploading}
          labels={{ ...uploadLabels, upload: labels.businessLicense }}
          onFileChange={makeFileChangeHandler(
            BUSINESS_LICENSE_TYPES,
            onUploadBusinessLicense
          )}
          onClear={onClearBusinessLicense}
        />
        <p className='text-xs text-gray-500'>{labels.businessLicenseHelp}</p>
      </div>

      <div>
        <Button
          variant='primary'
          onClick={handleSubmit}
          disabled={isSubmitting || isUploading || isBusinessLicenseUploading}
          loading={isSubmitting}
        >
          {labels.submit}
        </Button>
      </div>
    </div>
  );
};

export default PlatformSettingsForm;
