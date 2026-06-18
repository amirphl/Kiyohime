import React from 'react';
import Button from '../../../components/ui/Button';
import { BundlesCopy } from '../translations';

interface BundlesFiltersBarProps {
  copy: BundlesCopy;
  titleFilter: string;
  customerFilter: string;
  customerOptions: string[];
  onTitleFilterChange: (value: string) => void;
  onCustomerFilterChange: (value: string) => void;
  onClear: () => void;
}

const BundlesFiltersBar: React.FC<BundlesFiltersBarProps> = ({
  copy,
  titleFilter,
  customerFilter,
  customerOptions,
  onTitleFilterChange,
  onCustomerFilterChange,
  onClear,
}) => {
  return (
    <section className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6'>
      <div className='grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(220px,1fr)_auto] lg:items-end'>
        <div>
          <label className='mb-2 block text-sm font-semibold text-gray-700'>
            {copy.filters.titleLabel}
          </label>
          <input
            type='text'
            value={titleFilter}
            onChange={event => onTitleFilterChange(event.target.value)}
            placeholder={copy.filters.titlePlaceholder}
            className='input-field'
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-semibold text-gray-700'>
            {copy.filters.customerLabel}
          </label>
          <select
            value={customerFilter}
            onChange={event => onCustomerFilterChange(event.target.value)}
            className='input-field'
          >
            <option value=''>{copy.filters.allCustomers}</option>
            {customerOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className='lg:pb-0.5'>
          <Button variant='outline' fullWidth onClick={onClear}>
            {copy.filters.clear}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BundlesFiltersBar;
