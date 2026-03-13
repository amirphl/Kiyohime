export interface AdminCustomerManagementCopy {
  title: string;
  backToSardis: string;
  filters: {
    startDate: string;
    endDate: string;
    apply: string;
  };
  table: {
    headers: {
      row: string;
      customerName: string;
      representativeName: string;
      agencyName: string;
      accountType: string;
      isActive: string;
      toggle: string;
      totalSent: string;
      clickRate: string;
      agencyIncome: string;
      systemIncome: string;
      tax: string;
      details: string;
      discounts: string;
    };
    noData: string;
  };
  actions: {
    view: string;
    show: string;
    activate: string;
    deactivate: string;
  };
  totals: {
    agencyIncome: string;
    systemIncome: string;
    tax: string;
    totalSent: string;
  };
  modals: {
    detailsTitle: string;
    campaignTitle: string;
    discountsTitle: string;
    customerSectionTitle: string;
    campaignsSectionTitle: string;
    detailsNoData: string;
  };
  detailsFields: {
    id: string;
    uuid: string;
    agencyRefererCode: string;
    accountTypeId: string;
    accountType: string;
    company: string;
    nationalId: string;
    companyPhone: string;
    companyAddress: string;
    postalCode: string;
    representativeFirstName: string;
    representativeLastName: string;
    mobile: string;
    email: string;
    shebaNumber: string;
    referrerAgencyId: string;
    isEmailVerified: string;
    isMobileVerified: string;
    isActive: string;
    createdAt: string;
    updatedAt: string;
    emailVerifiedAt: string;
    mobileVerifiedAt: string;
    lastLoginAt: string;
  };
  campaignsTable: {
    title: string;
    lineNumber: string;
    level3s: string;
    audience: string;
    created: string;
    schedule: string;
    status: string;
    sent: string;
    delivered: string;
    clickRate: string;
    details: string;
    noData: string;
  };
  campaignDetails: {
    id: string;
    uuid: string;
    status: string;
    created: string;
    updated: string;
    title: string;
    level1: string;
    level2s: string;
    level3s: string;
    tags: string;
    sex: string;
    cities: string;
    adLink: string;
    content: string;
    shortLinkDomain: string;
    jobCategory: string;
    job: string;
    schedule: string;
    lineNumber: string;
    budget: string;
    comment: string;
    segmentPriceFactor: string;
    lineNumberPriceFactor: string;
    statistics: string;
    totalClicks: string;
    clickRate: string;
  };
  discountsTable: {
    rate: string;
    created: string;
    expires: string;
    totalSent: string;
    agencyIncome: string;
    noData: string;
  };
  common: {
    loading: string;
    yes: string;
    no: string;
  };
}

