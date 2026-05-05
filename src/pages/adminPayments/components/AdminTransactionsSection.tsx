import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FileUp, Link2, UserCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { useLanguage } from '../../../hooks/useLanguage';
import { useToast } from '../../../hooks/useToast';
import { adminPaymentsTranslations } from '../translations';
import { useAdminTransactions } from '../hooks/useAdminTransactions';
import { AdminTransactionItem } from '../../../types/payments';
import { adminPaymentsApi } from '../api';

const DEFAULT_PAGE_SIZE = 20;
const TOAST_DURATION_MS = 15_000;

const toRfc3339 = (value: string): string | undefined => {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
};

interface AdminTransactionsSectionProps {
  refreshSignal?: number;
}

const AdminTransactionsSection: React.FC<AdminTransactionsSectionProps> = ({
  refreshSignal,
}) => {
  const { language } = useLanguage();
  const copy = useMemo(
    () =>
      adminPaymentsTranslations[language as 'en' | 'fa'] ||
      adminPaymentsTranslations.en,
    [language]
  );
  const { showError, showSuccess } = useToast();
  const { data, loading, params, refresh, setInvoiceAttached } =
    useAdminTransactions({
      page: 1,
      page_size: DEFAULT_PAGE_SIZE,
    });

  const [customerId, setCustomerId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [selectedTx, setSelectedTx] = useState<AdminTransactionItem | null>(
    null
  );
  const [selectedCustomerTx, setSelectedCustomerTx] =
    useState<AdminTransactionItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attaching, setAttaching] = useState(false);
  const parseCustomerId = (value: string): number | undefined => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  };

  const getErrorMessage = useCallback(
    (errorCode?: string) => {
      switch (errorCode) {
        case 'INVALID_PAGE':
          return copy.transactions.errors.invalidPage;
        case 'INVALID_PAGE_SIZE':
          return copy.transactions.errors.invalidPageSize;
        case 'INVALID_START_DATE':
          return copy.transactions.errors.invalidStartDate;
        case 'INVALID_END_DATE':
          return copy.transactions.errors.invalidEndDate;
        case 'START_DATE_AFTER_END_DATE':
          return copy.transactions.errors.startDateAfterEndDate;
        case 'TRANSACTION_NOT_FOUND':
          return copy.transactions.errors.transactionNotFound;
        case 'PAYMENT_REQUEST_NOT_FOUND':
          return copy.transactions.errors.paymentRequestNotFound;
        case 'INVOICE_UUID_REQUIRED':
          return copy.transactions.errors.invoiceUuidRequired;
        case 'INVOICE_UUID_INVALID':
          return copy.transactions.errors.invoiceUuidInvalid;
        case 'INVOICE_UUID_MISMATCH':
          return copy.transactions.errors.invoiceUuidMismatch;
        case 'UNAUTHORIZED':
        case 'MISSING_ADMIN_ID':
          return copy.transactions.errors.unauthorized;
        case 'NETWORK_ERROR':
          return copy.transactions.errors.network;
        default:
          return '';
      }
    },
    [copy.transactions.errors]
  );

  const loadTransactions = useCallback(
    async (overrides?: Record<string, any>) => {
      const res = await refresh(overrides);
      if (!res || res.success) return;
      showError(
        getErrorMessage(res.error?.code) ||
          res.message ||
          copy.transactions.errors.listFailed,
        TOAST_DURATION_MS
      );
    },
    [refresh, showError, copy.transactions.errors.listFailed, getErrorMessage]
  );

  const applyFilters = async () => {
    const startRfc3339 = toRfc3339(startDate);
    const endRfc3339 = toRfc3339(endDate);
    if (startRfc3339 && endRfc3339 && startRfc3339 > endRfc3339) {
      showError(
        copy.transactions.errors.startDateAfterEndDate,
        TOAST_DURATION_MS
      );
      return;
    }

    await loadTransactions({
      page: 1,
      page_size: pageSize,
      customer_id: parseCustomerId(customerId),
      start_date: startRfc3339,
      end_date: endRfc3339,
    });
  };

  const changePage = async (nextPage: number) => {
    await loadTransactions({ page: nextPage, page_size: pageSize });
  };

  const handleAttachInvoice = async () => {
    if (!selectedTx) return;
    if (attaching) return;
    if (!selectedFile) {
      showError(copy.transactions.errors.fileRequired, TOAST_DURATION_MS);
      return;
    }

    setAttaching(true);
    try {
      const uploadRes = await adminPaymentsApi.uploadMultimediaByAdmin(
        selectedTx.customer_id,
        selectedFile
      );
      if (!uploadRes.success || !uploadRes.data?.uuid) {
        showError(
          getErrorMessage(uploadRes.error?.code) ||
            uploadRes.message ||
            copy.transactions.errors.uploadFailed,
          TOAST_DURATION_MS
        );
        return;
      }

      const linkRes = await adminPaymentsApi.addInvoiceToTransaction({
        transaction_uuid: selectedTx.uuid,
        customer_invoice_uuid: uploadRes.data.uuid,
      });

      if (!linkRes.success) {
        showError(
          getErrorMessage(linkRes.error?.code) ||
            linkRes.message ||
            copy.transactions.errors.addInvoiceFailed,
          TOAST_DURATION_MS
        );
        return;
      }

      setInvoiceAttached(selectedTx.uuid, uploadRes.data.uuid);
      showSuccess(copy.transactions.success.invoiceAttached, TOAST_DURATION_MS);
      setSelectedTx(null);
      setSelectedFile(null);
    } catch (e) {
      showError(
        getErrorMessage(e instanceof Error ? e.message : undefined) ||
          copy.transactions.errors.addInvoiceFailed,
        TOAST_DURATION_MS
      );
    } finally {
      setAttaching(false);
    }
  };

  useEffect(() => {
    if (refreshSignal === undefined) return;
    refresh();
    // refreshSignal intentionally triggers list recall after receipt status updates.
    // Use stable `refresh` to avoid callback-identity loops from `loadTransactions`.
  }, [refreshSignal, refresh]);

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-4'>
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <h2 className='text-xl font-semibold'>{copy.transactions.title}</h2>
        <div className='flex flex-wrap gap-2 text-sm'>
          <input
            type='number'
            min={1}
            value={customerId}
            placeholder={copy.transactions.customerFilter}
            onChange={e => setCustomerId(e.target.value)}
            className='w-32 rounded border border-gray-300 px-2 py-1'
          />
          <input
            type='datetime-local'
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className='rounded border border-gray-300 px-2 py-1'
            title={copy.transactions.startDate}
          />
          <input
            type='datetime-local'
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className='rounded border border-gray-300 px-2 py-1'
            title={copy.transactions.endDate}
          />
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className='rounded border border-gray-300 px-2 py-1'
            title={copy.transactions.pageSize}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <Button size='sm' variant='outline' onClick={applyFilters}>
            {copy.transactions.applyFilters}
          </Button>
        </div>
      </div>

      <div className='overflow-auto'>
        <table className='min-w-full divide-y divide-gray-200 text-sm text-center'>
          <thead className='bg-gray-50 text-gray-700'>
            <tr>
              <th className='px-3 py-2'>{copy.transactions.table.datetime}</th>
              <th className='px-3 py-2'>
                {copy.transactions.table.customerId}
              </th>
              <th className='px-3 py-2'>{copy.transactions.table.amount}</th>
              <th className='px-3 py-2'>
                {copy.transactions.table.customerInfo}
              </th>
              {/* <th className='px-3 py-2'>{copy.transactions.table.status}</th> */}
              {/* <th className='px-3 py-2'>{copy.transactions.table.operation}</th> */}
              {/* <th className='px-3 py-2'>{copy.transactions.table.source}</th> */}
              {/* <th className='px-3 py-2'>
                {copy.transactions.table.externalRef}
              </th> */}
              <th className='px-3 py-2'>{copy.transactions.table.invoice}</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {data.items.map(item => {
              const alreadyAttached = Boolean(item.customer_invoice_uuid);
              return (
                <tr key={item.uuid} className='bg-white'>
                  <td className='px-3 py-2'>
                    {new Date(item.datetime).toLocaleString()}
                  </td>
                  <td className='px-3 py-2'>{item.customer_id}</td>
                  <td className='px-3 py-2'>
                    {item.amount.toLocaleString()} {item.currency}
                  </td>
                  <td className='px-3 py-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => setSelectedCustomerTx(item)}
                      title={copy.transactions.customerInfo.openModal}
                    >
                      <UserCircle className='h-4 w-4' />
                    </Button>
                  </td>
                  {/* <td className='px-3 py-2 capitalize'>{item.status}</td> */}
                  {/* <td className='px-3 py-2'>{item.operation}</td> */}
                  {/* <td className='px-3 py-2'>{item.source}</td> */}
                  {/* <td className='px-3 py-2'>{item.external_ref || '-'}</td> */}
                  <td className='px-3 py-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      disabled={alreadyAttached}
                      onClick={() => {
                        setSelectedTx(item);
                        setSelectedFile(null);
                      }}
                      title={
                        alreadyAttached
                          ? copy.transactions.invoice.alreadyAttached
                          : copy.transactions.invoice.openModal
                      }
                    >
                      {alreadyAttached ? (
                        <Link2 className='h-4 w-4' />
                      ) : (
                        <FileUp className='h-4 w-4' />
                      )}
                    </Button>
                  </td>
                </tr>
              );
            })}
            {data.items.length === 0 && !loading && (
              <tr>
                <td className='px-3 py-4 text-center text-gray-500' colSpan={5}>
                  {copy.transactions.errors.noData}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='flex items-center justify-between'>
        <button
          type='button'
          className='rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50'
          onClick={() => changePage(Math.max(1, (params.page || 1) - 1))}
          disabled={loading || !data.pagination.has_previous}
        >
          {copy.transactions.prevPage}
        </button>
        <span className='text-sm text-gray-600'>
          {copy.transactions.paginationLabel
            .replace('{{current}}', String(data.pagination.current_page || 1))
            .replace('{{total}}', String(data.pagination.total_pages || 1))}
        </span>
        <button
          type='button'
          className='rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50'
          onClick={() => changePage((params.page || 1) + 1)}
          disabled={loading || !data.pagination.has_next}
        >
          {copy.transactions.nextPage}
        </button>
      </div>

      <ConfirmationModal
        isOpen={!!selectedTx}
        onConfirm={handleAttachInvoice}
        onCancel={() => {
          if (attaching) return;
          setSelectedTx(null);
          setSelectedFile(null);
        }}
        title={copy.transactions.invoice.attachTitle}
        confirmText={
          attaching
            ? copy.transactions.invoice.attaching
            : copy.transactions.invoice.uploadAndAttach
        }
        cancelText={copy.transactions.invoice.cancel}
        loading={attaching}
      >
        <div className='space-y-3'>
          <p className='text-sm text-gray-700'>
            {copy.transactions.invoice.attachPrompt}
          </p>
          <div className='space-y-1'>
            <label className='text-xs text-gray-600'>
              {copy.transactions.invoice.chooseFile}
            </label>
            <input
              type='file'
              onChange={e => setSelectedFile(e.target.files?.[0] || null)}
              className='w-full rounded border border-gray-300 px-2 py-1 text-sm'
              disabled={attaching}
            />
            {selectedFile && (
              <p className='text-xs text-gray-500'>
                {copy.transactions.invoice.selectedFile}: {selectedFile.name}
              </p>
            )}
          </div>
        </div>
      </ConfirmationModal>

      {selectedCustomerTx && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-lg rounded-lg bg-white shadow-xl'>
            <div className='flex items-center justify-between border-b border-gray-200 p-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                {copy.transactions.customerInfo.modalTitle}
              </h3>
              <button
                type='button'
                className='text-sm text-gray-500 hover:text-gray-700'
                onClick={() => setSelectedCustomerTx(null)}
              >
                {copy.transactions.customerInfo.close}
              </button>
            </div>
            <div className='space-y-3 p-4 text-sm'>
              <div className='rounded-md bg-gray-50 p-3 font-medium text-gray-800'>
                {copy.transactions.customerInfo.transactionAmount}:{' '}
                {selectedCustomerTx.amount.toLocaleString()}{' '}
                {selectedCustomerTx.currency}
              </div>
              {[
                {
                  label: copy.transactions.customerInfo.customerId,
                  value: String(selectedCustomerTx.customer_id),
                },
                {
                  label: copy.transactions.customerInfo.fullName,
                  value: selectedCustomerTx.customer?.full_name,
                },
                {
                  label: copy.transactions.customerInfo.representativeFirstName,
                  value: selectedCustomerTx.customer?.representative_first_name,
                },
                {
                  label: copy.transactions.customerInfo.representativeLastName,
                  value: selectedCustomerTx.customer?.representative_last_name,
                },
                {
                  label: copy.transactions.customerInfo.representativeMobile,
                  value: selectedCustomerTx.customer?.representative_mobile,
                },
                {
                  label: copy.transactions.customerInfo.email,
                  value: selectedCustomerTx.customer?.email,
                },
                {
                  label: copy.transactions.customerInfo.companyName,
                  value: selectedCustomerTx.customer?.company_name,
                },
                {
                  label: copy.transactions.customerInfo.companyPhone,
                  value: selectedCustomerTx.customer?.company_phone,
                },
                {
                  label: copy.transactions.customerInfo.companyAddress,
                  value: selectedCustomerTx.customer?.company_address,
                },
                {
                  label: copy.transactions.customerInfo.postalCode,
                  value: selectedCustomerTx.customer?.postal_code,
                },
                {
                  label: copy.transactions.customerInfo.nationalId,
                  value: selectedCustomerTx.customer?.national_id,
                },
                {
                  label: copy.transactions.customerInfo.accountType,
                  value: selectedCustomerTx.customer?.account_type,
                },
              ].map(field => (
                <div
                  key={field.label}
                  className='grid grid-cols-2 gap-3 border-b border-gray-100 pb-2 last:border-b-0'
                >
                  <span className='text-gray-500'>{field.label}</span>
                  <span className='text-gray-900'>
                    {field.value || copy.transactions.customerInfo.missingValue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactionsSection;
