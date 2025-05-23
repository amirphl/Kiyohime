import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useConfig } from '../hooks/useConfig';
import { useLanguage } from '../hooks/useLanguage';

interface DynamicBrandProps {
  showSubtitle?: boolean;
  className?: string;
}

const DynamicBrand: React.FC<DynamicBrandProps> = ({ showSubtitle = true, className = '' }) => {
  const config = useConfig();
  const { isRTL } = useLanguage();

  return (
    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} ${className}`}>
      <div 
        className="flex items-center justify-center w-10 h-10 rounded-lg"
        style={{ backgroundColor: config.ui.primaryColor }}
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900">{config.brandName}</h1>
        {showSubtitle && (
          <p className="text-sm text-gray-500">{config.brandSubtitle}</p>
        )}
      </div>
    </div>
  );
};

export default DynamicBrand; 