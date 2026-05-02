export interface SegmentPriceFactorTranslations {
  title: string;
  subtitle: string;
  platformLabel: string;
  platformPlaceholder: string;
  level3Label: string;
  level3Placeholder: string;
  priceFactorLabel: string;
  priceFactorPlaceholder: string;
  createButton: string;
  refreshButton: string;
  listTitle: string;
  empty: string;
  errors: {
    loadOptions: string;
    loadFactors: string;
    createFailed: string;
    missingPlatform: string;
    missingLevel3: string;
    invalidPriceFactor: string;
  };
  successSaved: string;
  columns: {
    platform: string;
    level3: string;
    priceFactor: string;
    createdAt: string;
  };
}

export const segmentPriceFactorTranslations: Record<'en' | 'fa', SegmentPriceFactorTranslations> = {
  en: {
    title: 'Segment Price Factors',
    subtitle: 'Set a price factor for each Level 3 segment.',
    platformLabel: 'Platform',
    platformPlaceholder: 'Select a platform',
    level3Label: 'Level 3',
    level3Placeholder: 'Select a Level 3 option',
    priceFactorLabel: 'Price Factor',
    priceFactorPlaceholder: 'e.g. 1.25',
    createButton: 'Save',
    refreshButton: 'Refresh',
    listTitle: 'Current Price Factors',
    empty: 'No price factors yet',
    errors: {
      loadOptions: 'Failed to load Level 3 options',
      loadFactors: 'Failed to load price factors',
      createFailed: 'Create price factor failed',
      missingPlatform: 'Select a platform first',
      missingLevel3: 'Select a Level 3 option first',
      invalidPriceFactor: 'Price factor must be greater than zero',
    },
    successSaved: 'Segment price factor saved',
    columns: {
      platform: 'Platform',
      level3: 'Level 3',
      priceFactor: 'Price Factor',
      createdAt: 'Created At',
    },
  },
  fa: {
    title: 'مدیریت ضریب قیمت سگمنت',
    subtitle: 'برای هر سگمنت سطح ۳ یک ضریب قیمت ثبت کنید.',
    platformLabel: 'کانال',
    platformPlaceholder: 'یک کانال انتخاب کنید',
    level3Label: 'سطح ۳',
    level3Placeholder: 'یک گزینه سطح ۳ انتخاب کنید',
    priceFactorLabel: 'ضریب قیمت',
    priceFactorPlaceholder: 'مثلاً ۱.۲۵',
    createButton: 'ثبت',
    refreshButton: 'تازه‌سازی',
    listTitle: 'ضرایب ثبت‌شده',
    empty: 'ضریبی ثبت نشده است',
    errors: {
      loadOptions: 'دریافت گزینه‌های سطح ۳ ناموفق بود',
      loadFactors: 'دریافت ضرایب قیمت ناموفق بود',
      createFailed: 'ثبت ضریب قیمت ناموفق بود',
      missingPlatform: 'ابتدا یک کانال انتخاب کنید',
      missingLevel3: 'ابتدا یک گزینه سطح ۳ انتخاب کنید',
      invalidPriceFactor: 'ضریب قیمت باید بزرگتر از صفر باشد',
    },
    successSaved: 'ضریب قیمت ذخیره شد',
    columns: {
      platform: 'کانال',
      level3: 'سطح ۳',
      priceFactor: 'ضریب قیمت',
      createdAt: 'تاریخ ایجاد',
    },
  },
};
