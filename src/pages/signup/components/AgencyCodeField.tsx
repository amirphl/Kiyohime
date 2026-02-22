import React from 'react';
import { SignupTranslations } from '../translations';
import { SignupFormData, FormErrors } from '../types';

interface Props {
  formData: SignupFormData;
  errors: FormErrors;
  onChange: (name: keyof SignupFormData, value: string) => void;
  strings: SignupTranslations;
}

const AgencyCodeField: React.FC<Props> = ({ formData, errors, onChange, strings }) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-2'>
      {strings.agencyCode}
    </label>
    <input
      type='text'
      name='referrerAgencyCode'
      value={formData.referrerAgencyCode}
      onChange={e => onChange('referrerAgencyCode', e.target.value)}
      className='input-field'
      placeholder={strings.agencyCodePlaceholder}
      maxLength={255}
    />
    {errors.referrerAgencyCode && (
      <p className='mt-1 text-sm text-red-600'>{errors.referrerAgencyCode}</p>
    )}
    <p className='mt-1 text-xs text-gray-500'>{strings.agencyCodeHelp}</p>
  </div>
);

export default AgencyCodeField;
