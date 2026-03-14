import React from 'react';
import { AdminCustomerManagementCopy } from '../translations';

interface TotalsGridProps {
  totals: {
    sum_agency_share_with_tax?: number | null;
    sum_system_share?: number | null;
    sum_tax_share?: number | null;
    sum_total_sent?: number | null;
  } | null;
  formatNumber: (n?: number | null) => string;
  copy: AdminCustomerManagementCopy;
}

const TotalsGrid: React.FC<TotalsGridProps> = ({ totals, formatNumber, copy }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {copy.totals.agencyIncome}
      </div>
      <div className="text-lg font-semibold text-gray-900">
        {formatNumber(totals?.sum_agency_share_with_tax)}
      </div>
    </div>
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {copy.totals.systemIncome}
      </div>
      <div className="text-lg font-semibold text-gray-900">
        {formatNumber(totals?.sum_system_share)}
      </div>
    </div>
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {copy.totals.tax}
      </div>
      <div className="text-lg font-semibold text-gray-900">
        {formatNumber(totals?.sum_tax_share)}
      </div>
    </div>
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {copy.totals.totalSent}
      </div>
      <div className="text-lg font-semibold text-gray-900">
        {formatNumber(totals?.sum_total_sent)}
      </div>
    </div>
  </div>
);

export default TotalsGrid;
