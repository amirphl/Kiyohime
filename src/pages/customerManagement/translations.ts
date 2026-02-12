export interface AgencyReportTranslations {
  invalidRange: string;
  startDate: string;
  endDate: string;
  name: string;
  namePlaceholder: string;
  applyFilters: string;
  tableTitle: string;
  firstName: string;
  lastName: string;
  representativeName: string;
  companyName: string;
  totalSent: string;
  totalShare: string;
  totalSentAll: string;
  totalShareAll: string;
  discountsTitle: string;
  discountCustomer: string;
  discountRate: string;
  discountCreatedAt: string;
  discountCreateAction: string;
  discountHistoryAction: string;
  discountSelectCustomer: string;
  discountName: string;
  discountRateLabel: string;
  discountCancel: string;
  discountNameRequired: string;
  discountRateInvalid: string;
  discountCreate: string;
  discountHistoryTitle: string;
  discountExpiresAt: string;
  discountGlobalCreate: string;
}

export const customerManagementTranslations: Record<'en' | 'fa', AgencyReportTranslations> = {
  en: {
    invalidRange: 'End date must be greater than start date',
    startDate: 'Start Date',
    endDate: 'End Date',
    name: 'Name filter',
    namePlaceholder: 'Filter by name...',
    applyFilters: 'Apply Filters',
    tableTitle: 'Customers Report',
    firstName: 'First Name',
    lastName: 'Last Name',
    representativeName: 'Representative Name',
    companyName: 'Company Name',
    totalSent: 'Total Sent',
    totalShare: 'Total Share (with tax)',
    totalSentAll: 'Sum Total Sent',
    totalShareAll: 'Sum Total Share',
    discountsTitle: 'Active Discounts',
    discountCustomer: 'Customer Name',
    discountRate: 'Discount Rate (%)',
    discountCreatedAt: 'Created At',
    discountCreateAction: 'Create New',
    discountHistoryAction: 'History',
    discountSelectCustomer: 'Select Customer',
    discountName: 'Discount Name',
    discountRateLabel: 'Discount Rate (0 - 100)',
    discountCancel: 'Cancel',
    discountNameRequired: 'Name is required',
    discountRateInvalid: 'Rate must be between 0 and 100',
    discountCreate: 'Create',
    discountHistoryTitle: 'Discount History',
    discountExpiresAt: 'Expires At',
    discountGlobalCreate: 'Create Discount',
  },
  fa: {
    invalidRange: 'تاریخ پایان باید بزرگتر از تاریخ شروع باشد',
    startDate: 'تاریخ شروع',
    endDate: 'تاریخ پایان',
    name: 'فیلتر نام',
    namePlaceholder: 'فیلتر بر اساس نام...',
    applyFilters: 'اعمال فیلترها',
    tableTitle: 'گزارش مشتریان',
    firstName: 'نام',
    lastName: 'نام خانوادگی',
    representativeName: 'نام و نام خانوادگی نماینده',
    companyName: 'نام شرکت',
    totalSent: 'تعداد کل ارسال',
    totalShare: 'درآمد آژانس',
    totalSentAll: 'مجموع کل ارسال‌ها',
    totalShareAll: 'مجموع درآمد آژانس',
    discountsTitle: 'شارژهای هدیه فعال',
    discountCustomer: 'نام مشتری',
    discountRate: 'درصد شارژ هدیه',
    discountCreatedAt: 'تاریخ ایجاد',
    discountCreateAction: 'ایجاد',
    discountHistoryAction: 'سوابق',
    discountSelectCustomer: 'انتخاب مشتری',
    discountName: 'نام شارژ هدیه',
    discountRateLabel: 'درصد شارژ هدیه (۰ تا ۱۰۰)',
    discountCancel: 'انصراف',
    discountNameRequired: 'نام الزامی است',
    discountRateInvalid: 'نرخ باید بین ۰ تا ۱۰۰ باشد',
    discountCreate: 'ایجاد',
    discountHistoryTitle: 'تاریخچه شارژهای هدیه',
    discountExpiresAt: 'تاریخ انقضا',
    discountGlobalCreate: 'ایجاد شارژ هدیه',
  },
};

export type CustomerManagementLocale = keyof typeof customerManagementTranslations;

export const getCustomerManagementCopy = (language: string): AgencyReportTranslations =>
  customerManagementTranslations[language as CustomerManagementLocale] ||
  customerManagementTranslations.en;
