import React from 'react';
import { AdminGetCampaignResponse } from '../../../types/admin';
import { AdminCampaignManagementCopy } from '../translations';

interface CampaignsTableProps {
  items: AdminGetCampaignResponse[];
  loading: boolean;
  error: string | null;
  copy: AdminCampaignManagementCopy;
  formatDateTime: (value?: string | null) => string;
  canApproveOrReject: (status?: string | null) => boolean;
  canCancel: (status?: string | null) => boolean;
  isActionSubmitting: boolean;
  onApprove: (campaign: AdminGetCampaignResponse) => void;
  onReject: (campaign: AdminGetCampaignResponse) => void;
  onCancel: (campaign: AdminGetCampaignResponse) => void;
}

const CampaignsTable: React.FC<CampaignsTableProps> = ({
  items,
  loading,
  error,
  copy,
  formatDateTime,
  canApproveOrReject,
  canCancel,
  isActionSubmitting,
  onApprove,
  onReject,
  onCancel,
}) => (
  <div className="overflow-auto">
    <table className="min-w-full border text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="border px-2 py-2">{copy.table.headers.row}</th>
          <th className="border px-2 py-2">{copy.table.headers.status}</th>
          <th className="border px-2 py-2">{copy.table.headers.platform}</th>
          <th className="border px-2 py-2">{copy.table.headers.createdAt}</th>
          <th className="border px-2 py-2">{copy.table.headers.updatedAt}</th>
          <th className="border px-2 py-2">{copy.table.headers.title}</th>
          <th className="border px-2 py-2">{copy.table.headers.segment}</th>
          <th className="border px-2 py-2">{copy.table.headers.subsegment}</th>
          <th className="border px-2 py-2">{copy.table.headers.sex}</th>
          <th className="border px-2 py-2">{copy.table.headers.city}</th>
          <th className="border px-2 py-2">{copy.table.headers.adLink}</th>
          <th className="border px-2 py-2">{copy.table.headers.content}</th>
          <th className="border px-2 py-2">{copy.table.headers.scheduleAt}</th>
          <th className="border px-2 py-2">{copy.table.headers.lineNumber}</th>
          <th className="border px-2 py-2">{copy.table.headers.budget}</th>
          <th className="border px-2 py-2">{copy.table.headers.comment}</th>
          <th className="border px-2 py-2">{copy.table.headers.actions}</th>
        </tr>
      </thead>
      <tbody>
        {!loading && error ? (
          <tr>
            <td colSpan={17} className="text-center py-6 text-red-600">
              {error}
            </td>
          </tr>
        ) : items.length === 0 && !loading ? (
          <tr>
            <td colSpan={17} className="text-center py-6">
              {copy.table.noData}
            </td>
          </tr>
        ) : (
          items.map((item, index) => (
            <tr key={item.uuid} className="odd:bg-white even:bg-gray-50">
              <td className="border px-2 py-2 text-center">{index + 1}</td>
              <td className="border px-2 py-2">{item.status}</td>
              <td className="border px-2 py-2">{item.platform || ''}</td>
              <td className="border px-2 py-2">{formatDateTime(item.created_at)}</td>
              <td className="border px-2 py-2">{formatDateTime(item.updated_at)}</td>
              <td className="border px-2 py-2 max-w-[220px] truncate" title={item.title || ''}>
                {item.title || ''}
              </td>
              <td className="border px-2 py-2 max-w-[220px] truncate" title={item.level1 || ''}>
                {item.level1 || ''}
              </td>
              <td
                className="border px-2 py-2 max-w-[220px] truncate"
                title={Array.isArray(item.level2s) ? item.level2s.join(', ') : ''}
              >
                {Array.isArray(item.level2s) ? item.level2s.join(', ') : ''}
              </td>
              <td className="border px-2 py-2">{item.sex || ''}</td>
              <td className="border px-2 py-2">{Array.isArray(item.city) ? item.city.join(', ') : ''}</td>
              <td className="border px-2 py-2 max-w-[220px] truncate" title={item.adlink || ''}>
                {item.adlink || ''}
              </td>
              <td className="border px-2 py-2 max-w-[220px] truncate" title={item.content || ''}>
                {item.content || ''}
              </td>
              <td className="border px-2 py-2">{formatDateTime(item.scheduleat)}</td>
              <td className="border px-2 py-2">{item.line_number || ''}</td>
              <td className="border px-2 py-2">
                {typeof item.budget === 'number' ? item.budget.toLocaleString() : ''}
              </td>
              <td className="border px-2 py-2 max-w-[220px] truncate" title={item.comment || ''}>
                {item.comment || ''}
              </td>
              <td className="border px-2 py-2 whitespace-nowrap">
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-60"
                    onClick={() => onApprove(item)}
                    disabled={isActionSubmitting || !canApproveOrReject(item.status)}
                  >
                    {copy.table.actions.approve}
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-60"
                    onClick={() => onReject(item)}
                    disabled={isActionSubmitting || !canApproveOrReject(item.status)}
                  >
                    {copy.table.actions.reject}
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-amber-600 text-white disabled:opacity-60"
                    onClick={() => onCancel(item)}
                    disabled={isActionSubmitting || !canCancel(item.status)}
                  >
                    {copy.table.actions.cancel}
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default CampaignsTable;
