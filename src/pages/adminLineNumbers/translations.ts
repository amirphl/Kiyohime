export interface AdminLineNumbersCopy {
  title: string;
  subtitle: string;
  backToSardis: string;
  createNew: string;
  refresh: string;
  reorderHint: string;
  common: {
    loading: string;
    save: string;
    cancel: string;
    submit: string;
    confirm: string;
    close: string;
    yes: string;
    no: string;
    empty: string;
  };
  table: {
    title: string;
    row: string;
    lineNumber: string;
    priority: string;
    priceFactor: string;
    active: string;
    noItems: string;
  };
  report: {
    title: string;
    lineNumber: string;
    totalSent: string;
    totalPartsSent: string;
    totalArrivedPartsSent: string;
    totalNonArrivedPartsSent: string;
    totalIncome: string;
    totalCost: string;
    noItems: string;
  };
  form: {
    title: string;
    fields: {
      name: string;
      lineNumber: string;
      priceFactor: string;
      priority: string;
      active: string;
    };
  };
  confirm: {
    title: string;
    summary: string;
    fields: {
      name: string;
      lineNumber: string;
      priceFactor: string;
      priority: string;
      active: string;
    };
  };
  validation: {
    lineNumberRequired: string;
    lineNumberLength: string;
    priceFactorRequired: string;
    priceFactorInvalid: string;
    priorityInvalid: string;
    nameTooLong: string;
  };
  errors: {
    missingAccessToken: string;
    unauthorized: string;
    network: string;
    invalidRequest: string;
    unknown: string;
    loadListFailed: string;
    loadReportFailed: string;
    createFailed: string;
    reorderFailed: string;
    validationFailed: string;
    lineNumberAlreadyExists: string;
    lineNumberValueRequired: string;
    lineNumberLengthInvalid: string;
    priceFactorBackendInvalid: string;
    priorityBackendInvalid: string;
  };
  success: {
    created: string;
    orderSaved: string;
  };
}

const en: AdminLineNumbersCopy = {
  title: 'Line Number Management',
  subtitle: 'Create line numbers, reorder delivery priority, and review usage.',
  backToSardis: 'Back to Sardis',
  createNew: 'Create New Line Number',
  refresh: 'Refresh',
  reorderHint: 'Drag rows to change priority, then save the new order.',
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    confirm: 'Confirm',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    empty: '-',
  },
  table: {
    title: 'Line Numbers',
    row: '#',
    lineNumber: 'Line Number',
    priority: 'Priority',
    priceFactor: 'Price Factor',
    active: 'Active',
    noItems: 'No line numbers found',
  },
  report: {
    title: 'Line Numbers Report',
    lineNumber: 'Line Number',
    totalSent: 'Total Sent',
    totalPartsSent: 'Total Parts Sent',
    totalArrivedPartsSent: 'Total Arrived Parts',
    totalNonArrivedPartsSent: 'Total Non-arrived Parts',
    totalIncome: 'Total Income',
    totalCost: 'Total Cost',
    noItems: 'No report data found',
  },
  form: {
    title: 'Create Line Number',
    fields: {
      name: 'Name (optional)',
      lineNumber: 'Line Number',
      priceFactor: 'Price Factor',
      priority: 'Priority (optional)',
      active: 'Active',
    },
  },
  confirm: {
    title: 'Confirm Create Line Number',
    summary: 'Review the values before creating the line number.',
    fields: {
      name: 'Name',
      lineNumber: 'Line Number',
      priceFactor: 'Price Factor',
      priority: 'Priority',
      active: 'Active',
    },
  },
  validation: {
    lineNumberRequired: 'Line number is required.',
    lineNumberLength: 'Line number must be between 3 and 50 characters.',
    priceFactorRequired: 'Price factor is required.',
    priceFactorInvalid: 'Price factor must be greater than zero.',
    priorityInvalid: 'Priority must be zero or greater.',
    nameTooLong: 'Name must be 255 characters or fewer.',
  },
  errors: {
    missingAccessToken: 'Authentication is missing. Please sign in again.',
    unauthorized: 'Your session has expired. Please sign in again.',
    network: 'Network error. Please try again.',
    invalidRequest: 'Invalid request.',
    unknown: 'An unexpected error occurred. Please try again.',
    loadListFailed: 'Failed to load line numbers.',
    loadReportFailed: 'Failed to load the line number report.',
    createFailed: 'Failed to create the line number.',
    reorderFailed: 'Failed to save the new order.',
    validationFailed: 'Validation failed.',
    lineNumberAlreadyExists: 'Line number already exists.',
    lineNumberValueRequired: 'Line number is required.',
    lineNumberLengthInvalid: 'Line number must be between 3 and 50 characters.',
    priceFactorBackendInvalid: 'Price factor must be greater than zero.',
    priorityBackendInvalid: 'Priority must be zero or greater.',
  },
  success: {
    created: 'Line number created successfully.',
    orderSaved: 'Line number order saved.',
  },
};

