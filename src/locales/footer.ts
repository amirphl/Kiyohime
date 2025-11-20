export const footerI18n = {
  en: {
    description:
      'Empower your business with targeted SMS marketing campaigns. Reach your customers with precision and drive results.',
    quickLinks: 'Quick Links',
    support: 'Support',
    helpCenter: 'Help Center',
    contactUs: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    copyright: '© 2024 SMS Platform. All rights reserved.',
  },
  fa: {
    description: 'بازاریابی خود را با جاذبه علمی و شخصی‌سازی‌شده کنید. از ابزارهای تحلیل داده و اتومیشن ما برای بهینه‌سازی تجربهٔ مشتری و افزایش نرخ تبدیل بهره ببرید',
    quickLinks: 'لینک‌های سریع',
    support: 'پشتیبانی',
    helpCenter: 'مرکز راهنمایی',
    contactUs: 'تماس با ما',
    privacyPolicy: 'حریم خصوصی',
    termsOfService: 'شرایط خدمات',
    copyright: 'صاحب امتیاز تمامی حقوق وب‌سایت، شرکت راه‌کارهای هدفمند خلاق می‌باشد',
  },
} as const;

export type FooterLocale = keyof typeof footerI18n; 