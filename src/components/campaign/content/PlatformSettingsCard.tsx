import React from 'react';
import Card from '../../ui/Card';
import FormField from '../../ui/FormField';

interface PlatformSettingsOption {
  value: string;
  label: string;
}

interface PlatformSettingsCardProps {
  value: string;
  options: PlatformSettingsOption[];
  onChange: (value: string) => void;
  title: string;
  placeholder: string;
}

const PlatformSettingsCard: React.FC<PlatformSettingsCardProps> = ({
  value,
  options,
  onChange,
  title,
  placeholder,
}) => (
  <Card>
    <div className='space-y-3'>
      <h3 className='text-lg font-medium text-gray-900'>{title}</h3>
      <FormField
        id='platformSettingsId'
        label=''
        type='select'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        options={options}
      />
    </div>
  </Card>
);

export default PlatformSettingsCard;
