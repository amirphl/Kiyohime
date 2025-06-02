// Error handling utility for mapping backend error codes to user-friendly messages

export interface ErrorMessage {
  en: string;
  fa: string;
}

// Error code to message mapping
export const ERROR_MESSAGES: Record<string, ErrorMessage> = {
  // Signup errors
  'EMAIL_EXISTS': {
    en: 'An account with this email already exists',
    fa: 'حسابی با این ایمیل قبلاً وجود دارد'
  },
  'MOBILE_EXISTS': {
    en: 'An account with this mobile number already exists',
    fa: 'حسابی با این شماره موبایل قبلاً وجود دارد'
  },
  'NATIONAL_ID_EXISTS': {
    en: 'An account with this national ID already exists',
    fa: 'حسابی با این کد ملی قبلاً وجود دارد'
  },
  'ACCOUNT_TYPE_NOT_FOUND': {
    en: 'Selected account type is not valid',
    fa: 'نوع حساب انتخاب شده معتبر نیست'
  },
  'COMPANY_FIELDS_REQUIRED': {
    en: 'Company information is required for business accounts',
    fa: 'اطلاعات شرکت برای حساب‌های تجاری الزامی است'
  },
  'REFERRER_AGENCY_NOT_FOUND': {
    en: 'Referrer agency not found',
    fa: 'آژانس معرف یافت نشد'
  },
  'REFERRER_MUST_BE_AGENCY': {
    en: 'Referrer must be a marketing agency',
    fa: 'معرف باید یک آژانس بازاریابی باشد'
  },
  'REFERRER_AGENCY_INACTIVE': {
    en: 'Referrer agency is inactive',
    fa: 'آژانس معرف غیرفعال است'
  },
  'SIGNUP_FAILED': {
    en: 'Account creation failed. Please try again',
    fa: 'ایجاد حساب ناموفق بود. لطفاً دوباره تلاش کنید'
  },

  // Login errors
  'CUSTOMER_NOT_FOUND': {
    en: 'Account not found. Please check your credentials',
    fa: 'حساب یافت نشد. لطفاً اطلاعات خود را بررسی کنید'
  },
  'ACCOUNT_INACTIVE': {
    en: 'Your account is inactive. Please contact support',
    fa: 'حساب شما غیرفعال است. لطفاً با پشتیبانی تماس بگیرید'
  },
  'INCORRECT_PASSWORD': {
    en: 'Incorrect password. Please try again',
    fa: 'رمز عبور اشتباه است. لطفاً دوباره تلاش کنید'
  },
  'LOGIN_FAILED': {
    en: 'Login failed. Please try again',
    fa: 'ورود ناموفق بود. لطفاً دوباره تلاش کنید'
  },

  // OTP errors
  'NO_VALID_OTP': {
    en: 'No valid verification code found. Please request a new one',
    fa: 'کد تایید معتبری یافت نشد. لطفاً کد جدیدی درخواست کنید'
  },
  'INVALID_OTP_CODE': {
    en: 'Invalid verification code. Please check and try again',
    fa: 'کد تایید نامعتبر است. لطفاً بررسی کرده و دوباره تلاش کنید'
  },
  'INVALID_OTP_TYPE': {
    en: 'Invalid verification method. Please try again',
    fa: 'روش تایید نامعتبر است. لطفاً دوباره تلاش کنید'
  },
  'OTP_EXPIRED': {
    en: 'Verification code has expired. Please request a new one',
    fa: 'کد تایید منقضی شده است. لطفاً کد جدیدی درخواست کنید'
  },
  'OTP_VERIFICATION_FAILED': {
    en: 'Verification failed. Please try again',
    fa: 'تایید ناموفق بود. لطفاً دوباره تلاش کنید'
  },

  // Password reset errors
  'PASSWORD_RESET_FAILED': {
    en: 'Password reset failed. Please try again',
    fa: 'بازنشانی رمز عبور ناموفق بود. لطفاً دوباره تلاش کنید'
  },

  // Resend OTP errors
  'ACCOUNT_ALREADY_VERIFIED': {
    en: 'Your account is already verified',
    fa: 'حساب شما قبلاً تایید شده است'
  },
  'RESEND_OTP_FAILED': {
    en: 'Failed to send verification code. Please try again',
    fa: 'ارسال کد تایید ناموفق بود. لطفاً دوباره تلاش کنید'
  },

  // Campaign errors
  'CAMPAIGN_CREATION_FAILED': {
    en: 'Campaign creation failed. Please try again',
    fa: 'ایجاد کمپین ناموفق بود. لطفاً دوباره تلاش کنید'
  },
  'CAMPAIGN_NOT_FOUND': {
    en: 'Campaign not found',
    fa: 'کمپین یافت نشد'
  },
  'INVALID_CAMPAIGN_DATA': {
    en: 'Invalid campaign data provided',
    fa: 'داده‌های کمپین نامعتبر است'
  },
  'COST_CALCULATION_FAILED': {
    en: 'Failed to calculate campaign costs. Please try again',
    fa: 'محاسبه هزینه‌های کمپین ناموفق بود. لطفاً دوباره تلاش کنید'
  },
  'INVALID_SEGMENT_CONFIGURATION': {
    en: 'Invalid segment configuration for cost calculation',
    fa: 'تنظیمات بخش‌بندی برای محاسبه هزینه نامعتبر است'
  },
  'INVALID_BUDGET_RANGE': {
    en: 'Budget amount is outside the allowed range',
    fa: 'مقدار بودجه خارج از محدوده مجاز است'
  },
  'INVALID_LINE_NUMBER': {
    en: 'Invalid line number provided for cost calculation',
    fa: 'شماره خط ارائه شده برای محاسبه هزینه نامعتبر است'
  },
  'COST_CALCULATION_TIMEOUT': {
    en: 'Cost calculation timed out. Please try again',
    fa: 'محاسبه هزینه زمان‌بندی شد. لطفاً دوباره تلاش کنید'
  },
  'CAMPAIGN_ALREADY_EXISTS': {
    en: 'A campaign with this configuration already exists',
    fa: 'کمپینی با این تنظیمات قبلاً وجود دارد'
  },
  'CAMPAIGN_LIMIT_EXCEEDED': {
    en: 'Campaign limit exceeded. Please contact support',
    fa: 'محدودیت کمپین تجاوز شده است. لطفاً با پشتیبانی تماس بگیرید'
  },
  'CAMPAIGN_BUDGET_EXCEEDED': {
    en: 'Campaign budget exceeds your account limit',
    fa: 'بودجه کمپین از محدودیت حساب شما تجاوز می‌کند'
  },
  'CAMPAIGN_SEGMENT_INVALID': {
    en: 'Invalid campaign segment configuration',
    fa: 'تنظیمات بخش‌بندی کمپین نامعتبر است'
  },
  'CAMPAIGN_CONTENT_INVALID': {
    en: 'Invalid campaign content provided',
    fa: 'محتوای کمپین نامعتبر است'
  },
  'CAMPAIGN_SCHEDULE_INVALID': {
    en: 'Invalid campaign schedule provided',
    fa: 'زمان‌بندی کمپین نامعتبر است'
  },

  // Generic errors
  'NETWORK_ERROR': {
    en: 'Network error. Please check your connection and try again',
    fa: 'خطای شبکه. لطفاً اتصال خود را بررسی کرده و دوباره تلاش کنید'
  },
  'UNKNOWN_ERROR': {
    en: 'An unexpected error occurred. Please try again',
    fa: 'خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید'
  },
  'VALIDATION_ERROR': {
    en: 'Please check your input and try again',
    fa: 'لطفاً ورودی خود را بررسی کرده و دوباره تلاش کنید'
  },
  'UNAUTHORIZED': {
    en: 'You are not authorized to perform this action',
    fa: 'شما مجاز به انجام این عملیات نیستید'
  },
  'FORBIDDEN': {
    en: 'Access denied. Please contact support if you believe this is an error',
    fa: 'دسترسی رد شد. اگر فکر می‌کنید این خطا است، با پشتیبانی تماس بگیرید'
  },
  'NOT_FOUND': {
    en: 'The requested resource was not found',
    fa: 'منبع درخواستی یافت نشد'
  },
  'INTERNAL_SERVER_ERROR': {
    en: 'Server error. Please try again later',
    fa: 'خطای سرور. لطفاً بعداً تلاش کنید'
  },
  'SERVICE_UNAVAILABLE': {
    en: 'Service temporarily unavailable. Please try again later',
    fa: 'سرویس موقتاً در دسترس نیست. لطفاً بعداً تلاش کنید'
  },
  'TIMEOUT_ERROR': {
    en: 'Request timed out. Please try again',
    fa: 'درخواست زمان‌بندی شد. لطفاً دوباره تلاش کنید'
  },
  'RATE_LIMIT_EXCEEDED': {
    en: 'Too many requests. Please wait a moment and try again',
    fa: 'درخواست‌های زیادی ارسال شده. لطفاً لحظه‌ای صبر کرده و دوباره تلاش کنید'
  },
  'INSUFFICIENT_PERMISSIONS': {
    en: 'You do not have sufficient permissions for this action',
    fa: 'شما مجوز کافی برای این عملیات ندارید'
  },
  'RESOURCE_LOCKED': {
    en: 'Resource is currently locked. Please try again later',
    fa: 'منبع در حال حاضر قفل شده است. لطفاً بعداً تلاش کنید'
  },
  'CONFLICT_ERROR': {
    en: 'Resource conflict detected. Please check your data and try again',
    fa: 'تضاد منبع تشخیص داده شد. لطفاً داده‌های خود را بررسی کرده و دوباره تلاش کنید'
  }
};

