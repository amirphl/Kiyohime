import { useMemo } from 'react';
import {
  config,
  getEnvironmentConfig,
  EnvironmentConfig,
} from '../config/environment';

export const useConfig = (): EnvironmentConfig => {
  return useMemo(() => {
    return getEnvironmentConfig();
  }, []);
};

// Export the static config for non-React contexts
export { config };
