// Environment configuration for multi-domain deployment
export interface EnvironmentConfig {
  // Domain and URL settings
  domain: string;
  baseUrl: string;
  apiUrl: string;

  // Brand settings
  brandName: string;
  brandSubtitle: string;

  // Feature flags
  features: {
    smsMarketing: boolean;
    analytics: boolean;
  };

  // API endpoints (same for all configurations)
  endpoints: {
    auth: {
      login: string;
      signup: string;
      verifyOtp: string;
      resendOtp: string;
    };
    campaigns: {
      list: string;
      create: string;
      calculateCosts: string;
      calculateCapacity: string;
      calculateCost: string;
      update: string;
    };
    wallet: {
      balance: string;
    };
    analytics: {
      dashboard: string;
      reports: string;
    };
  };

  // UI/UX settings
  ui: {
    primaryColor: string;
    logoUrl: string;
    faviconUrl: string;
    theme: 'light' | 'dark' | 'auto';
  };

  // Localization settings (always enabled)
  localization: {
    defaultLanguage: 'en' | 'fa';
    supportedLanguages: Array<'en' | 'fa'>;
    rtlLanguages: Array<'fa'>;
  };
}

// Default configuration
const defaultConfig: EnvironmentConfig = {
  domain: 'yamata-no-orochi.com',
  baseUrl: 'https://yamata-no-orochi.com:8443',
  apiUrl: 'https://yamata-no-orochi.com:8443/api/v1',

  brandName: 'Jaazebeh',
  brandSubtitle: 'SMS Marketing Platform',

  features: {
    smsMarketing: true,
    analytics: true,
  },

  endpoints: {
    auth: {
      login: '/auth/login',
      signup: '/auth/signup',
      verifyOtp: '/auth/verify',
      resendOtp: '/auth/resend-otp',
    },
    campaigns: {
      list: '/sms-campaigns',
      create: '/sms-campaigns',
      calculateCosts: '/campaigns/calculate-costs',
      calculateCapacity: '/sms-campaigns/calculate-capacity',
      calculateCost: '/sms-campaigns/calculate-cost',
      update: '/sms-campaigns/:uuid',
    },
    wallet: {
      balance: '/wallet/balance',
    },
    analytics: {
      dashboard: '/analytics/dashboard',
      reports: '/analytics/reports',
    },
  },

  ui: {
    primaryColor: '#2563eb',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    theme: 'light',
  },

  localization: {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'fa'],
    rtlLanguages: ['fa'],
  },
};

// Domain-specific configurations
const domainConfigs: Record<string, Partial<EnvironmentConfig>> = {
  // Yamata no Orochi domain (set in /etc/hosts) - Local development
  'yamata-no-orochi.com': {
    domain: 'yamata-no-orochi.com',
    baseUrl: 'https://yamata-no-orochi.com:8443',
    apiUrl: 'https://yamata-no-orochi.com:8443/api/v1',
    brandName: 'Yamata no Orochi',
    brandSubtitle: 'SMS Marketing Platform',
    features: {
      smsMarketing: true,
      analytics: true,
    },
    ui: {
      primaryColor: '#22c55e',
      logoUrl: '/logo-yamata.png',
      faviconUrl: '/favicon-yamata.ico',
      theme: 'light',
    },
  },
};

// Get current domain
const getCurrentDomain = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }

  // For production, use the domain from .env
  if (process.env.REACT_APP_PRODUCTION_DOMAIN) {
    return process.env.REACT_APP_PRODUCTION_DOMAIN;
  }

  return process.env.REACT_APP_DOMAIN || 'yamata-no-orochi.com';
};

// Get environment configuration
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const currentDomain = getCurrentDomain();
  let domainConfig = domainConfigs[currentDomain] || {};

  // For production domain (not in predefined configs), create dynamic config
  if (
    process.env.REACT_APP_PRODUCTION_DOMAIN &&
    currentDomain === process.env.REACT_APP_PRODUCTION_DOMAIN
  ) {
    domainConfig = {
      domain: currentDomain,
      baseUrl: `https://${currentDomain}`,
      apiUrl: `https://${currentDomain}/api/v1`,
      brandName: 'Jaazebeh',
      brandSubtitle: 'SMS Marketing Platform',
      features: {
        smsMarketing: true,
        analytics: true,
      },
      ui: {
        primaryColor: '#2563eb',
        logoUrl: '/logo.png',
        faviconUrl: '/favicon.ico',
        theme: 'light',
      },
    };
  }

  // Merge with default config
  const config: EnvironmentConfig = {
    ...defaultConfig,
    ...domainConfig,
    features: {
      ...defaultConfig.features,
      ...domainConfig.features,
    },
    endpoints: {
      ...defaultConfig.endpoints,
      ...domainConfig.endpoints,
    },
    ui: {
      ...defaultConfig.ui,
      ...domainConfig.ui,
    },
    localization: {
      ...defaultConfig.localization,
      ...domainConfig.localization,
    },
  };

  return config;
};

// Export current config
export const config = getEnvironmentConfig();

// Helper functions
export const isProduction = (): boolean => {
  return config.domain !== 'yamata-no-orochi.com';
};

export const isDevelopment = (): boolean => {
  return config.domain === 'yamata-no-orochi.com';
};

export const isStaging = (): boolean => {
  return false; // No staging environment
};

export const getApiUrl = (endpoint: string): string => {
  return `${config.apiUrl}${endpoint}`;
};

export const getFullUrl = (path: string): string => {
  return `${config.baseUrl}${path}`;
};
