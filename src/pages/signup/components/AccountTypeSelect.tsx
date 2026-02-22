import React from 'react';
import { SignupTranslations } from '../translations';
import { AccountType } from '../types';

interface Props {
  value: AccountType;
  error?: string;
  onChange: (name: 'accountType', value: string) => void;
  requiredLabel: React.ReactNode;
  strings: SignupTranslations;
}

const AccountTypeSelect: React.FC<Props> = ({ value, error, onChange, requiredLabel, strings }) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-2'>
      {strings.accountType} {requiredLabel}
    </label>
    <div className='space-y-2'>
      {[
        { id: 'individual', label: strings.individual },
        { id: 'independent_company', label: strings.independentCompany },
        { id: 'marketing_agency', label: strings.marketingAgency },
      ].map(option => (
        <label key={option.id} className='flex items-center space-x-2 text-sm text-gray-700'>
          <input
            type='radio'
            name='accountType'
            value={option.id}
            checked={value === option.id}
            onChange={e => onChange('accountType', e.target.value)}
            className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300'
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
    {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
  </div>
);

export default AccountTypeSelect;
