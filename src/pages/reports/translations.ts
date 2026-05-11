export interface ReportsTranslations {
  title: string;
  filterPlaceholder: string;
  sortBy: string;
  sortNewest: string;
  sortOldest: string;
  noMore: string;
  loading: string;
  platforms: {
    sms: string;
    rubika: string;
    bale: string;
    splus: string;
  };
  table: {
    row: string;
    title: string;
    text: string;
    lineNumber: string;
    platform: string;
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
    running: string;
    cancelled: string;
    'cancelled-by-admin': string;
    expired: string;
    executed: string;
    [key: string]: string;
  };
  clone: {
    button: string;
    confirm: string;
    success: string;
    error: string;
    notAllowed: string;
    modalTitle: string;
    modalBody: string;
    close: string;
  };
  resume: {
    button: string;
    confirm: string;
    success: string;
    error: string;
    notAllowed: string;
  };
  modal: {
    details: string;
    rejected: string;
    close: string;
    fixAndRestart: string;
    lineNumber: string;
    platform: string;
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
    segmentPriceFactor: string;
    pricing: string;
    budget: string;
    comment: string;
    statistics: string;
    clickRate: string;
    totalClicks: string;
    totalSentSuccessfully: string;
    totalSentRecords: string;
    totalFailedRecords: string;
    inactiveChannelNumbers: string;
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
    exportReport: string;
    exportingReport: string;
    exportError: string;
    exportMissingCampaignUuid: string;
    exportInvalidCampaignUuid: string;
    exportUnauthorized: string;
    exportForbidden: string;
    exportNotFound: string;
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
    platforms: {
      sms: 'SMS',
      rubika: 'Rubika',
      bale: 'Bale',
      splus: 'S+',
    },
    table: {
      row: '#',
      title: 'Title',
      text: 'Text',
      lineNumber: 'Line Number/Service',
      platform: 'Platform',
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
      running: 'Running',
      cancelled: 'Cancelled',
      'cancelled-by-admin': 'Cancelled by Admin',
      expired: 'Expired',
      executed: 'Executed',
    },
    clone: {
      button: 'Clone',
      confirm: 'Cloning will replace your current in-progress draft. Continue?',
      success: 'Campaign cloned. Loading draft...',
      error: 'Failed to clone campaign.',
      notAllowed: 'This campaign cannot be cloned right now.',
      modalTitle: 'Campaign cloned',
      modalBody:
        'Your campaign was cloned. When you open the Segment page, the latest draft will be loaded automatically.',
      close: 'Close',
    },
    resume: {
      button: 'Resume',
      confirm: 'Resume this campaign? It will replace the current draft.',
      success: 'Campaign loaded. Redirecting to editor...',
      error: 'Failed to resume campaign.',
      notAllowed: 'This campaign cannot be resumed right now.',
    },
    modal: {
      details: 'Details',
      rejected: 'Rejected',
      close: 'Close',
      fixAndRestart: 'Fix and restart the campaign?',
      lineNumber: 'Line Number/Service',
      platform: 'Platform',
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
      segmentPriceFactor: 'Segment Price Factor',
      pricing: 'Pricing & Budget',
      budget: 'Budget',
      comment: 'Comment',
      statistics: 'Statistics',
      clickRate: 'Click Rate',
      totalClicks: 'Total Clicks',
      totalSentSuccessfully: 'Total Sent Successfully',
      totalSentRecords: 'Total Sent Records',
      totalFailedRecords: 'Total Failed Records',
      inactiveChannelNumbers: 'Inactive numbers for this channel',
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
      exportReport: 'Export report',
      exportingReport: 'Exporting...',
      exportError: 'Failed to export campaign report',
      exportMissingCampaignUuid: 'Campaign UUID is required',
      exportInvalidCampaignUuid: 'Campaign UUID is invalid',
      exportUnauthorized: 'You are not authorized. Please log in again.',
      exportForbidden: 'You do not have access to export this campaign report.',
      exportNotFound: 'Campaign report was not found.',
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
    platforms: {
      sms: 'پیامک',
      rubika: 'روبیکا',
      bale: 'بله',
      splus: 'سروش پلاس',
    },
    table: {
      row: '#',
      title: 'عنوان ارسال',
      text: 'متن',
      lineNumber: 'سر شماره/سرویس',
      platform: 'کانال ارسال',
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
      running: 'در حال اجرا',
      cancelled: 'لغو شده',
      'cancelled-by-admin': 'لغو شده توسط ادمین',
      expired: 'منقضی شده',
      executed: 'اجرا شده',
    },
    clone: {
      button: 'کپی',
      confirm: 'با کپی، پیش‌نویس فعلی شما جایگزین می‌شود. ادامه می‌دهید؟',
      success: 'کمپین کپی شد. در حال بارگذاری پیش‌نویس...',
      error: 'کپی کمپین ناموفق بود.',
      notAllowed: 'این کمپین قابل کپی نیست.',
      modalTitle: 'کمپین کپی شد',
      modalBody:
        'کمپین شما کپی شد. با ورود به بخش مدیریت ارسال‌ها، پیش‌نویس جدید به صورت خودکار بارگذاری می‌شود.',
      close: 'بستن',
    },
    resume: {
      button: 'ادامه',
      confirm: 'این کمپین جایگزین پیش‌نویس فعلی می‌شود. ادامه می‌دهید؟',
      success: 'کمپین بارگذاری شد. در حال هدایت به ویرایش...',
      error: 'ادامه کمپین ناموفق بود.',
      notAllowed: 'امکان ادامه این کمپین وجود ندارد.',
    },
    modal: {
      details: 'جزئیات',
      rejected: 'رد شده',
      close: 'بستن',
      fixAndRestart: 'اصلاح و شروع مجدد کمپین؟',
      lineNumber: 'سر شماره/سرویس',
      platform: 'کانال ارسال',
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
      segmentPriceFactor: 'ضریب قیمت مخاطبان',
      pricing: 'قیمت و بودجه',
      budget: 'هزینه ارسال',
      comment: 'پیام ادمین',
      statistics: 'آمار',
      clickRate: 'نرخ کلیک (تعداد کلیک / تعداد پیام های رسیده)',
      totalClicks: 'مجموع کلیک',
      totalSentSuccessfully: 'تعداد پیام‌های رسیده',
      totalSentRecords: 'تعداد پیام‌های ارسالی',
      totalFailedRecords: 'تعداد پیام‌های خطا خورده',
      inactiveChannelNumbers: 'تعداد شماره‌های غیرفعال برای این کانال',
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
      exportReport: 'خروجی گزارش',
      exportingReport: 'در حال دریافت خروجی...',
      exportError: 'دریافت خروجی گزارش کمپین ناموفق بود',
      exportMissingCampaignUuid: 'شناسه کمپین الزامی است',
      exportInvalidCampaignUuid: 'شناسه کمپین نامعتبر است',
      exportUnauthorized: 'احراز هویت ناموفق بود. لطفا دوباره وارد شوید.',
      exportForbidden: 'شما دسترسی لازم برای دریافت خروجی این گزارش را ندارید.',
      exportNotFound: 'گزارش کمپین پیدا نشد.',
    },
  },
};

export type ReportsLocale = keyof typeof reportsTranslations;

export const getReportsCopy = (language: string): ReportsTranslations =>
  reportsTranslations[language as ReportsLocale] || reportsTranslations.en;

export type ReportsCopy = ReportsTranslations;
