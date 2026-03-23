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
  min: number;
  max: number;
  step: number;
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
  min,
  max,
  step,
}) => {
  const formatBudget = (budget: number) => {
    return `${budget.toLocaleString()} ${currencyLabel}`;
  };
  const isOutOfRange = value > 0 && (value < min || value > max);
  const error = isOutOfRange ? validationMessage : undefined;

  const handleBlur = () => {
    if (value <= 0) return;
    const rounded = Math.round(value / step) * step;
    const adjusted = rounded === 0 ? step : rounded;
    if (adjusted !== value) {
      onChange(adjusted);
    }
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
          onBlur={handleBlur}
          error={error}
          validation={{
            min,
            max,
            step,
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
