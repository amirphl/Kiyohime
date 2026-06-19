import React from 'react';
import { ReportsCopy } from '../translations';
import { useBundles } from '../../../components/campaign/content/useBundles';

type OrderBy = 'newest' | 'oldest';

interface FiltersBarProps {
  titleInput: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  orderBy: OrderBy;
  onOrderChange: (order: OrderBy) => void;
  bundleIdFilter: number | null;
  onBundleIdChange: (id: number | null) => void;
  phaseFilter: string;
  onPhaseChange: (phase: string) => void;
  accessToken: string | null;
  copy: ReportsCopy;
}

const FiltersBar: React.FC<FiltersBarProps> = ({
  titleInput,
  onTitleChange,
  orderBy,
  onOrderChange,
  bundleIdFilter,
  onBundleIdChange,
  phaseFilter,
  onPhaseChange,
  accessToken,
  copy,
}) => {
  const { bundleOptions, isLoading: bundlesLoading } = useBundles(accessToken);

  const selectCls =
    'px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white';

  return (
    <div className='flex flex-col gap-3 mb-6'>
      {/* Top row: title + sort */}
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>{copy.title}</h1>
          <p className='text-sm text-gray-500'>
            {copy.sortBy}{' '}
            {orderBy === 'newest' ? copy.sortNewest : copy.sortOldest}
          </p>
        </div>
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
          <input
            type='text'
            value={titleInput}
            onChange={onTitleChange}
            placeholder={copy.filterPlaceholder}
            className={`${selectCls} min-w-[220px]`}
          />
          <div className='inline-flex rounded-lg shadow-sm border border-gray-200 overflow-hidden bg-white'>
            <button
              onClick={() => onOrderChange('newest')}
              className={`px-3 py-2 text-sm transition ${
                orderBy === 'newest'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {copy.sortNewest}
            </button>
            <button
              onClick={() => onOrderChange('oldest')}
              className={`px-3 py-2 text-sm border-l border-gray-200 transition ${
                orderBy === 'oldest'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {copy.sortOldest}
            </button>
          </div>
        </div>
      </div>

      {/* Second row: bundle + phase filters */}
      <div className='flex flex-col sm:flex-row gap-3'>
        <select
          value={bundleIdFilter ?? ''}
          onChange={e =>
            onBundleIdChange(e.target.value ? Number(e.target.value) : null)
          }
          className={`${selectCls} min-w-[200px]`}
          disabled={bundlesLoading}
        >
          <option value=''>
            {bundlesLoading ? copy.bundleLoading : copy.bundleAll}
          </option>
          {bundleOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={phaseFilter}
          onChange={e => onPhaseChange(e.target.value)}
          className={`${selectCls} min-w-[180px]`}
        >
          <option value=''>{copy.phaseAll}</option>
          <option value='execution'>{copy.phaseExecution}</option>
          <option value='test'>{copy.phaseTest}</option>
        </select>
      </div>
    </div>
  );
};

export default FiltersBar;
