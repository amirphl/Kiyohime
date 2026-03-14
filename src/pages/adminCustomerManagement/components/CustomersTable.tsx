import React from 'react';
import Button from '../../../components/ui/Button';
import { AdminCustomerManagementCopy } from '../translations';
import { AdminCustomersSharesResponse } from '../../../types/admin';

interface CustomersTableProps {
  items: AdminCustomersSharesResponse['items'];
  loading: boolean;
  error: string | null;
  copy: AdminCustomerManagementCopy;
  onToggleActive: (customerId: number, current?: boolean | null) => void;
  onViewDetails: (customerId: number) => void;
  onShowDiscounts: (customerId: number) => void;
  toggleLoadingId: number | null;
  formatNumber: (n?: number | null) => string;
  toPct: (v?: number | null) => string;
}

const CustomersTable: React.FC<CustomersTableProps> = ({
  items,
  loading,
  error,
  copy,
  onToggleActive,
  onViewDetails,
  onShowDiscounts,
  toggleLoadingId,
  formatNumber,
  toPct,
}) => {
  const headers = copy.table.headers;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {headers.row}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {headers.customerName}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {headers.representativeName}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {headers.agencyName}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {headers.accountType}
              </th>
              {/* <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {headers.isActive}
              </th> */}
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {headers.toggle}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {headers.totalSent}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {headers.clickRate}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {headers.agencyIncome}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {headers.systemIncome}
              </th>
              {/* <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {headers.tax}
              </th> */}
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {headers.details}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {headers.discounts}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={14} className="px-6 py-6 text-center text-gray-500">
                  {copy.common.loading}
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={14} className="px-6 py-6 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : !items || items.length === 0 ? (
              <tr>
                <td colSpan={14} className="px-6 py-6 text-center text-gray-500">
                  {copy.table.noData}
                </td>
              </tr>
            ) : (
              items.map((it, idx) => (
                <tr key={`${it.customer_id}-${idx}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center text-gray-900">{idx + 1}</td>
                  <td className="px-4 py-3 text-center text-gray-900">{it.company_name || '-'}</td>
                  <td className="px-4 py-3 text-center text-gray-700">
                    {it.full_name || `${it.first_name} ${it.last_name}`.trim() || '-'}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">{it.referrer_agency_name || '-'}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{it.account_type_name || '-'}</td>
                  {/* <td className="px-4 py-3 text-center text-gray-700">
                    {typeof it.is_active === 'boolean'
                      ? (it.is_active ? copy.common.yes : copy.common.no)
                      : '-'}
                  </td> */}
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleActive(it.customer_id || 0, it.is_active ?? null)}
                      disabled={toggleLoadingId === (it.customer_id || 0)}
                    >
                      {toggleLoadingId === (it.customer_id || 0)
                        ? copy.common.loading
                        : (it.is_active ? copy.actions.deactivate : copy.actions.activate)}
                    </Button>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">{formatNumber(it.total_sent)}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{toPct(it.click_rate)}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{formatNumber(it.agency_share_with_tax)}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{formatNumber(it.system_share)}</td>
                  {/* <td className="px-4 py-3 text-right text-gray-700">{formatNumber(it.tax_share)}</td> */}
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(it.customer_id || 0)}
                    >
                      {copy.actions.view}
                    </Button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onShowDiscounts(it.customer_id || 0)}
                    >
                      {copy.actions.show}
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
};

export default CustomersTable;
