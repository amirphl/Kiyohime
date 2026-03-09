export interface WalletTableTranslations {
  row: string;
  datetime: string;
  type: string;
  status: string;
  freeIncrease: string;
  creditIncrease: string;
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
  historyTitle: string;
  table: WalletTableTranslations;
  operationTypes: Record<string, string>;
  statuses: Record<string, string>;
  modalTitle: string;
  modalChargeAmount: string;
  modalTax: string;
  modalTotal: string;
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
    pay: 'Pay',
    historyTitle: 'Payment & Charge History',
    table: {
      row: 'Row',
      datetime: 'Datetime',
      type: 'Type',
      status: 'Status',
      freeIncrease: 'Free Increase',
      creditIncrease: 'Credit Increase',
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
      'Refund': 'Refund',
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
    pay: 'پرداخت',
    historyTitle: 'تاریخچه پرداخت و شارژ',
    table: {
      row: 'ردیف',
      datetime: 'تاریخ و زمان',
      type: 'نوع',
      status: 'وضعیت',
      freeIncrease: 'افزایش موجودی آزاد',
      creditIncrease: 'افزایش اعتبار',
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
      'Refund': 'بازپرداخت',
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
  },
};

export type WalletLocale = keyof typeof walletTranslations;

export const getWalletCopy = (language: string): WalletTranslations =>
  walletTranslations[language as WalletLocale] || walletTranslations.en;

export type WalletCopy = WalletTranslations;
