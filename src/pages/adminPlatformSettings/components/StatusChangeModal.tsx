import React from 'react';
import { AdminPlatformSettingsCopy } from '../translations';
import { AdminPlatformSettingsItem } from '../../../types/admin';

interface StatusChangeModalProps {
  isOpen: boolean;
  item: AdminPlatformSettingsItem | null;
  value: 'in-progress' | 'active' | 'inactive' | '';
  onValueChange: (value: 'in-progress' | 'active' | 'inactive' | '') => void;
  submitting: boolean;
  copy: AdminPlatformSettingsCopy;
  onClose: () => void;
  onConfirm: () => void;
  statusLabel: (status: string) => string;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  item,
  value,
  onValueChange,
  submitting,
  copy,
  onClose,
  onConfirm,
  statusLabel,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
      <div className='w-full max-w-md rounded-lg border bg-white p-4 shadow-lg'>
        <h2 className='text-lg font-semibold'>{copy.modal.title}</h2>
        <div className='mt-4 space-y-3'>
          <div className='text-sm text-gray-700'>
            <span className='font-medium'>{copy.modal.currentStatus}: </span>
            <span>{statusLabel(item.status)}</span>
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              {copy.modal.nextStatus}
            </label>
            <select
              className='w-full rounded border px-3 py-2'
              value={value}
              onChange={e =>
                onValueChange(
                  (e.target.value || '') as
                    | 'in-progress'
                    | 'active'
                    | 'inactive'
                    | ''
                )
              }
              disabled={submitting}
            >
              <option value=''>{copy.modal.nextStatus}</option>
              <option value='in-progress'>
                {statusLabel('in-progress')}
              </option>
              <option value='active'>{statusLabel('active')}</option>
              <option value='inactive'>{statusLabel('inactive')}</option>
            </select>
            <p className='mt-1 text-xs text-gray-500'>{copy.modal.hint}</p>
          </div>
        </div>

        <div className='mt-5 flex items-center justify-end gap-2'>
          <button
            type='button'
            onClick={onClose}
            disabled={submitting}
            className='rounded border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-70'
          >
            {copy.actions.cancel}
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={submitting}
            className='rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-70'
          >
            {submitting ? copy.common.loading : copy.actions.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeModal;
