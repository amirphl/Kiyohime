import React from 'react';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { AdminLineNumberFormValues } from '../types';
import { AdminLineNumbersCopy } from '../translations';
import { formatBooleanLabel, getDisplayValue } from '../utils';

interface CreateLineNumberModalProps {
  copy: AdminLineNumbersCopy;
  values: AdminLineNumberFormValues;
  formError: string | null;
  isOpen: boolean;
  isConfirmOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onCloseConfirm: () => void;
  onSubmit: () => void;
  onConfirm: () => void;
  onChange: <TKey extends keyof AdminLineNumberFormValues>(
    key: TKey,
    value: AdminLineNumberFormValues[TKey]
  ) => void;
}

const CreateLineNumberModal: React.FC<CreateLineNumberModalProps> = ({
  copy,
  values,
  formError,
  isOpen,
  isConfirmOpen,
  isSubmitting,
  onClose,
  onCloseConfirm,
  onSubmit,
  onConfirm,
  onChange,
}) => (
  <>
    {isOpen && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
        <div className='w-full max-w-lg rounded-lg bg-white shadow-xl'>
          <div className='flex items-center justify-between border-b border-gray-100 px-6 py-4'>
            <h2 className='text-lg font-semibold text-gray-900'>
              {copy.form.title}
            </h2>
            <button
              type='button'
              className='text-gray-400 transition-colors hover:text-gray-600'
              onClick={onClose}
              disabled={isSubmitting}
            >
              {copy.common.close}
            </button>
          </div>

          <div className='space-y-4 px-6 py-5'>
            {formError ? (
              <div className='rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
                {formError}
              </div>
            ) : null}

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                {copy.form.fields.name}
              </label>
              <input
                className='w-full rounded border border-gray-300 px-3 py-2'
                value={values.name}
                onChange={event => onChange('name', event.target.value)}
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                {copy.form.fields.lineNumber}
              </label>
              <input
                className='w-full rounded border border-gray-300 px-3 py-2'
                value={values.lineNumber}
                onChange={event => onChange('lineNumber', event.target.value)}
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                {copy.form.fields.priceFactor}
              </label>
              <input
                type='number'
                step='0.01'
                className='w-full rounded border border-gray-300 px-3 py-2'
                value={values.priceFactor}
                onChange={event => onChange('priceFactor', event.target.value)}
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                {copy.form.fields.priority}
              </label>
              <input
                type='number'
                className='w-full rounded border border-gray-300 px-3 py-2'
                value={values.priority}
                onChange={event => onChange('priority', event.target.value)}
              />
            </div>

            <label className='flex items-center gap-2 text-sm text-gray-700'>
              <input
                type='checkbox'
                checked={values.isActive}
                onChange={event => onChange('isActive', event.target.checked)}
              />
              {copy.form.fields.active}
            </label>
          </div>

          <div className='flex justify-end gap-2 border-t border-gray-100 px-6 py-4'>
            <button
              type='button'
              className='rounded border border-gray-300 px-4 py-2 text-gray-700'
              onClick={onClose}
              disabled={isSubmitting}
            >
              {copy.common.cancel}
            </button>
            <button
              type='button'
              className='rounded bg-blue-600 px-4 py-2 text-white'
              onClick={onSubmit}
            >
              {copy.common.submit}
            </button>
          </div>
        </div>
      </div>
    )}

    <ConfirmationModal
      isOpen={isConfirmOpen}
      onConfirm={onConfirm}
      onCancel={onCloseConfirm}
      title={copy.confirm.title}
      confirmText={isSubmitting ? copy.common.loading : copy.common.confirm}
      cancelText={copy.common.cancel}
      loading={isSubmitting}
    >
      <div className='space-y-3 text-sm text-gray-700'>
        <p>{copy.confirm.summary}</p>
        <div>
          <strong>{copy.confirm.fields.name}: </strong>
          {getDisplayValue(values.name.trim(), copy.common.empty)}
        </div>
        <div>
          <strong>{copy.confirm.fields.lineNumber}: </strong>
          {getDisplayValue(values.lineNumber.trim(), copy.common.empty)}
        </div>
        <div>
          <strong>{copy.confirm.fields.priceFactor}: </strong>
          {getDisplayValue(values.priceFactor.trim(), copy.common.empty)}
        </div>
        <div>
          <strong>{copy.confirm.fields.priority}: </strong>
          {getDisplayValue(values.priority.trim(), copy.common.empty)}
        </div>
        <div>
          <strong>{copy.confirm.fields.active}: </strong>
          {formatBooleanLabel(values.isActive, copy)}
        </div>
      </div>
    </ConfirmationModal>
  </>
);

export default CreateLineNumberModal;
