import React from 'react';
import Button from '../../../components/ui/Button';
import { formatDatetime } from '../utils';
import { AgencyDiscountItem } from '../hooks/useAgencyDiscounts';

interface DiscountsTableProps {
  discounts: AgencyDiscountItem[];
  loading: boolean;
  error: string | null;
  currencyLabel: string;
  noTransactionsLabel: string;
  commonLoadingLabel: string;
  language: string;
  copy: {
    discountsTitle: string;
    discountCustomer: string;
    companyName: string;
    discountRate: string;
    discountCreatedAt: string;
    discountCreateAction: string;
    discountHistoryAction: string;
  };
  onCreate: (item: AgencyDiscountItem) => void;
  onHistory: (item: AgencyDiscountItem) => void;
}

const DiscountsTable: React.FC<DiscountsTableProps> = ({
  discounts,
  loading,
  error,
  currencyLabel,
  noTransactionsLabel,
  commonLoadingLabel,
  language,
  copy,
  onCreate,
  onHistory,
}) => (
  <div className='mt-8'>
    <h3 className='text-lg font-medium text-gray-900 mb-2'>
      {copy.discountsTitle}
    </h3>
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
              #
            </th>
            <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
              {copy.companyName}
            </th>
            <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
              {copy.discountRate}
            </th>
            <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
              {copy.discountCreatedAt}
            </th>
            <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
              {copy.discountCreateAction}
            </th>
            <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
              {copy.discountHistoryAction}
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {loading ? (
            <tr>
              <td colSpan={7} className='px-4 py-6 text-center text-gray-600'>
                {commonLoadingLabel}
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={7} className='px-4 py-6 text-center text-red-600'>
                {error}
              </td>
            </tr>
          ) : discounts.length === 0 ? (
            <tr>
              <td colSpan={7} className='px-4 py-6 text-center text-gray-500'>
                {noTransactionsLabel}
              </td>
            </tr>
          ) : (
            discounts.map((d, idx) => (
              <tr key={`${d.customer_id}-${idx}`}>
                <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                  {idx + 1}
                </td>
                <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                  {d.company_name ?? ''}
                </td>
                <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                  {(() => {
                    const rate = Number(d.discount_rate);
                    if (!Number.isFinite(rate) || rate >= 1) return '-';
                    const value = (100 * rate) / (1 - rate);
                    return Math.ceil(value).toString();
                  })()}
                </td>
                <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                  {formatDatetime(d.created_at, language)}
                </td>
                <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                  <Button variant='outline' onClick={() => onCreate(d)}>
                    {copy.discountCreateAction}
                  </Button>
                </td>
                <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                  <Button variant='outline' onClick={() => onHistory(d)}>
                    {copy.discountHistoryAction}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default DiscountsTable;