/**
 * Get user-friendly error message for a given error code
 * @param errorCode - The backend error code
 * @param language - The language code ('en' or 'fa')
 * @param fallbackMessage - Optional fallback message if error code not found
 * @returns User-friendly error message in the specified language
 */
export function getErrorMessage(
  errorCode: string | undefined,
  language: 'en' | 'fa' = 'en',
  fallbackMessage?: string
): string {
  if (!errorCode) {
    return fallbackMessage || ERROR_MESSAGES['UNKNOWN_ERROR'][language];
  }

  const errorMessage = ERROR_MESSAGES[errorCode];
  if (errorMessage) {
    return errorMessage[language];
  }

  // If error code not found, try to provide a generic message
  if (errorCode.includes('VALIDATION')) {
    return ERROR_MESSAGES['VALIDATION_ERROR'][language];
  }
  if (errorCode.includes('NETWORK') || errorCode.includes('TIMEOUT')) {
    return ERROR_MESSAGES['NETWORK_ERROR'][language];
  }
  if (errorCode.includes('UNAUTHORIZED') || errorCode.includes('AUTH')) {
    return ERROR_MESSAGES['UNAUTHORIZED'][language];
  }
  if (errorCode.includes('FORBIDDEN')) {
    return ERROR_MESSAGES['FORBIDDEN'][language];
  }
  if (errorCode.includes('NOT_FOUND')) {
    return ERROR_MESSAGES['NOT_FOUND'][language];
  }
  if (errorCode.includes('SERVER') || errorCode.includes('INTERNAL')) {
    return ERROR_MESSAGES['INTERNAL_SERVER_ERROR'][language];
  }

  // Return fallback or unknown error message
  return fallbackMessage || ERROR_MESSAGES['UNKNOWN_ERROR'][language];
}

