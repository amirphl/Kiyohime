export interface BundlesCopy {
  title: string;
  subtitle: string;
  create: string;
  breadcrumbs: {
    dashboard: string;
    bundles: string;
    create: string;
    detail: string;
  };
  filters: {
    titleLabel: string;
    titlePlaceholder: string;
    customerLabel: string;
    allCustomers: string;
    clear: string;
  };
  table: {
    title: string;
    objective: string;
    persona: string;
    customer: string;
    category: string;
    totalSent: string;
    delivered: string;
    clicks: string;
    clickRate: string;
    status: string;
    actions: string;
    bundleId: string;
    empty: string;
  };
  actions: {
    view: string;
    campaignsWithPhaseAsExecution: string;
    campaignsWithPhaseAsTest: string;
    New: string;
  };
  pagination: {
    previous: string;
    next: string;
    rowsPerPage: string;
    showing: string;
  };
  states: {
    loading: string;
    loadingDescription: string;
    retry: string;
    unknown: string;
    noClickRate: string;
  };
  messages: {
    listLoadFailed: string;
    createLoadFailed: string;
    detailLoadFailed: string;
    actionTodo: string;
    creatingCampaignFromBundle: string;
    saveAndCreateCampaignTodo: string;
    createSuccess: string;
    authRequired: string;
    missingBundleId: string;
    detailActionTodo: string;
    redirectingToReports: string;
  };
  createPage: {
    title: string;
    subtitle: string;
    back: string;
    sections: {
      bundleInfo: string;
      testCustomer: string;
    };
    optional: string;
    fields: {
      title: string;
      objective: string;
      persona: string;
      description: string;
      customerName: string;
      jobCategory: string;
      job: string;
    };
    placeholders: {
      title: string;
      objective: string;
      persona: string;
      description: string;
      customerName: string;
      jobCategory: string;
      job: string;
    };
    helper: {
      testCustomer: string;
    };
    actions: {
      cancel: string;
      save: string;
      saveAndCreateCampaign: string;
      saving: string;
    };
    validation: {
      titleRequired: string;
      objectiveRequired: string;
      personaRequired: string;
      linkRequired: string;
      descriptionTooLong: string;
    };
  };
  detailPage: {
    titleFallback: string;
    back: string;
    sections: {
      overview: string;
      performance: string;
      link: string;
    };
    subtitles: {
      overview: string;
      performance: string;
    };
    fields: {
      objective: string;
      persona: string;
      customerName: string;
      category: string;
      description: string;
      bundleId: string;
      status: string;
      link: string;
      shortLinkDomain: string;
      trackingPlaceholder: string;
      linkTracking: string;
    };
    stats: {
      totalCampaigns: string;
      testCampaigns: string;
      executionCampaigns: string;
      totalSent: string;
      totalClicks: string;
    };
    actions: {
      createCampaign: string;
      viewCampaignsWithPhaseAsTest: string;
      viewCampaignsWithPhaseAsExecution: string;
    };
    values: {
      enabled: string;
      disabled: string;
      notAvailable: string;
      yes: string;
      no: string;
    };
  };
  statuses: Record<string, string>;
}

