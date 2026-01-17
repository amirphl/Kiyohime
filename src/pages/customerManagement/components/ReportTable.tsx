import React from 'react';
import Button from '../../../components/ui/Button';

interface ReportItem {
  customer_id?: number;
  representative_first_name: string;
  representative_last_name: string;
  company_name: string;
  total_sent: number;
  total_agency_share_with_tax: number;
}

interface ReportTableProps {
  items: ReportItem[];
  loading: boolean;
  error: string | null;
  currencyLabel: string;
  noTransactionsLabel: string;
  commonLoadingLabel: string;
  copy: {
    tableTitle: string;
    firstName: string;
    lastName: string;
    representativeName: string;
    companyName: string;
    totalSent: string;
    totalShare: string;
    discountCreateAction: string;
    discountHistoryAction: string;
  };
  onCreateForCustomer: (
    customerId: number,
    info: { representative_first_name: string; representative_last_name: string; company_name?: string | null }
  ) => void;
  onViewHistory: (
    customerId: number,
    info: { representative_first_name: string; representative_last_name: string; company_name?: string | null }
  ) => void;
}

const ReportTable: React.FC<ReportTableProps> = ({
  items,
  loading,
  error,
  currencyLabel,
  noTransactionsLabel,
  commonLoadingLabel,
  copy,
  onCreateForCustomer,
  onViewHistory,
}) => (
  <div className='overflow-x-auto'>
    <h3 className='text-lg font-medium text-gray-900 mb-2'>
      {copy.tableTitle}
    </h3>
    <table className='min-w-full divide-y divide-gray-200'>
      <thead className='bg-gray-50'>
        <tr>
          <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
            #
          </th>
          <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
            {copy.representativeName}
          </th>
          <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
            {copy.companyName}
          </th>
          <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
            {copy.totalSent}
          </th>
          <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
            {copy.totalShare}
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
            <td colSpan={8} className='px-4 py-6 text-center text-gray-600'>
              {commonLoadingLabel}
            </td>
          </tr>
        ) : error ? (
          <tr>
            <td colSpan={8} className='px-4 py-6 text-center text-red-600'>
              {error}
            </td>
          </tr>
        ) : items.length === 0 ? (
          <tr>
            <td colSpan={8} className='px-4 py-6 text-center text-gray-500'>
              {noTransactionsLabel}
            </td>
          </tr>
        ) : (
          items.map((it, idx) => (
            <tr key={`${it.representative_first_name}-${it.representative_last_name}-${idx}`}>
              <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                {idx + 1}
              </td>
              <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                {it.representative_first_name || '-'}{' '}{it.representative_last_name || '-'}
              </td>
              <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                {it.company_name || '-'}
              </td>
              <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                {(it.total_sent || 0).toLocaleString()}
              </td>
              <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                {(it.total_agency_share_with_tax || 0).toLocaleString()}{' '}
                {currencyLabel}
              </td>
              <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                <Button
                  variant='outline'
                  onClick={() =>
                    it.customer_id !== undefined &&
                    onCreateForCustomer(it.customer_id, {
                      representative_first_name: it.representative_first_name,
                      representative_last_name: it.representative_last_name,
                      company_name: it.company_name,
                    })
                  }
                >
                  {copy.discountCreateAction}
                </Button>
              </td>
              <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                <Button
                  variant='outline'
                  onClick={() =>
                    it.customer_id !== undefined &&
                    onViewHistory(it.customer_id, {
                      representative_first_name: it.representative_first_name,
                      representative_last_name: it.representative_last_name,
                      company_name: it.company_name,
                    })
                  }
                >
                  {copy.discountHistoryAction}
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default ReportTable;
