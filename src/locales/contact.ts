export const contactI18n = {
  en: {
    title: 'Contact Us',
    companyName: 'Rahkarhaye Hadafmand-e Khalagh Company (Private Joint Stock)',
    address:
      'Address: Tehran, Molla Sadra Street, North Shirazi Street, Hakim Azam Street, No. 19, Monstrect',
    postalCode: 'Postal Code: 1991647419',
    nationalId: 'National ID: 14013340169',
    registrationNumber: 'Registration Number: 646905',
    email: 'info@jazebeh.ir',
    phone: 'Phone: +982189677330 - +982189670000',
  },
  fa: {
    title: 'تماس با ما',
    companyName: 'شرکت راه کارهای هدفمند خلاق (سهامی خاص)',
    address:
      'نشانی: استان تهران، شهرستان تهران، بخش مرکزی، شهر تهران، امانیه، خیابان آرامش، خیابان نیلوفر، پلاک 10، طبقه 5، واحد جنوبی',
    postalCode: 'کدپستی: ۱۹۶۷۷۵۸۴۵۴',
    nationalId: 'شناسه ملی: ۱۴۰۱۳۳۴۰۱۶۹',
    registrationNumber: 'شماره ثبت: ۶۴۶۹۰۵',
    email: 'info@jazebeh.ir',
    phone: 'تلفن ثابت: ۰۲۱۲۶۲۱۳۹۶۲',
  },
} as const;

export type ContactLocale = keyof typeof contactI18n;
