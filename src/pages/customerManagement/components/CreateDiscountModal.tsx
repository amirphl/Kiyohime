import React from 'react';
import { Calculator } from 'lucide-react';
import Button from '../../../components/ui/Button';
import AgencyCalculatorModal from '../../../components/calculator/Calculator';

interface CustomerInfo {
  representative_first_name: string;
  representative_last_name: string;
  company_name?: string | null;
}

interface CreateDiscountModalProps {
  isOpen: boolean;
  isGlobal: boolean;
  customers: Array<{ customer_id: number; representative_first_name: string; representative_last_name: string; company_name?: string | null }>;
  selectedCustomerInfo: CustomerInfo | null;
  globalCustomerId: number | '';
  onSelectCustomer: (id: number | '') => void;
  newDiscountName: string;
  newDiscountRate: string;
  onChangeName: (value: string) => void;
  onChangeRate: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  createError: string | null;
  submitting: boolean;
  language: string;
  calcTranslations: any;
  calcOpen: boolean;
  onCalcOpen: () => void;
  onCalcClose: () => void;
  onCalcApply: (percent: number) => void;
  copy: any;
}

const CreateDiscountModal: React.FC<CreateDiscountModalProps> = ({
  isOpen,
  isGlobal,
  customers,
  selectedCustomerInfo,
  globalCustomerId,
  onSelectCustomer,
  newDiscountName,
  newDiscountRate,
  onChangeName,
  onChangeRate,
  onClose,
  onSubmit,
  createError,
  submitting,
  language,
  calcTranslations,
  calcOpen,
  onCalcOpen,
  onCalcClose,
  onCalcApply,
  copy,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-md w-full p-6 relative'>
        <div className='flex items-center justify-between mb-4'>
          <h4 className='text-lg font-medium text-gray-900'>
            {copy.discountCreateTitle}
          </h4>
          <Button variant='outline' onClick={onCalcOpen}>
            <Calculator className='h-4 w-4 mr-2' /> {calcTranslations.openCalculator}
          </Button>
        </div>
        {createError && (
          <div className='text-red-600 mb-2 text-sm'>{createError}</div>
        )}
        <div className='space-y-4'>
          {isGlobal && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {copy.discountSelectCustomer}
              </label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                value={globalCustomerId}
                onChange={e =>
                  onSelectCustomer(
                    e.target.value ? parseInt(e.target.value, 10) : ''
                  )
                }
              >
                <option value=''>--</option>
                {customers.map(c => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {`${c.representative_first_name || ''} ${c.representative_last_name || ''}`.trim()}{' '}
                    {c.company_name ? `- ${c.company_name}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
          {!isGlobal && selectedCustomerInfo && (
            <div className='p-3 bg-gray-50 rounded border text-sm text-gray-700'>
              <div>
                <span className='font-medium'>
                  {copy.discountCustomer}:
                </span>{' '}
                {`${selectedCustomerInfo.representative_first_name || ''} ${selectedCustomerInfo.representative_last_name || ''}`.trim()}
              </div>
              <div>
                <span className='font-medium'>
                  {copy.companyName}:
                </span>{' '}
                {selectedCustomerInfo.company_name ?? '-'}
              </div>
            </div>
          )}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {copy.discountName}
            </label>
            <input
              type='text'
              value={newDiscountName}
              onChange={e => onChangeName(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {copy.discountRateLabel}
            </label>
            <input
              type='number'
              step='0.01'
              min='0'
              max='100'
              value={newDiscountRate}
              onChange={e => onChangeRate(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500'
            />
          </div>
          <div className='flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={onClose}
              disabled={submitting}
            >
              {copy.discountCancel}
            </Button>
            <Button variant='primary' onClick={onSubmit} disabled={submitting}>
              {copy.discountCreate}
            </Button>
          </div>
        </div>
        {calcOpen && (
          <AgencyCalculatorModal
            isOpen={calcOpen}
            onClose={onCalcClose}
            translations={calcTranslations}
            dir={language === 'fa' ? 'rtl' : 'ltr'}
            onApply={onCalcApply}
          />
        )}
      </div>
    </div>
  );
};

export default CreateDiscountModal;
