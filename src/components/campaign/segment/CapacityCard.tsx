import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { MapPin } from 'lucide-react';
import Card from '../../ui/Card';

interface CapacityCardProps {
  title: string;
  help: string;
  isLoading: boolean;
  capacity?: number;
  fallbackCapacity?: number;
  unitsLabel: string;
  calculatingLabel: string;
  notSetLabel: string;
  lowCapacityLabel: string;
  error?: string | null;
}

const CapacityCard: React.FC<CapacityCardProps> = ({
  title,
  help,
  isLoading,
  capacity,
  fallbackCapacity,
  unitsLabel,
  calculatingLabel,
  notSetLabel,
  lowCapacityLabel,
  error,
}) => {
  const { language } = useLanguage();

  const formatNumberByLang = (n?: number) => {
    if (n === undefined || n === null) return '';
    try {
      return language === 'fa'
        ? n.toLocaleString('fa-IR')
        : n.toLocaleString('en-US');
    } catch (e) {
      return String(n);
    }
  };
  const effectiveCapacity =
    capacity !== undefined ? capacity : fallbackCapacity;
  return (
    <Card className='h-full'>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900 flex items-center gap-1'>
          <MapPin className='h-5 w-5 text-primary-600' />
          {title}
        </h3>
        <p className='text-sm text-gray-600'>{help}</p>
        <div className='flex items-center justify-between bg-gray-50 p-4 rounded-lg'>
          <div>
            {/* <p className='text-sm font-medium text-gray-700'>{title}</p> */}
            <p className='text-2xl font-bold text-primary-600'>
              {isLoading
                ? calculatingLabel
                : effectiveCapacity !== undefined
                  ? `${formatNumberByLang(effectiveCapacity)} ${unitsLabel}`
                  : notSetLabel}
            </p>
            {effectiveCapacity !== undefined && effectiveCapacity < 500 && (
              <p className='text-xs text-red-600 mt-1'>{lowCapacityLabel}</p>
            )}
          </div>
          <div className='flex items-center space-x-2'>
            {isLoading && (
              <svg
                className='animate-spin h-6 w-6 text-primary-600'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            )}
            {error && (
              <svg
                className='h-6 w-6 text-red-600'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L2.298 18c-.77 1.333.192 3 1.732 3z'
                ></path>
              </svg>
            )}
          </div>
        </div>
        {error && <p className='text-sm text-red-600'>{error}</p>}
      </div>
    </Card>
  );
};

export default CapacityCard;
