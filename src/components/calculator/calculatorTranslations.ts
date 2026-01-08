export interface CalculatorTranslations {
  openCalculator: string;
  title: string;
  amountLabel: string;
  amountPlaceholder: string;
  amountPreview: string;
  amountChips: string[];
  percentLabel: string;
  percentHint: string;
  percentChips: string[];
  tableHeadDesc: string;
  tableHeadValue: string;
  reductionLabel: string;
  reductionTip: string;
  giftLabel: string;
  giftTip: string;
  ruleFixed: string;
  yourRevenueLabel: string;
  totalChargeLabel: string;
  reset: string;
  apply: string;
  // Legacy fields (kept for backward compatibility with older calculator usage)
  discountLabel?: string;
  chips?: string[];
  equationPrefix?: string;
  times?: string;
}

export const calculatorTranslations: Record<'en' | 'fa', CalculatorTranslations> = {
  en: {
    openCalculator: 'Calculator',
    title: 'Your Calculator',
    amountLabel: 'Customer Top-up Amount (Toman)',
    amountPlaceholder: 'e.g. 300000000',
    amountPreview: 'Preview:',
    amountChips: ['20 million Toman', '60 million Toman', '140 million Toman', '300 million Toman'],
    percentLabel: 'Customer Gift Percent (0 to 100%)',
    percentHint: 'Quick picks:',
    percentChips: ['0%', '20%', '40%', '60%', '80%', '90%', '100%'],
    tableHeadDesc: 'Description',
    tableHeadValue: 'Amount',
    reductionLabel: 'Your revenue reduction',
    reductionTip:
      'Reduction of your revenue compared to when the gift percent is zero. Depends on customer top-up and the gift percent you set.',
    giftLabel: 'Gift amount you give the customer',
    giftTip: 'The gift balance you are granting to the customer based on their top-up and your chosen gift percent.',
    ruleFixed: 'Fixed rule:',
    yourRevenueLabel: 'Your final revenue',
    totalChargeLabel: 'Customer final balance',
    reset: 'Reset',
    apply: 'Apply',
    // Legacy values from the previous calcI18n
    discountLabel: 'Agency discount (0 to 100%)',
    chips: ['0%', '20%', '40%', '60%', '80%', '90%', '100%'],
    equationPrefix: '',
    times: '×',
  },
  fa: {
    openCalculator: 'ماشین‌حساب',
    title: 'ماشین‌حساب شما',
    amountLabel: 'میزان شارژ مشتری (تومان)',
    amountPlaceholder: 'مثلاً 300000000',
    amountPreview: 'نمایش:',
    amountChips: ['۲۰ میلیون تومان', '۶۰ میلیون تومان', '۱۴۰ میلیون تومان', '۳۰۰ میلیون تومان'],
    percentLabel: 'درصد شارژ هدیه مشتری (۰ تا ۱۰۰٪)',
    percentHint: 'انتخاب نمونه‌ها:',
    percentChips: ['۰٪', '۲۰٪', '۴۰٪', '۶۰٪', '۸۰٪', '۹۰٪', '۱۰۰٪'],
    tableHeadDesc: 'شرح',
    tableHeadValue: 'مقدار',
    reductionLabel: 'میزان کاهش درآمد شما',
    reductionTip:
      'این فیلد میزان کاهش درآمد شما نسبت به وقتی است که درصد شارژ هدیه صفر در نظر گرفته‌اید. این مقدار متناسب با مبلغ شارژ مشتری و درصد شارژ هدیه‌ای است که برای مشتری در نظر گرفته‌اید',
    giftLabel: 'میزان شارژ هدیه شما به مشتری',
    giftTip:
      'این فیلد میزان شارژ هدیه‌ای است که شما به مشتری داده‌اید. این مقدار متناسب با مبلغ شارژ مشتری و درصد شارژ هدیه‌ای است که برای مشتری در نظر گرفته‌اید',
    ruleFixed: 'قاعده‌ی ثابت:',
    yourRevenueLabel: 'میزان درآمد نهایی شما',
    totalChargeLabel: 'میزان شارژ نهایی مشتری',
    reset: 'بازنشانی',
    apply: 'اعمال',
    // Legacy values from the previous calcI18n
    discountLabel: 'درصد تخفیف آژانس (۰ تا ۱۰۰٪)',
    chips: ['۰٪', '۲۰٪', '۴۰٪', '۶۰٪', '۸۰٪', '۹۰٪', '۱۰۰٪'],
    equationPrefix: '',
    times: '×',
  },
};
