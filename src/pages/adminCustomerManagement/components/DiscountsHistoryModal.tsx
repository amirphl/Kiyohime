import React from 'react';
import ModalShell from './ModalShell';
import { AdminCustomerManagementCopy } from '../translations';
import { AdminCustomerDiscountHistoryItem } from '../../../types/admin';

interface DiscountsHistoryModalProps {
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  items: AdminCustomerDiscountHistoryItem[] | null;
  copy: AdminCustomerManagementCopy;
  onClose: () => void;
  formatDateTime: (iso?: string | null) => string;
  formatNumber: (n?: number | null) => string;
}

const DiscountsHistoryModal: React.FC<DiscountsHistoryModalProps> = ({
  isOpen,
  loading,
  error,
  items,
  copy,
  onClose,
  formatDateTime,
  formatNumber,
}) => (
  <ModalShell
    isOpen={isOpen}
    title={copy.modals.discountsTitle}
    onClose={onClose}
    maxWidthClassName="max-w-4xl"
  >
    {loading ? (
      <div className="text-sm text-gray-500">{copy.common.loading}</div>
    ) : (
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.discountsTable.rate}</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.discountsTable.created}</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.discountsTable.expires}</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.discountsTable.totalSent}</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.discountsTable.agencyIncome}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {error ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : items && items.length ? (
              items.map((d, idx) => (
                <tr key={`${d.created_at}-${idx}`} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2 text-right">
                    {typeof d.discount_rate === 'number' ? `${(d.discount_rate * 100).toFixed(2)}%` : '-'}
                  </td>
                  <td className="px-4 py-2">{formatDateTime(d.created_at)}</td>
                  <td className="px-4 py-2">{formatDateTime(d.expires_at)}</td>
                  <td className="px-4 py-2 text-right">{formatNumber(d.total_sent)}</td>
                  <td className="px-4 py-2 text-right">{formatNumber(d.agency_share_with_tax)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  {copy.discountsTable.noData}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}
  </ModalShell>
);

export default DiscountsHistoryModal;
