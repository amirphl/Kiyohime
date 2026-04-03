import React from 'react';
import Card from '../../ui/Card';
import FormField from '../../ui/FormField';

interface ActiveServiceOption {
  value: string;
  label: string;
}

interface ActiveServiceCardProps {
  value: string;
  options: ActiveServiceOption[];
  onChange: (value: string) => void;
  title: string;
  placeholder: string;
}

const ActiveServiceCard: React.FC<ActiveServiceCardProps> = ({
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
        id='activeService'
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

export default ActiveServiceCard;