const bundlesEn: BundlesCopy = {
  title: 'Bundles',
  subtitle: 'Review and manage all of your bundles.',
  create: 'Create new bundle',
  breadcrumbs: {
    dashboard: 'Dashboard',
    bundles: 'Bundles',
    create: 'Create new bundle',
    detail: 'Bundle details',
  },
  filters: {
    titleLabel: 'Filter by bundle title',
    titlePlaceholder: 'Search by bundle title...',
    customerLabel: 'Customer name',
    allCustomers: 'All customers',
    clear: 'Clear filters',
  },
  table: {
    title: 'Bundle title',
    objective: 'Bundle objective',
    persona: 'Audience persona',
    customer: 'Customer name',
    category: 'Category',
    totalSent: 'Total sends',
    delivered: 'Delivered messages',
    clicks: 'Clicks',
    clickRate: 'Click rate',
    status: 'Status',
    actions: 'Actions',
    bundleId: 'Bundle ID',
    empty: 'No bundles found.',
  },
  actions: {
    view: 'View',
    campaignsWithPhaseAsExecution: 'Execution phase',
    campaignsWithPhaseAsTest: 'Test phase',
    New: 'New',
  },
  pagination: {
    previous: 'Previous',
    next: 'Next',
    rowsPerPage: 'Rows per page',
    showing: 'Showing {from} to {to} of {total} bundles',
  },
  states: {
    loading: 'Loading bundles...',
    loadingDescription: 'Fetching the latest bundle list.',
    retry: 'Retry',
    unknown: 'Unknown',
    noClickRate: '-',
  },
  messages: {
    listLoadFailed: 'Failed to load bundles.',
    createLoadFailed: 'Failed to create the bundle.',
    detailLoadFailed: 'Failed to load bundle details.',
    actionTodo: 'TODO: implement bundle action behavior.',
    creatingCampaignFromBundle:
      'Opening a new campaign draft for this bundle...',
    saveAndCreateCampaignTodo:
      'TODO: implement save and create campaign behavior.',
    createSuccess: 'Bundle created successfully.',
    authRequired: 'Please sign in again to continue.',
    missingBundleId: 'Bundle ID is missing or invalid.',
    detailActionTodo: 'TODO: implement detail page action behavior.',
    redirectingToReports: 'Redirecting to reports...',
  },
  createPage: {
    title: 'Create new bundle',
    subtitle:
      'Enter your bundle information so you can design and run related campaigns.',
    back: 'Back to bundles',
    sections: {
      bundleInfo: 'Bundle information',
      testCustomer: 'Test account customer information',
    },
    optional: 'Optional',
    fields: {
      title: 'Bundle title',
      objective: 'Bundle objective',
      persona: 'Audience persona',
      description: 'Additional description',
      customerName: 'Customer name',
      jobCategory: 'Main business category',
      job: 'Sub business category',
    },
    placeholders: {
      title: 'Enter the bundle title',
      objective: 'Summarize the bundle objective clearly',
      persona:
        'Describe your target audience traits such as age, gender, interests, and behavior',
      description: 'Enter any additional notes about this bundle',
      customerName: 'Enter customer name (optional)',
      jobCategory: 'Select main business category (optional)',
      job: 'Select sub business category (optional)',
    },
    helper: {
      testCustomer:
        'If you are creating a test bundle, enter the customer information below.',
    },
    actions: {
      cancel: 'Cancel',
      save: 'Save bundle',
      saveAndCreateCampaign: 'Save and create campaign',
      saving: 'Saving...',
    },
    validation: {
      titleRequired: 'Bundle title is required.',
      objectiveRequired: 'Bundle objective is required.',
      personaRequired: 'Audience persona is required.',
      linkRequired: 'Bundle link is required.',
      descriptionTooLong: 'Description must be at most 2000 characters.',
    },
  },
  detailPage: {
    titleFallback: 'Bundle details',
    back: 'Back to bundles',
    sections: {
      overview: 'Bundle information',
      performance: 'Bundle performance summary',
      link: 'Link details',
    },
    subtitles: {
      overview: 'Key information about this bundle.',
      performance: 'Overview of all bundle campaigns performance.',
    },
    fields: {
      objective: 'Bundle objective',
      persona: 'Audience persona',
      customerName: 'Customer name',
      category: 'Business category',
      description: 'Additional description',
      bundleId: 'Bundle ID',
      status: 'Status',
      link: 'Bundle link',
      shortLinkDomain: 'Short link domain',
      trackingPlaceholder: 'Tracking placeholder',
      linkTracking: 'Link tracking',
    },
    stats: {
      totalCampaigns: 'Total campaigns',
      testCampaigns: 'Total campaigns (phase = Test)',
      executionCampaigns: 'Total campaigns (phase = Execution)',
      totalSent: 'Total delivered messages',
      totalClicks: 'Total clicks',
    },
    actions: {
      createCampaign: 'Create campaign',
      viewCampaignsWithPhaseAsTest: 'View phase = test',
      viewCampaignsWithPhaseAsExecution: 'View phase = execution',
    },
    values: {
      enabled: 'Enabled',
      disabled: 'Disabled',
      notAvailable: 'Not available',
      yes: 'Yes',
      no: 'No',
    },
  },
  statuses: {
    active: 'Active',
    inactive: 'Inactive',
    initiated: 'Initiated',
    in_progress: 'In progress',
    waiting_for_approval: 'Waiting for approval',
    draft: 'Draft',
    pending: 'Pending',
    scheduled: 'Scheduled',
    running: 'Running',
    completed: 'Completed',
    failed: 'Failed',
    paused: 'Paused',
    stopped: 'Stopped',
    cancelled: 'Cancelled',
    archived: 'Archived',
  },
};

