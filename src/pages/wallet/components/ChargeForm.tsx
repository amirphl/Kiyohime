import React from 'react';
import Button from '../../../components/ui/Button';
import { WalletCopy } from '../translations';

interface ChargeFormProps {
  amount: number | '';
  error: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRecommended: (amount: number) => void;
  onPay: () => void;
  recommendedAmounts: number[];
  currencyLabel: string;
  copy: WalletCopy;
}

const ChargeForm: React.FC<ChargeFormProps> = ({
  amount,
  error,
  onAmountChange,
  onSelectRecommended,
  onPay,
  recommendedAmounts,
  currencyLabel,
  copy,
}) => {
  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-medium text-gray-900'>
        {copy.chargeTitle}
      </h2>
      <div>
        <label
          htmlFor='chargeAmount'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          {copy.amountLabel}
        </label>
        <input
          type='number'
          id='chargeAmount'
          value={amount}
          onChange={onAmountChange}
          min={1_000_000}
          max={1_000_000_000}
          step={100_000}
          className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
          placeholder={copy.amountPlaceholder}
        />
        {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
      </div>

      <div className='flex flex-wrap gap-2'>
        {recommendedAmounts.map(value => (
          <Button
            key={value}
            variant='outline'
            onClick={() => onSelectRecommended(value)}
            className='px-4 py-2'
          >
            {value.toLocaleString()} {currencyLabel}
          </Button>
        ))}
      </div>

      <div className='pt-2'>
        <Button
          variant='primary'
          disabled={!!error || amount === ''}
          className='w-full'
          onClick={onPay}
        >
          {copy.pay}
        </Button>
      </div>
    </div>
  );
};

export default ChargeForm;
