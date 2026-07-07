import React from 'react';
import { ReportsCopy } from '../translations';

interface BulkHideActionBarProps {
  copy: ReportsCopy;
  selectedCount: number;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const BulkHideActionBar: React.FC<BulkHideActionBarProps> = ({
  copy,
  selectedCount,
  isSubmitting,
  onSubmit,
}) => {
  const handleClick = () => {
    if (!window.confirm(copy.bulkHide.confirm(selectedCount))) return;
    onSubmit();
  };

  return (
    <div className='mt-6 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
      <div className='text-sm text-gray-700'>
        {copy.bulkHide.selectionCount(selectedCount)}
      </div>

      <button
        type='button'
        onClick={handleClick}
        disabled={isSubmitting || selectedCount === 0}
        className='inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300'
      >
        {isSubmitting ? copy.bulkHide.submitting : copy.bulkHide.button}
      </button>
    </div>
  );
};

export default BulkHideActionBar;
