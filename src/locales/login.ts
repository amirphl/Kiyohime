export const loginI18n = {
    en: {
        title: 'Welcome to SMS Platform',
        subtitle: 'Sign in to access your SMS marketing dashboard',
        emailOrMobile: 'Email or Mobile Number',
        emailOrMobilePlaceholder: '',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        signIn: 'Sign In',
        forgotPassword: 'Forgot Password?',
        noAccount: "Don't have an account?",
        signUpHere: 'Sign up here',
        success: 'Login successful!',
        validation: {
            allFieldsRequired: 'Please fill in all fields',
        },
        error: {
            invalidCredentials: 'Invalid email/mobile or password',
            customerNotFound: 'Customer not found. Please check your information.',
            accountInactive: 'Account is inactive. Please contact support.',
            accountTypeNotFound: 'Account type not found. Please contact support.',
            incorrectPassword: 'Incorrect password. Please try again.',
            networkError: 'Network error. Please try again.',
        },
        features: {
            title: 'Why Choose SMS Platform?',
            targeted: 'Targeted SMS campaigns',
            segmentation: 'Advanced customer segmentation',
            analytics: 'Real-time analytics and reporting',
            compliance: 'Compliance with regulations',
        },
    },
    fa: {
        title: 'به پلتفرم هوشمند و داده‌محور خوش آمدید',
        subtitle: 'برای دسترسی به داشبورد بازاریابی هوشمند و داده‌محور وارد شوید',
        emailOrMobile: 'ایمیل یا شماره موبایل',
        emailOrMobilePlaceholder: '',
        password: 'رمز عبور',
        passwordPlaceholder: '',
        signIn: 'ورود',
        forgotPassword: 'رمز عبور را فراموش کرده‌اید؟',
        noAccount: 'حساب کاربری ندارید؟',
        signUpHere: 'اینجا ثبت نام کنید',
        success: 'ورود موفقیت‌آمیز بود!',
        validation: {
            allFieldsRequired: 'لطفاً تمام فیلدها را پر کنید',
        },
        error: {
            invalidCredentials: 'ایمیل/موبایل یا رمز عبور نامعتبر',
            customerNotFound: 'مشتری یافت نشد. لطفاً اطلاعات خود را بررسی کنید.',
            accountInactive:
                'حساب کاربری غیرفعال است. لطفاً با پشتیبانی تماس بگیرید.',
            accountTypeNotFound:
                'نوع حساب کاربری یافت نشد. لطفاً با پشتیبانی تماس بگیرید.',
            incorrectPassword: 'رمز عبور نادرست است. لطفاً دوباره تلاش کنید.',
            networkError: 'خطای شبکه. لطفاً دوباره تلاش کنید.',
        },
        features: {
            title: 'چرا پلتفرم هوشمند و داده‌محور را انتخاب کنیم؟',
            targeted: 'کمپین‌های هوشمند و داده‌محور هدفمند',
            segmentation: 'بخش‌بندی پیشرفته مشتریان',
            analytics: 'تحلیلات و گزارش‌گیری بلادرنگ',
            compliance: 'سازگاری با قوانین',
        },
    },
} as const;

export type LoginLocale = keyof typeof loginI18n;