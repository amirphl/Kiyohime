import React from 'react';
import { PlatformKey } from '../../../types/platformSettings';

interface PlatformSelectorProps {
  value: PlatformKey;
  onChange: (value: PlatformKey) => void;
  options: Array<{ value: PlatformKey; label: string }>;
  label: string;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ value, onChange, options, label }) => {
  return (
    <div className='space-y-2'>
      <div className='text-sm font-medium text-gray-700'>{label}</div>
      <div className='flex flex-wrap gap-4'>
        {options.map(option => (
          <label key={option.value} className='inline-flex items-center gap-2 text-sm text-gray-700'>
            <input
              type='radio'
              name='platform'
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className='text-primary-600 focus:ring-primary-500'
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;
