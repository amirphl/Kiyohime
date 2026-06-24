import { CpaCalculatorTranslations } from './types';

export const cpaCalculatorTranslations: Record<
  'en' | 'fa',
  CpaCalculatorTranslations
> = {
  en: {
    openCalculator: 'CPA Calculator',
    title: '',
    heroTitle: 'CPA Campaign Profit Calculator',
    heroSubtitle:
      'Estimate CPA campaign profitability by entering your main send performance, optional supplemental send data, capacity, and signup pricing. Related fields update automatically as you edit.',
    heroBadge: 'Right message, right audience, right time',
    mainSendSectionTitle: 'Send Selection',
    mainSendLabel: 'Main send selection',
    mainSendPlaceholder: 'Manual selection',
    mainSendFormula:
      'In the current version, main send data is entered manually. With database integration, multi-send selection should be supported.',
    supplementSendLabel: 'Supplemental send selection',
    supplementSendPlaceholder: 'Manual selection',
    supplementSendFormula:
      'With database integration, the user send list should appear here and support multi-select.',
    primarySectionTitle: 'Main Send Data',
    primaryFields: {
      delivered: {
        label: 'Delivered messages of main send',
        formula: 'Main send signups ÷ main send signup rate',
      },
      conversions: {
        label: 'Main send signups',
        formula: 'Delivered messages × main send signup rate',
      },
      conversionRate: {
        label: 'Main send signup rate',
        formula: '(Main send signups ÷ delivered messages) × 100',
      },
      sendCost: {
        label: 'Your cost per main send message',
        formula: 'Main send cost ÷ delivered messages of main send',
      },
    },
    supplementToggleOn: '+ Calculate supplemental send',
    supplementToggleOff: '− Remove supplemental send',
    supplementSectionTitle: 'Supplemental Send Data',
    supplementFields: {
      mainClicks: {
        label: 'Main send clicks',
        formula: 'Delivered messages of main send × main send click rate',
      },
      clickRate: {
        label: 'Main send click rate',
        formula: '(Main send clicks ÷ delivered messages of main send) × 100',
      },
      suppDelivered: {
        label: 'Delivered messages of supplemental send',
        formula: 'Supplemental signups ÷ supplemental signup rate',
      },
      suppConversions: {
        label: 'Supplemental send signups',
        formula:
          'Delivered messages of supplemental send × supplemental signup rate',
      },
      suppRate: {
        label: 'Supplemental send signup rate',
        formula:
          '(Supplemental signups ÷ delivered messages of supplemental send) × 100',
      },
      suppSendCost: {
        label: 'Your cost per supplemental send message',
        formula:
          'Supplemental cost is only applied at scale for clickers of the main send',
      },
    },
    pricingSectionTitle: 'Capacity and Pricing',
    pricingFields: {
      capacity: {
        label: 'Available capacity of selected segment',
        formula:
          'Main send capacity; supplemental send does not increase capacity',
      },
      offerPrice: {
        label: 'Suggested price per signup',
        formula: 'Total revenue ÷ total achievable signups',
      },
      breakEven: {
        label: 'Break-even price per signup',
        formula: 'Total cost ÷ total achievable signups',
      },
    },
    resultSectionTitle: 'Campaign Financial Result',
    resultFields: {
      possibleConversions: {
        label: 'Total achievable signups',
        formula: 'Main send signups + supplemental send signups',
      },
      revenue: {
        label: 'Total revenue',
        formula: 'Total achievable signups × suggested price per signup',
      },
      totalCost: {
        label: 'Total cost',
        formula: 'Scaled main send cost + scaled supplemental send cost',
      },
      profit: {
        label: 'Your profit',
        formula: 'Total revenue - total cost',
      },
      profitPercent: {
        label: 'Profit percent',
        formula: '(Your profit ÷ total cost) × 100',
      },
    },
    reset: 'Reset all fields',
    close: 'Close',
    manualOption: 'Manual selection',
    unitPercent: '%',
    unitToman: 'Toman',
  },
  fa: {
    openCalculator: 'ماشین‌حساب CPA',
    title: '',
    heroTitle: 'ماشین‌حساب سود کمپین CPA',
    heroSubtitle:
      'سود کمپین‌های CPA را با وارد کردن عملکرد ارسال اصلی، داده‌های ارسال مکمل، ظرفیت و قیمت هر ثبت‌نام محاسبه کنید. فیلدهای وابسته با هر تغییر به‌صورت خودکار به‌روزرسانی می‌شوند.',
    heroBadge: 'پیام درست، مخاطب درست، زمان درست',
    mainSendSectionTitle: 'انتخاب ارسال‌ها',
    mainSendLabel: 'انتخاب ارسال اصلی',
    mainSendPlaceholder: 'انتخاب دستی',
    mainSendFormula:
      'در نسخه فعلی اطلاعات ارسال اصلی به‌صورت دستی وارد می‌شود؛ در حالت اتصال به دیتابیس، انتخاب چند ارسال باید ممکن باشد.',
    supplementSendLabel: 'انتخاب ارسال مکمل',
    supplementSendPlaceholder: 'انتخاب دستی',
    supplementSendFormula:
      'در نسخه اتصال به دیتابیس، لیست ارسال‌های کاربر اینجا نمایش داده می‌شود و انتخاب چند ارسال باید ممکن باشد.',
    primarySectionTitle: 'اطلاعات ارسال اصلی',
    primaryFields: {
      delivered: {
        label: 'تعداد پیام رسیده ارسال اصلی',
        formula: 'تعداد ثبت‌نام ÷ نرخ ثبت‌نام ارسال اصلی',
      },
      conversions: {
        label: 'تعداد ثبت‌نام ارسال اصلی',
        formula: 'تعداد پیام رسیده × نرخ ثبت‌نام ارسال اصلی',
      },
      conversionRate: {
        label: 'نرخ ثبت‌نام ارسال اصلی',
        formula: '(تعداد ثبت‌نام ÷ تعداد پیام رسیده) × 100',
      },
      sendCost: {
        label: 'قیمت هر ارسال اصلی برای شما',
        formula: 'هزینه ارسال اصلی ÷ تعداد پیام رسیده اصلی',
      },
    },
    supplementToggleOn: '+ محاسبه ارسال مکمل',
    supplementToggleOff: '− حذف ارسال مکمل',
    supplementSectionTitle: 'اطلاعات ارسال مکمل',
    supplementFields: {
      mainClicks: {
        label: 'تعداد کلیک ارسال اصلی',
        formula: 'تعداد پیام رسیده ارسال اصلی × نرخ کلیک ارسال اصلی',
      },
      clickRate: {
        label: 'نرخ کلیک ارسال اصلی',
        formula: '(تعداد کلیک ارسال اصلی ÷ تعداد پیام رسیده ارسال اصلی) × 100',
      },
      suppDelivered: {
        label: 'تعداد پیام رسیده ارسال مکمل',
        formula: 'تعداد ثبت‌نام مکمل ÷ نرخ ثبت‌نام ارسال مکمل',
      },
      suppConversions: {
        label: 'تعداد ثبت‌نام ارسال مکمل',
        formula: 'تعداد پیام رسیده مکمل × نرخ ثبت‌نام ارسال مکمل',
      },
      suppRate: {
        label: 'نرخ ثبت‌نام ارسال مکمل',
        formula: '(تعداد ثبت‌نام مکمل ÷ تعداد پیام رسیده مکمل) × 100',
      },
      suppSendCost: {
        label: 'قیمت هر ارسال مکمل برای شما',
        formula:
          'هزینه مکمل فقط برای کلیک‌کنندگان ارسال اصلی در مقیاس لحاظ می‌شود',
      },
    },
    pricingSectionTitle: 'ظرفیت و قیمت‌گذاری',
    pricingFields: {
      capacity: {
        label: 'ظرفیت موجود دسته انتخابی',
        formula: 'ظرفیت ارسال اصلی؛ ارسال مکمل ظرفیت را افزایش نمی‌دهد',
      },
      offerPrice: {
        label: 'قیمت پیشنهادی هر ثبت‌نام',
        formula: 'درآمد کل ÷ تعداد ثبت‌نام قابل حصول کل',
      },
      breakEven: {
        label: 'قیمت سربه‌سر هر ثبت‌نام',
        formula: 'هزینه کل ÷ تعداد ثبت‌نام قابل حصول کل',
      },
    },
    resultSectionTitle: 'نتیجه مالی کمپین',
    resultFields: {
      possibleConversions: {
        label: 'تعداد ثبت‌نام قابل حصول کل',
        formula: 'ثبت‌نام ارسال اصلی + ثبت‌نام ارسال مکمل',
      },
      revenue: {
        label: 'درآمد کل',
        formula: 'تعداد ثبت‌نام قابل حصول کل × قیمت پیشنهادی هر ثبت‌نام',
      },
      totalCost: {
        label: 'هزینه کل',
        formula: 'هزینه ارسال اصلی در مقیاس + هزینه ارسال مکمل در مقیاس',
      },
      profit: {
        label: 'سود شما',
        formula: 'درآمد کل - هزینه کل',
      },
      profitPercent: {
        label: 'درصد سود',
        formula: '(سود شما ÷ هزینه کل) × 100',
      },
    },
    reset: 'پاک‌کردن همه فیلدها',
    close: 'بستن',
    manualOption: 'انتخاب دستی',
    unitPercent: '%',
    unitToman: 'تومان',
  },
};
