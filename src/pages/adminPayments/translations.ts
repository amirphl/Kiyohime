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
  receipts: {
    title: string;
    statusFilter: string;
    customerFilter: string;
    langFilter: string;
    refresh: string;
    table: {
      amount: string;
      status: string;
      lang: string;
      created: string;
      preview: string;
      download: string;
      approve: string;
      reject: string;
      reason: string;
    };
    errors: {
      listFailed: string;
      downloadFailed: string;
      updateFailed: string;
    };
    noData: string;
    success: {
      statusUpdated: string;
    };
    cancel: string;
    confirmApprove: string;
    confirmReject: string;
  };
  transactions: {
    title: string;
    refresh: string;
    applyFilters: string;
    customerFilter: string;
    startDate: string;
    endDate: string;
    pageSize: string;
    prevPage: string;
    nextPage: string;
    paginationLabel: string;
    table: {
      datetime: string;
      customerId: string;
      amount: string;
      customerInfo: string;
      status: string;
      operation: string;
      source: string;
      invoice: string;
      externalRef: string;
    };
    invoice: {
      openModal: string;
      alreadyAttached: string;
      attachTitle: string;
      attachPrompt: string;
      chooseFile: string;
      selectedFile: string;
      uploadAndAttach: string;
      attaching: string;
      cancel: string;
    };
    customerInfo: {
      openModal: string;
      modalTitle: string;
      transactionAmount: string;
      customerId: string;
      fullName: string;
      representativeFirstName: string;
      representativeLastName: string;
      representativeMobile: string;
      email: string;
      companyName: string;
      companyPhone: string;
      companyAddress: string;
      postalCode: string;
      nationalId: string;
      accountType: string;
      missingValue: string;
      close: string;
    };
    errors: {
      listFailed: string;
      noData: string;
      invalidPage: string;
      invalidPageSize: string;
      invalidStartDate: string;
      invalidEndDate: string;
      startDateAfterEndDate: string;
      uploadFailed: string;
      addInvoiceFailed: string;
      transactionNotFound: string;
      paymentRequestNotFound: string;
      invoiceUuidRequired: string;
      invoiceUuidInvalid: string;
      invoiceUuidMismatch: string;
      unauthorized: string;
      network: string;
      fileRequired: string;
    };
    success: {
      invoiceAttached: string;
    };
  };
}

