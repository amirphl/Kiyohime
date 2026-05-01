import { Language } from '../../hooks/useLanguage';

export interface AdminCampaignManagementCopy {
  title: string;
  backToSardis: string;
  common: {
    loading: string;
    cancel: string;
  };
  filters: {
    titleLabel: string;
    titlePlaceholder: string;
    statusLabel: string;
    startDateLabel: string;
    endDateLabel: string;
    apply: string;
    all: string;
    statuses: {
      initiated: string;
      inProgress: string;
      waitingForApproval: string;
      approved: string;
      rejected: string;
    };
  };
  table: {
    noData: string;
    headers: {
      row: string;
      status: string;
      platform: string;
      createdAt: string;
      updatedAt: string;
      title: string;
      segment: string;
      subsegment: string;
      sex: string;
      city: string;
      adLink: string;
      content: string;
      scheduleAt: string;
      lineNumber: string;
      budget: string;
      comment: string;
      actions: string;
    };
    actions: {
      approve: string;
      reject: string;
      cancel: string;
    };
  };
  modal: {
    approveTitle: string;
    rejectTitle: string;
    cancelTitle: string;
    uuid: string;
    title: string;
    currentStatus: string;
    platform: string;
    platformSettingsId: string;
    mediaUuid: string;
    commentLabelOptional: string;
    commentLabelRequired: string;
    maxChars: string;
    approve: string;
    reject: string;
    cancel: string;
    submitting: string;
    closeLabel: string;
  };
  errors: {
    listFailed: string;
    approveFailed: string;
    rejectFailed: string;
    cancelFailed: string;
    missingNumericId: string;
  };
}

const en: AdminCampaignManagementCopy = {
  title: 'Admin Campaigns',
  backToSardis: 'Back to Sardis',
  common: {
    loading: 'Loading...',
    cancel: 'Cancel',
  },
  filters: {
    titleLabel: 'Title',
    titlePlaceholder: 'Search by title',
    statusLabel: 'Status',
    startDateLabel: 'Start Date',
    endDateLabel: 'End Date',
    apply: 'Apply',
    all: 'All',
    statuses: {
      initiated: 'Initiated',
      inProgress: 'In Progress',
      waitingForApproval: 'Waiting for Approval',
      approved: 'Approved',
      rejected: 'Rejected',
    },
  },
  table: {
    noData: 'No campaigns found',
    headers: {
      row: '#',
      status: 'Status',
      platform: 'Platform',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      title: 'Title',
      segment: 'Segment',
      subsegment: 'Subsegment',
      sex: 'Sex',
      city: 'City',
      adLink: 'Ad Link',
      content: 'Content',
      scheduleAt: 'Schedule At',
      lineNumber: 'Line Number',
      budget: 'Budget',
      comment: 'Comment',
      actions: 'Actions',
    },
    actions: {
      approve: 'Approve',
      reject: 'Reject',
      cancel: 'Cancel',
    },
  },
  modal: {
    approveTitle: 'Approve Campaign',
    rejectTitle: 'Reject Campaign',
    cancelTitle: 'Cancel Campaign',
    uuid: 'UUID',
    title: 'Title',
    currentStatus: 'Current Status',
    platform: 'Platform',
    platformSettingsId: 'Platform Settings ID',
    mediaUuid: 'Media UUID',
    commentLabelOptional: 'Comment (optional)',
    commentLabelRequired: 'Comment (required)',
    maxChars: 'Max 1000 chars',
    approve: 'Approve',
    reject: 'Reject',
    cancel: 'Cancel',
    submitting: 'Submitting…',
    closeLabel: 'Close',
  },
  errors: {
    listFailed: 'Failed to list campaigns',
    approveFailed: 'Approve failed',
    rejectFailed: 'Reject failed',
    cancelFailed: 'Cancel failed',
    missingNumericId: 'Campaign numeric id not available',
  },
};

const fa: AdminCampaignManagementCopy = {
  title: 'ارسال‌های ادمین',
  backToSardis: 'بازگشت به ساردیس',
  common: {
    loading: 'در حال بارگذاری...',
    cancel: 'انصراف',
  },
  filters: {
    titleLabel: 'عنوان',
    titlePlaceholder: 'جستجو بر اساس عنوان',
    statusLabel: 'وضعیت',
    startDateLabel: 'تاریخ شروع',
    endDateLabel: 'تاریخ پایان',
    apply: 'اعمال',
    all: 'همه',
    statuses: {
      initiated: 'آغاز شده',
      inProgress: 'در حال انجام',
      waitingForApproval: 'در انتظار تأیید',
      approved: 'تأیید شده',
      rejected: 'رد شده',
    },
  },
  table: {
    noData: 'کمپینی یافت نشد',
    headers: {
      row: '#',
      status: 'وضعیت',
      platform: 'پلتفرم',
      createdAt: 'ایجاد شده در',
      updatedAt: 'به‌روزرسانی در',
      title: 'عنوان',
      segment: 'بخش',
      subsegment: 'زیر‌بخش',
      sex: 'جنسیت',
      city: 'شهر',
      adLink: 'لینک تبلیغ',
      content: 'محتوا',
      scheduleAt: 'زمان‌بندی',
      lineNumber: 'شماره خط',
      budget: 'بودجه',
      comment: 'توضیح',
      actions: 'اقدامات',
    },
    actions: {
      approve: 'تأیید',
      reject: 'رد',
      cancel: 'لغو',
    },
  },
  modal: {
    approveTitle: 'تأیید کمپین',
    rejectTitle: 'رد کمپین',
    cancelTitle: 'لغو کمپین',
    uuid: 'UUID',
    title: 'عنوان',
    currentStatus: 'وضعیت فعلی',
    platform: 'کانال',
    platformSettingsId: 'شناسه تنظیمات کانال',
    mediaUuid: 'شناسه رسانه',
    commentLabelOptional: 'توضیح (اختیاری)',
    commentLabelRequired: 'توضیح (الزامی)',
    maxChars: 'حداکثر ۱۰۰۰ کاراکتر',
    approve: 'تأیید',
    reject: 'رد',
    cancel: 'لغو',
    submitting: 'در حال ارسال…',
    closeLabel: 'بستن',
  },
  errors: {
    listFailed: 'دریافت فهرست ارسال‌ها ناموفق بود',
    approveFailed: 'تأیید ناموفق بود',
    rejectFailed: 'رد ناموفق بود',
    cancelFailed: 'لغو ناموفق بود',
    missingNumericId: 'شناسه عددی کمپین در دسترس نیست',
  },
};

const map: Record<Language, AdminCampaignManagementCopy> = {
  en,
  fa,
};

export const getAdminCampaignManagementCopy = (language: Language): AdminCampaignManagementCopy =>
  map[language] || map.en;
