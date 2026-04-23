import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import Card from '../../ui/Card';

interface TargetAudienceExcelFileUploadCardProps {
  label: string;
  help: string;
  uploadingLabel: string;
  uploadedLabel: string;
  removeLabel: string;
  fileName: string | null;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onClear: () => void;
}

const ACCEPTED_EXCEL_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const TargetAudienceExcelFileUploadCard: React.FC<
  TargetAudienceExcelFileUploadCardProps
> = ({
  label,
  help,
  uploadingLabel,
  uploadedLabel,
  removeLabel,
  fileName,
  isUploading,
  onUpload,
  onClear,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onUpload(file);
    event.target.value = '';
  };

  return (
    <Card>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900 flex items-center gap-1'>
          <FileSpreadsheet className='h-5 w-5 text-primary-600' />
          {label}
        </h3>

        <input
          type='file'
          accept='.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          onChange={handleFileChange}
          disabled={isUploading}
          className='block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100'
        />
        <p className='text-xs text-gray-500'>{help}</p>

        {isUploading && (
          <p className='text-sm text-gray-600'>{uploadingLabel}</p>
        )}

        {fileName && !isUploading && (
          <div className='flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2'>
            {/* <span className='text-sm text-gray-700 truncate'>{fileName}</span> */}
            <div className='flex items-center gap-3'>
              <span className='text-sm text-green-700'>{uploadedLabel}</span>
              <button
                type='button'
                onClick={onClear}
                className='text-sm text-red-600 hover:text-red-700'
              >
                {removeLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export const isTargetAudienceExcelFile = (file: File): boolean => {
  const lowerName = file.name.toLowerCase();
  return (
    ACCEPTED_EXCEL_TYPES.includes(file.type) ||
    lowerName.endsWith('.xls') ||
    lowerName.endsWith('.xlsx')
  );
};

export default TargetAudienceExcelFileUploadCard;