const adminCustomerManagementEn: AdminCustomerManagementCopy = {
  title: 'Customer Management',
  backToSardis: 'Back to Sardis',
  filters: {
    startDate: 'Start Date',
    endDate: 'End Date',
    apply: 'Apply',
  },
  table: {
    headers: {
      row: '#',
      customerName: 'Customer Name',
      representativeName: 'Representative Name',
      agencyName: 'Agency Name',
      accountType: 'Account Type',
      isActive: 'Active',
      toggle: 'Toggle',
      totalSent: 'Total Sent',
      clickRate: 'Click Rate',
      agencyIncome: 'Agency Income',
      systemIncome: 'System Income',
      tax: 'Tax',
      details: 'Details',
      discounts: 'Discounts',
    },
    noData: 'No data',
  },
  actions: {
    view: 'View',
    show: 'Show',
    activate: 'Activate',
    deactivate: 'Deactivate',
  },
  totals: {
    agencyIncome: 'Sum Agency Income',
    systemIncome: 'Sum System Income',
    tax: 'Sum Tax',
    totalSent: 'Sum Total Sent',
  },
  modals: {
    detailsTitle: 'Customer Details',
    campaignTitle: 'Campaign Details',
    discountsTitle: 'Discounts History',
    customerSectionTitle: 'Customer',
    campaignsSectionTitle: 'Campaigns',
    detailsNoData: 'No customer data available',
  },
  detailsFields: {
    id: 'ID',
    uuid: 'UUID',
    agencyRefererCode: 'Agency Referrer Code',
    accountTypeId: 'Account Type ID',
    accountType: 'Account Type',
    company: 'Company',
    nationalId: 'National ID',
    companyPhone: 'Company Phone',
    companyAddress: 'Company Address',
    postalCode: 'Postal Code',
    representativeFirstName: 'Representative First Name',
    representativeLastName: 'Representative Last Name',
    mobile: 'Mobile',
    email: 'Email',
    shebaNumber: 'Sheba Number',
    referrerAgencyId: 'Referrer Agency ID',
    isEmailVerified: 'Email Verified',
    isMobileVerified: 'Mobile Verified',
    isActive: 'Active',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    emailVerifiedAt: 'Email Verified At',
    mobileVerifiedAt: 'Mobile Verified At',
    lastLoginAt: 'Last Login At',
  },
  campaignsTable: {
    title: 'Title',
    lineNumber: 'Line Number',
    level3s: 'Level 1',
    audience: 'Audience',
    created: 'Created',
    schedule: 'Schedule',
    status: 'Status',
    sent: 'Sent',
    delivered: 'Delivered',
    clickRate: 'Click Rate',
    details: 'Details',
    noData: 'No campaigns found',
  },
  campaignDetails: {
    id: 'ID',
    uuid: 'UUID',
    status: 'Status',
    created: 'Created',
    updated: 'Updated',
    title: 'Title',
    level1: 'Level 1',
    level2s: 'Level 2',
    level3s: 'Level 3',
    tags: 'Tags',
    sex: 'Sex',
    cities: 'Cities',
    adLink: 'Ad Link',
    content: 'Content',
    shortLinkDomain: 'Short Link Domain',
    jobCategory: 'Job Category',
    job: 'Job',
    schedule: 'Schedule',
    lineNumber: 'Line Number',
    budget: 'Budget',
    comment: 'Comment',
    segmentPriceFactor: 'Segment Price Factor',
    lineNumberPriceFactor: 'Line Number Price Factor',
    statistics: 'Statistics',
    totalClicks: 'Total Clicks',
    clickRate: 'Click Rate',
  },
  discountsTable: {
    rate: 'Rate (%)',
    created: 'Created At',
    expires: 'Expires At',
    totalSent: 'Total Sent',
    agencyIncome: 'Agency Income',
    noData: 'No discounts found',
  },
  common: {
    loading: 'Loading...',
    yes: 'Yes',
    no: 'No',
  },
};

