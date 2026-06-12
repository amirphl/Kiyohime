import React from 'react';
import { AdminSegmentPriceFactorItem } from '../../../types/admin';
import { SegmentPriceFactorTranslations } from '../translations';

interface SegmentPriceFactorsTableProps {
  items: AdminSegmentPriceFactorItem[];
  loading: boolean;
  error: string | null;
  copy: SegmentPriceFactorTranslations;
  formatDateTime: (value?: string | null) => string;
  isRTL: boolean;
}

const SegmentPriceFactorsTable: React.FC<SegmentPriceFactorsTableProps> = ({
  items,
  loading,
  error,
  copy,
  formatDateTime,
  isRTL,
}) => (
  <div className='rounded-lg border bg-white p-4 shadow'>
    <div className='mb-3 flex items-center justify-between'>
      <h2 className='text-lg font-medium'>{copy.listTitle}</h2>
      {error && <span className='text-sm text-red-600'>{error}</span>}
    </div>

    <div className='overflow-auto'>
      <table className='min-w-full border text-sm'>
        <thead className='bg-gray-50'>
          <tr>
            <th
              className={`border px-2 py-2 ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {copy.columns.platform}
            </th>
            <th
              className={`border px-2 py-2 ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {copy.columns.level3}
            </th>
            <th
              className={`border px-2 py-2 ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {copy.columns.priceFactor}
            </th>
            <th
              className={`border px-2 py-2 ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {copy.columns.createdAt}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td className='border px-2 py-3 text-center' colSpan={4}>
                {copy.common.loading}
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td className='border px-2 py-3 text-center' colSpan={4}>
                {copy.empty}
              </td>
            </tr>
          ) : (
            items.map(item => (
              <tr
                key={`${item.platform}-${item.level3}-${item.created_at}`}
                className='odd:bg-white even:bg-gray-50'
              >
                <td
                  className={`border px-2 py-2 ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {item.platform}
                </td>
                <td
                  className={`border px-2 py-2 ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {item.level3}
                </td>
                <td
                  className={`border px-2 py-2 ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {item.price_factor}
                </td>
                <td
                  className={`border px-2 py-2 ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {formatDateTime(item.created_at)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default SegmentPriceFactorsTable;
