import React from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { SignupTranslations } from '../translations';
import { SignupFormData, FormErrors } from '../types';

interface Props {
  formData: SignupFormData;
  errors: FormErrors;
  onChange: (name: keyof SignupFormData, value: string) => void;
  requiredLabel: React.ReactNode;
  strings: SignupTranslations;
  isRTL: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

const CredentialsFields: React.FC<Props> = ({
  formData,
  errors,
  onChange,
  requiredLabel,
  strings,
  isRTL,
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
}) => (
  <div className='space-y-6 border-t pt-6'>
    <h3 className={`text-lg font-medium text-gray-900 flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
      <Lock className='h-5 w-5' />
      <span>{strings.credentials}</span>
    </h3>

    {formData.accountType === 'marketing_agency' && (
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {strings.sheba} {requiredLabel}
        </label>
        <div className='relative'>
          <span className='absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium' dir='ltr'>
            IR
          </span>
          <input
            type='text'
            name='shebaNumber'
            value={formData.shebaNumber}
            onChange={e => onChange('shebaNumber', e.target.value)}
            className='input-field pl-10'
            dir={isRTL ? 'ltr' : undefined}
            placeholder={strings.shebaPlaceholder}
            maxLength={24}
          />
        </div>
        {errors.shebaNumber && <p className='mt-1 text-sm text-red-600'>{errors.shebaNumber}</p>}
      </div>
    )}

    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {strings.email} {requiredLabel}
        </label>
        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={e => onChange('email', e.target.value)}
          className='input-field'
          placeholder={strings.emailPlaceholder}
        />
        {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email}</p>}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {strings.password} {requiredLabel}
        </label>
        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            value={formData.password}
            onChange={e => onChange('password', e.target.value)}
            className={`input-field ${isRTL ? 'pl-10' : 'pr-10'}`}
            placeholder={strings.passwordPlaceholder}
          />
          <button
            type='button'
            onClick={onTogglePassword}
            className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
          >
            {showPassword ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
          </button>
        </div>
        {errors.password && <p className='mt-1 text-sm text-red-600'>{errors.password}</p>}

        <div className='mt-2 text-xs text-gray-500'>
          <p className='font-medium mb-1'>{strings.passwordRequirements}:</p>
          <ul className='space-y-1'>
            <li>• {strings.validation.passwordMin}</li>
            <li>• {strings.validation.passwordUppercase}</li>
            <li>• {strings.validation.passwordNumber}</li>
          </ul>
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {strings.confirmPassword} {requiredLabel}
        </label>
        <div className='relative'>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={e => onChange('confirmPassword', e.target.value)}
            className={`input-field ${isRTL ? 'pl-10' : 'pr-10'}`}
            placeholder={strings.confirmPasswordPlaceholder}
          />
          <button
            type='button'
            onClick={onToggleConfirmPassword}
            className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
          >
            {showConfirmPassword ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
          </button>
        </div>
        {errors.confirmPassword && <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword}</p>}
      </div>
    </div>
  </div>
);

export default CredentialsFields;
