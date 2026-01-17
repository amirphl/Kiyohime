import React from 'react';
import Button from '../../../components/ui/Button';
import { DiscountHistoryItem } from '../hooks/useDiscountHistory';
import { formatDatetime } from '../utils';

interface HistoryModalProps {
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  items: DiscountHistoryItem[];
  onClose: () => void;
  language: string;
  copy: any;
  common: {
    close: string;
    loading: string;
  };
  noTransactionsLabel: string;
  createdAtLabel: string;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  loading,
  error,
  items,
  onClose,
  language,
  copy,
  common,
  noTransactionsLabel,
  createdAtLabel,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-2xl w-full p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h4 className='text-lg font-medium text-gray-900'>
            {copy.discountHistoryTitle}
          </h4>
          <Button variant='outline' onClick={onClose}>
            {common.close}
          </Button>
        </div>
        {loading ? (
          <div className='text-center text-gray-600 py-8'>
            {common.loading}
          </div>
        ) : error ? (
          <div className='text-center text-red-600 py-8'>{error}</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    #
                  </th>
                  <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    {copy.discountRate}
                  </th>
                  <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    {copy.totalSent}
                  </th>
                  <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    {copy.totalShare}
                  </th>
                  <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    {createdAtLabel}
                  </th>
                  <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    {copy.discountExpiresAt}
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-4 py-6 text-center text-gray-500'
                    >
                      {noTransactionsLabel}
                    </td>
                  </tr>
                ) : (
                  items.map((h, idx) => (
                    <tr key={`${idx}-${h.created_at}`}>
                      <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                        {idx + 1}
                      </td>
                      <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                        {h.discount_rate.toFixed(2)}
                      </td>
                      <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                        {h.total_sent.toLocaleString()}
                      </td>
                      <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                        {h.agency_share_with_tax.toLocaleString()}
                      </td>
                      <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                        {formatDatetime(h.created_at, language)}
                      </td>
                      <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                        {h.expires_at
                          ? formatDatetime(h.expires_at, language)
                          : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;