const fa: AdminLineNumbersCopy = {
  title: 'مدیریت سرشماره‌ها',
  subtitle:
    'سرشماره ایجاد کنید، اولویت ارسال را تغییر دهید و گزارش را بررسی کنید.',
  backToSardis: 'بازگشت به ساردیس',
  createNew: 'ایجاد سرشماره جدید',
  refresh: 'بارگذاری مجدد',
  reorderHint: 'برای تغییر اولویت، سطرها را جابه‌جا کنید و سپس ذخیره را بزنید.',
  common: {
    loading: 'در حال بارگذاری...',
    save: 'ذخیره',
    cancel: 'انصراف',
    submit: 'ثبت',
    confirm: 'تأیید',
    close: 'بستن',
    yes: 'بله',
    no: 'خیر',
    empty: '-',
  },
  table: {
    title: 'فهرست سرشماره‌ها',
    row: '#',
    lineNumber: 'شماره خط',
    priority: 'اولویت',
    priceFactor: 'ضریب قیمت',
    active: 'فعال',
    noItems: 'سرشماره‌ای یافت نشد',
  },
  report: {
    title: 'گزارش سرشماره‌ها',
    lineNumber: 'شماره خط',
    totalSent: 'کل ارسال',
    totalPartsSent: 'کل پارت‌های ارسال‌شده',
    totalArrivedPartsSent: 'کل پارت‌های رسیده',
    totalNonArrivedPartsSent: 'کل پارت‌های نرسیده',
    totalIncome: 'کل درآمد',
    totalCost: 'کل هزینه',
    noItems: 'داده‌ای برای گزارش وجود ندارد',
  },
  form: {
    title: 'ایجاد سرشماره',
    fields: {
      name: 'نام (اختیاری)',
      lineNumber: 'شماره خط',
      priceFactor: 'ضریب قیمت',
      priority: 'اولویت (اختیاری)',
      active: 'فعال',
    },
  },
  confirm: {
    title: 'تأیید ایجاد سرشماره',
    summary: 'پیش از ایجاد سرشماره، مقادیر را بررسی کنید.',
    fields: {
      name: 'نام',
      lineNumber: 'شماره خط',
      priceFactor: 'ضریب قیمت',
      priority: 'اولویت',
      active: 'فعال',
    },
  },
  validation: {
    lineNumberRequired: 'شماره خط الزامی است.',
    lineNumberLength: 'شماره خط باید بین ۳ تا ۵۰ کاراکتر باشد.',
    priceFactorRequired: 'ضریب قیمت الزامی است.',
    priceFactorInvalid: 'ضریب قیمت باید بیشتر از صفر باشد.',
    priorityInvalid: 'اولویت باید صفر یا بیشتر باشد.',
    nameTooLong: 'نام باید حداکثر ۲۵۵ کاراکتر باشد.',
  },
  errors: {
    missingAccessToken:
      'اطلاعات احراز هویت موجود نیست. لطفاً دوباره وارد شوید.',
    unauthorized: 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید.',
    network: 'خطای شبکه رخ داد. دوباره تلاش کنید.',
    invalidRequest: 'درخواست نامعتبر است.',
    unknown: 'خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
    loadListFailed: 'دریافت سرشماره‌ها ناموفق بود.',
    loadReportFailed: 'دریافت گزارش سرشماره‌ها ناموفق بود.',
    createFailed: 'ایجاد سرشماره ناموفق بود.',
    reorderFailed: 'ذخیره ترتیب جدید ناموفق بود.',
    validationFailed: 'اعتبارسنجی ناموفق بود.',
    lineNumberAlreadyExists: 'این شماره خط قبلاً ثبت شده است.',
    lineNumberValueRequired: 'شماره خط الزامی است.',
    lineNumberLengthInvalid: 'شماره خط باید بین ۳ تا ۵۰ کاراکتر باشد.',
    priceFactorBackendInvalid: 'ضریب قیمت باید بیشتر از صفر باشد.',
    priorityBackendInvalid: 'اولویت باید صفر یا بیشتر باشد.',
  },
  success: {
    created: 'سرشماره با موفقیت ایجاد شد.',
    orderSaved: 'ترتیب سرشماره‌ها ذخیره شد.',
  },
};

export const adminLineNumbersTranslations = {
  en,
  fa,
};
