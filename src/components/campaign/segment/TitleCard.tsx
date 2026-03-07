import React from 'react';
import { Target } from 'lucide-react';
import Card from '../../ui/Card';
import FormField from '../../ui/FormField';

interface TitleCardProps {
    title: string;
    onChange: (v: string) => void;
    label: string;
    placeholder: string;
    validationMessage?: string;
}

const TitleCard: React.FC<TitleCardProps> = ({ title, onChange, label, placeholder, validationMessage }) => {
    return (
        <Card>
            <div className='space-y-4'>
                <h3 className='text-lg font-medium text-gray-900 flex items-center gap-1'>
                    <Target className='h-5 w-5 text-primary-600' />
                    {label}
                </h3>
                <FormField
                    id='campaignTitle'
                    label={''}
                    type='text'
                    placeholder={placeholder}
                    value={title}
                    onChange={onChange}
                    required
                    validation={{ max: 255, message: validationMessage }}
                />
            </div>
        </Card>
    );
};

export default TitleCard; 
