import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../hooks/useToast';
import { useLanguage } from '../../../hooks/useLanguage';
import { adminPaymentsTranslations } from '../translations';
import { useAdminDepositReceipts } from '../hooks/useAdminDepositReceipts';
import { adminPaymentsApi } from '../api';
import { downloadBlob } from '../../wallet/utils/download';
import { AdminUpdateDepositReceiptStatusRequest, DepositReceiptItem } from '../../../types/payments';
import ConfirmationModal from '../../../components/ConfirmationModal';

const AdminDepositReceiptsSection: React.FC = () => {
  const { language } = useLanguage();
  const copy = useMemo(
    () =>
      adminPaymentsTranslations[language as 'en' | 'fa'] ||
      adminPaymentsTranslations.en,
    [language]
  );
  const { showError, showSuccess } = useToast();

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [langFilter, setLangFilter] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [pendingAction, setPendingAction] = useState<{ receipt: DepositReceiptItem; action: 'approve' | 'reject' } | null>(null);
  const [pendingReason, setPendingReason] = useState('');
  const { items, loading, error, refresh, mutateStatus } = useAdminDepositReceipts({
    status: statusFilter || undefined,
    lang: langFilter || undefined,
    customer_id: customerId ? Number(customerId) : undefined,
  });

  const handleRefresh = () => refresh({ status: statusFilter || undefined, lang: langFilter || undefined, customer_id: customerId ? Number(customerId) : undefined });

  const handleDownload = async (receipt: DepositReceiptItem) => {
    try {
      const res = await adminPaymentsApi.downloadDepositReceiptFile(receipt.uuid);
      if (!res.success || !res.blob) {
        showError(res.message || copy.receipts.errors.downloadFailed);
        return;
      }
      const fallbackName =
        res.filename || receipt.file_name || `${receipt.uuid}.pdf`;
      downloadBlob(res.blob, fallbackName);
    } catch (e) {
      showError(copy.receipts.errors.downloadFailed);
    }
  };

  const handleStatus = async (receipt: DepositReceiptItem, action: 'approve' | 'reject') => {
    setPendingAction({ receipt, action });
    setPendingReason('');
  };

  const confirmPendingAction = async () => {
    if (!pendingAction) return;
    const payload: AdminUpdateDepositReceiptStatusRequest = {
      receipt_uuid: pendingAction.receipt.uuid,
      action: pendingAction.action,
      reason: pendingAction.action === 'reject' ? (pendingReason || undefined) : undefined,
    };
    const res = await adminPaymentsApi.updateDepositReceiptStatus(payload);
    if (!res.success) {
      showError(res.message || copy.receipts.errors.updateFailed);
    } else {
      showSuccess(copy.receipts.success.statusUpdated);
      mutateStatus(pendingAction.receipt.uuid, payload.action === 'approve' ? 'approved' : 'rejected');
      handleRefresh();
    }
    setPendingAction(null);
    setPendingReason('');
  };

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-4'>
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-xl font-semibold'>{copy.receipts.title}</h2>
        </div>
        <div className='flex flex-wrap gap-2 text-sm'>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className='rounded border border-gray-300 px-2 py-1'
          >
            <option value=''>{copy.receipts.statusFilter}</option>
            <option value='pending'>pending</option>
            <option value='approved'>approved</option>
            <option value='rejected'>rejected</option>
          </select>
          <select
            value={langFilter}
            onChange={e => setLangFilter(e.target.value)}
            className='rounded border border-gray-300 px-2 py-1'
          >
            <option value=''>{copy.receipts.langFilter}</option>
            <option value='FA'>FA</option>
            <option value='EN'>EN</option>
          </select>
          <input
            type='number'
            value={customerId}
            placeholder={copy.receipts.customerFilter}
            onChange={e => setCustomerId(e.target.value)}
            className='w-32 rounded border border-gray-300 px-2 py-1'
          />
          <Button size='sm' variant='outline' onClick={handleRefresh} disabled={loading}>
            {copy.receipts.refresh}
          </Button>
        </div>
      </div>

      {error && <p className='text-sm text-red-600'>{error}</p>}

      <div className='overflow-auto'>
        <table className='min-w-full divide-y divide-gray-200 text-sm text-center'>
          <thead className='bg-gray-50 text-gray-700'>
            <tr>
              <th className='px-3 py-2'>{copy.receipts.table.amount}</th>
              <th className='px-3 py-2'>{copy.receipts.table.status}</th>
              {/* <th className='px-3 py-2'>{copy.receipts.table.lang}</th> */}
              <th className='px-3 py-2'>{copy.receipts.table.created}</th>
              <th className='px-3 py-2'>{copy.receipts.table.preview}</th>
              <th className='px-3 py-2 min-w-[200px]'>{copy.receipts.table.reason}</th>
              <th className='px-3 py-2'>{copy.receipts.table.download}</th>
              <th className='px-3 py-2'>{copy.receipts.table.approve}</th>
              <th className='px-3 py-2'>{copy.receipts.table.reject}</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {items.map(item => (
              <tr key={item.uuid} className='bg-white'>
                <td className='px-3 py-2'>{item.amount.toLocaleString()} {item.currency}</td>
                <td className='px-3 py-2 capitalize'>{item.status}</td>
                {/* <td className='px-3 py-2'>{itemshow confirmation modal for approve/reject in @.lang}</td> */}
                <td className='px-3 py-2'>{new Date(item.created_at as any).toLocaleString()}</td>
                <td className='px-3 py-2'>
                  {item.preview_base64 ? (
                    item.preview_type?.startsWith('image/') ? (
                      <img
                        src={`data:${item.preview_type};base64,${item.preview_base64}`}
                        alt='preview'
                        className='h-12 w-12 object-cover rounded mx-auto'
                      />
                    ) : (
                      <span className='text-gray-500'>{item.preview_type}</span>
                    )
                  ) : (
                    <span className='text-gray-400'>-</span>
                  )}
                </td>
                <td className='px-3 py-2 min-w-[200px]'>
                  {item.rejection_note || item.status_reason || <span className='text-gray-400'>-</span>}
                </td>
                <td className='px-3 py-2'>
                  <Button size='sm' variant='outline' onClick={() => handleDownload(item)}>
                    <Download className='h-4 w-4' />
                  </Button>
                </td>
                <td className='px-3 py-2'>
                  <Button
                    size='sm'
                    variant='primary'
                    onClick={() => handleStatus(item, 'approve')}
                    disabled={item.status !== 'pending'}
                  >
                    {copy.receipts.table.approve}
                  </Button>
                </td>
                <td className='px-3 py-2'>
                  <Button
                    size='sm'
                    variant='danger'
                    onClick={() => handleStatus(item, 'reject')}
                    disabled={item.status !== 'pending'}
                  >
                    {copy.receipts.table.reject}
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr>
                <td className='px-3 py-4 text-center text-gray-500' colSpan={8}>
                  {copy.info.noCustomersFound}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={!!pendingAction}
        onConfirm={confirmPendingAction}
        onCancel={() => setPendingAction(null)}
        title={
          pendingAction?.action === 'approve'
            ? copy.receipts.table.approve
            : copy.receipts.table.reject
        }
        confirmText={
          pendingAction?.action === 'approve'
            ? copy.receipts.table.approve
            : copy.receipts.table.reject
        }
        cancelText={copy.receipts.cancel || 'Close'}
        loading={false}
      >
        <div className='space-y-3'>
          <p className='text-sm text-gray-700'>
            {pendingAction?.action === 'approve'
              ? copy.receipts.confirmApprove || 'Approve this receipt?'
              : copy.receipts.confirmReject || 'Reject this receipt?'}
          </p>
          {pendingAction?.action === 'reject' && (
            <div className='space-y-1'>
              <label className='text-xs text-gray-600'>{copy.receipts.table.reason}</label>
              <textarea
                className='w-full rounded border border-gray-300 px-2 py-1 text-sm'
                rows={3}
                value={pendingReason}
                onChange={e => setPendingReason(e.target.value)}
                placeholder={copy.receipts.table.reason}
              />
            </div>
          )}
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default AdminDepositReceiptsSection;
