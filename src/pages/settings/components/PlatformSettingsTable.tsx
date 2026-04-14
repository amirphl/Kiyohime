import React from 'react';
import Button from '../../../components/ui/Button';
import { PlatformSettingsItem } from '../../../types/platformSettings';
import MediaPreviewCell from './MediaPreviewCell';

interface PlatformSettingsTableProps {
  items: PlatformSettingsItem[];
  accessToken: string | null;
  onEdit: (item: PlatformSettingsItem) => void;
  onError: (message: string) => void;
  labels: {
    id: string;
    name: string;
    description: string;
    multimediaPreview: string;
    status: string;
    actions: string;
    edit: string;
    empty: string;
    statusInitialized: string;
    statusInProgress: string;
    statusActive: string;
    statusInactive: string;
  };
}

const PlatformSettingsTable: React.FC<PlatformSettingsTableProps> = ({
  items,
  accessToken,
  onEdit,
  onError,
  labels,
}) => {
  const statusLabel = (status: PlatformSettingsItem['status']) => {
    switch (status) {
      case 'initialized':
        return labels.statusInitialized;
      case 'in-progress':
        return labels.statusInProgress;
      case 'active':
        return labels.statusActive;
      case 'inactive':
        return labels.statusInactive;
      default:
        return status;
    }
  };

  if (!items.length) {
    return (
      <div className='text-sm text-gray-600 bg-white border border-gray-200 rounded-lg p-6'>
        {labels.empty}
      </div>
    );
  }

  return (
    <div className='overflow-x-auto bg-white border border-gray-200 rounded-lg'>
      <table className='min-w-full divide-y divide-gray-200 text-sm'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>{labels.id}</th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>{labels.name}</th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>{labels.description}</th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>{labels.multimediaPreview}</th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>{labels.status}</th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>{labels.actions}</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td className='px-4 py-3 text-gray-700 text-center'>{index + 1}</td>
              <td className='px-4 py-3 text-gray-700 text-center'>{item.name || '—'}</td>
              <td className='px-4 py-3 text-gray-700 text-center max-w-md'>
                <div className='line-clamp-2'>{item.description || '—'}</div>
              </td>
              <td className='px-4 py-3 text-center'>
                <MediaPreviewCell
                  uuid={item.multimedia_uuid}
                  accessToken={accessToken}
                  onError={onError}
                />
              </td>
              <td className='px-4 py-3 text-gray-700 text-center'>{statusLabel(item.status)}</td>
              <td className='px-4 py-3 text-center'>
                <Button variant='outline' size='sm' onClick={() => onEdit(item)}>
                  {labels.edit}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlatformSettingsTable;
