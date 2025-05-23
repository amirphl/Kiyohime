import React from 'react';
import { useConfig } from '../hooks/useConfig';
import { isProduction } from '../config/environment';

const EnvironmentBanner: React.FC = () => {
  const config = useConfig();

  // Don't show banner on production
  if (isProduction()) {
    return null;
  }

  const getBannerConfig = () => {
    if (config.domain === 'yamata-no-orochi.com') {
      return {
        text: 'Yamata Development',
        bgColor: '#dc2626', // Red
        textColor: 'white',
      };
    }
    return {
      text: 'Development Environment',
      bgColor: '#f59e0b', // Orange fallback
      textColor: 'white',
    };
  };

  const bannerConfig = getBannerConfig();

  return (
    <div
      className="w-full py-2 text-center text-sm font-medium"
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