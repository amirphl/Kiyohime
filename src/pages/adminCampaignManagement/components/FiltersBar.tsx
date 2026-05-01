import React from 'react';
import { AdminListCampaignsFilter } from '../../../types/admin';
import { AdminCampaignManagementCopy } from '../translations';

interface StatusOption {
  value: AdminListCampaignsFilter['status'] | '';
  label: string;
}

interface AdminCampaignFiltersBarProps {
  title: string;
  status: AdminListCampaignsFilter['status'];
  start: string;
  end: string;
  loading: boolean;
  copy: AdminCampaignManagementCopy;
  statusOptions: StatusOption[];
  onTitleChange: (value: string) => void;
  onStatusChange: (value: AdminListCampaignsFilter['status']) => void;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onApply: () => void;
}

const FiltersBar: React.FC<AdminCampaignFiltersBarProps> = ({
  title,
  status,
  start,
  end,
  loading,
  copy,
  statusOptions,
  onTitleChange,
  onStatusChange,
  onStartChange,
  onEndChange,
  onApply,
}) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium mb-1">{copy.filters.titleLabel}</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder={copy.filters.titlePlaceholder}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{copy.filters.statusLabel}</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={status || ''}
          onChange={(e) => onStatusChange((e.target.value || undefined) as AdminListCampaignsFilter['status'])}
        >
          {statusOptions.map((opt) => (
            <option key={opt.label} value={opt.value || ''}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{copy.filters.startDateLabel}</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => onStartChange(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{copy.filters.endDateLabel}</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => onEndChange(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
    </div>

    <div className="mb-6">
      <button
        onClick={onApply}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? copy.common.loading : copy.filters.apply}
      </button>
    </div>
  </>
);

export default FiltersBar;
