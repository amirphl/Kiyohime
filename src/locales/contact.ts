export const contactI18n = {
    en: {
        title: 'Contact Us',
        companyName: 'Rahkarhaye Hadafmand-e Khalagh Company (Private Joint Stock)',
        address: 'Address: Tehran, Molla Sadra Street, North Shirazi Street, Hakim Azam Street, No. 19, Monstrect',
        postalCode: 'Postal Code: 1991647419',
        email: 'info@jazebeh.ir',
        phone: 'Phone: +98 21 8967 7330'
    },
    fa: {
        title: 'تماس با ما',
        companyName: 'شرکت راه کارهای هدفمند خلاق (سهامی خاص)',
        address: 'نشانی: استان : تهران - شهرستان : تهران - بخش : مرکزی - شهر : تهران - محله : آرارات - بزرگراه کردستان - خیابان حکیم اعظم - پلاک : -19.0 - طبقه : 3 - واحد : 6',
        postalCode: 'کدپستی: ۱۹۹۱۶۴۷۴۱۹',
        email: 'info@jazebeh.ir',
        phone: 'تلفن ثابت: ۰۲۱۸۹۶۷۷۳۳۰ - ۰۲۱۸۹۶۷۰۰۰۰'
    },
} as const;

export type ContactLocale = keyof typeof contactI18n;