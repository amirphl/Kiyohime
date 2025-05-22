import { useMemo } from 'react';
import { config, getEnvironmentConfig, EnvironmentConfig } from '../config/environment';

export const useConfig = (): EnvironmentConfig => {
  return useMemo(() => {
    // Re-evaluate config on each call to handle dynamic domain changes
    return getEnvironmentConfig();
  }, []);
};

// Export the static config for non-React contexts
export { config }; 