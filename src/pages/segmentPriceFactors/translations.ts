export interface SegmentPriceFactorTranslations {
  title: string;
  subtitle: string;
  backToSardis: string;
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
    basePriceListFailed: string;
    basePriceUpdateFailed: string;
    basePriceInvalid: string;
    pagePriceListFailed: string;
    pagePriceUpdateFailed: string;
    pagePriceInvalid: string;
    pagePriceValidationFailed: string;
    pagePricePlatformRequired: string;
    pagePricePlatformInvalid: string;
    pagePriceInsertFailed: string;
    unauthorized: string;
    networkError: string;
    invalidRequest: string;
  };
  successSaved: string;
  columns: {
    platform: string;
    level3: string;
    priceFactor: string;
    createdAt: string;
  };
  basePrices: {
    title: string;
    subtitle: string;
    update: string;
    platformLabels: {
      sms: string;
      rubika: string;
      bale: string;
      splus: string;
    };
    columns: {
      platform: string;
      currentPrice: string;
      newPrice: string;
      actions: string;
    };
  };
  pagePrices: {
    title: string;
    subtitle: string;
    update: string;
    platformLabels: {
      sms: string;
      rubika: string;
      bale: string;
      splus: string;
    };
    columns: {
      platform: string;
      currentPrice: string;
      updatedAt: string;
      newPrice: string;
      actions: string;
    };
  };
  pricingCalculation: {
    title: string;
    subtitle: string;
    note: string;
    columns: {
      platform: string;
      segmentPriceFactor: string;
      numPages: string;
      platformBasePrice: string;
      lineNumberPriceFactor: string;
      pagePrice: string;
      totalCost: string;
    };
  };
  success: {
    basePriceUpdated: string;
    pagePriceUpdated: string;
  };
  common: {
    loading: string;
    emptyValue: string;
  };
}

export const segmentPriceFactorTranslations: Record<
  'en' | 'fa',
  SegmentPriceFactorTranslations
