import React from 'react';

interface IdentifierFieldProps {
  id?: string;
  label: string;
  placeholder?: string;
  value: string;
  error?: string;
  isOtp: boolean;
  onChange: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  inputRef?: React.Ref<HTMLInputElement>;
}

const IdentifierField: React.FC<IdentifierFieldProps> = ({
  id = 'identifier',
  label,
  placeholder,
  value,
  error,
  isOtp,
  onChange,
  onBlur,
  inputRef,
}) => {
  return (
    <div>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700 mb-2'>
        {label}
      </label>
      <input
        key={isOtp ? 'otp-identifier' : 'password-identifier'}
        type='text'
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        ref={inputRef}
        className='input-field'
        placeholder={placeholder}
        dir='ltr'
        required
        autoCapitalize='none'
        autoCorrect='off'
        autoComplete={isOtp ? 'tel' : 'username'}
        inputMode={isOtp ? 'tel' : 'email'}
      />
      {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
    </div>
  );
};

export default IdentifierField;
