import React from 'react';
import Button from '../../../components/ui/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { TransactionHistoryItem } from '../../../types/payments';
import { WalletCopy } from '../translations';

interface HistoryTableProps {
  items: TransactionHistoryItem[];
  loading: boolean;
  error: string | null;
  page: number;
  hasNext: boolean;
  currencyLabel: string;
  formatDatetime: (iso: string) => string;
  onNext: () => void;
  onPrev: () => void;
  copy: WalletCopy;
}

const HistoryTable: React.FC<HistoryTableProps> = ({
  items,
  loading,
  error,
  page,
  hasNext,
  currencyLabel,
  formatDatetime,
  onNext,
  onPrev,
  copy,
}) => {
  const { t } = useTranslation();

  return (
    <div className='pt-8'>
      <h2 className='text-lg font-medium text-gray-900 mb-4'>
        {copy.historyTitle}
      </h2>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.row}
              </th>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.datetime}
              </th>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.type}
              </th>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.status}
              </th>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.freeIncrease}
              </th>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.creditIncrease}
              </th>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.description}
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {error && (
              <tr>
                <td colSpan={7} className='px-4 py-6 text-center text-red-600'>
                  {error}
                </td>
              </tr>
            )}
            {!error && items.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={7}
                  className='px-4 py-6 text-center text-gray-500'
                >
                  {copy.table.noTransactions}
                </td>
              </tr>
            )}
            {items.map((item, idx) => {
              const freeBefore =
                (item.balance_before && (item.balance_before as any)['free']) ??
                0;
              const freeAfter =
                (item.balance_after && (item.balance_after as any)['free']) ??
                0;
              const creditBefore =
                (item.balance_before && (item.balance_before as any)['credit']) ??
                0;
              const creditAfter =
                (item.balance_after && (item.balance_after as any)['credit']) ??
                0;
              const freeInc = Math.max(0, freeAfter - freeBefore);
              const creditInc = Math.max(0, creditAfter - creditBefore);
              return (
                <tr key={item.uuid} className='hover:bg-gray-50'>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {idx + 1}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {formatDatetime(item.datetime)}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {copy.operationTypes[item.operation] || item.operation}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {copy.statuses[item.status] || item.status}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {freeInc > 0
                      ? `${freeInc.toLocaleString()} ${currencyLabel}`
                      : '-'}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {creditInc > 0
                      ? `${creditInc.toLocaleString()} ${currencyLabel}`
                      : '-'}
                  </td>
                  <td className='px-4 py-3 text-sm text-gray-500 text-center'>
                    {item.metadata?.description || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className='flex justify-between items-center mt-4'>
        <Button
          variant='outline'
          onClick={onPrev}
          disabled={loading || page === 1}
        >
          {t('common.previous')}
        </Button>
        <Button
          variant='outline'
          onClick={onNext}
          disabled={loading || !hasNext}
        >
          {t('common.next')}
        </Button>
      </div>
    </div>
  );
};

export default HistoryTable;
