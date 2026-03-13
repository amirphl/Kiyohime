import React from 'react';
import { AdminCustomerManagementCopy } from '../translations';

interface FiltersBarProps {
  start: string;
  end: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onApply: () => void;
  loading: boolean;
  copy: AdminCustomerManagementCopy;
}

const FiltersBar: React.FC<FiltersBarProps> = ({
  start,
  end,
  onStartChange,
  onEndChange,
  onApply,
  loading,
  copy,
}) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{copy.title}</h1>
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {copy.filters.startDate}
          </label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => onStartChange(e.target.value)}
            className="w-full min-w-[220px] rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {copy.filters.endDate}
          </label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => onEndChange(e.target.value)}
            className="w-full min-w-[220px] rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button
          className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-60"
          onClick={onApply}
          disabled={loading}
        >
          {loading ? copy.common.loading : copy.filters.apply}
        </button>
      </div>
    </div>
  </div>
);

export default FiltersBar;