> = {
  en: {
    title: 'Segment Price Factors',
    subtitle: 'Set a price factor for each Level 3 segment.',
    backToSardis: 'Back to Sardis',
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
      basePriceListFailed: 'Failed to list platform base prices',
      basePriceUpdateFailed: 'Failed to update platform base price',
      basePriceInvalid: 'Price must be greater than 0',
      pagePriceListFailed: 'Failed to list page prices',
      pagePriceUpdateFailed: 'Failed to update page price',
      pagePriceInvalid: 'Price must be greater than 0',
      pagePriceValidationFailed: 'Validation failed for page price update',
      pagePricePlatformRequired: 'Platform is required',
      pagePricePlatformInvalid: 'Platform is invalid',
      pagePriceInsertFailed: 'Failed to insert page price',
      unauthorized: 'Unauthorized',
      networkError: 'Network error occurred',
      invalidRequest: 'Invalid request',
    },
    successSaved: 'Segment price factor saved',
    columns: {
      platform: 'Platform',
      level3: 'Level 3',
      priceFactor: 'Price Factor',
      createdAt: 'Created At',
    },
    basePrices: {
      title: 'Platform Base Prices',
      subtitle: 'Review and update base prices for each platform.',
      update: 'Update',
      platformLabels: {
        sms: 'SMS',
        rubika: 'Rubika',
        bale: 'Bale',
        splus: 'Soroush Plus',
      },
      columns: {
        platform: 'Platform',
        currentPrice: 'Current Price',
        newPrice: 'New Price',
        actions: 'Actions',
      },
    },
    pagePrices: {
      title: 'Campaign Page Prices',
      subtitle: 'Review and update page prices for each platform.',
      update: 'Update',
      platformLabels: {
        sms: 'SMS',
        rubika: 'Rubika',
        bale: 'Bale',
        splus: 'Soroush Plus',
      },
      columns: {
        platform: 'Platform',
        currentPrice: 'Current Price',
        updatedAt: 'Last Updated',
        newPrice: 'New Price',
        actions: 'Actions',
      },
    },
    pricingCalculation: {
      title: 'Pricing Calculation Table',
      subtitle:
        'Adjust factors and prices to estimate total cost per platform.',
      note: 'SMS uses segment/page and line-number factors; other platforms use fixed multipliers of 1 for pages and line-number factor.',
      columns: {
        platform: 'Platform',
        segmentPriceFactor: 'Segment Price Factor',
        numPages: 'Number of Pages',
        platformBasePrice: 'Platform Base Price',
        lineNumberPriceFactor: 'Line Number Price Factor',
        pagePrice: 'Page Price',
        totalCost: 'Total Cost',
      },
    },
    success: {
      basePriceUpdated: 'Platform base price updated',
      pagePriceUpdated: 'Page price updated',
    },
    common: {
      loading: 'Loading...',
      emptyValue: '-',
    },
  },
  fa: {
    title: 'مدیریت تعرفه',
    subtitle: 'برای هر سگمنت سطح ۳ یک ضریب قیمت ثبت کنید.',
    backToSardis: 'بازگشت به ساردیس',
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
      basePriceListFailed: 'دریافت قیمت‌های پایه کانال ناموفق بود',
      basePriceUpdateFailed: 'بروزرسانی قیمت پایه کانال ناموفق بود',
      basePriceInvalid: 'قیمت باید بزرگ‌تر از صفر باشد',
      pagePriceListFailed: 'دریافت قیمت جاذبه ناموفق بود',
      pagePriceUpdateFailed: 'بروزرسانی قیمت جاذبه ناموفق بود',
      pagePriceInvalid: 'قیمت باید بزرگ‌تر از صفر باشد',
      pagePriceValidationFailed: 'اعتبارسنجی قیمت جاذبه ناموفق بود',
      pagePricePlatformRequired: 'انتخاب کانال الزامی است',
      pagePricePlatformInvalid: 'کانال انتخاب‌شده نامعتبر است',
      pagePriceInsertFailed: 'ثبت قیمت جاذبه ناموفق بود',
      unauthorized: 'دسترسی غیرمجاز',
      networkError: 'خطای شبکه رخ داد',
      invalidRequest: 'درخواست نامعتبر است',
    },
    successSaved: 'ضریب قیمت ذخیره شد',
    columns: {
      platform: 'کانال',
      level3: 'سطح ۳',
      priceFactor: 'ضریب قیمت',
      createdAt: 'تاریخ ایجاد',
    },
    basePrices: {
      title: 'قیمت پایه کانال‌ها',
      subtitle: 'قیمت پایه هر کانال را مشاهده و بروزرسانی کنید.',
      update: 'بروزرسانی',
      platformLabels: {
        sms: 'SMS',
        rubika: 'روبیکا',
        bale: 'بله',
        splus: 'سروش پلاس',
      },
      columns: {
        platform: 'کانال',
        currentPrice: 'قیمت فعلی',
        newPrice: 'قیمت جدید',
        actions: 'اقدامات',
      },
    },
    pagePrices: {
      title: 'قیمت جاذبه',
      subtitle: 'قیمت جاذبه برای هر کانال را مشاهده و بروزرسانی کنید.',
      update: 'بروزرسانی',
      platformLabels: {
        sms: 'SMS',
        rubika: 'روبیکا',
        bale: 'بله',
        splus: 'سروش پلاس',
      },
      columns: {
        platform: 'کانال',
        currentPrice: 'قیمت فعلی',
        updatedAt: 'آخرین بروزرسانی',
        newPrice: 'قیمت جدید',
        actions: 'اقدامات',
      },
    },
    pricingCalculation: {
      title: 'جدول محاسبه قیمت',
      subtitle:
        'برای برآورد هزینه نهایی هر کانال، ضرایب و قیمت‌ها را تغییر دهید.',
      note: 'برای SMS ضرایب تعداد پارت و سرشماره اعمال می‌شود؛ برای سایر کانال‌ها ضریب تعداد پارت و ضریب سرشماره برابر ۱ در نظر گرفته می‌شود.',
      columns: {
        platform: 'کانال',
        segmentPriceFactor: 'ضریب قیمت سگمنت',
        numPages: 'تعداد پارت',
        platformBasePrice: 'قیمت پایه کانال',
        lineNumberPriceFactor: 'ضریب قیمت سرشماره',
        pagePrice: 'قیمت جاذبه',
        totalCost: 'هزینه نهایی',
      },
    },
    success: {
      basePriceUpdated: 'قیمت پایه کانال بروزرسانی شد',
      pagePriceUpdated: 'قیمت جاذبه بروزرسانی شد',
    },
    common: {
      loading: 'در حال بارگذاری...',
      emptyValue: '-',
    },
  },
};
