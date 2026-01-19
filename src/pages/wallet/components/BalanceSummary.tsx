import React from 'react';
import { WalletBalances } from '../hooks/useWalletBalance';
import { WalletCopy } from '../translations';

interface BalanceSummaryProps {
  balances: WalletBalances;
  loading: boolean;
  error: string | null;
  currencyLabel: string;
  formatDatetime: (iso: string) => string;
  isMarketingAgency: boolean;
  copy: WalletCopy;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  balances,
  loading,
  error,
  currencyLabel,
  isMarketingAgency,
  copy,
}) => {
  const renderAmount = (value: number | null) =>
    loading && value === null
      ? 'Loading...'
      : `${(value ?? 0).toLocaleString()} ${currencyLabel}`;

  const secondaryGridCols = isMarketingAgency ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <div className='space-y-2'>
      <h2 className='text-lg font-medium text-gray-900'>
        {copy.currentBalance}
      </h2>
      <div className='grid grid-cols-4 gap-4'>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <p className='text-sm text-gray-500'>{copy.free}</p>
          <p className='text-xl font-semibold'>
            {renderAmount(balances.free)}
          </p>
        </div>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <p className='text-sm text-gray-500'>{copy.credit}</p>
          <p className='text-xl font-semibold'>
            {renderAmount(balances.credit)}
          </p>
        </div>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <p className='text-sm text-gray-500'>{copy.reserved}</p>
          <p className='text-xl font-semibold'>
            {renderAmount(balances.reserved)}
          </p>
        </div>
      </div>
      <div className={`grid ${secondaryGridCols} gap-4`}>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <p className='text-sm text-gray-500'>{copy.spendOnCampaigns}</p>
          <p className='text-xl font-semibold'>
            {renderAmount(balances.spendOnCampaigns)}
          </p>
        </div>
        {isMarketingAgency && (
          <div className='bg-gray-50 p-4 rounded-lg'>
            <p className='text-sm text-gray-500'>{copy.agencyShareWithTax}</p>
            <p className='text-xl font-semibold'>
              {renderAmount(balances.agencyShareWithTax)}
            </p>
          </div>
        )}
      </div>
      {error && <p className='text-sm text-red-600'>{error}</p>}
    </div>
  );
};

export default BalanceSummary;
