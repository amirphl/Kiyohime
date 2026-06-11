import React, { useRef } from 'react';
import Button from '../../../components/ui/Button';
import { ROUTES } from '../../../config/routes';

interface PlatformSettingsFormProps {
  name: string;
  description: string;
  website: string;
  fileName: string | null;
  businessLicenseFileName: string | null;
  isUploading: boolean;
  isBusinessLicenseUploading: boolean;
  isSubmitting: boolean;
  isSubmitDisabled?: boolean;
  showTermsAcceptance?: boolean;
  isTermsAccepted?: boolean;
  labels: {
    title: string;
    name: string;
    description: string;
    descriptionHelp: string;
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
    terms: string;
    approvalRequired: string;
    acceptTermsPrefix: string;
    acceptTermsLink: string;
    acceptTermsPostfix: string;
    nameMaxReached: string;
    descriptionMaxReached: string;
    websiteMaxReached: string;
    validation: {
      nameRequired: string;
      descriptionRequired: string;
      descriptionTooLong: string;
      multimediaRequired: string;
      websiteRequired: string;
      websiteTooLong: string;
      businessLicenseRequired: string;
      invalidFileType: string;
      fileTooLarge: string;
      imageTooSmall: string;
    };
  };
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onWebsiteChange: (value: string) => void;
  onUploadFile: (file: File) => void;
  onClearFile: () => void;
  onUploadBusinessLicense: (file: File) => void;
  onClearBusinessLicense: () => void;
  onTermsAcceptedChange?: (checked: boolean) => void;
  onSubmit: () => Promise<void> | void;
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
const NAME_MAX_LENGTH = 255;
const DESCRIPTION_MAX_LENGTH = 512;
const WEBSITE_MAX_LENGTH = 512;
const MIN_IMAGE_WIDTH = 512;
const MIN_IMAGE_HEIGHT = 512;

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

const isImageFile = (file: File) => file.type.startsWith('image/');

const hasMinimumImageDimensions = (file: File) =>
  new Promise<boolean>(resolve => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const valid =
        image.naturalWidth >= MIN_IMAGE_WIDTH &&
        image.naturalHeight >= MIN_IMAGE_HEIGHT;
      URL.revokeObjectURL(objectUrl);
      resolve(valid);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(false);
    };

    image.src = objectUrl;
  });

const PlatformSettingsForm: React.FC<PlatformSettingsFormProps> = ({
  name,
  description,
  website,
  fileName,
  businessLicenseFileName,
  isUploading,
  isBusinessLicenseUploading,
  isSubmitting,
  isSubmitDisabled = false,
  showTermsAcceptance = false,
  isTermsAccepted = false,
  labels,
  onNameChange,
  onDescriptionChange,
  onWebsiteChange,
  onUploadFile,
  onClearFile,
  onUploadBusinessLicense,
  onClearBusinessLicense,
  onTermsAcceptedChange,
  onSubmit,
  onError,
}) => {
  const multimediaInputRef = useRef<HTMLInputElement>(null);
  const businessLicenseInputRef = useRef<HTMLInputElement>(null);

  const makeFileChangeHandler =
    (allowedTypes: string[], onUpload: (file: File) => void) =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!allowedTypes.includes(file.type)) {
        onError(labels.validation.invalidFileType);
        event.target.value = '';
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        onError(labels.validation.fileTooLarge);
        event.target.value = '';
        return;
      }
      if (isImageFile(file)) {
        const hasMinimumDimensions = await hasMinimumImageDimensions(file);
        if (!hasMinimumDimensions) {
          onError(labels.validation.imageTooSmall);
          event.target.value = '';
          return;
        }
      }
      onUpload(file);
      event.target.value = '';
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
          maxLength={NAME_MAX_LENGTH}
          required
          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500'
        />
        {name.length >= NAME_MAX_LENGTH && (
          <p className='text-xs text-amber-700'>{labels.nameMaxReached}</p>
        )}
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {labels.description}
        </label>
        <textarea
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          maxLength={DESCRIPTION_MAX_LENGTH}
          rows={4}
          required
          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500'
        />
        {description.length >= DESCRIPTION_MAX_LENGTH && (
          <p className='text-xs text-amber-700'>
            {labels.descriptionMaxReached}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {labels.website}
        </label>
        <input
          type='url'
          value={website}
          onChange={e => onWebsiteChange(e.target.value)}
          maxLength={WEBSITE_MAX_LENGTH}
          required
          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500'
        />
        {website.length >= WEBSITE_MAX_LENGTH && (
          <p className='text-xs text-amber-700'>{labels.websiteMaxReached}</p>
        )}
        <p className='text-xs text-gray-500'>{labels.descriptionHelp}</p>
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

      <div className='space-y-3'>
        {showTermsAcceptance && (
          <div className='space-y-2'>
            <div className='flex items-start gap-2'>
              <input
                id='acceptBaleTerms'
                type='checkbox'
                checked={isTermsAccepted}
                onChange={e => onTermsAcceptedChange?.(e.target.checked)}
                className='mt-1 h-4 w-4 rounded border-gray-300'
              />
              <label
                htmlFor='acceptBaleTerms'
                className='text-sm text-gray-700'
              >
                {labels.acceptTermsPrefix}{' '}
                <a
                  href={ROUTES.BALE_TERMS.path}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700 underline underline-offset-2'
                  onClick={event => event.stopPropagation()}
                >
                  {labels.acceptTermsLink}
                </a>
                {labels.acceptTermsPostfix
                  ? ` ${labels.acceptTermsPostfix}`
                  : ''}
              </label>
            </div>
            <p className='text-sm text-amber-700'>{labels.approvalRequired}</p>
          </div>
        )}

        <Button
          variant='primary'
          onClick={onSubmit}
          disabled={
            isSubmitDisabled ||
            isSubmitting ||
            isUploading ||
            isBusinessLicenseUploading
          }
          loading={isSubmitting}
        >
          {labels.submit}
        </Button>
      </div>
    </div>
  );
};

export default PlatformSettingsForm;
