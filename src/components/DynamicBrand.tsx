import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useConfig } from '../hooks/useConfig';
import { useLanguage } from '../hooks/useLanguage';

interface DynamicBrandProps {
  showSubtitle?: boolean;
  className?: string;
}

const DynamicBrand: React.FC<DynamicBrandProps> = ({
  showSubtitle = true,
  className = '',
}) => {
  const config = useConfig();
  const { isRTL } = useLanguage();

  return (
    <div
      className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} ${className}`}
    >
      <div
        className='flex items-center justify-center w-10 h-10 rounded-lg bg-red-600'
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className='w-6 h-6'
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <div>
        <h1 className='text-xl font-bold text-gray-900'>{config.brandName}</h1>
        {showSubtitle && (
          <p className='text-sm text-gray-500'>{config.brandSubtitle}</p>
        )}
      </div>
    </div>
  );
};

export default DynamicBrand;