const adminCustomerManagementFa: AdminCustomerManagementCopy = {
  title: 'مدیریت مشتریان',
  backToSardis: 'بازگشت به سردیس',
  filters: {
    startDate: 'تاریخ شروع',
    endDate: 'تاریخ پایان',
    apply: 'اعمال',
  },
  table: {
    headers: {
      row: '#',
      customerName: 'نام مشتری',
      representativeName: 'نام نماینده',
      agencyName: 'نام آژانس',
      accountType: 'نوع حساب',
      isActive: 'فعال',
      toggle: 'وضعیت',
      totalSent: 'تعداد ارسال',
      clickRate: 'نرخ کلیک',
      agencyIncome: 'درآمد آژانس',
      systemIncome: 'درآمد ما',
      tax: 'مالیات',
      details: 'جزئیات مشتری',
      discounts: 'شارژهای هدیه',
    },
    noData: 'داده‌ای یافت نشد',
  },
  actions: {
    view: 'مشاهده',
    show: 'نمایش',
    activate: 'غیر فعال',
    deactivate: 'فعال',
  },
  totals: {
    agencyIncome: 'مجموع درآمد آژانس',
    systemIncome: 'مجموع درآمد ما',
    tax: 'مجموع مالیات',
    totalSent: 'مجموع کل ارسال',
  },
  modals: {
    detailsTitle: 'جزئیات مشتری',
    campaignTitle: 'جزئیات کمپین',
    discountsTitle: 'تاریخچه شارژهای هدیه',
    customerSectionTitle: 'مشتری',
    campaignsSectionTitle: 'کمپین‌ها',
    detailsNoData: 'اطلاعاتی برای نمایش وجود ندارد',
  },
  detailsFields: {
    id: 'شناسه',
    uuid: 'شناسه یکتا',
    agencyRefererCode: 'کد معرف آژانس',
    accountTypeId: 'شناسه نوع حساب',
    accountType: 'نوع حساب',
    company: 'نام شرکت',
    nationalId: 'شناسه ملی',
    companyPhone: 'تلفن شرکت',
    companyAddress: 'آدرس شرکت',
    postalCode: 'کد پستی',
    representativeFirstName: 'نام نماینده',
    representativeLastName: 'نام خانوادگی نماینده',
    mobile: 'شماره موبایل',
    email: 'ایمیل',
    shebaNumber: 'شماره شبا',
    referrerAgencyId: 'شناسه آژانس والد',
    isEmailVerified: 'تایید ایمیل',
    isMobileVerified: 'تایید موبایل',
    isActive: 'فعال',
    createdAt: 'تاریخ ایجاد',
    updatedAt: 'تاریخ به‌روزرسانی',
    emailVerifiedAt: 'زمان تایید ایمیل',
    mobileVerifiedAt: 'زمان تایید موبایل',
    lastLoginAt: 'آخرین ورود',
  },
  campaignsTable: {
    title: 'عنوان ارسال',
    lineNumber: 'سرشماره',
    level3s: 'مخاطبان هدف',
    audience: 'تعداد پیام‌های ارسالی',
    created: 'ایجاد شده',
    schedule: 'زمان‌بندی ارسال',
    status: 'وضعیت',
    sent: 'تعداد پیام‌های رسیده',
    delivered: 'تحویل',
    clickRate: 'نرخ کلیک',
    details: 'جزئیات',
    noData: 'کمپینی یافت نشد',
  },
  campaignDetails: {
    id: 'شناسه',
    uuid: 'شناسه یکتا',
    status: 'وضعیت',
    created: 'تاریخ ایجاد',
    updated: 'تاریخ به‌روزرسانی',
    title: 'عنوان',
    level1: 'سطح ۱',
    level2s: 'سطح ۲',
    level3s: 'سطح ۳',
    tags: 'برچسب‌ها',
    sex: 'جنسیت',
    cities: 'شهرها',
    adLink: 'لینک تبلیغ',
    content: 'متن',
    shortLinkDomain: 'دامنه لینک کوتاه',
    jobCategory: 'دسته شغلی',
    job: 'شغل',
    schedule: 'زمان‌بندی',
    lineNumber: 'شماره خط',
    budget: 'بودجه',
    comment: 'توضیحات ادمین',
    segmentPriceFactor: 'ضریب قیمت بخش',
    lineNumberPriceFactor: 'ضریب قیمت سرشماره',
    statistics: 'آمار',
    totalClicks: 'تعداد کلیک',
    clickRate: 'نرخ کلیک',
  },
  discountsTable: {
    rate: 'درصد شارژ هدیه',
    created: 'تاریخ ایجاد',
    expires: 'تاریخ انقضا',
    totalSent: 'کل ارسال',
    agencyIncome: 'درآمد آژانس',
    noData: 'شارژ هدیه‌ای یافت نشد',
  },
  common: {
    loading: 'در حال بارگذاری...',
    yes: 'بله',
    no: 'خیر',
  },
};

const adminCustomerManagementMap = {
  en: adminCustomerManagementEn,
  fa: adminCustomerManagementFa,
} as const;

export type AdminCustomerManagementLocale = keyof typeof adminCustomerManagementMap;

export const getAdminCustomerManagementCopy = (
  language: string
): AdminCustomerManagementCopy =>
  adminCustomerManagementMap[language as AdminCustomerManagementLocale] ||
  adminCustomerManagementMap.en;
