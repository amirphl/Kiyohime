import React from 'react';
import { Phone } from 'lucide-react';
import Card from '../../ui/Card';
import FormField from '../../ui/FormField';

interface LineNumberCardProps {
  value: string;
  options: Array<{ value: string; label: string; priceFactor?: number }>;
  isLoading: boolean;
  error: string | null;
  onChange: (value: string) => void;
  title: string;
  label: string;
  placeholder: string;
  helpText: string;
  priceFactorLabel?: string;
}

const LineNumberCard: React.FC<LineNumberCardProps> = ({
  value,
  options,
  isLoading,
  error,
  onChange,
  title,
  label,
  placeholder,
  helpText,
  priceFactorLabel,
}) => {
  const selected = options.find(opt => opt.value === value);
  return (
    <Card>
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-1">
          <Phone className="h-5 w-5 text-primary-600" />
          {title}
        </h3>

        {error ? (
          <div className="text-red-600 text-sm">{error}</div>
        ) : (
          <FormField
            id="lineNumber"
            label={isLoading ? 'Loading...' : label}
            type="select"
            options={options}
            value={value}
            onChange={onChange}
            required
            placeholder={placeholder}
          />
        )}

        {priceFactorLabel && selected?.priceFactor !== undefined && (
          <div className="text-sm text-gray-700">
            {priceFactorLabel}: <span className="font-medium">{selected.priceFactor}</span>
          </div>
        )}

        <div className="text-sm text-gray-500">
          {helpText}
        </div>
      </div>
    </Card>
  );
};

export default LineNumberCard;
