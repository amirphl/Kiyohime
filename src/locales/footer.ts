export const footerI18n = {
  en: {
    description:
      'Empower your business with targeted SMS marketing campaigns. Reach your customers with precision and drive results.',
    quickLinks: 'Quick Links',
    support: 'Support',
    helpCenter: 'Help Center',
    contactUs: 'Contact Us',
    termsOfService: 'Terms of Service',
    copyright: '© 2025 SMS Platform. All rights reserved.',
  },
  fa: {
    description: 'با جاذبه، پیام شما سرگردان نیست',
    quickLinks: 'لینک‌های سریع',
    support: 'پشتیبانی',
    helpCenter: 'مرکز راهنمایی',
    contactUs: 'تماس با ما',
    termsOfService: 'شرایط خدمات',
    copyright: 'کلیه حقوق این سامانه برای شرکت راه‌کارهای هدفمند خلاق محفوظ است.',
  },
} as const;

export type FooterLocale = keyof typeof footerI18n; 