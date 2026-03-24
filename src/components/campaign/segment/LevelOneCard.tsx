import React from 'react';
import Card from '../../ui/Card';

interface LevelOneCardProps {
    label: string;
    labelDescription?: string;
    placeholder: string;
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (v: string) => void;
}

const LevelOneCard: React.FC<LevelOneCardProps> = ({ label, labelDescription, placeholder, options, value, onChange }) => {
    return (
        <Card>
            <div className='space-y-4'>
                <h3 className='text-lg font-medium text-gray-900'>{label}</h3>
                {labelDescription && (
                    <p className='text-sm text-gray-600'>{labelDescription}</p>
                )}
                <div className='space-y-3'>
                    {options.map(opt => (
                        <label
                            key={opt.value}
                            className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-400 cursor-pointer transition'
                        >
                            <input
                                type='radio'
                                name='level1Select'
                                value={opt.value}
                                checked={value === opt.value}
                                onChange={() => onChange(opt.value)}
                                className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300'
                            />
                            <span className='text-sm text-gray-800'>{opt.label}</span>
                        </label>
                    ))}
                    {options.length === 0 && (
                        <div className='text-sm text-gray-500'>
                            {placeholder}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default LevelOneCard; 
