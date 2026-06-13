import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { TransactionHistoryItem } from '../../../types/payments';
import apiService from '../../../services/api';
import { useToast } from '../../../hooks/useToast';
import { openProformaPreview } from '../utils/proforma';
import { WalletCopy } from '../translations';

interface HistoryTableProps {
  items: TransactionHistoryItem[];
  loading: boolean;
  error: string | null;
  page: number;
  hasNext: boolean;
  accessToken?: string | null;
  language: string;
  currencyLabel: string;
  formatDatetime: (iso: string) => string;
  onNext: () => void;
  onPrev: () => void;
  copy: WalletCopy;
}

type HistoryKind = 'charge-free' | 'charge-credit' | 'agency-share';

interface HistoryRow {
  id: string;
  source: TransactionHistoryItem;
  kind: HistoryKind;
  amount: number;
  invoiceEligible: boolean;
}

const getPositive = (value?: number | null) => Math.max(0, Number(value || 0));

const buildHistoryRows = (items: TransactionHistoryItem[]): HistoryRow[] => {
  return items.flatMap(item => {
    const freeInc = getPositive(item.amount);
    const creditInc = getPositive(item.customer_credit);
    const agencyShare = getPositive(item.agency_share_with_tax);

    const rows: HistoryRow[] = [];
    if (freeInc > 0) {
      rows.push({
        id: `${item.uuid}-charge-free`,
        source: item,
        kind: 'charge-free',
        amount: freeInc,
        invoiceEligible: true,
      });
    }
    if (creditInc > 0) {
      rows.push({
        id: `${item.uuid}-charge-credit`,
        source: item,
        kind: 'charge-credit',
        amount: creditInc,
        invoiceEligible: false,
      });
    }
    if (agencyShare > 0) {
      rows.push({
        id: `${item.uuid}-agency-share`,
        source: item,
        kind: 'agency-share',
        amount: agencyShare,
        invoiceEligible: true,
      });
    }

    return rows;
  });
};

const HistoryTable: React.FC<HistoryTableProps> = ({
  items,
  loading,
  error,
  page,
  hasNext,
  accessToken,
  language,
  currencyLabel,
  formatDatetime,
  onNext,
  onPrev,
  copy,
}) => {
  const { t } = useTranslation();
  const { showError } = useToast();
  const [invoiceLoadingId, setInvoiceLoadingId] = useState<string | null>(null);
  const rows = useMemo(() => buildHistoryRows(items), [items]);

  const kindLabel = (kind: HistoryKind) => {
    switch (kind) {
      case 'charge-free':
        return copy.historyKindLabels.chargeFree;
      case 'charge-credit':
        return copy.historyKindLabels.chargeCredit;
      case 'agency-share':
        return copy.historyKindLabels.agencyShare;
      default:
        return '-';
    }
  };

  const handleInvoice = async (row: HistoryRow) => {
    if (!accessToken) return;
    setInvoiceLoadingId(row.id);
    apiService.setAccessToken(accessToken);
    try {
      const taxedAmount = Math.round(row.amount * 1.1);
      const resp = await apiService.previewProformaInvoiceByAmount(
        taxedAmount,
        language
      );
      if (!resp.success || !resp.data) {
        showError(resp.message || copy.invoiceDownloadError);
        return;
      }
      const payload = (resp.data as any).data || resp.data;
      openProformaPreview(payload, language);
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setInvoiceLoadingId(null);
    }
  };

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
              {/* <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.type}
              </th>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.status}
              </th> */}
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.kind}
              </th>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.amount}
              </th>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.invoice}
              </th>
              {/* <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.description}
              </th> */}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {error && (
              <tr>
                <td colSpan={5} className='px-4 py-6 text-center text-red-600'>
                  {error}
                </td>
              </tr>
            )}
            {!error && rows.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className='px-4 py-6 text-center text-gray-500'>
                  {copy.table.noTransactions}
                </td>
              </tr>
            )}
            {rows.map((row, idx) => {
              return (
                <tr key={row.id} className='hover:bg-gray-50'>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {idx + 1}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {formatDatetime(row.source.datetime)}
                  </td>
                  {/* <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {copy.operationTypes[item.operation] || item.operation}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {copy.statuses[item.status] || item.status}
                  </td> */}
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {kindLabel(row.kind)}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {`${row.amount.toLocaleString()} ${currencyLabel}`}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {accessToken && row.invoiceEligible ? (
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleInvoice(row)}
                        disabled={invoiceLoadingId === row.id}
                        aria-label={copy.table.invoice}
                        // title={copy.table.invoice}
                      >
                        <Download className='h-4 w-4' />
                      </Button>
                    ) : (
                      '-'
                    )}
                  </td>
                  {/* <td className='px-4 py-3 text-sm text-gray-500 text-center'>
                    {item.metadata?.description || '-'}
                  </td> */}
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
