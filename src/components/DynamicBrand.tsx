import React from 'react';
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
      <img
        src={config.ui.logoUrl}
        alt={config.brandName}
        className='w-10 h-10 rounded-lg object-contain bg-white border border-gray-200'
        loading='lazy'
      />
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