const bundlesFa: BundlesCopy = {
  title: 'کمپین‌ها',
  subtitle: 'تمام کمپین‌های خود را مدیریت و بررسی کنید.',
  create: 'ساخت کمپین جدید',
  breadcrumbs: {
    dashboard: 'پیشخوان',
    bundles: 'کمپین‌ها',
    create: 'ساخت کمپین جدید',
    detail: 'جزئیات کمپین',
  },
  filters: {
    titleLabel: 'فیلتر بر اساس عنوان کمپین',
    titlePlaceholder: 'جستجو بر اساس عنوان کمپین...',
    customerLabel: 'نام مشتری',
    allCustomers: 'همه مشتریان',
    clear: 'پاک کردن فیلترها',
  },
  table: {
    title: 'عنوان کمپین',
    objective: 'هدف کمپین',
    persona: 'پرسونای مخاطب',
    customer: 'نام مشتری',
    category: 'دسته‌بندی شغلی',
    totalSent: 'تعداد ارسال‌ها',
    delivered: 'پیام‌های رسیده',
    clicks: 'کلیک‌ها',
    clickRate: 'نرخ کلیک',
    status: 'وضعیت',
    actions: 'اقدامات',
    bundleId: 'شناسه کمپین',
    empty: 'کمپین‌ای پیدا نشد.',
  },
  actions: {
    view: 'مشاهده',
    campaignsWithPhaseAsExecution: 'ارسال‌های اجرا',
    campaignsWithPhaseAsTest: 'ارسال‌های تست',
    New: 'ساخت ارسال',
  },
  pagination: {
    previous: 'قبلی',
    next: 'بعدی',
    rowsPerPage: 'نمایش',
    showing: 'نمایش {from} تا {to} از {total} کمپین',
  },
  states: {
    loading: 'در حال بارگذاری کمپین‌ها...',
    loadingDescription: 'فهرست جدید کمپین‌ها در حال دریافت است.',
    retry: 'تلاش دوباره',
    unknown: 'نامشخص',
    noClickRate: '-',
  },
  messages: {
    listLoadFailed: 'دریافت کمپین‌ها ناموفق بود.',
    createLoadFailed: 'ایجاد کمپین ناموفق بود.',
    detailLoadFailed: 'دریافت جزئیات کمپین ناموفق بود.',
    actionTodo: 'TODO: رفتار این اقدام بعداً پیاده‌سازی شود.',
    creatingCampaignFromBundle:
      'پیش‌نویس یک ارسال جدید بر اساس این کمپین در حال باز شدن است...',
    saveAndCreateCampaignTodo: 'این قابلیت به زودی به سیستم افزوده می‌شود.',
    createSuccess: 'کمپین با موفقیت ایجاد شد.',
    authRequired: 'برای ادامه لطفاً دوباره وارد شوید.',
    missingBundleId: 'شناسه کمپین موجود نیست یا نامعتبر است.',
    detailActionTodo: 'TODO: رفتار دکمه‌های صفحه جزئیات بعداً پیاده‌سازی شود.',
    redirectingToReports: 'در حال هدایت به گزارش و تحلیل...',
  },
  createPage: {
    title: 'ساخت کمپین جدید',
    subtitle:
      'اطلاعات کمپین خود را وارد کنید تا بتوانید ارسال‌های مرتبط را طراحی و اجرا نمایید.',
    back: 'بازگشت به کمپین‌ها',
    sections: {
      bundleInfo: 'اطلاعات کمپین',
      testCustomer: 'اطلاعات مشتری برای حساب آژانس',
    },
    optional: 'اختیاری',
    fields: {
      title: 'عنوان کمپین',
      objective: 'هدف کمپین',
      persona: 'پرسونای مخاطب هدف',
      description: 'توضیحات تکمیلی',
      customerName: 'نام مشتری',
      jobCategory: 'دسته‌بندی اصلی کسب‌وکار',
      job: 'زیر‌دسته فعالیت',
    },
    placeholders: {
      title: 'عنوان کمپین خود را وارد کنید',
      objective: 'هدف کمپین خود را به صورت خلاصه و شفاف وارد کنید',
      persona:
        'ویژگی‌های مخاطبان هدف خود را وارد کنید (مانند سن، جنسیت، علاقه‌مندی‌ها، رفتار و ...)',
      description: 'توضیحات و نکات تکمیلی در مورد این کمپین را وارد کنید',
      customerName: 'نام مشتری را وارد کنید (اختیاری)',
      jobCategory: 'دسته‌بندی اصلی کسب‌وکار را انتخاب کنید (اختیاری)',
      job: 'زیر‌دسته فعالیت کسب‌وکار را انتخاب کنید (اختیاری)',
    },
    helper: {
      testCustomer: 'در صورت تست کمپین برای مشتری، اطلاعات زیر را وارد کنید.',
    },
    actions: {
      cancel: 'انصراف',
      save: 'ذخیره کمپین',
      saveAndCreateCampaign: 'ذخیره و ساخت ارسال',
      saving: 'در حال ذخیره...',
    },
    validation: {
      titleRequired: 'عنوان کمپین الزامی است.',
      objectiveRequired: 'هدف کمپین الزامی است.',
      personaRequired: 'پرسونای مخاطب هدف الزامی است.',
      linkRequired: 'لینک کمپین الزامی است.',
      descriptionTooLong: 'توضیحات باید حداکثر ۲۰۰۰ کاراکتر باشد.',
    },
  },
  detailPage: {
    titleFallback: 'جزئیات کمپین',
    back: 'بازگشت به کمپین‌ها',
    sections: {
      overview: 'اطلاعات کمپین',
      performance: 'خلاصه عملکرد کمپین',
      link: 'جزئیات لینک',
    },
    subtitles: {
      overview: 'اطلاعات کلیدی این کمپین را مشاهده کنید.',
      performance: 'نمای کلی عملکرد همه ارسال‌های این کمپین.',
    },
    fields: {
      objective: 'هدف کمپین',
      persona: 'پرسونای مخاطب هدف',
      customerName: 'نام مشتری (در حالت نمایندگی)',
      category: 'دسته‌بندی شغلی مشتری',
      description: 'توضیحات تکمیلی',
      bundleId: 'شناسه کمپین',
      status: 'وضعیت',
      link: 'لینک کمپین',
      shortLinkDomain: 'دامنه لینک کوتاه',
      trackingPlaceholder: 'شناسه رهگیری',
      linkTracking: 'رهگیری لینک',
    },
    stats: {
      totalCampaigns: 'تعداد کل ارسال‌ها',
      testCampaigns: 'تعداد ارسال‌های تست',
      executionCampaigns: 'تعداد ارسال‌های اجرا',
      totalSent: 'مجموع پیام‌های رسیده',
      totalClicks: 'مجموع کلیک‌ها',
    },
    actions: {
      createCampaign: 'ساخت ارسال',
      viewCampaignsWithPhaseAsTest: 'مشاهده ارسال‌های تست',
      viewCampaignsWithPhaseAsExecution: 'مشاهده ارسال‌های اجرا',
    },
    values: {
      enabled: 'فعال',
      disabled: 'غیرفعال',
      notAvailable: 'موجود نیست',
      yes: 'بله',
      no: 'خیر',
    },
  },
  statuses: {
    active: 'فعال',
    inactive: 'غیرفعال',
    initiated: 'آغاز شده',
    in_progress: 'در حال انجام',
    waiting_for_approval: 'در انتظار تأیید',
    draft: 'پیش‌نویس',
    pending: 'در انتظار',
    scheduled: 'زمان‌بندی شده',
    running: 'در حال اجرا',
    completed: 'تکمیل شده',
    failed: 'ناموفق',
    paused: 'متوقف',
    stopped: 'متوقف شده',
    cancelled: 'لغو شده',
    archived: 'بایگانی شده',
  },
};

export const getBundlesCopy = (language: string): BundlesCopy =>
  language === 'fa' ? bundlesFa : bundlesEn;
