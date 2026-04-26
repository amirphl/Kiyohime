export interface AdminPaymentsCopy {
  title: string;
  subtitle: string;
  backToSardis: string;
  form: {
    customerSearchLabel: string;
    customerSearchPlaceholder: string;
    customerLabel: string;
    customerPlaceholder: string;
    amountLabel: string;
    amountPlaceholder: string;
    submit: string;
    submitting: string;
  };
  info: {
    listLoaded: string;
    noCustomersFound: string;
  };
  validation: {
    customerRequired: string;
    amountRequired: string;
    amountMustBeNumber: string;
    amountRange: string;
  };
  errors: {
    listCustomersFailed: string;
    chargeFailed: string;
  };
  success: {
    chargeSuccess: string;
  };
  result: {
    title: string;
    paymentRequestId: string;
    invoiceNumber: string;
    referenceNumber: string;
    customerId: string;
    adminId: string;
    amountWithTax: string;
  };
}

const en: AdminPaymentsCopy = {
  title: 'Admin Payments',
  subtitle: 'Directly charge a customer wallet without gateway redirect.',
  backToSardis: 'Back to Sardis',
  form: {
    customerSearchLabel: 'Search customer',
    customerSearchPlaceholder: 'Search by first name, last name, or company name',
    customerLabel: 'Customer',
    customerPlaceholder: 'Select a customer',
    amountLabel: 'Amount with Tax',
    amountPlaceholder: 'Enter amount (1000 - 1000000000)',
    submit: 'Charge Wallet',
    submitting: 'Charging...',
  },
  info: {
    listLoaded: 'Customer list loaded.',
    noCustomersFound: 'No customers found for this search.',
  },
  validation: {
    customerRequired: 'Please select a customer.',
    amountRequired: 'Amount is required.',
    amountMustBeNumber: 'Amount must be a number.',
    amountRange: 'Amount must be between 1000 and 1000000000.',
  },
  errors: {
    listCustomersFailed: 'Failed to retrieve customers list.',
    chargeFailed: 'Wallet charging by admin failed.',
  },
  success: {
    chargeSuccess: 'Wallet charged successfully by admin.',
  },
  result: {
    title: 'Latest Charge Result',
    paymentRequestId: 'Payment Request ID',
    invoiceNumber: 'Invoice Number',
    referenceNumber: 'Reference Number',
    customerId: 'Customer ID',
    adminId: 'Admin ID',
    amountWithTax: 'Amount with Tax',
  },
};

const fa: AdminPaymentsCopy = {
  title: 'شارژ توسط ادمین',
  subtitle: 'شارژ مستقیم کیف پول مشتری بدون هدایت به درگاه پرداخت.',
  backToSardis: 'بازگشت به ساردیس',
  form: {
    customerSearchLabel: 'جستجوی مشتری',
    customerSearchPlaceholder: 'جستجو بر اساس نام، نام خانوادگی یا نام شرکت',
    customerLabel: 'مشتری',
    customerPlaceholder: 'یک مشتری انتخاب کنید',
    amountLabel: 'مبلغ با مالیات',
    amountPlaceholder: 'مبلغ را وارد کنید (1000 تا 1000000000)',
    submit: 'شارژ کیف پول',
    submitting: 'در حال شارژ...',
  },
  info: {
    listLoaded: 'لیست مشتریان دریافت شد.',
    noCustomersFound: 'مشتری‌ای با این جستجو پیدا نشد.',
  },
  validation: {
    customerRequired: 'لطفا یک مشتری انتخاب کنید.',
    amountRequired: 'مبلغ الزامی است.',
    amountMustBeNumber: 'مبلغ باید عدد باشد.',
    amountRange: 'مبلغ باید بین 1000 و 1000000000 باشد.',
  },
  errors: {
    listCustomersFailed: 'دریافت لیست مشتریان ناموفق بود.',
    chargeFailed: 'شارژ کیف پول توسط ادمین ناموفق بود.',
  },
  success: {
    chargeSuccess: 'کیف پول با موفقیت توسط ادمین شارژ شد.',
  },
  result: {
    title: 'نتیجه آخرین شارژ',
    paymentRequestId: 'شناسه درخواست پرداخت',
    invoiceNumber: 'شماره فاکتور',
    referenceNumber: 'شماره مرجع',
    customerId: 'شناسه مشتری',
    adminId: 'شناسه ادمین',
    amountWithTax: 'مبلغ با مالیات',
  },
};

export const adminPaymentsTranslations: Record<'en' | 'fa', AdminPaymentsCopy> = {
  en,
  fa,
};