/**
 * Get error message for API response
 * @param response - The API response object
 * @param language - The language code ('en' or 'fa')
 * @param fallbackMessage - Optional fallback message
 * @returns User-friendly error message
 */
export function getApiErrorMessage(
  response: { success: boolean; message?: string; error?: { code?: string; details?: any } },
  language: 'en' | 'fa' = 'en',
  fallbackMessage?: string
): string {
  // If response has a message, use it as fallback
  const responseMessage = response.message;
  
  // Get error code from response
  const errorCode = response.error?.code;
  
  // Get the user-friendly message
  return getErrorMessage(errorCode, language, responseMessage || fallbackMessage);
}

/**
 * Check if an error is a specific type
 * @param errorCode - The error code to check
 * @param expectedCode - The expected error code
 * @returns True if the error matches the expected code
 */
export function isErrorType(errorCode: string | undefined, expectedCode: string): boolean {
  return errorCode === expectedCode;
}

/**
 * Check if an error is a validation error
 * @param errorCode - The error code to check
 * @returns True if it's a validation error
 */
export function isValidationError(errorCode: string | undefined): boolean {
  return errorCode ? errorCode.includes('VALIDATION') || errorCode.includes('REQUIRED') : false;
}

/**
 * Check if an error is a network error
 * @param errorCode - The error code to check
 * @returns True if it's a network error
 */
export function isNetworkError(errorCode: string | undefined): boolean {
  return errorCode ? errorCode.includes('NETWORK') || errorCode.includes('TIMEOUT') : false;
}

/**
 * Check if an error is an authentication error
 * @param errorCode - The error code to check
 * @returns True if it's an authentication error
 */
export function isAuthenticationError(errorCode: string | undefined): boolean {
  return errorCode ? errorCode.includes('AUTH') || errorCode.includes('UNAUTHORIZED') || errorCode.includes('INVALID') : false;
}

/**
 * Clear all user-related data from localStorage
 * This function should be called during logout to ensure complete cleanup
 */
export function clearAllUserData(): void {
  console.log('🧹 Starting comprehensive user data cleanup...');
  
  // Get all localStorage keys
  const allKeys = Object.keys(localStorage);
  
  // Clear all items except user preferences
  allKeys.forEach(key => {
    if (!key.includes('language') && !key.includes('theme') && !key.includes('ui_')) {
      localStorage.removeItem(key);
      console.log(`🗑️  Removed: ${key}`);
    } else {
      console.log(`💾 Preserved (user preference): ${key}`);
    }
  });
  
  console.log('✅ User data cleanup completed');
}

/**
 * Clear campaign data from localStorage
 * This function should be called when campaign is finished or during logout
 */
export function clearCampaignData(): void {
  console.log('🧹 Clearing campaign data from localStorage...');
  
  // Clear campaign-specific items
  localStorage.removeItem('campaign_creation_data');
  localStorage.removeItem('campaign_creation_step');
  
  console.log('✅ Campaign data cleared');
}

/**
 * Check if a logout is required based on error code
 * @param errorCode - The error code to check
 * @returns True if logout is required
 */
export function requiresLogout(errorCode: string | undefined): boolean {
  if (!errorCode) return false;
  
  const logoutErrors = [
    'UNAUTHORIZED',
    'FORBIDDEN',
    'TOKEN_EXPIRED',
    'INVALID_TOKEN',
    'ACCOUNT_INACTIVE',
    'SESSION_EXPIRED'
  ];
  
  return logoutErrors.some(error => errorCode.includes(error));
} 