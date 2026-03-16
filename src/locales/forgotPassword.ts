export const forgotPasswordI18n = {
  en: {
    title: 'Forgot Password',
    subtitle: 'Enter your email or mobile number to reset your password',
    emailOrMobile: 'Email or Mobile Number',
    emailOrMobilePlaceholder: 'Enter your email or mobile number',
    sendResetLink: 'Send Reset Link',
    backToLogin: 'Back to Login',
    helpText: 'We will send a password reset OTP to your mobile number',
    validation: {
      identifierRequired: 'Please enter your email or mobile number',
    },
    error: {
      requestFailed: 'Failed to send reset link. Please try again.',
      customerNotFound: 'Customer not found. Please check your information.',
      accountInactive: 'Account is inactive. Please contact support.',
      accountTypeNotFound: 'Account type not found. Please contact support.',
      networkError: 'Network error. Please try again.',
    },
    success: {
      title: 'Reset Link Sent',
      subtitle: 'Check your mobile for the OTP',
      message: 'Password reset OTP has been sent to {phone} Please check your messages.',
      expiresIn: 'OTP expires in {minutes} minutes',
      tryAgain: 'Try Another Email/Mobile',
      resetPassword: 'Reset Password',
      backToLogin: 'Back to Login',
    },
  },
  fa: {
    title: 'فراموشی رمز عبور',
    subtitle: 'ایمیل یا شماره موبایل خود را برای بازنشانی رمز عبور وارد کنید',
    emailOrMobile: 'ایمیل یا شماره موبایل',
    emailOrMobilePlaceholder: 'ایمیل یا شماره موبایل خود را وارد کنید',
    sendResetLink: 'ارسال لینک بازنشانی',
    backToLogin: 'بازگشت به ورود',
    helpText:
      'کد تأیید بازنشانی رمز عبور را به شماره موبایل شما ارسال خواهیم کرد',
    validation: {
      identifierRequired: 'لطفاً ایمیل یا شماره موبایل خود را وارد کنید',
    },
    error: {
      requestFailed:
        'ارسال لینک بازنشانی ناموفق بود. لطفاً دوباره تلاش کنید.',
      customerNotFound: 'مشتری یافت نشد. لطفاً اطلاعات خود را بررسی کنید.',
      accountInactive:
        'حساب کاربری غیرفعال است. لطفاً با پشتیبانی تماس بگیرید.',
      accountTypeNotFound:
        'نوع حساب کاربری یافت نشد. لطفاً با پشتیبانی تماس بگیرید.',
      networkError: 'خطای شبکه. لطفاً دوباره تلاش کنید.',
    },
    success: {
      title: 'لینک بازنشانی ارسال شد',
      subtitle: 'موبایل خود را برای کد تأیید بررسی کنید',
      message: 'کد تأیید بازنشانی رمز عبور به شماره {phone} ارسال شده است',
      expiresIn: 'کد تأیید تا {minutes} دقیقه معتبر است',
      tryAgain: 'ایمیل/موبایل دیگری امتحان کنید',
      resetPassword: 'بازنشانی رمز عبور',
      backToLogin: 'بازگشت به ورود',
    },
  }
} as const;

export type ForgotPasswordLocale = keyof typeof forgotPasswordI18n;
