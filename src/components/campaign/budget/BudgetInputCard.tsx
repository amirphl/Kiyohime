import React from 'react';
import { DollarSign } from 'lucide-react';
import Card from '../../ui/Card';
import FormField from '../../ui/FormField';

interface BudgetInputCardProps {
  value: number;
  onChange: (value: number) => void;
  title: string;
  label: string;
  placeholder: string;
  helpText: string;
  validationMessage: string;
  currencyLabel: string;
  budgetLabel: string;
}

const BudgetInputCard: React.FC<BudgetInputCardProps> = ({
  value,
  onChange,
  title,
  label,
  placeholder,
  helpText,
  validationMessage,
  currencyLabel,
  budgetLabel,
}) => {
  const formatBudget = (budget: number) => {
    return `${budget.toLocaleString()} ${currencyLabel}`;
  };

  return (
    <Card>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900 flex items-center gap-1'>
          <DollarSign className='h-5 w-5 text-primary-600' />
          {title}
        </h3>

        <FormField
          id='totalBudget'
          label={label}
          type='number'
          placeholder={placeholder}
          value={value || ''}
          onChange={(v: number) => onChange(Number(v))}
          validation={{
            min: 100000,
            max: 160000000,
            step: 100000,
            message: validationMessage,
          }}
          required
        />

        {value > 0 && (
          <div className='text-sm text-gray-600 bg-gray-50 p-2 rounded'>
            <span className='font-medium'>{budgetLabel}:</span>{' '}
            {formatBudget(value)}
          </div>
        )}

        <div className='text-sm text-gray-500'>{helpText}</div>
      </div>
    </Card>
  );
};

export default BudgetInputCard;
