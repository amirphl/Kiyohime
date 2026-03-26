import React from 'react';
import { GetSMSCampaignResponse } from '../../../types/campaign';
import { ReportsCopy } from '../translations';
import { useCancelCampaign } from '../hooks/useCancelCampaign';

interface CampaignsTableProps {
  items: GetSMSCampaignResponse[];
  copy: ReportsCopy;
  formatDateTime: (iso?: string) => string;
  onDetails: (campaign: GetSMSCampaignResponse) => void;
  truncateText: (text: string, max?: number) => string;
}

const CampaignsTable: React.FC<CampaignsTableProps> = ({
  items,
  copy,
  formatDateTime,
  onDetails,
  truncateText,
}) => {
  const statusLabel = (status: string) => copy.statuses[status] || status;
  const { cancelCampaign, cancelling, cancelled } = useCancelCampaign(copy);

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
      <div className='p-6'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {copy.table.row}
                </th>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {copy.table.title}
                </th>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {copy.table.lineNumber}
                </th>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {copy.table.segment}
                </th>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {copy.table.numAudience}
                </th>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {copy.table.sent}
                </th>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {copy.table.status}
                </th>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {copy.table.createdAt}
                </th>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {copy.table.scheduleAt}
                </th>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {copy.table.actions}
                </th>
                <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {copy.table.details}
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {items.map((c, idx) => (
                <tr key={c.uuid}>
                  <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                    {idx + 1}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-700 text-center'>
                    {truncateText(c.title || '')}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                    {c.line_number || '-'}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                    {Array.isArray(c.level3s) ? c.level3s.join(', ') : c.level3s || '-'}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-500 text-center'>
                    {c.num_audience || '-'}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-500 text-center'>
                    {c.statistics?.totalSent || '-'}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                    {statusLabel(c.status)}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                    {formatDateTime(c.created_at)}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                    {formatDateTime(c.scheduleat)}
                  </td>
                  <td className='px-4 py-2 text-center text-sm text-gray-900'>
                    {c.status === 'waiting-for-approval' && c.id ? (
                      <button
                        onClick={() => cancelCampaign(c)}
                        disabled={cancelling[c.id] || cancelled[c.id]}
                        className='px-3 py-1 text-sm rounded bg-amber-600 text-white shadow-sm hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition'
                      >
                        {cancelled[c.id]
                          ? copy.modal.cancelled
                          : cancelling[c.id]
                            ? copy.modal.cancelling
                            : copy.modal.cancel}
                      </button>
                    ) : (
                      <span className='text-gray-400'>-</span>
                    )}
                  </td>
                  <td className='px-4 py-2 text-center'>
                    <button
                      onClick={() => onDetails(c)}
                      className='px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 shadow-sm'
                    >
                      {copy.table.details}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignsTable;
