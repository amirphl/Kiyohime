import React, { useRef } from 'react';
import Button from '../../../components/ui/Button';

interface PlatformSettingsFormProps {
  name: string;
  description: string;
  fileName: string | null;
  multimediaUuid: string | null;
  isUploading: boolean;
  isSubmitting: boolean;
  labels: {
    title: string;
    name: string;
    description: string;
    upload: string;
    uploadHelp: string;
    remove: string;
    submit: string;
    uploading: string;
    fileSelected: string;
    noFile: string;
  };
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onUploadFile: (file: File) => void;
  onClearFile: () => void;
  onSubmit: () => void;
  onError: (message: string) => void;
}

const PlatformSettingsForm: React.FC<PlatformSettingsFormProps> = ({
  name,
  description,
  fileName,
  multimediaUuid,
  isUploading,
  isSubmitting,
  labels,
  onNameChange,
  onDescriptionChange,
  onUploadFile,
  onClearFile,
  onSubmit,
  onError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/x-matroska',
  ];
  const maxBytes = 100 * 1024 * 1024;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!allowedTypes.includes(file.type)) {
      onError('Invalid file type');
      return;
    }
    if (file.size > maxBytes) {
      onError('File is too large (max 100MB)');
      return;
    }
    onUploadFile(file);
    event.target.value = '';
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      onError('Name is required');
      return;
    }
    if (!description.trim()) {
      onError('Description is required');
      return;
    }
    if (!multimediaUuid) {
      onError('Multimedia is required');
      return;
    }
    onSubmit();
  };

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
      <div className='text-lg font-medium text-gray-900'>{labels.title}</div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>{labels.name}</label>
        <input
          type='text'
          value={name}
          onChange={e => onNameChange(e.target.value)}
          required
          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500'
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>{labels.description}</label>
        <textarea
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          rows={4}
          required
          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500'
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>{labels.upload}</label>
        <div className='flex flex-wrap items-center gap-3'>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm,video/x-matroska'
            className='hidden'
            onChange={handleFileChange}
          />
          <Button
            variant='outline'
            size='sm'
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? labels.uploading : labels.upload}
          </Button>
          <span className='text-sm text-gray-600'>
            {fileName ? `${labels.fileSelected}: ${fileName}` : labels.noFile}
          </span>
          {fileName && (
            <Button variant='ghost' size='sm' onClick={onClearFile}>
              {labels.remove}
            </Button>
          )}
        </div>
        <p className='text-xs text-gray-500'>{labels.uploadHelp}</p>
      </div>

      <div>
        <Button
          variant='primary'
          onClick={handleSubmit}
          disabled={isSubmitting || isUploading}
          loading={isSubmitting}
        >
          {labels.submit}
        </Button>
      </div>
    </div>
  );
};

export default PlatformSettingsForm;
