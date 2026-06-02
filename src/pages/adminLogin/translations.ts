export const adminLoginTranslations = {
  en: {
    title: 'Admin Login',
    subtitle:
      'Enter your username, password, and captcha to receive a one-time code.',
    otpTitle: 'Verify One-Time Code',
    otpSubtitle: 'Enter the 6-digit code sent to {maskedPhone}.',
    fields: {
      username: 'Username',
      usernamePlaceholder: 'Enter your username',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      captcha: 'Rotate Captcha',
      captchaAngle: 'Captcha angle',
      captchaMasterAlt: 'Captcha reference image',
      captchaThumbAlt: 'Captcha piece to rotate',
      otpCode: 'OTP code',
      otpPlaceholder: 'Enter 6-digit code',
    },
    actions: {
      reloadCaptcha: 'Reload captcha',
      sendOtp: 'Send OTP',
      sendingOtp: 'Sending OTP…',
      verifyOtp: 'Verify OTP',
      verifyingOtp: 'Verifying OTP…',
      back: 'Back',
      restart: 'Start over',
      loadingCaptcha: 'Loading captcha…',
      retryCaptcha: 'Retry captcha',
    },
    status: {
      otpExpiresAt: 'OTP expires at {time}',
      otpSentTo: 'Code sent to {maskedPhone}',
      alreadySent: 'A valid OTP was already sent.',
    },
    validation: {
      captchaNotReady: 'Captcha is not ready yet.',
      usernameRequired: 'Username is required.',
      passwordRequired: 'Password is required.',
      otpRequired: 'Please enter the 6-digit OTP code.',
      otpInvalid: 'OTP code must be exactly 6 digits.',
    },
    errors: {
      captchaInitFailed: 'Failed to initialize captcha. Please try again.',
      loginInitFailed: 'Failed to start login. Please try again.',
      otpVerifyFailed: 'OTP verification failed. Please try again.',
      invalidResponse: 'The server response was invalid. Please try again.',
      networkError:
        'Network error. Please check your connection and try again.',
      unexpectedState:
        'The login flow is in an invalid state. Please start over.',
      unknown: 'An unexpected error occurred. Please try again.',
    },
    success: {
      otpSent: 'OTP sent successfully.',
      loginSuccessful: 'Login successful.',
    },
    backend: {
      INVALID_REQUEST: 'Invalid request. Please review your input.',
      VALIDATION_ERROR:
        'Please review the highlighted information and try again.',
      INVALID_CAPTCHA: 'Captcha is incorrect. Please try again.',
      ADMIN_2FA_NOT_CONFIGURED:
        'Two-factor authentication is not configured for this admin account.',
      LOGIN_FAILED: 'Username, password, or captcha is incorrect.',
      RATE_LIMITED: 'Too many attempts. Please wait and try again.',
      INVALID_OTP: 'The OTP code is invalid or has expired.',
      ADMIN_INACTIVE: 'This admin account is inactive.',
      UNAUTHORIZED: 'You are not authorized to perform this action.',
      OTP_ALREADY_VERIFIED: 'This OTP challenge has already been used.',
      OTP_EXPIRED: 'The OTP code has expired. Please start over.',
      CHALLENGE_NOT_FOUND:
        'The login challenge was not found. Please start over.',
      INVALID_RESPONSE: 'The server response was invalid. Please try again.',
      INVALID_RESPONSE_CONTENT_TYPE:
        'The server response was invalid. Please try again.',
      NETWORK_ERROR:
        'Network error. Please check your connection and try again.',
      TIMEOUT_ERROR: 'Request timed out. Please try again.',
      FORBIDDEN: 'You do not have access to perform this action.',
      RATE_LIMIT_EXCEEDED: 'Too many attempts. Please wait and try again.',
      SERVICE_UNAVAILABLE:
        'Service is temporarily unavailable. Please try again later.',
      INTERNAL_SERVER_ERROR: 'A server error occurred. Please try again later.',
      MISSING_ACCESS_TOKEN: 'Authentication is missing. Please sign in again.',
      UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
      invalidRequestBody: 'Invalid request. Please review your input.',
      validationFailed:
        'Please review the highlighted information and try again.',
      invalidCaptchaMessage: 'Captcha is incorrect. Please try again.',
      otpSentMessage: 'OTP sent successfully.',
      loginSuccessfulMessage: 'Login successful.',
      otpVerifyFailedMessage: 'OTP verification failed. Please try again.',
      loginFailedMessage: 'Username, password, or captcha is incorrect.',
      captchaInitFailedMessage:
        'Failed to initialize captcha. Please try again.',
    },
  },
  fa: {
    title: 'ورود ادمین',
    subtitle:
      'نام کاربری، رمز عبور و کپچا را وارد کنید تا کد یکبارمصرف برای شما ارسال شود.',
    otpTitle: 'تأیید کد یکبارمصرف',
    otpSubtitle: 'کد ۶ رقمی ارسال‌شده به {maskedPhone} را وارد کنید.',
    fields: {
      username: 'نام کاربری',
      usernamePlaceholder: 'نام کاربری را وارد کنید',
      password: 'رمز عبور',
      passwordPlaceholder: 'رمز عبور را وارد کنید',
      captcha: 'چرخاندن کپچا',
      captchaAngle: 'زاویه کپچا',
      captchaMasterAlt: 'تصویر مرجع کپچا',
      captchaThumbAlt: 'قطعه کپچای قابل چرخش',
      otpCode: 'کد یکبارمصرف',
      otpPlaceholder: 'کد ۶ رقمی را وارد کنید',
    },
    actions: {
      reloadCaptcha: 'بارگذاری مجدد کپچا',
      sendOtp: 'ارسال کد',
      sendingOtp: 'در حال ارسال کد…',
      verifyOtp: 'تأیید کد',
      verifyingOtp: 'در حال تأیید کد…',
      back: 'بازگشت',
      restart: 'شروع دوباره',
      loadingCaptcha: 'در حال بارگذاری کپچا…',
      retryCaptcha: 'تلاش دوباره برای کپچا',
    },
    status: {
      otpExpiresAt: 'انقضای کد: {time}',
      otpSentTo: 'کد به {maskedPhone} ارسال شد',
      alreadySent: 'یک کد معتبر قبلاً ارسال شده است.',
    },
    validation: {
      captchaNotReady: 'کپچا هنوز آماده نیست.',
      usernameRequired: 'نام کاربری الزامی است.',
      passwordRequired: 'رمز عبور الزامی است.',
      otpRequired: 'لطفاً کد ۶ رقمی را وارد کنید.',
      otpInvalid: 'کد باید دقیقاً ۶ رقم باشد.',
    },
    errors: {
      captchaInitFailed: 'بارگذاری کپچا ناموفق بود. دوباره تلاش کنید.',
      loginInitFailed: 'شروع ورود ناموفق بود. دوباره تلاش کنید.',
      otpVerifyFailed: 'تأیید کد ناموفق بود. دوباره تلاش کنید.',
      invalidResponse: 'پاسخ سرور نامعتبر بود. دوباره تلاش کنید.',
      networkError:
        'خطای شبکه رخ داد. اتصال خود را بررسی کرده و دوباره تلاش کنید.',
      unexpectedState:
        'وضعیت فرایند ورود نامعتبر است. لطفاً دوباره از ابتدا تلاش کنید.',
      unknown: 'خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
    },
    success: {
      otpSent: 'کد یکبارمصرف با موفقیت ارسال شد.',
      loginSuccessful: 'ورود با موفقیت انجام شد.',
    },
    backend: {
      INVALID_REQUEST: 'درخواست نامعتبر است. ورودی را بررسی کنید.',
      VALIDATION_ERROR:
        'لطفاً اطلاعات واردشده را بررسی کرده و دوباره تلاش کنید.',
      INVALID_CAPTCHA: 'کپچا نامعتبر است. دوباره تلاش کنید.',
      ADMIN_2FA_NOT_CONFIGURED:
        'احراز هویت دومرحله‌ای برای این حساب مدیر تنظیم نشده است.',
      LOGIN_FAILED: 'نام کاربری، رمز عبور یا کپچا نادرست است.',
      RATE_LIMITED: 'تعداد تلاش‌ها زیاد است. کمی بعد دوباره تلاش کنید.',
      INVALID_OTP: 'کد یکبارمصرف نامعتبر است یا منقضی شده است.',
      ADMIN_INACTIVE: 'این حساب مدیر غیرفعال است.',
      UNAUTHORIZED: 'شما مجاز به انجام این عملیات نیستید.',
      OTP_ALREADY_VERIFIED: 'این چالش کد یکبارمصرف قبلاً استفاده شده است.',
      OTP_EXPIRED: 'کد یکبارمصرف منقضی شده است. دوباره از ابتدا شروع کنید.',
      CHALLENGE_NOT_FOUND:
        'چالش ورود پیدا نشد. لطفاً دوباره از ابتدا شروع کنید.',
      INVALID_RESPONSE: 'پاسخ سرور نامعتبر بود. دوباره تلاش کنید.',
      INVALID_RESPONSE_CONTENT_TYPE: 'پاسخ سرور نامعتبر بود. دوباره تلاش کنید.',
      NETWORK_ERROR:
        'خطای شبکه رخ داد. اتصال خود را بررسی کرده و دوباره تلاش کنید.',
      TIMEOUT_ERROR: 'مهلت درخواست به پایان رسید. دوباره تلاش کنید.',
      FORBIDDEN: 'شما به انجام این عملیات دسترسی ندارید.',
      RATE_LIMIT_EXCEEDED: 'تعداد تلاش‌ها زیاد است. کمی بعد دوباره تلاش کنید.',
      SERVICE_UNAVAILABLE:
        'سرویس موقتاً در دسترس نیست. لطفاً بعداً دوباره تلاش کنید.',
      INTERNAL_SERVER_ERROR: 'خطای سرور رخ داد. لطفاً بعداً دوباره تلاش کنید.',
      MISSING_ACCESS_TOKEN:
        'اطلاعات احراز هویت موجود نیست. لطفاً دوباره وارد شوید.',
      UNKNOWN_ERROR: 'خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
      invalidRequestBody: 'درخواست نامعتبر است. ورودی را بررسی کنید.',
      validationFailed:
        'لطفاً اطلاعات واردشده را بررسی کرده و دوباره تلاش کنید.',
      invalidCaptchaMessage: 'کپچا نامعتبر است. دوباره تلاش کنید.',
      otpSentMessage: 'کد یکبارمصرف با موفقیت ارسال شد.',
      loginSuccessfulMessage: 'ورود با موفقیت انجام شد.',
      otpVerifyFailedMessage: 'تأیید کد ناموفق بود. دوباره تلاش کنید.',
      loginFailedMessage: 'نام کاربری، رمز عبور یا کپچا نادرست است.',
      captchaInitFailedMessage: 'بارگذاری کپچا ناموفق بود. دوباره تلاش کنید.',
    },
  },
} as const;

export type AdminLoginLocale = keyof typeof adminLoginTranslations;
