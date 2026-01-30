const contentEn = {
    // Step header
    title: 'Design Your Message',

    // Link insertion section
    insertLink: 'Insert Link',
    on: 'ON',
    off: 'OFF',
    linkInsertionEnabled: 'Link insertion is enabled',
    linkInsertionDisabled: 'Link insertion is disabled',
    campaignLink: 'Campaign Link',
    linkPlaceholder: 'Enter link URL (max 10000 characters)',
    linkValidation: 'Link must be at most 10000 characters',
    linkInvalidUrl: 'Please enter a valid URL (must start with http:// or https://)',
    characters: 'characters',
    linkAnalysisInfo: 'By enabling this feature you can analyze click results on your landing link.',

    // Schedule section
    scheduleAt: 'Schedule At (Optional)',
    disableSchedule: 'Disable Schedule',
    enableSchedule: 'Enable Schedule',
    campaignScheduled: 'Campaign will be scheduled',
    campaignImmediate: 'Campaign will be sent immediately after approval.',
    scheduleDateTime: 'Schedule Date & Time',
    scheduleTooSoon: 'Please pick a time at least 20 minutes from now',

    // Message text section
    text: 'Text',
    campaignText: '',
    textPlaceholder: 'Enter your campaign message text',
    insertLinkCharacter: 'Add link here',
    linkCharacterInserted: 'Link position marked',
    linkCharacterInsertedMessage: 'Link will be inserted at the marked position (🔗)',
    charactersLabel: 'Characters: {count} (user input)',
    totalLabel: 'Total: {count} / {max}',
    partsLabel: 'Parts: {count}',
    partsCount: '{total}/{parts}',
    partsBreakdown: 'Parts breakdown:',
    partsExplanation: '≤70 chars = 1 part, ≤132 = 2 parts, ≤198 = 3 parts, ≤264 = 4 parts, ≤330 = 5 parts',
    withLinkExplanation: 'With link: starts at 20 chars (6 cancellation + 14 shortened link)',
    withoutLinkExplanation: 'Without link: starts at 6 chars (cancellation append)',
    textExceedsLimit: '⚠️ Text exceeds maximum length. Please shorten your message.',
};

const contentFa = {
    // Step header
    title: 'پیام خود را طراحی کنید',

    // Link insertion section
    insertLink: 'قابلیت تحلیل نتایج عملکردی لینک',
    on: 'فعال',
    off: 'غیرفعال',
    linkInsertionEnabled: 'افزودن لینک فعال است',
    linkInsertionDisabled: 'افزودن لینک غیرفعال است',
    campaignLink: 'لینک کمپین',
    linkPlaceholder: 'آدرس لینک را وارد کنید (حداکثر ۱۰۰۰۰ کاراکتر)',
    linkValidation: 'لینک باید حداکثر ۱۰۰۰۰ کاراکتر باشد',
    linkInvalidUrl: 'لطفاً یک آدرس لینک صحیح وارد کنید (باید با http:// یا https:// شروع شود)',
    characters: 'کاراکتر',
    linkAnalysisInfo: 'با فعال‌کردن این قابلیت امکان تحلیل نتایج کلیک روی لینک مورد نظر شما فراهم می‌شود.',

    // Schedule section
    scheduleAt: 'زمان‌بندی (اختیاری)',
    disableSchedule: 'غیرفعال کردن زمان‌بندی',
    enableSchedule: 'فعال کردن زمان‌بندی',
    campaignScheduled: 'کمپین زمان‌بندی خواهد شد.',
    campaignImmediate: 'کمپین بلافاصله بعد از تایید ارسال می‌شود.',
    scheduleDateTime: 'تاریخ و زمان زمان‌بندی',
    scheduleTooSoon: 'لطفاً زمانی حداقل ۲۰ دقیقه بعد از اکنون انتخاب کنید',

    // Message text section
    text: 'متن',
    campaignText: '',
    textPlaceholder: 'متن پیام کمپین خود را وارد کنید',
    insertLinkCharacter: 'افزودن لینک در اینجا',
    linkCharacterInserted: 'موقعیت لینک شناسایی شده',
    linkCharacterInsertedMessage: 'لینک کوتاه‌شده در محل مکان‌نما با علامت 🔗 قرار خواهد گرفت.',
    charactersLabel: 'تعداد کاراکترها: {count} (ورودی کاربر)',
    totalLabel: 'مجموع: {count} / {max}',
    partsLabel: 'تعداد صفحه: {count}',
    partsCount: '{total}/{parts}',
    partsBreakdown: 'تجزیه تعداد پیام:',
    partsExplanation: '≤۷۰ کاراکتر = ۱ پیام، ≤۱۳۲ = ۲ پیام، ≤۱۹۸ = ۳ پیام، ≤۲۶۴ = ۴ پیام، ≤۳۳۰ = ۵ پیام',
    withLinkExplanation: 'با لینک: از ۲۰ کاراکتر شروع می‌شود (۶ لغو + ۱۴ لینک کوتاه)',
    withoutLinkExplanation: 'بدون لینک: از ۶ کاراکتر شروع می‌شود (اضافه کردن لغو)',
    textExceedsLimit: '⚠️ متن از حداکثر طول مجاز فراتر رفته است. لطفاً پیام خود را کوتاه کنید.',
};

export const contentI18n = {
    en: contentEn,
    fa: contentFa,
};