const en: AdminPaymentsCopy = {
  title: 'Admin Payments',
  subtitle: 'Directly charge a customer wallet without gateway redirect.',
  backToSardis: 'Back to Sardis',
  form: {
    customerSearchLabel: 'Search customer',
    customerSearchPlaceholder:
      'Search by first name, last name, or company name',
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
  receipts: {
    title: 'Deposit Receipts',
    statusFilter: 'Status',
    customerFilter: 'Customer ID',
    langFilter: 'Language',
    refresh: 'Refresh',
    table: {
      amount: 'Amount',
      status: 'Status',
      lang: 'Lang',
      created: 'Created',
      preview: 'Preview',
      download: 'Download',
      approve: 'Approve',
      reject: 'Reject',
      reason: 'Reason (optional)',
    },
    errors: {
      listFailed: 'Failed to load deposit receipts.',
      downloadFailed: 'Failed to download receipt file.',
      updateFailed: 'Failed to update receipt status.',
    },
    noData: 'No deposit receipts found.',
    success: {
      statusUpdated: 'Receipt status updated.',
    },
    cancel: 'Close',
    confirmApprove: 'Approve this receipt?',
    confirmReject: 'Reject this receipt?',
  },
  transactions: {
    title: 'Transactions',
    refresh: 'Refresh',
    applyFilters: 'Apply Filters',
    customerFilter: 'Customer ID',
    startDate: 'Start Date',
    endDate: 'End Date',
    pageSize: 'Page Size',
    prevPage: 'Previous',
    nextPage: 'Next',
    paginationLabel: 'Page {{current}} of {{total}}',
    table: {
      datetime: 'Date/Time',
      customerId: 'Customer ID',
      amount: 'Amount',
      customerInfo: 'Customer Info',
      status: 'Status',
      operation: 'Operation',
      source: 'Source',
      invoice: 'Invoice',
      externalRef: 'External Ref',
    },
    invoice: {
      openModal: 'Attach',
      alreadyAttached: 'Attached',
      attachTitle: 'Attach Invoice',
      attachPrompt: 'Upload an invoice and attach it to this transaction?',
      chooseFile: 'Choose file',
      selectedFile: 'Selected file',
      uploadAndAttach: 'Upload & Attach',
      attaching: 'Attaching...',
      cancel: 'Cancel',
    },
    customerInfo: {
      openModal: 'View customer details',
      modalTitle: 'Customer Details',
      transactionAmount: 'Transaction Amount',
      customerId: 'Customer ID',
      fullName: 'Full Name',
      representativeFirstName: 'Representative First Name',
      representativeLastName: 'Representative Last Name',
      representativeMobile: 'Representative Mobile',
      email: 'Email',
      companyName: 'Company Name',
      companyPhone: 'Company Phone',
      companyAddress: 'Company Address',
      postalCode: 'Postal Code',
      nationalId: 'National ID',
      accountType: 'Account Type',
      missingValue: '-',
      close: 'Close',
    },
    errors: {
      listFailed: 'Failed to load transactions.',
      noData: 'No transactions found.',
      invalidPage: 'Invalid page.',
      invalidPageSize: 'Invalid page size.',
      invalidStartDate: 'Invalid start date format.',
      invalidEndDate: 'Invalid end date format.',
      startDateAfterEndDate: 'Start date must be before end date.',
      uploadFailed: 'Failed to upload invoice file.',
      addInvoiceFailed: 'Failed to attach invoice to transaction.',
      transactionNotFound: 'Transaction not found.',
      paymentRequestNotFound: 'Payment request not found.',
      invoiceUuidRequired: 'Invoice UUID is required.',
      invoiceUuidInvalid: 'Invoice UUID is invalid.',
      invoiceUuidMismatch:
        'Invoice conflicts with existing transaction metadata.',
      unauthorized: 'Unauthorized request.',
      network: 'Network error occurred.',
      fileRequired: 'Please select an invoice file.',
    },
    success: {
      invoiceAttached: 'Invoice attached successfully.',
    },
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
  receipts: {
    title: 'فیش‌های واریز',
    statusFilter: 'وضعیت',
    customerFilter: 'شناسه مشتری',
    langFilter: 'زبان',
    refresh: 'بروزرسانی',
    table: {
      amount: 'مبلغ',
      status: 'وضعیت',
      lang: 'زبان',
      created: 'تاریخ ثبت',
      preview: 'پیش‌نمایش',
      download: 'دانلود',
      approve: 'تأیید',
      reject: 'رد',
      reason: 'دلیل (اختیاری)',
    },
    errors: {
      listFailed: 'دریافت لیست رسیدها ناموفق بود.',
      downloadFailed: 'دانلود فایل رسید ناموفق بود.',
      updateFailed: 'به‌روزرسانی وضعیت رسید ناموفق بود.',
    },
    noData: 'رسید واریزی یافت نشد.',
    success: {
      statusUpdated: 'وضعیت رسید به‌روزرسانی شد.',
    },
    cancel: 'بستن',
    confirmApprove: 'این رسید تأیید شود؟',
    confirmReject: 'این رسید رد شود؟',
  },
  transactions: {
    title: 'تراکنش‌ها',
    refresh: 'بروزرسانی',
    applyFilters: 'اعمال فیلتر',
    customerFilter: 'شناسه مشتری',
    startDate: 'از تاریخ',
    endDate: 'تا تاریخ',
    pageSize: 'اندازه صفحه',
    prevPage: 'قبلی',
    nextPage: 'بعدی',
    paginationLabel: 'صفحه {{current}} از {{total}}',
    table: {
      datetime: 'تاریخ/زمان',
      customerId: 'شناسه مشتری',
      amount: 'مبلغ',
      customerInfo: 'اطلاعات مشتری',
      status: 'وضعیت',
      operation: 'عملیات',
      source: 'منبع',
      invoice: 'فاکتور',
      externalRef: 'مرجع خارجی',
    },
    invoice: {
      openModal: 'ضمیمه کردن',
      alreadyAttached: 'متصل شده',
      attachTitle: 'ضمیمه‌کردن فاکتور',
      attachPrompt: 'فایل فاکتور بارگذاری و به این تراکنش ضمیمه شود؟',
      chooseFile: 'انتخاب فایل',
      selectedFile: 'فایل انتخاب شده',
      uploadAndAttach: 'بارگذاری و ضمیمه شود',
      attaching: 'در حال ضمیمه کردن...',
      cancel: 'انصراف',
    },
    customerInfo: {
      openModal: 'مشاهده اطلاعات مشتری',
      modalTitle: 'جزئیات مشتری',
      transactionAmount: 'مبلغ تراکنش',
      customerId: 'شناسه مشتری',
      fullName: 'نام کامل',
      representativeFirstName: 'نام نماینده',
      representativeLastName: 'نام خانوادگی نماینده',
      representativeMobile: 'موبایل نماینده',
      email: 'ایمیل',
      companyName: 'نام شرکت',
      companyPhone: 'تلفن شرکت',
      companyAddress: 'آدرس شرکت',
      postalCode: 'کد پستی',
      nationalId: 'شناسه ملی',
      accountType: 'نوع حساب',
      missingValue: '-',
      close: 'بستن',
    },
    errors: {
      listFailed: 'دریافت لیست تراکنش‌ها ناموفق بود.',
      noData: 'تراکنشی یافت نشد.',
      invalidPage: 'شماره صفحه نامعتبر است.',
      invalidPageSize: 'اندازه صفحه نامعتبر است.',
      invalidStartDate: 'فرمت تاریخ شروع نامعتبر است.',
      invalidEndDate: 'فرمت تاریخ پایان نامعتبر است.',
      startDateAfterEndDate: 'تاریخ شروع باید قبل از تاریخ پایان باشد.',
      uploadFailed: 'بارگذاری فایل فاکتور ناموفق بود.',
      addInvoiceFailed: 'ضمیمه کردن فاکتور به تراکنش ناموفق بود.',
      transactionNotFound: 'تراکنش پیدا نشد.',
      paymentRequestNotFound: 'درخواست پرداخت پیدا نشد.',
      invoiceUuidRequired: 'شناسه فاکتور الزامی است.',
      invoiceUuidInvalid: 'شناسه فاکتور نامعتبر است.',
      invoiceUuidMismatch: 'شناسه فاکتور با متادیتای موجود تراکنش مغایرت دارد.',
      unauthorized: 'دسترسی غیرمجاز.',
      network: 'خطای شبکه رخ داد.',
      fileRequired: 'لطفا فایل فاکتور را انتخاب کنید.',
    },
    success: {
      invoiceAttached: 'فاکتور با موفقیت متصل شد.',
    },
  },
};

export const adminPaymentsTranslations: Record<'en' | 'fa', AdminPaymentsCopy> =
  {
    en,
    fa,
  };
