export interface AdminPlatformSettingsCopy {
  title: string;
  subtitle: string;
  backToSardis: string;
  refresh: string;
  table: {
    row: string;
    id: string;
    uuid: string;
    customerId: string;
    platform: string;
    name: string;
    description: string;
    website: string;
    multimediaUuid: string;
    businessLicenseUuid: string;
    preview: string;
    download: string;
    businessLicenseDownload: string;
    metadata: string;
    metadataInfo: string;
    metadataKey: string;
    metadataValue: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    changeStatus: string;
    noData: string;
  };
  statuses: {
    initialized: string;
    inProgress: string;
    active: string;
    inactive: string;
  };
  actions: {
    openStatusModal: string;
    download: string;
    attachMetadata: string;
    viewMetadata: string;
    save: string;
    cancel: string;
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
  modal: {
    title: string;
    currentStatus: string;
    nextStatus: string;
    hint: string;
    metadataTitle: string;
    metadataEmpty: string;
  };
  errors: {
    listFailed: string;
    updateFailed: string;
    invalidTargetStatus: string;
    previewFailed: string;
    downloadFailed: string;
    metadataKeyRequired: string;
    metadataValueRequired: string;
    metadataKeyNotAllowedForPlatform: string;
    metadataUpdateFailed: string;
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
    validationFailed: string;
    platformSettingsNotFound: string;
    statusChangeNotAllowed: string;
    invalidPlatformSettingsStatus: string;
    platformSettingsIdRequired: string;
    platformSettingsLookupFailed: string;
    platformSettingsStatusUpdateFailed: string;
    platformSettingsMetadataKeyRequired: string;
    platformSettingsMetadataUpdateFailed: string;
  };
  success: {
    statusUpdated: string;
    metadataUpdated: string;
    basePriceUpdated: string;
    pagePriceUpdated: string;
  };
  common: {
    loading: string;
    emptyValue: string;
  };
}

const en: AdminPlatformSettingsCopy = {
  title: 'Platform Settings (Admin)',
  subtitle: 'Review all platform settings and change their status.',
  backToSardis: 'Back to Sardis',
  refresh: 'Refresh',
  table: {
    row: '#',
    id: 'ID',
    uuid: 'UUID',
    customerId: 'Customer ID',
    platform: 'Platform',
    name: 'Name',
    description: 'Description',
    website: 'Website',
    multimediaUuid: 'Multimedia UUID',
    businessLicenseUuid: 'Business License',
    preview: 'Profile Picture Preview',
    download: 'Download Profile Picture',
    businessLicenseDownload: 'License',
    metadata: 'Metadata',
    metadataInfo: 'Meta',
    metadataKey: 'Key',
    metadataValue: 'Value',
    status: 'Status',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    changeStatus: 'Change Status',
    noData: 'No platform settings found',
  },
  statuses: {
    initialized: 'Initialized',
    inProgress: 'In Progress',
    active: 'Active',
    inactive: 'Inactive',
  },
  actions: {
    openStatusModal: 'Change',
    download: 'Download',
    attachMetadata: 'Attach',
    viewMetadata: 'View metadata',
    save: 'Save',
    cancel: 'Cancel',
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
    subtitle: 'Adjust factors and prices to estimate total cost per platform.',
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
  modal: {
    title: 'Change Platform Setting Status',
    currentStatus: 'Current Status',
    nextStatus: 'New Status',
    hint: 'Initialized cannot be selected.',
    metadataTitle: 'Metadata',
    metadataEmpty: 'No metadata',
  },
  errors: {
    listFailed: 'Failed to list platform settings',
    updateFailed: 'Failed to update status',
    invalidTargetStatus: 'Select a valid status',
    previewFailed: 'Failed to load multimedia preview',
    downloadFailed: 'Failed to download multimedia',
    metadataKeyRequired: 'Metadata key is required',
    metadataValueRequired: 'Metadata value is required',
    metadataKeyNotAllowedForPlatform:
      'Selected metadata key is not allowed for this platform',
    metadataUpdateFailed: 'Failed to update platform settings metadata',
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
    validationFailed: 'Validation failed',
    platformSettingsNotFound: 'Platform settings not found',
    statusChangeNotAllowed: 'Status change is not allowed',
    invalidPlatformSettingsStatus: 'Invalid platform settings status',
    platformSettingsIdRequired: 'Platform settings ID is required',
    platformSettingsLookupFailed: 'Failed to retrieve platform settings',
    platformSettingsStatusUpdateFailed:
      'Failed to change platform settings status',
    platformSettingsMetadataKeyRequired: 'Metadata key is required',
    platformSettingsMetadataUpdateFailed:
      'Failed to update platform settings metadata',
  },
  success: {
    statusUpdated: 'Platform setting status updated',
    metadataUpdated: 'Platform settings metadata updated',
    basePriceUpdated: 'Platform base price updated',
    pagePriceUpdated: 'Page price updated',
  },
  common: {
    loading: 'Loading...',
    emptyValue: '-',
  },
};

const fa: AdminPlatformSettingsCopy = {
  title: 'تنظیمات کانال‌ها (ادمین)',
  subtitle: 'تمام تنظیمات کانال‌ها را مشاهده و وضعیت آن‌ها را مدیریت کنید.',
  backToSardis: 'بازگشت به ساردیس',
  refresh: 'تازه‌سازی',
  table: {
    row: '#',
    id: 'شناسه',
    uuid: 'UUID',
    customerId: 'شناسه مشتری',
    platform: 'کانال',
    name: 'نام',
    description: 'بایو',
    website: 'وب‌سایت',
    multimediaUuid: 'UUID رسانه',
    businessLicenseUuid: 'مجوز کسب‌وکار',
    preview: 'پیش‌نمایش تصویر پروفایل',
    download: 'دانلود تصویر پروفایل',
    businessLicenseDownload: 'مجوز',
    metadata: 'متادیتا',
    metadataInfo: 'جزئیات',
    metadataKey: 'کلید',
    metadataValue: 'مقدار',
    status: 'وضعیت',
    createdAt: 'تاریخ ایجاد',
    updatedAt: 'تاریخ بروزرسانی',
    changeStatus: 'تغییر وضعیت',
    noData: 'تنظیمات کانالی یافت نشد',
  },
  statuses: {
    initialized: 'مقداردهی اولیه',
    inProgress: 'در حال انجام',
    active: 'فعال',
    inactive: 'غیرفعال',
  },
  actions: {
    openStatusModal: 'تغییر',
    download: 'دانلود',
    attachMetadata: 'ثبت',
    viewMetadata: 'نمایش متادیتا',
    save: 'ذخیره',
    cancel: 'انصراف',
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
    note: 'برای SMS ضرایب تعداد پارت و شماره خط اعمال می‌شود؛ برای سایر کانال‌ها ضریب تعداد پارت و ضریب شماره خط برابر ۱ در نظر گرفته می‌شود.',
    columns: {
      platform: 'کانال',
      segmentPriceFactor: 'ضریب قیمت سگمنت',
      numPages: 'تعداد پارت',
      platformBasePrice: 'قیمت پایه کانال',
      lineNumberPriceFactor: 'ضریب قیمت شماره خط',
      pagePrice: 'قیمت جاذبه',
      totalCost: 'هزینه نهایی',
    },
  },
  modal: {
    title: 'تغییر وضعیت تنظیمات کانال',
    currentStatus: 'وضعیت فعلی',
    nextStatus: 'وضعیت جدید',
    hint: 'وضعیت مقداردهی اولیه قابل انتخاب نیست.',
    metadataTitle: 'متادیتا',
    metadataEmpty: 'متادیتایی وجود ندارد',
  },
  errors: {
    listFailed: 'دریافت تنظیمات کانال ناموفق بود',
    updateFailed: 'تغییر وضعیت ناموفق بود',
    invalidTargetStatus: 'یک وضعیت معتبر انتخاب کنید',
    previewFailed: 'بارگذاری پیش‌نمایش رسانه ناموفق بود',
    downloadFailed: 'دانلود رسانه ناموفق بود',
    metadataKeyRequired: 'کلید متادیتا الزامی است',
    metadataValueRequired: 'مقدار متادیتا الزامی است',
    metadataKeyNotAllowedForPlatform:
      'کلید متادیتای انتخاب‌شده برای این کانال مجاز نیست',
    metadataUpdateFailed: 'بروزرسانی متادیتای تنظیمات کانال ناموفق بود',
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
    validationFailed: 'اعتبارسنجی ناموفق بود',
    platformSettingsNotFound: 'تنظیمات کانال یافت نشد',
    statusChangeNotAllowed: 'تغییر وضعیت مجاز نیست',
    invalidPlatformSettingsStatus: 'وضعیت تنظیمات کانال نامعتبر است',
    platformSettingsIdRequired: 'شناسه تنظیمات کانال الزامی است',
    platformSettingsLookupFailed: 'دریافت تنظیمات کانال ناموفق بود',
    platformSettingsStatusUpdateFailed: 'تغییر وضعیت تنظیمات کانال ناموفق بود',
    platformSettingsMetadataKeyRequired: 'کلید متادیتا الزامی است',
    platformSettingsMetadataUpdateFailed:
      'بروزرسانی متادیتای تنظیمات کانال ناموفق بود',
  },
  success: {
    statusUpdated: 'وضعیت تنظیمات کانال بروزرسانی شد',
    metadataUpdated: 'متادیتای تنظیمات کانال بروزرسانی شد',
    basePriceUpdated: 'قیمت پایه کانال بروزرسانی شد',
    pagePriceUpdated: 'قیمت جاذبه بروزرسانی شد',
  },
  common: {
    loading: 'در حال بارگذاری...',
    emptyValue: '-',
  },
};

export const adminPlatformSettingsTranslations: Record<
  'en' | 'fa',
  AdminPlatformSettingsCopy
> = {
  en,
  fa,
};
