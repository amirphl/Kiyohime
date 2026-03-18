import React from 'react';
import { SignupTranslations } from '../translations';

interface Props {
  accepted: boolean;
  onChange: (checked: boolean) => void;
  strings: SignupTranslations;
}

const TermsCheckbox: React.FC<Props> = ({ accepted, onChange, strings }) => (
  <div className='flex items-start gap-2 border-t pt-6'>
    <input
      id='acceptedTerms'
      type='checkbox'
      checked={accepted}
      onChange={e => onChange(e.target.checked)}
      className='mt-1'
    />
    <label htmlFor='acceptedTerms' className='text-sm text-gray-700'>
      <a
        href='/terms'
        className='text-primary-600 hover:text-primary-700'
        target='_blank'
        rel='noopener noreferrer'
      >
        {strings.acceptTerms}
      </a>
    </label>
  </div>
);

export default TermsCheckbox;
