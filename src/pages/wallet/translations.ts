export interface WalletTableTranslations {
  row: string;
  datetime: string;
  kind: string;
  amount: string;
  type: string;
  status: string;
  freeIncrease: string;
  creditIncrease: string;
  invoice: string;
  description: string;
  noTransactions: string;
  createdAt: string;
}

export interface WalletTranslations {
  title: string;
  comingSoon: string;
  backToDashboard: string;
  currency: string;
  currentBalance: string;
  free: string;
  locked: string;
  reserved: string;
  credit: string;
  total: string;
  spendOnCampaigns: string;
  agencyShareWithTax: string;
  lastUpdated: string;
  chargeTitle: string;
  amountLabel: string;
  amountPlaceholder: string;
  errorInvalidNumber: string;
  errorMinAmount: string;
  errorMultipleOf: string;
  pay: string;
  payByDeposit: string;
  depositTitle: string;
  depositAmountLabel: string;
  depositUploadLabel: string;
  depositSelectFile: string;
  depositSubmit: string;
  depositProforma: string;
  depositSectionHelp: string;
  depositTableTitle: string;
  depositColumnAmount: string;
  depositColumnStatus: string;
  depositColumnCreated: string;
  depositColumnFile: string;
  depositColumnDownload: string;
  depositColumnUpdate: string;
  depositColumnDelete: string;
  depositColumnProforma: string;
  depositColumnRejection: string;
  depositColumnLang: string;
  depositColumnPreview: string;
  depositConfirmTitle: string;
  depositConfirmBody: string;
  depositDownloadFile: string;
  depositUpdateFile: string;
  depositDeleteFile: string;
  depositNoFile: string;
  depositNeedAmount: string;
  depositNeedFile: string;
  depositNeedReceiptForProforma: string;
  depositFileTooLarge: string;
  depositSizeHint: string;
  historyTitle: string;
  historyKindLabels: {
    chargeFree: string;
    chargeCredit: string;
    agencyShare: string;
  };
  table: WalletTableTranslations;
  operationTypes: Record<string, string>;
  statuses: Record<string, string>;
  modalTitle: string;
  modalChargeAmount: string;
  modalTax: string;
  modalTotal: string;
  loading: string;
  invoiceDownloadError: string;
}

