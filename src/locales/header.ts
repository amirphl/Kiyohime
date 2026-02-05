export const headerI18n = {
  en: {
    brand: 'SMS Platform',
    subtitle: 'Consulting and Data-Driven Technology',
    dashboard: 'Dashboard',
    campaigns: 'Campaigns',
    analytics: 'Analytics',
    support: 'Support',
    features: 'Features',
    howItWorks: 'How It Works',
    pricing: 'Pricing',
    signin: 'Sign In',
    signup: 'Sign Up',
    logout: 'Logout',
  },
  fa: {
    brand: 'پلتفرم هوشمند و داده‌محور',
    subtitle: 'پلتفرم بازاریابی هوشمند و داده‌محور',
    dashboard: 'پیشخوان',
    campaigns: 'ارسال‌ها',
    analytics: 'تحلیلات',
    support: 'پشتیبانی',
    features: 'ویژگی‌ها',
    howItWorks: 'چگونه جاذبه به شما کمک می‌کند',
    pricing: 'قیمت‌گذاری',
    signin: 'ورود',
    signup: 'ثبت نام',
    logout: 'خروج',
  },
} as const;

export type HeaderLocale = keyof typeof headerI18n; 