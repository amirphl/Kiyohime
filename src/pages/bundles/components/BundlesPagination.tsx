import React from 'react';
import Button from '../../../components/ui/Button';
import { BundlesCopy } from '../translations';

interface BundlesPaginationProps {
  copy: BundlesCopy;
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const BundlesPagination: React.FC<BundlesPaginationProps> = ({
  copy,
  page,
  limit,
  totalItems,
  totalPages,
  onPageChange,
  onLimitChange,
}) => {
  const from = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const to = totalItems === 0 ? 0 : Math.min(page * limit, totalItems);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(page - 3, 0), Math.max(page - 3, 0) + 5);

  return (
    <div className='flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
      <p className='text-sm text-gray-500'>
        {copy.pagination.showing
          .replace('{from}', String(from))
          .replace('{to}', String(to))
          .replace('{total}', String(totalItems))}
      </p>

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-600'>
            {copy.pagination.rowsPerPage}
          </span>
          <select
            value={limit}
            onChange={event => onLimitChange(Number(event.target.value))}
            className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700'
          >
            {PAGE_SIZE_OPTIONS.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            {copy.pagination.previous}
          </Button>

          <div className='flex items-center gap-2'>
            {pageNumbers.map(pageNumber => (
              <button
                key={pageNumber}
                type='button'
                onClick={() => onPageChange(pageNumber)}
                className={`min-w-10 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  pageNumber === page
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary-200 hover:text-primary-700'
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <Button
            variant='outline'
            size='sm'
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            {copy.pagination.next}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BundlesPagination;
