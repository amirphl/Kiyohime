import React from 'react';
import { Building2 } from 'lucide-react';
import { SignupTranslations } from '../translations';
import { SignupFormData, FormErrors } from '../types';

interface Props {
  formData: SignupFormData;
  errors: FormErrors;
  onChange: (name: keyof SignupFormData, value: string) => void;
  requiredLabel: React.ReactNode;
  strings: SignupTranslations;
  isRTL: boolean;
}

const CompanyFields: React.FC<Props> = ({ formData, errors, onChange, requiredLabel, strings, isRTL }) => (
  <div className='space-y-6 border-t pt-6'>
    <h3 className={`text-lg font-medium text-gray-900 flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
      <Building2 className='h-5 w-5' />
      <span>{strings.companyInfo}</span>
    </h3>

    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {strings.companyName} {requiredLabel}
        </label>
        <input
          type='text'
          name='companyName'
          value={formData.companyName}
          onChange={e => onChange('companyName', e.target.value)}
          className='input-field'
          placeholder={strings.companyNamePlaceholder}
          maxLength={60}
        />
        {errors.companyName && <p className='mt-1 text-sm text-red-600'>{errors.companyName}</p>}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {strings.nationalId} {requiredLabel}
        </label>
        <input
          type='text'
          name='nationalId'
          value={formData.nationalId}
          onChange={e => onChange('nationalId', e.target.value)}
          className='input-field'
          placeholder={strings.nationalIdPlaceholder}
          maxLength={11}
        />
        {errors.nationalId && <p className='mt-1 text-sm text-red-600'>{errors.nationalId}</p>}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {strings.companyPhone} {requiredLabel}
        </label>
        <input
          type='tel'
          name='companyPhone'
          value={formData.companyPhone}
          onChange={e => onChange('companyPhone', e.target.value)}
          className='input-field'
          placeholder={strings.companyPhonePlaceholder}
          maxLength={11}
        />
        {errors.companyPhone && <p className='mt-1 text-sm text-red-600'>{errors.companyPhone}</p>}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {strings.postalCode} {requiredLabel}
        </label>
        <input
          type='text'
          name='postalCode'
          value={formData.postalCode}
          onChange={e => onChange('postalCode', e.target.value)}
          className='input-field'
          placeholder={strings.postalCodePlaceholder}
          maxLength={10}
        />
        {errors.postalCode && <p className='mt-1 text-sm text-red-600'>{errors.postalCode}</p>}
      </div>
    </div>

    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {strings.companyAddress} {requiredLabel}
      </label>
      <textarea
        name='companyAddress'
        value={formData.companyAddress}
        onChange={e => onChange('companyAddress', e.target.value)}
        rows={3}
        className='input-field'
        placeholder={strings.companyAddressPlaceholder}
        maxLength={255}
      />
      {errors.companyAddress && <p className='mt-1 text-sm text-red-600'>{errors.companyAddress}</p>}
    </div>
  </div>
);

export default CompanyFields;
