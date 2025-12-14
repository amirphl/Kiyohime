const budgetEn = {
    // Step header
    title: 'Set Your Budget',
    subtitle: 'Define the financial parameters for your campaign',

    // Line number section
    lineNumber: 'Line Number',
    selectLineNumber: 'Select Line Number',
    lineNumberPlaceholder: 'Choose a line number for your campaign',
    lineNumberHelp: 'Select the phone line that will be used to send SMS messages for this campaign.',
    selectedLine: 'Selected Line',

    // Budget section
    totalBudget: 'Total Budget',
    campaignBudget: 'Campaign Budget',
    budgetPlaceholder: 'Enter budget amount in Toman',
    budgetValidation: 'Budget must be between 1 and 100,000,000,000 Toman',
    budget: 'Budget',
    budgetHelp: 'Set your total campaign budget. The system will calculate how many messages can be sent with this budget.',

    // Message count section
    estimatedMessages: 'Number of Messages That Can Be Sent',
    calculatingMessages: 'Calculating messages...',
    messages: 'messages',
    basedOnBudget: 'Based on your budget of {budget}',
    lastUpdated: 'Last updated: {time}',
    calculating: 'Calculating...',
    enterBudgetToSee: 'Enter a budget to see estimated messages',
    estimatedMessagesHelp: 'This field is automatically calculated by the backend based on your budget and current message costs.',
    note: 'Note:',
    notStored: 'This value is not stored in your campaign data and will be recalculated when needed.',

    // Budget summary
    budgetSummary: 'Budget Summary',
    lineNumberLabel: 'Line Number:',
    totalBudgetLabel: 'Total Budget:',
    estimatedMessagesLabel: 'Estimated Messages:',
    messageCountHelp: 'Number of messages that can be sent with your budget',
    calculateMessageCount: 'Calculate Message Count',
    calculatingMessageCount: 'Calculating message count...',
    messageCountResult: '{count} messages can be sent',
    messageCountError: 'Unable to calculate message count. Please check your selections.',
    notSelected: 'Not Selected',
    notSet: 'Not Set',
    estimatedReach: 'Estimated Reach',
    estimatedReachMessage: 'This shows how many people your campaign can reach based on your budget and targeting criteria.',
    budgetSummaryHelp: 'Review your budget allocation and estimated campaign reach before proceeding to payment.',
};

const budgetFa = {
    // Step header
    title: 'بودجه خود را تنظیم کنید',
    subtitle: 'پارامترهای مالی کمپین خود را تعریف کنید',

    // Line number section
    lineNumber: 'شماره خط',
    selectLineNumber: 'انتخاب شماره خط',
    lineNumberPlaceholder: 'شماره خط کمپین خود را انتخاب کنید',
    lineNumberHelp: 'شماره خط تلفنی که برای ارسال پیام‌های پیامکی این کمپین استفاده خواهد شد را انتخاب کنید.',
    selectedLine: 'خط انتخاب شده',

    // Budget section
    totalBudget: 'کل بودجه',
    campaignBudget: 'بودجه کمپین',
    budgetPlaceholder: 'مقدار بودجه را به تومان وارد کنید',
    budgetValidation: 'بودجه باید بین ۱ تا ۱۰۰,۰۰۰,۰۰۰,۰۰۰ تومان باشد',
    budget: 'بودجه',
    budgetHelp: 'کل بودجه کمپین خود را تنظیم کنید. سیستم محاسبه خواهد کرد که با این بودجه چند پیام می‌توان ارسال کرد.',

    // Message count section
    estimatedMessages: 'تعداد پیام‌هایی که می‌توان ارسال کرد',
    calculatingMessages: 'در حال محاسبه پیام‌ها...',
    messages: 'پیام',
    basedOnBudget: 'بر اساس بودجه شما: {budget}',
    lastUpdated: 'آخرین به‌روزرسانی: {time}',
    calculating: 'در حال محاسبه...',
    enterBudgetToSee: 'بودجه را وارد کنید تا پیام‌های تخمینی را ببینید',
    estimatedMessagesHelp: 'این فیلد به طور خودکار توسط سیستم بر اساس بودجه شما و هزینه‌های فعلی پیام محاسبه می‌شود.',
    note: 'توجه:',
    notStored: 'این مقدار در داده‌های کمپین شما ذخیره نمی‌شود و در صورت نیاز مجدداً محاسبه خواهد شد.',

    // Budget summary
    budgetSummary: 'خلاصه بودجه',
    lineNumberLabel: 'شماره خط:',
    totalBudgetLabel: 'کل بودجه:',
    estimatedMessagesLabel: 'تعداد پیام‌های تخمینی:',
    messageCountHelp: 'تعداد پیام‌هایی که می‌توان با بودجه شما ارسال کرد',
    calculateMessageCount: 'محاسبه تعداد پیام',
    calculatingMessageCount: 'در حال محاسبه تعداد پیام...',
    messageCountResult: '{count} پیام می‌توان با بودجه شما ارسال کرد',
    messageCountError: 'قادر به محاسبه تعداد پیام نیست. لطفاً انتخاب‌های خود را بررسی کنید.',
    notSelected: 'انتخاب نشده',
    notSet: 'تنظیم نشده',
    estimatedReach: 'دسترسی تخمینی',
    estimatedReachMessage: 'این نشان می‌دهد که کمپین شما بر اساس بودجه و معیارهای هدف‌گذاری می‌تواند به چند نفر برسد.',
    budgetSummaryHelp: 'قبل از ادامه به پرداخت، تخصیص بودجه و دسترسی تخمینی کمپین خود را بررسی کنید.',
};

export const budgetI18n = {
    en: budgetEn,
    fa: budgetFa,
}; 