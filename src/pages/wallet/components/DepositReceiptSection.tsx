import React, { useMemo, useRef, useState } from 'react';
import Button from '../../../components/ui/Button';
import { Download } from 'lucide-react';
import { downloadBlob } from '../utils/download';
import { useToast } from '../../../hooks/useToast';
import { getWalletCopy } from '../translations';
import apiService from '../../../services/api';
import { useDepositReceipts } from '../hooks/useDepositReceipts';
import {
  DepositReceiptItem,
  ProformaPreviewResponse,
  UpdateDepositReceiptFileRequest,
} from '../../../types/payments';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { openProformaPreview } from '../utils/proforma';

interface DepositReceiptSectionProps {
  accessToken: string | null | undefined;
  language: string;
  currencyLabel: string;
  amount: number | '';
}

type FilePayload = UpdateDepositReceiptFileRequest & { file?: File };

const MIN_DEPOSIT = 1_000_000;
const MAX_DEPOSIT = 1_000_000_000;
const DEPOSIT_STEP = 100_000;

const isValidDepositAmount = (amount: number | ''): amount is number => {
  return (
    typeof amount === 'number' &&
    amount >= MIN_DEPOSIT &&
    amount <= MAX_DEPOSIT &&
    amount % DEPOSIT_STEP === 0
  );
};

