import React from 'react';
import { User } from 'lucide-react';
import { SignupTranslations } from '../translations';
import { SignupFormData, FormErrors } from '../types';

interface Props {
  formData: SignupFormData;
  errors: FormErrors;
  onChange: (name: keyof SignupFormData, value: string) => void;
  requiredLabel: React.ReactNode;
  strings: SignupTranslations;
  isCompanyAccount: boolean;
  isRTL: boolean;
}

const PersonalInfoFields: React.FC<Props> = ({
  formData,
  errors,
  onChange,
  requiredLabel,
  strings,
  isCompanyAccount,
  isRTL,
}) => (
  <div className='space-y-6 border-t pt-6'>
    <h3 className={`text-lg font-medium text-gray-900 flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
      <User className='h-5 w-5' />
      <span>{isCompanyAccount ? strings.representativeInfo : strings.personalInfo}</span>
    </h3>

    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {strings.firstName} {requiredLabel}
        </label>
        <input
          type='text'
          name='representativeFirstName'
          value={formData.representativeFirstName}
          onChange={e => onChange('representativeFirstName', e.target.value)}
          className='input-field'
          placeholder={strings.firstNamePlaceholder}
        />
        {errors.representativeFirstName && (
          <p className='mt-1 text-sm text-red-600'>{errors.representativeFirstName}</p>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {strings.lastName} {requiredLabel}
        </label>
        <input
          type='text'
          name='representativeLastName'
          value={formData.representativeLastName}
          onChange={e => onChange('representativeLastName', e.target.value)}
          className='input-field'
          placeholder={strings.lastNamePlaceholder}
        />
        {errors.representativeLastName && (
          <p className='mt-1 text-sm text-red-600'>{errors.representativeLastName}</p>
        )}
      </div>

      {!isCompanyAccount && (
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {strings.nationalCode} {requiredLabel}
          </label>
          <input
            type='text'
            name='nationalCode'
            value={formData.nationalCode}
            onChange={e => onChange('nationalCode', e.target.value)}
            className='input-field'
            placeholder={strings.nationalCodePlaceholder}
            maxLength={11}
          />
          {errors.nationalCode && <p className='mt-1 text-sm text-red-600'>{errors.nationalCode}</p>}
        </div>
      )}
    </div>

    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {strings.mobileNumber} {requiredLabel}
      </label>
      <input
        type='tel'
        name='representativeMobile'
        value={formData.representativeMobile}
        onChange={e => onChange('representativeMobile', e.target.value)}
        className='input-field'
        placeholder={strings.mobilePlaceholder}
        maxLength={11}
      />
      {errors.representativeMobile && (
        <p className='mt-1 text-sm text-red-600'>{errors.representativeMobile}</p>
      )}
    </div>
  </div>
);

export default PersonalInfoFields;
