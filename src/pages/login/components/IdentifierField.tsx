import React from 'react';

interface IdentifierFieldProps {
  id?: string;
  label: string;
  placeholder?: string;
  value: string;
  error?: string;
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
  onChange,
  onBlur,
  inputRef,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className='block text-sm font-medium text-gray-700 mb-2'
      >
        {label}
      </label>
      <input
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
        autoComplete='tel'
        inputMode='tel'
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className='mt-2 text-sm text-red-600'>
          {error}
        </p>
      )}
    </div>
  );
};

export default IdentifierField;
