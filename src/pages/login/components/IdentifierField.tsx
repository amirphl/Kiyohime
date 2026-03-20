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
        type={isOtp ? 'tel' : 'text'}
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        ref={inputRef}
        className='input-field'
        placeholder={placeholder}
        dir='ltr'
        required
        inputMode={isOtp ? 'numeric' : undefined}
        pattern={isOtp ? '[0-9+]+' : undefined}
      />
      {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
    </div>
  );
};

export default IdentifierField;
