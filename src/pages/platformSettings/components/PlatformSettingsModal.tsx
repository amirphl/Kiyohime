import React from 'react';
import Button from '../../../components/ui/Button';
import { PlatformSettingsItem } from '../../../types/platformSettings';

interface PlatformSettingsModalProps {
  isOpen: boolean;
  item: PlatformSettingsItem | null;
  onClose: () => void;
  labels: {
    title: string;
    name: string;
    description: string;
    website: string;
    businessLicense: string;
    status: string;
    platform: string;
    close: string;
    note: string;
  };
}

const PlatformSettingsModal: React.FC<PlatformSettingsModalProps> = ({
  isOpen,
  item,
  onClose,
  labels,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-lg rounded-lg bg-white shadow-xl'>
        <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            {labels.title}
          </h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600'
          >
            ×
          </button>
        </div>
        <div className='space-y-4 px-6 py-4'>
          <div className='text-sm text-gray-600'>{labels.note}</div>
          <div className='space-y-2'>
            <label className='text-xs font-medium text-gray-500'>
              {labels.platform}
            </label>
            <div className='rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700'>
              {item.platform}
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-xs font-medium text-gray-500'>
              {labels.name}
            </label>
            <div className='rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700'>
              {item.name || '—'}
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-xs font-medium text-gray-500'>
              {labels.description}
            </label>
            <div className='rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700'>
              {item.description || '—'}
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-xs font-medium text-gray-500'>
              {labels.website}
            </label>
            <div className='rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700'>
              {item.website ? (
                <a
                  href={item.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 underline break-all'
                >
                  {item.website}
                </a>
              ) : (
                '—'
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-xs font-medium text-gray-500'>
              {labels.businessLicense}
            </label>
            <div className='rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 break-all'>
              {item.business_license_uuid || '—'}
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-xs font-medium text-gray-500'>
              {labels.status}
            </label>
            <div className='rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700'>
              {item.status}
            </div>
          </div>
        </div>
        <div className='flex justify-end border-t border-gray-200 px-6 py-4'>
          <Button variant='outline' onClick={onClose}>
            {labels.close}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettingsModal;
