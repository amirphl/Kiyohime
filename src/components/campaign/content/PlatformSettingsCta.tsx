import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Card from '../../ui/Card';

interface PlatformSettingsCtaProps {
  label: string;
  actionRequiredLabel: string;
  goToSettingsLabel: string;
  onClick: () => void;
}

const PlatformSettingsCta: React.FC<PlatformSettingsCtaProps> = ({
  label,
  actionRequiredLabel,
  goToSettingsLabel,
  onClick,
}) => {
  return (
    <Card className='border-red-200 bg-gradient-to-br from-red-50 to-white'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center gap-2 text-red-700'>
          <AlertTriangle className='h-5 w-5' />
          <span className='text-sm font-semibold'>{actionRequiredLabel}</span>
        </div>
        <p className='text-sm text-red-600'>
          {label}
        </p>
        <div>
          <button
            type='button'
            onClick={onClick}
            className='inline-flex items-center justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50'
          >
            {goToSettingsLabel}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PlatformSettingsCta;
