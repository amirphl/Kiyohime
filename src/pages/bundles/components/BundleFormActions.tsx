import React from 'react';
import Button from '../../../components/ui/Button';
import { BundlesCopy } from '../translations';

interface BundleFormActionsProps {
  copy: BundlesCopy;
  submitting: boolean;
  mode: 'create' | 'update';
  onCancel: () => void;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}

const BundleFormActions: React.FC<BundleFormActionsProps> = ({
  copy,
  submitting,
  mode,
  onCancel,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  return (
    <section className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6'>
      <div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <Button variant='outline' onClick={onCancel}>
          {copy.createPage.actions.cancel}
        </Button>

        <div className='flex flex-col gap-3 sm:flex-row'>
          {mode === 'create' && onSecondaryAction ? (
            <Button
              variant='outline'
              onClick={onSecondaryAction}
              disabled={submitting}
            >
              {copy.createPage.actions.saveAndCreateCampaign}
            </Button>
          ) : null}
          <Button onClick={onPrimaryAction} loading={submitting}>
            {mode === 'update'
              ? submitting
                ? copy.createPage.actions.updating
                : copy.createPage.actions.update
              : submitting
                ? copy.createPage.actions.saving
                : copy.createPage.actions.save}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BundleFormActions;
