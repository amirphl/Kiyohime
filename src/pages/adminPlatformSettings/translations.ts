export interface AdminPlatformSettingsCopy {
  title: string;
  subtitle: string;
  backToSardis: string;
  refresh: string;
  table: {
    row: string;
    id: string;
    uuid: string;
    customerId: string;
    platform: string;
    name: string;
    description: string;
    multimediaUuid: string;
    preview: string;
    download: string;
    metadata: string;
    metadataInfo: string;
    metadataKey: string;
    metadataValue: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    changeStatus: string;
    noData: string;
  };
  statuses: {
    initialized: string;
    inProgress: string;
    active: string;
    inactive: string;
  };
  actions: {
    openStatusModal: string;
    download: string;
    attachMetadata: string;
    viewMetadata: string;
    save: string;
    cancel: string;
  };
  modal: {
    title: string;
    currentStatus: string;
    nextStatus: string;
    hint: string;
    metadataTitle: string;
    metadataEmpty: string;
  };
  errors: {
    listFailed: string;
    updateFailed: string;
    invalidTargetStatus: string;
    previewFailed: string;
    downloadFailed: string;
    metadataKeyRequired: string;
    metadataValueRequired: string;
    metadataUpdateFailed: string;
  };
  success: {
    statusUpdated: string;
    metadataUpdated: string;
  };
  common: {
    loading: string;
    emptyValue: string;
  };
}

const en: AdminPlatformSettingsCopy = {
  title: 'Platform Settings (Admin)',
  subtitle: 'Review all platform settings and change their status.',
  backToSardis: 'Back to Sardis',
  refresh: 'Refresh',
  table: {
    row: '#',
    id: 'ID',
    uuid: 'UUID',
    customerId: 'Customer ID',
    platform: 'Platform',
    name: 'Name',
    description: 'Description',
    multimediaUuid: 'Multimedia UUID',
    preview: 'Preview',
    download: 'Download',
    metadata: 'Metadata',
    metadataInfo: 'Meta',
    metadataKey: 'Key',
    metadataValue: 'Value',
    status: 'Status',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    changeStatus: 'Change Status',
    noData: 'No platform settings found',
  },
  statuses: {
    initialized: 'Initialized',
    inProgress: 'In Progress',
    active: 'Active',
    inactive: 'Inactive',
  },
  actions: {
    openStatusModal: 'Change',
    download: 'Download',
    attachMetadata: 'Attach',
    viewMetadata: 'View metadata',
    save: 'Save',
    cancel: 'Cancel',
  },
  modal: {
    title: 'Change Platform Setting Status',
    currentStatus: 'Current Status',
    nextStatus: 'New Status',
    hint: 'Initialized cannot be selected.',
    metadataTitle: 'Metadata',
    metadataEmpty: 'No metadata',
  },
  errors: {
    listFailed: 'Failed to list platform settings',
    updateFailed: 'Failed to update status',
    invalidTargetStatus: 'Select a valid status',
    previewFailed: 'Failed to load multimedia preview',
    downloadFailed: 'Failed to download multimedia',
    metadataKeyRequired: 'Metadata key is required',
    metadataValueRequired: 'Metadata value is required',
    metadataUpdateFailed: 'Failed to update platform settings metadata',
  },
  success: {
    statusUpdated: 'Platform setting status updated',
    metadataUpdated: 'Platform settings metadata updated',
  },
  common: {
    loading: 'Loading...',
    emptyValue: '-',
  },
};

const fa: AdminPlatformSettingsCopy = {
  title: 'تنظیمات کانال‌ها (ادمین)',
  subtitle: 'تمام تنظیمات کانال‌ها را مشاهده و وضعیت آن‌ها را مدیریت کنید.',
  backToSardis: 'بازگشت به ساردیس',
  refresh: 'تازه‌سازی',
  table: {
    row: '#',
    id: 'شناسه',
    uuid: 'UUID',
    customerId: 'شناسه مشتری',
    platform: 'کانال',
    name: 'نام',
    description: 'بایو',
    multimediaUuid: 'UUID رسانه',
    preview: 'پیش‌نمایش',
    download: 'دانلود',
    metadata: 'متادیتا',
    metadataInfo: 'جزئیات',
    metadataKey: 'کلید',
    metadataValue: 'مقدار',
    status: 'وضعیت',
    createdAt: 'تاریخ ایجاد',
    updatedAt: 'تاریخ بروزرسانی',
    changeStatus: 'تغییر وضعیت',
    noData: 'تنظیمات کانالی یافت نشد',
  },
  statuses: {
    initialized: 'مقداردهی اولیه',
    inProgress: 'در حال انجام',
    active: 'فعال',
    inactive: 'غیرفعال',
  },
  actions: {
    openStatusModal: 'تغییر',
    download: 'دانلود',
    attachMetadata: 'ثبت',
    viewMetadata: 'نمایش متادیتا',
    save: 'ذخیره',
    cancel: 'انصراف',
  },
  modal: {
    title: 'تغییر وضعیت تنظیمات کانال',
    currentStatus: 'وضعیت فعلی',
    nextStatus: 'وضعیت جدید',
    hint: 'وضعیت مقداردهی اولیه قابل انتخاب نیست.',
    metadataTitle: 'متادیتا',
    metadataEmpty: 'متادیتایی وجود ندارد',
  },
  errors: {
    listFailed: 'دریافت تنظیمات کانال ناموفق بود',
    updateFailed: 'تغییر وضعیت ناموفق بود',
    invalidTargetStatus: 'یک وضعیت معتبر انتخاب کنید',
    previewFailed: 'بارگذاری پیش‌نمایش رسانه ناموفق بود',
    downloadFailed: 'دانلود رسانه ناموفق بود',
    metadataKeyRequired: 'کلید متادیتا الزامی است',
    metadataValueRequired: 'مقدار متادیتا الزامی است',
    metadataUpdateFailed: 'بروزرسانی متادیتای تنظیمات کانال ناموفق بود',
  },
  success: {
    statusUpdated: 'وضعیت تنظیمات کانال بروزرسانی شد',
    metadataUpdated: 'متادیتای تنظیمات کانال بروزرسانی شد',
  },
  common: {
    loading: 'در حال بارگذاری...',
    emptyValue: '-',
  },
};

export const adminPlatformSettingsTranslations: Record<'en' | 'fa', AdminPlatformSettingsCopy> =
  {
    en,
    fa,
  };
