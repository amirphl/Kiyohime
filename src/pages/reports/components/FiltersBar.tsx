import React from 'react';
import { ReportsCopy } from '../translations';

type OrderBy = 'newest' | 'oldest';

interface FiltersBarProps {
  titleInput: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  orderBy: OrderBy;
  onOrderChange: (order: OrderBy) => void;
  copy: ReportsCopy;
}

const FiltersBar: React.FC<FiltersBarProps> = ({
  titleInput,
  onTitleChange,
  orderBy,
  onOrderChange,
  copy,
}) => (
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{copy.title}</h1>
      <p className="text-sm text-gray-500">
        {copy.sortBy} {orderBy === 'newest' ? copy.sortNewest : copy.sortOldest}
      </p>
    </div>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <input
        type="text"
        value={titleInput}
        onChange={onTitleChange}
        placeholder={copy.filterPlaceholder}
        className="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-w-[220px]"
      />
      <div className="inline-flex rounded-lg shadow-sm border border-gray-200 overflow-hidden bg-white">
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
);

export default FiltersBar;