const DepositReceiptSection: React.FC<DepositReceiptSectionProps> = ({
  accessToken,
  language,
  currencyLabel,
  amount,
}) => {
  const { showError, showSuccess } = useToast();
  const langCode = (language || 'en').toLowerCase() === 'fa' ? 'FA' : 'EN';
  const copy = useMemo(() => getWalletCopy(language), [language]);
  const { items, loading, error, refresh } = useDepositReceipts(
    accessToken,
    langCode
  );

  const [filePayload, setFilePayload] = useState<FilePayload | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [proformaAmountLoading, setProformaAmountLoading] = useState(false);
  const [lastProformaAmount, setLastProformaAmount] = useState<number | null>(
    null
  );
  const lastProformaPayloadRef = useRef<any>(null);
  const [downloadLoadingId, setDownloadLoadingId] = useState<string | null>(
    null
  );

  const amountValid = isValidDepositAmount(amount);
  const taxedAmount = amountValid ? Math.round(amount * 1.1) : null;
  const getLocalizedStatus = (status: string) => {
    const trimmed = status?.trim();
    if (!trimmed) return '-';
    const normalized =
      trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    return copy.statuses[trimmed] || copy.statuses[normalized] || trimmed;
  };
  const getLocalizedRejectionReason = (reason?: string | null) => {
    const trimmed = reason?.trim();
    if (!trimmed) return null;
    return copy.depositRejectionReasons[trimmed] || trimmed;
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    if (!amountValid) {
      showError(copy.depositNeedAmount);
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      showError(copy.depositUploadLabel);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError(copy.depositFileTooLarge);
      return;
    }
    const base64 = await readFileAsBase64(file);
    setFilePayload({
      file_name: file.name,
      content_type: file.type,
      file_size: file.size,
      file_base64: base64,
      file,
    });
  };

  const onPickFile = () => {
    if (!amountValid) {
      showError(copy.depositNeedAmount);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!amountValid) {
      showError(copy.depositNeedAmount);
      return;
    }
    if (!filePayload) {
      showError(copy.depositNeedFile);
      return;
    }
    setConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    if (!accessToken || !filePayload || taxedAmount === null) return;
    setSubmitting(true);
    apiService.setAccessToken(accessToken);
    try {
      const resp = await apiService.submitDepositReceipt({
        amount: taxedAmount,
        lang: langCode,
        file_name: filePayload.file_name,
        content_type: filePayload.content_type,
        file_size: filePayload.file_size,
        file_base64: filePayload.file_base64,
      });
      if (!resp.success) {
        showError(resp.message || 'Failed to submit receipt');
        return;
      }
      showSuccess(copy.depositSubmit);
      setFilePayload(null);
      refresh(langCode);
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  const handleDownloadFile = async (receipt: DepositReceiptItem) => {
    if (!accessToken) return;
    setDownloadLoadingId(receipt.uuid);
    apiService.setAccessToken(accessToken);
    try {
      const resp = await apiService.downloadDepositReceiptFile(receipt.uuid);
      if (!resp.success || !resp.blob) {
        showError(resp.message || copy.depositDownloadFile);
        return;
      }
      const fallbackName =
        resp.filename || receipt.file_name || `receipt-${receipt.uuid}.pdf`;
      downloadBlob(resp.blob, fallbackName);
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setDownloadLoadingId(null);
    }
  };

  const handleProformaByAmount = async () => {
    if (!accessToken) return;
    if (!amountValid || taxedAmount === null) {
      showError(copy.depositNeedAmount);
      return;
    }

    if (lastProformaAmount === taxedAmount && lastProformaPayloadRef.current) {
      openProformaPreview(lastProformaPayloadRef.current, language);
      return;
    }

    setProformaAmountLoading(true);
    apiService.setAccessToken(accessToken);
    try {
      const resp = await apiService.previewProformaInvoiceByAmount(
        taxedAmount,
        langCode
      );
      if (!resp.success || !resp.data) {
        showError(resp.message || copy.depositProforma);
        return;
      }
      const payload = (resp.data as ProformaPreviewResponse).data || resp.data;
      lastProformaPayloadRef.current = payload;
      setLastProformaAmount(taxedAmount);
      openProformaPreview(payload, language);
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setProformaAmountLoading(false);
    }
  };

  return (
    <div
      className='space-y-4 border border-gray-200 rounded-lg p-4'
      dir={language.toLowerCase() === 'fa' ? 'rtl' : 'ltr'}
    >
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
        <div className='space-y-1'>
          <h3 className='text-lg font-semibold text-gray-900'>
            {copy.depositTitle}
          </h3>
          <p className='text-xs text-gray-500'>{copy.depositSizeHint}</p>
          <p className='text-sm text-gray-700'>
            {copy.amountLabel}:{' '}
            {amountValid
              ? `${amount.toLocaleString()} ${currencyLabel}`
              : copy.depositNeedAmount}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            onClick={onPickFile}
            disabled={!amountValid}
          >
            {copy.depositSelectFile}
          </Button>
          <input
            type='file'
            accept='image/jpeg,image/png,application/pdf'
            className='hidden'
            ref={fileInputRef}
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(f);
            }}
          />
          <Button
            variant='primary'
            onClick={handleSubmit}
            disabled={submitting || !amountValid}
          >
            {copy.depositSubmit}
          </Button>
        </div>
      </div>

      {filePayload && (
        <div className='text-sm text-gray-700'>
          {filePayload.file_name} • {(filePayload.file_size / 1024).toFixed(1)}{' '}
          KB
        </div>
      )}

      <div className='flex flex-wrap gap-3'>
        <Button
          variant='outline'
          onClick={handleProformaByAmount}
          disabled={
            proformaAmountLoading ||
            !amountValid ||
            (taxedAmount !== null && lastProformaAmount === taxedAmount)
          }
        >
          {proformaAmountLoading ? 'Loading…' : copy.depositProforma}
        </Button>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <h4 className='font-semibold text-gray-900'>
            {copy.depositTableTitle}
          </h4>
          {loading && <span className='text-sm text-gray-500'>Loading…</span>}
          {error && <span className='text-sm text-red-600'>{error}</span>}
        </div>
        <div className='overflow-auto'>
          <table className='min-w-full divide-y divide-gray-200 text-sm text-center'>
            <thead className='bg-gray-50 text-center'>
              <tr>
                <th className='px-3 py-2 text-gray-600'>
                  {copy.depositColumnAmount}
                </th>
                <th className='px-3 py-2 text-gray-600'>
                  {copy.depositColumnStatus}
                </th>
                <th className='px-3 py-2 text-gray-600'>
                  {copy.depositColumnCreated}
                </th>
                <th className='px-3 py-2 text-gray-600'>
                  {copy.depositColumnPreview}
                </th>
                <th className='px-3 py-2 text-gray-600 min-w-[200px]'>
                  {copy.depositColumnRejection}
                </th>
                <th className='px-3 py-2 text-gray-600'>
                  {copy.depositColumnDownload}
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 text-center'>
              {items.map(item => (
                <tr key={item.uuid} className='bg-white'>
                  <td className='px-3 py-2'>
                    {item.amount.toLocaleString()} {currencyLabel}
                  </td>
                  <td className='px-3 py-2'>
                    {getLocalizedStatus(item.status)}
                  </td>
                  <td className='px-3 py-2'>
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className='px-3 py-2'>
                    {item.preview_base64 ? (
                      item.preview_type &&
                      item.preview_type.startsWith('image/') ? (
                        <img
                          src={`data:${item.preview_type};base64,${item.preview_base64}`}
                          alt='preview'
                          className='h-12 w-12 object-cover rounded'
                        />
                      ) : (
                        <span className='text-gray-500'>
                          {item.preview_type || copy.depositNoFile}
                        </span>
                      )
                    ) : (
                      <span className='text-gray-400'>
                        {copy.depositNoFile}
                      </span>
                    )}
                  </td>
                  <td className='px-3 py-2 min-w-[200px]'>
                    {getLocalizedRejectionReason(
                      item.rejection_note || item.status_reason
                    ) || <span className='text-gray-400'>-</span>}
                  </td>
                  <td className='px-3 py-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleDownloadFile(item)}
                      disabled={downloadLoadingId === item.uuid}
                      aria-label={copy.depositDownloadFile}
                    >
                      <Download className='h-4 w-4' />
                    </Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    className='px-3 py-4 text-center text-gray-500'
                    colSpan={6}
                  >
                    {copy.table.noTransactions}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmOpen}
        onConfirm={confirmSubmit}
        onCancel={() => setConfirmOpen(false)}
        title={copy.depositConfirmTitle}
        confirmText={copy.depositSubmit}
        cancelText={copy.pay}
        loading={submitting}
      >
        <p className='text-sm text-gray-700'>{copy.depositConfirmBody}</p>
      </ConfirmationModal>
    </div>
  );
};

export default DepositReceiptSection;

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}
