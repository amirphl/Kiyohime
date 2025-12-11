import React from 'react';
import Card from '../../ui/Card';
import FormField from '../../ui/FormField';

interface LevelOneCardProps {
    label: string;
    placeholder: string;
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (v: string) => void;
}

const LevelOneCard: React.FC<LevelOneCardProps> = ({ label, placeholder, options, value, onChange }) => {
    return (
        <Card>
            <div className='space-y-4'>
                <h3 className='text-lg font-medium text-gray-900'>{label}</h3>
                <FormField
                    id='level1Select'
                    label={label}
                    type='select'
                    options={options}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            </div>
        </Card>
    );
};

export default LevelOneCard;