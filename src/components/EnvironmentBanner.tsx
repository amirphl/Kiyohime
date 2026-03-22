import React from 'react';
import { useConfig } from '../hooks/useConfig';
import { isProduction } from '../config/environment';

const EnvironmentBanner: React.FC = () => {
  const config = useConfig();

  // Don't show banner on production
  if (isProduction()) {
    return null;
  }

  const bannerConfig = {
    text: 'Local Environment',
    bgColor: '#f59e0b',
    textColor: 'white',
  };

  return (
    <div
      className='w-full py-2 text-center text-sm font-medium'
      style={{
        backgroundColor: bannerConfig.bgColor,
        color: bannerConfig.textColor,
      }}
    >
      {bannerConfig.text} - {config.domain}
    </div>
  );
};

export default EnvironmentBanner;