export const walletTranslations: Record<'en' | 'fa', WalletTranslations> = {
  en: {
    title: 'Wallet & Charge',
    comingSoon: 'Coming Soon',
    backToDashboard: 'Back to Dashboard',
    currency: 'Toman',
    currentBalance: 'Current Balance',
    free: 'Free',
    locked: 'Locked',
    reserved: 'Reserved',
    credit: 'Credit',
    total: 'Total',
    spendOnCampaigns: 'Spend on Campaigns',
    agencyShareWithTax: 'Agency share (with tax)',
    lastUpdated: 'Last Updated',
    chargeTitle: 'Charge Wallet',
    amountLabel: 'Amount (Toman)',
    amountPlaceholder: 'Enter amount',
    errorInvalidNumber: 'Please enter a valid number',
    errorMinAmount: 'Amount must be at least 1,000,000 Toman',
    errorMultipleOf: 'Amount must be a multiple of 100,000 Toman',
    pay: 'Pay (Gateway)',
    payByDeposit: 'Pay via Deposit Receipt',
    depositTitle: 'Pay With Deposit Receipt',
    depositAmountLabel: 'Amount (Toman)',
    depositUploadLabel: 'Receipt file (JPG, PNG, PDF)',
    depositSelectFile: 'Choose file',
    depositSubmit: 'Submit',
    depositProforma: 'Download Proforma Invoice (PDF)',
    depositSectionHelp:
      'Enter the amount, upload your bank receipt, then submit for review.',
    depositTableTitle: 'Deposit Receipts',
    depositColumnAmount: 'Amount',
    depositColumnStatus: 'Status',
    depositColumnCreated: 'Created At',
    depositColumnFile: 'File',
    depositColumnDownload: 'Download receipt',
    depositColumnUpdate: 'Update',
    depositColumnDelete: 'Delete',
    depositColumnProforma: 'Proforma',
    depositColumnRejection: 'Note',
    depositColumnLang: 'Lang',
    depositColumnPreview: 'Preview',
    depositConfirmTitle: 'Submit deposit receipt?',
    depositConfirmBody:
      'We will send your receipt for manual review. Continue?',
    depositDownloadFile: 'Download file',
    depositUpdateFile: 'Update file',
    depositDeleteFile: 'Delete file',
    depositNoFile: '-',
    depositNeedAmount: 'Enter amount first',
    depositNeedFile: 'Please select a file',
    depositNeedReceiptForProforma: 'Submit a receipt first to get proforma.',
    depositFileTooLarge: 'File must be 5 MB or smaller.',
    depositSizeHint: 'Supported: JPG, PNG, PDF up to 5 MB.',
    historyTitle: 'Payment & Charge History',
    historyKindLabels: {
      chargeFree: 'Charge Free',
      chargeCredit: 'Charge Credit',
      agencyShare: 'Agency Share',
    },
    table: {
      row: 'Row',
      datetime: 'Datetime',
      kind: 'Kind',
      amount: 'Amount',
      type: 'Type',
      status: 'Status',
      freeIncrease: 'Free Increase',
      creditIncrease: 'Credit Increase',
      invoice: 'Invoice',
      description: 'Description',
      noTransactions: 'No transactions',
      createdAt: 'Created At',
    },
    operationTypes: {
      'Wallet Recharge': 'Wallet Recharge',
      'Wallet Withdrawal': 'Wallet Withdrawal',
      'Fund Freeze': 'Fund Freeze',
      'Fund Unfreeze': 'Fund Unfreeze',
      'Fund Lock': 'Fund Lock',
      'Fund Unlock': 'Fund Unlock',
      Refund: 'Refund',
      'Service Fee': 'Service Fee',
      'Balance Adjustment': 'Balance Adjustment',
      'Wallet Credit': 'Wallet Credit',
      'Wallet Debit': 'Wallet Debit',
      'Charge Agency Share with Tax': 'Charge Agency Share with Tax',
      'Discharge Agency Share with Tax': 'Discharge Agency Share with Tax',
    },
    statuses: {
      Pending: 'Pending',
      Completed: 'Completed',
      Failed: 'Failed',
      Cancelled: 'Cancelled',
      Reversed: 'Reversed',
    },
    modalTitle: 'Payment Confirmation',
    modalChargeAmount: 'Charge Amount:',
    modalTax: 'Tax (10%):',
    modalTotal: 'Total to Pay:',
    loading: 'Loading...',
    invoiceDownloadError: 'Unable to generate invoice',
  },
  fa: {
    title: 'مدیریت مالی',
    comingSoon: 'به زودی',
    backToDashboard: 'بازگشت به پیشخوان',
    currency: 'تومان',
    currentBalance: 'موجودی فعلی',
    free: 'موجودی در دسترس',
    locked: 'قفل‌شده',
    reserved: 'رزرو شده',
    credit: 'اعتبار هدیه',
    total: 'جمع کل',
    spendOnCampaigns: 'هزینه ارسال‌های گذشته',
    agencyShareWithTax: 'درآمد آژانس (با مالیات)',
    lastUpdated: 'آخرین بروزرسانی',
    chargeTitle: 'شارژ کیف پول',
    amountLabel: 'مبلغ (تومان)',
    amountPlaceholder: 'مبلغ را وارد کنید',
    errorInvalidNumber: 'لطفاً یک عدد معتبر وارد کنید',
    errorMinAmount: 'مبلغ باید حداقل ۱،۰۰۰،۰۰۰ تومان باشد',
    errorMultipleOf: 'مبلغ باید مضربی از ۱۰۰،۰۰۰ تومان باشد',
    pay: 'پرداخت از طریق درگاه پرداخت',
    payByDeposit: 'پرداخت از طریق فیش واریزی',
    depositTitle: 'پرداخت از طریق فیش واریزی',
    depositAmountLabel: 'مبلغ (تومان)',
    depositUploadLabel: 'فایل رسید (JPG, PNG, PDF)',
    depositSelectFile: 'بارگذاری فیش واریز',
    depositSubmit: 'ثبت',
    depositProforma: 'دانلود پیش‌فاکتور (PDF)',
    depositSectionHelp:
      'مبلغ را وارد کنید، فایل رسید را بارگذاری کنید و برای بررسی ارسال نمایید.',
    depositTableTitle: 'فیش‌های واریز',
    depositColumnAmount: 'مبلغ',
    depositColumnStatus: 'وضعیت',
    depositColumnCreated: 'تاریخ ثبت',
    depositColumnFile: 'فایل',
    depositColumnDownload: 'فیش',
    depositColumnUpdate: 'به‌روزرسانی',
    depositColumnDelete: 'حذف',
    depositColumnProforma: 'پیش‌فاکتور',
    depositColumnRejection: 'وضعیت',
    depositColumnLang: 'زبان',
    depositColumnPreview: 'پیش‌نمایش',
    depositConfirmTitle: 'فیش واریز ارسال شود؟',
    depositConfirmBody: 'فیش برای بررسی مالی ارسال می‌شود. ادامه می‌دهید؟',
    depositDownloadFile: 'دانلود',
    depositUpdateFile: 'به‌روزرسانی فایل',
    depositDeleteFile: 'حذف فایل',
    depositNoFile: '-',
    depositNeedAmount: 'ابتدا مبلغ را وارد کنید',
    depositNeedFile: 'لطفاً فایل را انتخاب کنید',
    depositNeedReceiptForProforma:
      'برای دریافت پیش‌فاکتور ابتدا رسید ثبت کنید.',
    depositFileTooLarge: 'حجم فایل نباید بیش از ۵ مگابایت باشد.',
    depositSizeHint: 'فرمت‌های مجاز: JPG، PNG، PDF تا ۵ مگابایت.',
    historyTitle: 'تراکنش‌های مالی',
    historyKindLabels: {
      chargeFree: 'شارژ سامانه',
      chargeCredit: 'شارژ اعتبار هدیه',
      agencyShare: 'سهم از فروش',
    },
    table: {
      row: 'ردیف',
      datetime: 'تاریخ و زمان',
      kind: 'نوع',
      amount: 'مبلغ',
      type: 'نوع',
      status: 'وضعیت',
      freeIncrease: 'افزایش موجودی آزاد',
      creditIncrease: 'افزایش اعتبار',
      invoice: 'فاکتور',
      description: 'توضیحات',
      noTransactions: 'تراکنشی یافت نشد',
      createdAt: 'تاریخ ایجاد',
    },
    operationTypes: {
      'Wallet Recharge': 'شارژ کیف پول',
      'Wallet Withdrawal': 'برداشت از کیف پول',
      'Fund Freeze': 'مسدودسازی وجه',
      'Fund Unfreeze': 'آزادسازی وجه',
      'Fund Lock': 'قفل‌کردن وجه',
      'Fund Unlock': 'بازکردن قفل وجه',
      Refund: 'بازپرداخت',
      'Service Fee': 'کارمزد خدمات',
      'Balance Adjustment': 'تعدیل موجودی',
      'Wallet Credit': 'واریز به کیف پول',
      'Wallet Debit': 'برداشت از کیف پول',
      'Charge Agency Share with Tax': 'کسر سهم آژانس با مالیات',
      'Discharge Agency Share with Tax': 'واریز سهم آژانس با مالیات',
    },
    statuses: {
      Pending: 'در انتظار',
      Completed: 'تکمیل‌شده',
      Failed: 'ناموفق',
      Cancelled: 'لغو شده',
      Reversed: 'معکوس شده',
    },
    modalTitle: 'تأیید پرداخت',
    modalChargeAmount: 'مبلغ شارژ:',
    modalTax: 'مالیات (۱۰٪):',
    modalTotal: 'مبلغ قابل پرداخت:',
    loading: 'در حال بارگذاری...',
    invoiceDownloadError: 'امکان دریافت فاکتور نیست',
  },
};

export type WalletLocale = keyof typeof walletTranslations;

export const getWalletCopy = (language: string): WalletTranslations =>
  walletTranslations[language as WalletLocale] || walletTranslations.en;

export type WalletCopy = WalletTranslations;
