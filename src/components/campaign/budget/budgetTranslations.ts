const budgetEn = {
    // Step header
    title: 'Set Your Budget',

    // Line number section
    lineNumber: 'Line Number',
    selectLineNumber: 'Select Line Number',
    lineNumberPlaceholder: 'Choose a line number for your campaign',
    selectedLine: 'Selected Line',
    linePriceFactor: 'Line price factor',

    // Budget section
    campaignBudget: 'Campaign Budget (Toman)',
    budgetPlaceholder: 'Enter budget amount in Toman',
    budgetValidation: 'Budget must be between 1,000 and 160,000,000 Toman',
    budget: 'Budget',
    budgetHelp: 'Set your total campaign budget. The system will calculate how many messages can be sent with this budget.',
    selectBudgetPercentTitle: 'Use Wallet Balance',
    availableBalance: 'Available Balance',
    balanceError: 'Unable to retrieve wallet balance',
    budgetFromBalance: 'Budget from balance (Toman)',
    currency: 'Toman',
    budgetTooLow: 'Computed amount is below minimum ({min})',
    budgetTooHigh: 'Computed amount exceeds maximum ({max})',

    // Message count section
    estimatedMessages: 'Number of Messages That Can Be Sent',
    sentCountLabel: 'Your total messages to send:',
    capacityCountLabel: 'Capacity of your selected audience:',
    calculatingMessages: 'Calculating messages...',
    messages: 'messages',
    basedOnBudget: 'Based on your budget of {budget}',
    calculating: 'Calculating...',
    enterBudgetToSee: 'Enter a budget to see estimated messages',
    estimatedMessagesHelp: 'This field is automatically calculated by the backend based on your budget and current message costs.',
    note: 'Note:',

    // Budget summary
    budgetSummary: 'Budget Summary',
    lineNumberLabel: 'Line Number:',
    estimatedMessagesLabel: 'Estimated Messages:',
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

    // Line number section
    lineNumber: 'انتخاب سرشماره',
    selectLineNumber: 'انتخاب سرشماره',
    lineNumberPlaceholder: 'سرشماره مدنظر خود را انتخاب کنید',
    selectedLine: 'خط انتخاب شده',
    linePriceFactor: 'ضریب قیمت خط',

    // Budget section
    campaignBudget: 'بودجه ارسال (تومان)',
    budgetPlaceholder: 'مقدار بودجه را به تومان وارد کنید',
    budgetValidation: 'بودجه باید بین ۱,۰۰۰ تا ۱۶۰,۰۰۰,۰۰۰ تومان باشد',
    budget: 'بودجه',
    budgetHelp: 'کل بودجه کمپین خود را تنظیم کنید. سیستم محاسبه خواهد کرد که با این بودجه چند پیام می‌توان ارسال کرد.',
    selectBudgetPercentTitle: 'استفاده از موجودی کیف پول',
    availableBalance: 'موجودی قابل برداشت',
    balanceError: 'عدم توانایی در بازیابی موجودی کیف پول',
    budgetFromBalance: 'بودجه از موجودی (تومان)',
    currency: 'تومان',
    budgetTooLow: 'مقدار محاسبه شده کمتر از حداقل ({min}) است',
    budgetTooHigh: 'مقدار محاسبه شده بیشتر از حداکثر ({max}) است',

    // Message count section
    estimatedMessages: 'تعداد پیام‌های ارسالی',
    sentCountLabel: 'تعداد پیام‌های ارسالی شما:',
    capacityCountLabel: 'تعداد ظرفیت مخاطبان هدف انتخابی شما:',
    calculatingMessages: 'در حال محاسبه پیام‌ها...',
    messages: 'پیام',
    basedOnBudget: 'بر اساس بودجه شما: {budget}',
    calculating: 'در حال محاسبه...',
    enterBudgetToSee: 'بودجه را وارد کنید تا پیام‌های تخمینی را ببینید',
    estimatedMessagesHelp: 'این فیلد به طور خودکار توسط سیستم بر اساس بودجه شما و هزینه‌های فعلی پیام محاسبه می‌شود.',
    note: 'توجه:',

    // Budget summary
    budgetSummary: 'خلاصه بودجه',
    lineNumberLabel: 'شماره خط:',
    estimatedMessagesLabel: 'تعداد پیام‌های تخمینی:',
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
