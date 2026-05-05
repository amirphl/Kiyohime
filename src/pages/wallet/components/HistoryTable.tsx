import React, { useMemo, useState } from 'react';
import { BellRing, Download } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { TransactionHistoryItem } from '../../../types/payments';
import apiService from '../../../services/api';
import { useToast } from '../../../hooks/useToast';
import { downloadBlob } from '../utils/download';
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
type InvoiceAction = 'download' | 'notify' | 'disabled';

interface HistoryRow {
  id: string;
  source: TransactionHistoryItem;
  kind: HistoryKind;
  amount: number;
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
      });
    }
    if (creditInc > 0) {
      rows.push({
        id: `${item.uuid}-charge-credit`,
        source: item,
        kind: 'charge-credit',
        amount: creditInc,
      });
    }
    if (agencyShare > 0) {
      rows.push({
        id: `${item.uuid}-agency-share`,
        source: item,
        kind: 'agency-share',
        amount: agencyShare,
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
  currencyLabel,
  formatDatetime,
  onNext,
  onPrev,
  copy,
}) => {
  const { t } = useTranslation();
  const { showError, showSuccess } = useToast();
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
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

  const getInvoiceErrorMessage = (errorCodeOrMessage?: string) => {
    switch (errorCodeOrMessage) {
      case 'INVALID_TRANSACTION_UUID':
        return copy.invoiceErrors.invalidTransactionUuid;
      case 'TRANSACTION_NOT_FOUND':
        return copy.invoiceErrors.transactionNotFound;
      case 'FORBIDDEN':
        return copy.invoiceErrors.forbidden;
      case 'INVOICE_ISSUE_REQUEST_RATE_LIMITED':
        return copy.invoiceErrors.rateLimited;
      case 'INVOICE_ALREADY_ASSIGNED':
        return copy.invoiceErrors.alreadyAssigned;
      case 'INVOICE_ISSUE_REQUEST_FAILED':
        return copy.invoiceErrors.issueRequestFailed;
      case 'Unauthorized - Please log in again':
      case 'UNAUTHORIZED':
      case 'Unauthorized':
        return copy.invoiceErrors.unauthorized;
      default:
        return undefined;
    }
  };

  const resolveInvoiceAction = (row: HistoryRow): InvoiceAction => {
    if (!accessToken || row.kind !== 'charge-free') return 'disabled';
    const hasInvoiceUUID = Boolean(row.source.customer_invoice_uuid);
    if (hasInvoiceUUID) return 'download';
    return 'notify';
  };

  const handleDownloadInvoice = async (row: HistoryRow) => {
    if (
      row.kind !== 'charge-free' ||
      !accessToken ||
      !row.source.customer_invoice_uuid ||
      row.amount < 0
    )
      return;
    setLoadingActionId(row.id);
    apiService.setAccessToken(accessToken);

    try {
      const resp = await apiService.downloadMultimedia(
        row.source.customer_invoice_uuid
      );
      if (!resp.success || !resp.blob) {
        const errorCode = resp.message;
        showError(
          getInvoiceErrorMessage(errorCode) || copy.invoiceErrors.downloadFailed
        );
        return;
      }
      downloadBlob(resp.blob, resp.filename || `invoice-${row.source.uuid}`);
    } catch (e) {
      showError(
        getInvoiceErrorMessage(e instanceof Error ? e.message : undefined) ||
          copy.invoiceErrors.downloadFailed
      );
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleNotifyInvoiceIssue = async (row: HistoryRow) => {
    if (
      row.kind !== 'charge-free' ||
      !accessToken ||
      row.source.customer_invoice_uuid
    )
      return;
    setLoadingActionId(row.id);
    apiService.setAccessToken(accessToken);

    try {
      const resp = await apiService.notifyInvoiceIssueRequest({
        transaction_uuid: row.source.uuid,
      });
      if (!resp.success) {
        const errorCode = resp.error?.code || resp.message;
        showError(
          getInvoiceErrorMessage(errorCode) ||
            resp.message ||
            copy.invoiceErrors.issueRequestFailed
        );
        return;
      }
      showSuccess(copy.invoiceNotifySuccess);
    } catch (e) {
      showError(
        getInvoiceErrorMessage(e instanceof Error ? e.message : undefined) ||
          copy.invoiceErrors.issueRequestFailed
      );
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleInvoiceAction = async (row: HistoryRow) => {
    const action = resolveInvoiceAction(row);
    if (action === 'download') {
      await handleDownloadInvoice(row);
      return;
    }
    if (action === 'notify') {
      await handleNotifyInvoiceIssue(row);
    }
  };

  const renderInvoiceIcon = (row: HistoryRow) => {
    const action = resolveInvoiceAction(row);
    if (action === 'download') return <Download className='h-4 w-4' />;
    if (action === 'notify') return <BellRing className='h-4 w-4' />;
    return <Download className='h-4 w-4' />;
  };

  const isRowActionDisabled = (row: HistoryRow) => {
    return (
      resolveInvoiceAction(row) === 'disabled' || loadingActionId === row.id
    );
  };

  const getInvoiceActionLabel = (row: HistoryRow) => {
    const action = resolveInvoiceAction(row);
    if (action === 'notify') return copy.table.invoiceNotifyIssue;
    return copy.table.invoiceDownload;
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
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.kind}
              </th>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.amount}
              </th>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                {copy.table.invoice}
              </th>
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
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {kindLabel(row.kind)}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {`${row.amount.toLocaleString()} ${currencyLabel}`}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center'>
                    {row.kind === 'charge-free' ? (
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleInvoiceAction(row)}
                        disabled={isRowActionDisabled(row)}
                        aria-label={getInvoiceActionLabel(row)}
                        title={getInvoiceActionLabel(row)}
                      >
                        {renderInvoiceIcon(row)}
                      </Button>
                    ) : (
                      <span className='text-gray-400'>-</span>
                    )}
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
