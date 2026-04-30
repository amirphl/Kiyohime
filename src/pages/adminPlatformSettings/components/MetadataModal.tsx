import React from 'react';
import { AdminPlatformSettingsItem } from '../../../types/admin';
import { AdminPlatformSettingsCopy } from '../translations';

interface MetadataModalProps {
  isOpen: boolean;
  item: AdminPlatformSettingsItem | null;
  copy: AdminPlatformSettingsCopy;
  onClose: () => void;
}

const MetadataModal: React.FC<MetadataModalProps> = ({
  isOpen,
  item,
  copy,
  onClose,
}) => {
  if (!isOpen || !item) return null;

  const entries = Object.entries(item.metadata || {});

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
      <div className='w-full max-w-lg rounded-lg border bg-white p-4 shadow-lg'>
        <h2 className='text-lg font-semibold'>{copy.modal.metadataTitle}</h2>
        <div className='mt-3 max-h-[60vh] overflow-auto rounded border'>
          {entries.length === 0 ? (
            <div className='px-3 py-4 text-sm text-gray-600'>
              {copy.modal.metadataEmpty}
            </div>
          ) : (
            <table className='min-w-full text-sm'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='border px-3 py-2 text-left'>
                    {copy.table.metadataKey}
                  </th>
                  <th className='border px-3 py-2 text-left'>
                    {copy.table.metadataValue}
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map(([key, value]) => (
                  <tr key={key}>
                    <td className='border px-3 py-2 font-mono text-xs'>
                      {key}
                    </td>
                    <td className='border px-3 py-2'>
                      <pre className='whitespace-pre-wrap break-words text-xs'>
                        {typeof value === 'string'
                          ? value
                          : JSON.stringify(value, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className='mt-4 flex justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='rounded border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'
          >
            {copy.actions.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetadataModal;
