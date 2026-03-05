import React from 'react';
import Card from '../../ui/Card';
import FormField from '../../ui/FormField';

interface ShortLinkDomainCardProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  placeholder: string;
}

const ShortLinkDomainCard: React.FC<ShortLinkDomainCardProps> = ({
  value,
  onChange,
  title,
  placeholder,
}) => {
  const options = [
    { value: 'jo1n.ir', label: 'jo1n.ir' },
    // { value: 'joinsahel.ir', label: 'joinsahel.ir' },
  ];

  return (
    <Card>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>{title}</h3>
        <FormField
          id='shortLinkDomain'
          label={''}
          type='select'
          options={options}
          value={value}
          onChange={onChange}
          required
          placeholder={placeholder}
        />
      </div>
    </Card>
  );
};

export default ShortLinkDomainCard;
