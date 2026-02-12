export interface ReportsTranslations {
  title: string;
  filterPlaceholder: string;
  sortBy: string;
  sortNewest: string;
  sortOldest: string;
  noMore: string;
  loading: string;
  table: {
    row: string;
    title: string;
    text: string;
    lineNumber: string;
    segment: string;
    sent: string;
    status: string;
    numAudience: string;
    createdAt: string;
    scheduleAt: string;
    details: string;
    subsegments: string;
    sex: string;
    cities: string;
    adlink: string;
    updatedAt: string;
    actions: string;
  };
  statuses: {
    initiated: string;
    'in-progress': string;
    'waiting-for-approval': string;
    approved: string;
    rejected: string;
    [key: string]: string;
  };
  modal: {
    details: string;
    rejected: string;
    close: string;
    fixAndRestart: string;
    lineNumber: string;
    subsegments: string;
    sex: string;
    cities: string;
    adlink: string;
    scheduleAt: string;
    updatedAt: string;
    level1: string;
    level2: string;
    level3: string;
    linePriceFactor: string;
    budget: string;
    comment: string;
    statistics: string;
    clickRate: string;
    totalClicks: string;
    total: string;
    numAudience: string;
    linkShortener: string;
    cancelCampaign: string;
    cancelCommentPlaceholder: string;
    cancel: string;
    cancelling: string;
    cancelled: string;
    cancelSuccess: string;
    cancelError: string;
    cancelNotAllowed: string;
    cancelConfirm: string;
  };
}

export const reportsTranslations: Record<'en' | 'fa', ReportsTranslations> = {
  en: {
    title: 'Reports',
    filterPlaceholder: 'Filter by title...',
    sortBy: 'Sort by',
    sortNewest: 'Newest',
    sortOldest: 'Oldest',
    noMore: 'No more campaigns',
    loading: 'Loading...',
    table: {
      row: '#',
      title: 'Title',
      text: 'Text',
      lineNumber: 'Line Number',
      segment: 'Segment',
      sent: 'Sent',
      status: 'Status',
      numAudience: 'Total',
      createdAt: 'Created At',
      scheduleAt: 'Schedule At',
      details: 'Details',
      subsegments: 'Subsegments',
      sex: 'Sex',
      cities: 'Cities',
      adlink: 'Ad Link',
      updatedAt: 'Updated At',
      actions: 'Actions',
    },
    statuses: {
      initiated: 'Initiated',
      'in-progress': 'In Progress',
      'waiting-for-approval': 'Waiting for Approval',
      approved: 'Approved',
      rejected: 'Rejected',
    },
    modal: {
      details: 'Details',
      rejected: 'Rejected',
      close: 'Close',
      fixAndRestart: 'Fix and restart the campaign?',
      lineNumber: 'Line Number',
      subsegments: 'Subsegments',
      sex: 'Sex',
      cities: 'Cities',
      adlink: 'Ad Link',
      scheduleAt: 'Schedule At',
      updatedAt: 'Updated At',
      level1: 'Level 1',
      level2: 'Level 2',
      level3: 'Level 3',
      linePriceFactor: 'Line Price Factor',
      budget: 'Budget',
      comment: 'Comment',
      statistics: 'Statistics',
      clickRate: 'Click Rate',
      totalClicks: 'Total Clicks',
      total: 'Total',
      numAudience: 'Total',
      linkShortener: 'Link Shortener',
      cancelCampaign: 'Cancel Campaign',
      cancelCommentPlaceholder: 'Optional comment (max 500 chars)',
      cancel: 'Cancel campaign',
      cancelling: 'Cancelling...',
      cancelled: 'Campaign cancelled',
      cancelSuccess: 'Campaign cancelled successfully',
      cancelError: 'Failed to cancel campaign',
      cancelNotAllowed: 'Only campaigns waiting for approval can be cancelled',
      cancelConfirm: 'Are you sure you want to cancel this campaign?',
    },
  },
  fa: {
    title: 'گزارش و تحلیل',
    filterPlaceholder: 'فیلتر بر اساس عنوان...',
    sortBy: 'مرتب‌سازی بر اساس',
    sortNewest: 'جدیدترین',
    sortOldest: 'قدیمی‌ترین',
    noMore: 'کمپین دیگری وجود ندارد',
    loading: 'در حال بارگذاری...',
    table: {
      row: '#',
      title: 'عنوان ارسال',
      text: 'متن',
      lineNumber: 'سر شماره',
      segment: 'مخاطبان هدف',
      sent: 'تعداد پیام های رسیده',
      status: 'وضعیت',
      numAudience: 'تعداد پیام های ارسالی',
      createdAt: 'ایجاد شده',
      scheduleAt: 'زمان‌بندی ارسال',
      details: 'جزئیات',
      subsegments: 'زیربخش‌ها',
      sex: 'جنسیت',
      cities: 'شهرها',
      adlink: 'لینک ضمیمه شده',
      updatedAt: 'به‌روزرسانی',
      actions: 'اقدامات',
    },
    statuses: {
      initiated: 'آغاز شده',
      'in-progress': 'در حال انجام',
      'waiting-for-approval': 'در انتظار تأیید',
      approved: 'تأیید شده',
      rejected: 'رد شده',
    },
    modal: {
      details: 'جزئیات',
      rejected: 'رد شده',
      close: 'بستن',
      fixAndRestart: 'اصلاح و شروع مجدد کمپین؟',
      lineNumber: 'سر شماره',
      subsegments: 'زیربخش‌ها',
      sex: 'جنسیت',
      cities: 'شهرها',
      adlink: 'لینک ضمیمه شده',
      scheduleAt: 'زمان‌بندی ارسال',
      updatedAt: 'به‌روزرسانی',
      level1: 'سطح ۱',
      level2: 'سطح ۲',
      level3: 'سطح ۳',
      linePriceFactor: 'ضریب قیمت سرشماره',
      budget: 'هزینه ارسال',
      comment: 'پیام ادمین',
      statistics: 'آمار',
      clickRate: 'نرخ کلیک (تعداد کلیک / تعداد پیام های رسیده)',
      totalClicks: 'مجموع کلیک',
      total: 'مجموع',
      numAudience: 'تعداد پیام های ارسالی',
      linkShortener: 'کوتاه کننده لینک',
      cancelCampaign: 'لغو',
      cancelCommentPlaceholder: 'توضیح اختیاری (حداکثر ۵۰۰ کاراکتر)',
      cancel: 'لغو',
      cancelling: 'در حال لغو...',
      cancelled: 'کمپین لغو شد',
      cancelSuccess: 'کمپین با موفقیت لغو شد',
      cancelError: 'لغو کمپین ناموفق بود',
      cancelNotAllowed: 'فقط ارسال‌های در انتظار تایید قابل لغو هستند',
      cancelConfirm: 'آیا از لغو این کمپین مطمئن هستید؟',
    },
  },
};

export type ReportsLocale = keyof typeof reportsTranslations;

export const getReportsCopy = (language: string): ReportsTranslations =>
  reportsTranslations[language as ReportsLocale] || reportsTranslations.en;

export type ReportsCopy = ReportsTranslations;
