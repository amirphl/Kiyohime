export const translations = {
  en: {
    // Header
    header: {
      brand: 'SMS Platform',
      subtitle: 'SMS Marketing Platform',
      dashboard: 'Dashboard',
      campaigns: 'Campaigns',
      analytics: 'Analytics',
      support: 'Support',
      features: 'Features',
      howItWorks: 'How It Works',
      pricing: 'Pricing',
      signin: 'Sign In',
      signup: 'Sign Up',
      logout: 'Logout',
    },

    // Footer
    footer: {
      description:
        'Empower your business with targeted SMS marketing campaigns. Reach your customers with precision and drive results.',
      quickLinks: 'Quick Links',
      support: 'Support',
      helpCenter: 'Help Center',
      contactUs: 'Contact Us',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      copyright: '© 2024 SMS Platform. All rights reserved.',
    },

    // Login Page
    login: {
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

    // Forgot Password Page
    forgotPassword: {
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
        message: 'Password reset OTP has been sent to {phone}',
        expiresIn: 'OTP expires in {minutes} minutes',
        tryAgain: 'Try Another Email/Mobile',
        resetPassword: 'Reset Password',
        backToLogin: 'Back to Login',
      },
    },

    // Reset Password Page
    resetPassword: {
      title: 'Reset Password',
      subtitle: 'Enter your new password and OTP code',
      forPhone: 'For phone number: {phone}',
      otpCode: 'OTP Code',
      otpHelp: 'Enter the 6-digit code sent to your mobile',
      newPassword: 'New Password',
      newPasswordPlaceholder: 'Enter your new password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your new password',
      resetPassword: 'Reset Password',
      backToLogin: 'Back to Login',
      requirements: {
        title: 'Password Requirements',
        minLength: 'At least 8 characters',
        letterAndDigit: 'At least 1 letter and 1 digit',
      },
      validation: {
        newPasswordRequired: 'Please enter a new password',
        passwordMin: 'Password must be at least 8 characters',
        passwordUppercase: 'Password must contain at least 1 uppercase letter',
        passwordNumber: 'Password must contain at least 1 number',
        passwordStrength: 'Password must contain at least 1 letter and 1 digit',
        passwordMismatch: 'Passwords do not match',
        otpRequired: 'Please enter the 6-digit OTP code',
      },
      error: {
        resetFailed: 'Failed to reset password. Please try again.',
        customerNotFound: 'Customer not found. Please check your information.',
        accountInactive: 'Account is inactive. Please contact support.',
        accountTypeNotFound: 'Account type not found. Please contact support.',
        noValidOtp: 'No valid OTP found. Please request a new OTP.',
        invalidOtpCode: 'Invalid OTP code. Please try again.',
        invalidOtpType: 'Invalid OTP type. Please try again.',
        otpExpired: 'OTP has expired. Please request a new OTP.',
        networkError: 'Network error. Please try again.',
        noCustomerId: 'Invalid reset link. Please try again.',
      },
      success: {
        title: 'Password Reset Successful',
        subtitle: 'Your password has been updated and you are now logged in',
        message: 'You have been automatically logged in with your new password',
        backToLogin: 'Go to Dashboard',
      },
    },

    // Signup Page
    signup: {
      title: 'Create Your Account',
      subtitle: 'Join SMS Platform and start your SMS marketing journey',
      accountType: 'Account Type',
      selectAccountType: 'Select account type',
      individual: 'Individual',
      independentCompany: 'Independent Company',
      marketingAgency: 'Marketing Agency',

      companyInfo: 'Company Information',
      companyName: 'Company Name',
      companyNamePlaceholder: 'Enter company name',
      nationalId: 'National ID',
      nationalIdPlaceholder: '10-digit national ID',
      companyPhone: 'Company Phone',
      companyPhonePlaceholder: 'Company phone number',
      postalCode: 'Postal Code',
      postalCodePlaceholder: '10-digit postal code',
      companyAddress: 'Company Address',
      companyAddressPlaceholder: 'Enter complete company address',

      personalInfo: 'Personal Information',
      representativeInfo: 'Representative Information',
      firstName: 'First Name',
      firstNamePlaceholder: 'Enter first name',
      lastName: 'Last Name',
      lastNamePlaceholder: 'Enter last name',
      mobileNumber: 'Mobile Number',
      mobilePlaceholder: '09xxxxxxxxx',

      credentials: 'Account Credentials',
      email: 'Email Address',
      emailPlaceholder: 'Enter your email address',
      password: 'Password',
      passwordPlaceholder: 'Enter password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm password',

      agencyCode: 'Agency Referral Code (Optional)',
      agencyCodePlaceholder: 'Enter agency code if you have one',
      agencyCodeHelp:
        'If you were referred by an agency, enter their code here',

      createAccount: 'Create Account',
      haveAccount: 'Already have an account?',
      signInHere: 'Sign in here',
      passwordRequirements: 'Password Requirements',

      // OTP Modal
      verifyMobile: 'Verify Your Mobile Number',
      otpSent: "We've sent a 6-digit verification code to",
      enterVerificationCode: 'Enter Verification Code',
      verifyCode: 'Verify Code',
      attemptsRemaining: 'Attempts remaining:',
      maxAttemptsReached: 'Maximum attempts reached',
      resendIn: 'Resend in',

      // Validation Messages
      validation: {
        required: 'This field is required',
        accountTypeRequired: 'Please select an account type',
        companyNameRequired: 'Company name is required',
        companyNameMax: 'Company name must be 60 characters or less',
        nationalIdRequired: 'National ID is required',
        nationalIdFormat: 'National ID must be 10 to 20 digits',
        companyPhoneRequired: 'Company phone is required',
        companyPhoneMin: 'Phone number must be at least 10 digits',
        companyAddressRequired: 'Company address is required',
        companyAddressMax: 'Address must be 255 characters or less',
        postalCodeRequired: 'Postal code is required',
        postalCodeFormat: 'Postal code must be at least 10 digits',
        firstNameRequired: 'First name is required',
        lastNameRequired: 'Last name is required',
        mobileRequired: 'Mobile number is required',
        mobileFormat: 'Mobile number must be in format 09xxxxxxxxx',
        emailRequired: 'Email is required',
        emailFormat: 'Please enter a valid email address',
        passwordRequired: 'Password is required',
        passwordMin: 'Password must be at least 8 characters',
        passwordUppercase: 'Password must contain at least 1 uppercase letter',
        passwordNumber: 'Password must contain at least 1 number',
        passwordStrength: 'Password must contain at least 1 letter and 1 digit',
        confirmPasswordRequired: 'Please confirm your password',
        passwordMismatch: 'Passwords do not match',
        agencyCodeFormat: 'Agency code must be a valid number',
        invalidOtp: 'Please enter a valid 6-digit OTP',
        maxOtpAttempts: 'Maximum attempts reached. Please try again later.',
      },
      success: 'Account created successfully! Welcome to SMS Platform!',
      otpResent: 'New OTP sent to your mobile number',
      error: {
        signupFailed: 'Failed to create account. Please try again.',
        invalidOtp: 'Invalid OTP. Please try again.',
        resendFailed: 'Failed to resend OTP. Please try again.',
        customerNotFound: 'Customer not found. Please check your information.',
        accountInactive: 'Account is inactive. Please contact support.',
        accountAlreadyVerified: 'Account is already verified. Please sign in.',
        emailExists:
          'Email address already exists. Please use a different email.',
        mobileExists:
          'Mobile number already exists. Please use a different number.',
        nationalIdExists:
          'National ID already exists. Please check your information.',
        accountTypeNotFound:
          'Account type not found. Please select a valid account type.',
        companyFieldsRequired:
          'Company fields are required for business accounts.',
        referrerAgencyNotFound:
          'Referrer agency not found. Please check the agency code.',
        referrerMustBeAgency: 'Referrer must be a marketing agency.',
        referrerAgencyInactive:
          'Referrer agency is inactive. Please contact support.',
        noValidOtp: 'No valid OTP found. Please request a new OTP.',
        invalidOtpType: 'Invalid OTP type. Please try again.',
        otpExpired: 'OTP has expired. Please request a new OTP.',
        networkError: 'Network error. Please try again.',
        noCustomerId: 'No customer ID found. Please try again.',
      },
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome',
      subtitle:
        'Manage your SMS marketing campaigns and track your performance',
      language: 'Language',
      logout: 'Logout',

      // Sidebar Navigation
      dashboard: 'Dashboard',
      targetedSend: 'targeted send',
      reports: 'reports',
      campaigns: 'Campaign and Customer',
      wallet: 'Wallet and Charge',
      support: 'Ticket and Support',
      customerManagement: 'Customer Management',
      discountManagement: 'Discount Management',

      // Stats
      stats: {
        totalCampaigns: 'Total Campaigns',
        totalCustomers: 'Total Customers',
        walletBalance: 'Wallet Balance',
        activeTickets: 'Active Tickets',
      },

      // Content
      recentActivity: 'Recent Activity',
      noActivity: 'No recent activity',
    },

    // Home Page
    home: {
      hero: {
        badge: 'Leading SMS Marketing Platform',
        title: 'Transform Your Business with Targeted SMS Marketing',
        subtitle:
          'Reach your customers with precision, drive engagement, and boost conversions with our advanced SMS marketing platform designed for modern businesses.',
        cta: 'Get Started Free',
        signin: 'Sign In',
      },
      stats: {
        customers: 'Happy Customers',
        messages: 'Messages Sent',
        delivery: 'Delivery Rate',
        support: 'Customer Support',
      },
      features: {
        title: 'Why Choose Our Platform?',
        subtitle:
          'Powerful features designed to help you succeed in SMS marketing',
        targeted: {
          title: 'Targeted Campaigns',
          description:
            'Create highly targeted SMS campaigns based on customer behavior, demographics, and preferences.',
        },
        segmentation: {
          title: 'Smart Segmentation',
          description:
            'Segment your audience intelligently and send personalized messages that resonate.',
        },
        analytics: {
          title: 'Real-time Analytics',
          description:
            'Track campaign performance with detailed analytics and actionable insights.',
        },
        compliance: {
          title: 'Regulatory Compliance',
          description:
            'Built-in compliance features ensure your campaigns meet all regulatory requirements.',
        },
      },
      howItWorks: {
        title: 'How It Works',
        subtitle: 'Get started with SMS marketing in three simple steps',
        step1: {
          title: 'Create Your Account',
          description:
            'Sign up and set up your business profile in minutes with our streamlined onboarding process.',
        },
        step2: {
          title: 'Design Your Campaign',
          description:
            'Use our intuitive tools to create compelling SMS campaigns with advanced targeting options.',
        },
        step3: {
          title: 'Send & Track Results',
          description:
            'Launch your campaigns and monitor real-time performance with comprehensive analytics.',
        },
      },
      cta: {
        title: 'Ready to Get Started?',
        subtitle:
          'Join thousands of businesses already using our platform to grow their customer base.',
        button: 'Start Your Free Trial',
      },
    },

    // Error Boundary
    error: {
      title: 'Something went wrong',
      message:
        "We're sorry, but something unexpected happened. Please try refreshing the page.",
      refresh: 'Refresh Page',
    },

    // Common
    common: {
      loading: 'Loading...',
      required: '*',
      cancel: 'Cancel',
      close: 'Close',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      resend: 'Resend',
      seconds: 's',
    },
  },

  fa: {
    // Header
    header: {
      brand: 'پلتفرم پیامکی',
      subtitle: 'پلتفرم بازاریابی پیامکی',
      dashboard: 'داشبورد',
      campaigns: 'کمپین‌ها',
      analytics: 'تحلیلات',
      support: 'پشتیبانی',
      features: 'ویژگی‌ها',
      howItWorks: 'چگونه کار می‌کند',
      pricing: 'قیمت‌گذاری',
      signin: 'ورود',
      signup: 'ثبت نام',
      logout: 'خروج',
    },

    // Footer
    footer: {
      description:
        'کسب و کار خود را با کمپین‌های هدفمند پیامکی قدرتمند کنید. با دقت به مشتریان خود برسید و نتایج مطلوب کسب کنید.',
      quickLinks: 'لینک‌های سریع',
      support: 'پشتیبانی',
      helpCenter: 'مرکز راهنمایی',
      contactUs: 'تماس با ما',
      privacyPolicy: 'حریم خصوصی',
      termsOfService: 'شرایط خدمات',
      copyright: '© ۱۴۰۳ پلتفرم پیامکی. تمامی حقوق محفوظ است.',
    },

    // Login Page
    login: {
      title: 'به پلتفرم پیامکی خوش آمدید',
      subtitle: 'برای دسترسی به داشبورد بازاریابی پیامکی وارد شوید',
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
        title: 'چرا پلتفرم پیامکی را انتخاب کنیم؟',
        targeted: 'کمپین‌های پیامکی هدفمند',
        segmentation: 'بخش‌بندی پیشرفته مشتریان',
        analytics: 'تحلیلات و گزارش‌گیری بلادرنگ',
        compliance: 'سازگاری با قوانین',
      },
    },

    // Forgot Password Page
    forgotPassword: {
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
    },

    // Reset Password Page
    resetPassword: {
      title: 'بازنشانی رمز عبور',
      subtitle: 'رمز عبور جدید و کد تأیید را وارد کنید',
      forPhone: 'برای شماره موبایل: {phone}',
      otpCode: 'کد تأیید',
      otpHelp: 'کد ۶ رقمی ارسال شده به موبایل خود را وارد کنید',
      newPassword: 'رمز عبور جدید',
      newPasswordPlaceholder: 'رمز عبور جدید خود را وارد کنید',
      confirmPassword: 'تکرار رمز عبور',
      confirmPasswordPlaceholder: 'رمز عبور جدید را تکرار کنید',
      resetPassword: 'بازنشانی رمز عبور',
      backToLogin: 'بازگشت به ورود',
      requirements: {
        title: 'نیازمندی‌های رمز عبور',
        minLength: 'حداقل ۸ کاراکتر',
        letterAndDigit: 'حداقل ۱ حرف و ۱ رقم',
      },
      validation: {
        newPasswordRequired: 'لطفاً رمز عبور جدید را وارد کنید',
        passwordMin: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
        passwordUppercase: 'رمز عبور باید حداقل ۱ حرف بزرگ داشته باشد',
        passwordNumber: 'رمز عبور باید حداقل ۱ رقم داشته باشد',
        passwordStrength: 'رمز عبور باید حداقل ۱ حرف و ۱ رقم داشته باشد',
        passwordMismatch: 'رمزهای عبور مطابقت ندارند',
        otpRequired: 'لطفاً کد تأیید ۶ رقمی را وارد کنید',
      },
      error: {
        resetFailed: 'بازنشانی رمز عبور ناموفق بود. لطفاً دوباره تلاش کنید.',
        customerNotFound: 'مشتری یافت نشد. لطفاً اطلاعات خود را بررسی کنید.',
        accountInactive:
          'حساب کاربری غیرفعال است. لطفاً با پشتیبانی تماس بگیرید.',
        accountTypeNotFound:
          'نوع حساب کاربری یافت نشد. لطفاً با پشتیبانی تماس بگیرید.',
        noValidOtp: 'کد تأیید معتبری یافت نشد. لطفاً کد جدیدی درخواست کنید.',
        invalidOtpCode: 'کد تأیید نامعتبر است. لطفاً دوباره تلاش کنید.',
        invalidOtpType: 'نوع کد تأیید نامعتبر است. لطفاً دوباره تلاش کنید.',
        otpExpired: 'کد تأیید منقضی شده است. لطفاً کد جدیدی درخواست کنید.',
        networkError: 'خطای شبکه. لطفاً دوباره تلاش کنید.',
        noCustomerId: 'لینک بازنشانی نامعتبر است. لطفاً دوباره تلاش کنید.',
      },
      success: {
        title: 'بازنشانی رمز عبور موفقیت‌آمیز',
        subtitle: 'رمز عبور شما به‌روزرسانی شده و اکنون وارد شده‌اید',
        message: 'شما با رمز عبور جدید به طور خودکار وارد شده‌اید',
        backToLogin: 'رفتن به داشبورد',
      },
    },

    // Signup Page
    signup: {
      title: 'حساب کاربری خود را بسازید',
      subtitle:
        'به پلتفرم پیامکی بپیوندید و سفر بازاریابی پیامکی خود را شروع کنید',
      accountType: 'نوع حساب کاربری',
      selectAccountType: 'نوع حساب را انتخاب کنید',
      individual: 'شخصی',
      independentCompany: 'شرکت مستقل',
      marketingAgency: 'آژانس بازاریابی',

      companyInfo: 'اطلاعات شرکت',
      companyName: 'نام شرکت',
      companyNamePlaceholder: 'نام شرکت را وارد کنید',
      nationalId: 'شناسه ملی',
      nationalIdPlaceholder: 'شناسه ملی ۱۱ رقمی',
      companyPhone: 'تلفن شرکت',
      companyPhonePlaceholder: 'شماره تلفن شرکت',
      postalCode: 'کد پستی',
      postalCodePlaceholder: 'کد پستی ۱۰ رقمی',
      companyAddress: 'آدرس شرکت',
      companyAddressPlaceholder: 'آدرس کامل شرکت را وارد کنید',

      personalInfo: 'اطلاعات شخصی',
      representativeInfo: 'اطلاعات نماینده',
      firstName: 'نام',
      firstNamePlaceholder: 'نام خود را وارد کنید',
      lastName: 'نام خانوادگی',
      lastNamePlaceholder: 'نام خانوادگی خود را وارد کنید',
      mobileNumber: 'شماره موبایل',
      mobilePlaceholder: '۰۹xxxxxxxxx',

      credentials: 'اطلاعات حساب کاربری',
      email: 'آدرس ایمیل',
      emailPlaceholder: 'آدرس ایمیل خود را وارد کنید',
      password: 'رمز عبور',
      passwordPlaceholder: 'رمز عبور را وارد کنید',
      confirmPassword: 'تکرار رمز عبور',
      confirmPasswordPlaceholder: 'رمز عبور را تکرار کنید',

      agencyCode: 'کد معرف آژانس (اختیاری)',
      agencyCodePlaceholder: 'در صورت داشتن کد آژانس وارد کنید',
      agencyCodeHelp: 'اگر توسط آژانسی معرفی شده‌اید، کد آن را اینجا وارد کنید',

      createAccount: 'ایجاد حساب کاربری',
      haveAccount: 'قبلاً حساب کاربری دارید؟',
      signInHere: 'اینجا وارد شوید',
      passwordRequirements: 'نیازمندی‌های رمز عبور',

      // OTP Modal
      verifyMobile: 'تأیید شماره موبایل شما',
      otpSent: 'کد تأیید ۶ رقمی به شماره زیر ارسال شده است',
      enterVerificationCode: 'کد تأیید را وارد کنید',
      verifyCode: 'تأیید کد',
      attemptsRemaining: 'تلاش باقی‌مانده:',
      maxAttemptsReached: 'حداکثر تلاش انجام شده است',
      resendIn: 'ارسال مجدد در',

      // Validation Messages
      validation: {
        required: 'این فیلد الزامی است',
        accountTypeRequired: 'لطفاً نوع حساب را انتخاب کنید',
        companyNameRequired: 'نام شرکت الزامی است',
        companyNameMax: 'نام شرکت باید حداکثر ۶۰ کاراکتر باشد',
        nationalIdRequired: 'شناسه ملی الزامی است',
        nationalIdFormat: 'شناسه ملی باید ۱۰ تا ۲۰ رقم باشد',
        companyPhoneRequired: 'تلفن شرکت الزامی است',
        companyPhoneMin: 'شماره تلفن باید حداقل ۱۰ رقم باشد',
        companyAddressRequired: 'آدرس شرکت الزامی است',
        companyAddressMax: 'آدرس باید حداکثر ۲۵۵ کاراکتر باشد',
        postalCodeRequired: 'کد پستی الزامی است',
        postalCodeFormat: 'کد پستی باید حداقل ۱۰ رقم باشد',
        firstNameRequired: 'نام الزامی است',
        lastNameRequired: 'نام خانوادگی الزامی است',
        mobileRequired: 'شماره موبایل الزامی است',
        mobileFormat: 'شماره موبایل باید به فرمت ۰۹xxxxxxxxx باشد',
        emailRequired: 'ایمیل الزامی است',
        emailFormat: 'لطفاً یک آدرس ایمیل معتبر وارد کنید',
        passwordRequired: 'رمز عبور الزامی است',
        passwordMin: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
        passwordUppercase: 'رمز عبور باید حداقل ۱ حرف بزرگ داشته باشد',
        passwordNumber: 'رمز عبور باید حداقل ۱ رقم داشته باشد',
        passwordStrength: 'رمز عبور باید حداقل ۱ حرف و ۱ رقم داشته باشد',
        confirmPasswordRequired: 'لطفاً رمز عبور را تأیید کنید',
        passwordMismatch: 'رمزهای عبور مطابقت ندارند',
        agencyCodeFormat: 'کد آژانس باید یک عدد معتبر باشد',
        invalidOtp: 'لطفاً یک کد تأیید ۶ رقمی معتبر وارد کنید',
        maxOtpAttempts: 'حداکثر تلاش انجام شده. لطفاً بعداً دوباره تلاش کنید.',
      },
      success: 'حساب کاربری با موفقیت ایجاد شد! به پلتفرم پیامکی خوش آمدید!',
      otpResent: 'کد تأیید جدید به شماره موبایل شما ارسال شد',
      error: {
        signupFailed: 'ایجاد حساب کاربری ناموفق بود. لطفاً دوباره تلاش کنید.',
        invalidOtp: 'کد تأیید نامعتبر. لطفاً دوباره تلاش کنید.',
        resendFailed: 'ارسال مجدد کد تأیید ناموفق بود. لطفاً دوباره تلاش کنید.',
        customerNotFound: 'مشتری یافت نشد. لطفاً اطلاعات خود را بررسی کنید.',
        accountInactive:
          'حساب کاربری غیرفعال است. لطفاً با پشتیبانی تماس بگیرید.',
        accountAlreadyVerified:
          'حساب کاربری قبلاً تأیید شده است. لطفاً وارد شوید.',
        emailExists:
          'آدرس ایمیل قبلاً وجود دارد. لطفاً از ایمیل دیگری استفاده کنید.',
        mobileExists:
          'شماره موبایل قبلاً وجود دارد. لطفاً از شماره دیگری استفاده کنید.',
        nationalIdExists:
          'کد ملی قبلاً وجود دارد. لطفاً اطلاعات خود را بررسی کنید.',
        accountTypeNotFound:
          'نوع حساب کاربری یافت نشد. لطفاً نوع حساب معتبری انتخاب کنید.',
        companyFieldsRequired: 'فیلدهای شرکت برای حساب‌های تجاری الزامی است.',
        referrerAgencyNotFound:
          'آژانس معرف یافت نشد. لطفاً کد آژانس را بررسی کنید.',
        referrerMustBeAgency: 'معرف باید یک آژانس بازاریابی باشد.',
        referrerAgencyInactive:
          'آژانس معرف غیرفعال است. لطفاً با پشتیبانی تماس بگیرید.',
        noValidOtp: 'کد تأیید معتبری یافت نشد. لطفاً کد جدیدی درخواست کنید.',
        invalidOtpType: 'نوع کد تأیید نامعتبر است. لطفاً دوباره تلاش کنید.',
        otpExpired: 'کد تأیید منقضی شده است. لطفاً کد جدیدی درخواست کنید.',
        networkError: 'خطای شبکه. لطفاً دوباره تلاش کنید.',
        noCustomerId: 'شناسه مشتری یافت نشد. لطفاً دوباره تلاش کنید.',
      },
    },

    // Dashboard
    dashboard: {
      title: 'داشبورد',
      welcome: 'خوش آمدید',
      subtitle:
        'مدیریت کمپین‌های پیامکی خود را و پیگیری عملکرد خود را شروع کنید',
      language: 'زبان',
      logout: 'خروج',

      // Sidebar Navigation
      dashboard: 'داشبورد',
      targetedSend: 'ارسال هدفمند',
      reports: 'گزارشگیری',
      campaigns: 'کمپین و مشتریان',
      wallet: 'کیف پول و شارژ',
      support: 'تیکت و پشتیبانی',
      customerManagement: 'مدیریت مشتریان',
      discountManagement: 'مدیریت تخفیف',

      // Stats
      stats: {
        totalCampaigns: 'تعداد کل کمپین‌ها',
        totalCustomers: 'تعداد کل مشتریان',
        walletBalance: 'موجودی کیف پول',
        activeTickets: 'تیکت‌های فعال',
      },

      // Content
      recentActivity: 'فعالیت‌های اخیر',
      noActivity: 'فعالیتی در حال حاضر وجود ندارد',
    },

    // Home Page
    home: {
      hero: {
        badge: 'پلتفرم پیشرو بازاریابی پیامکی',
        title: 'کسب و کار خود را با بازاریابی هدفمند پیامکی متحول کنید',
        subtitle:
          'با دقت به مشتریان خود برسید، تعامل را افزایش دهید و تبدیل را با پلتفرم پیشرفته بازاریابی پیامکی ما که برای کسب و کارهای مدرن طراحی شده است، تقویت کنید.',
        cta: 'شروع رایگان',
        signin: 'ورود',
      },
      stats: {
        customers: 'مشتریان راضی',
        messages: 'پیام ارسال شده',
        delivery: 'نرخ تحویل',
        support: 'پشتیبانی مشتریان',
      },
      features: {
        title: 'چرا پلتفرم ما را انتخاب کنیم؟',
        subtitle:
          'ویژگی‌های قدرتمند طراحی شده برای کمک به موفقیت شما در بازاریابی پیامکی',
        targeted: {
          title: 'کمپین‌های هدفمند',
          description:
            'کمپین‌های پیامکی بسیار هدفمند بر اساس رفتار، جمعیت‌شناسی و ترجیحات مشتری ایجاد کنید.',
        },
        segmentation: {
          title: 'بخش‌بندی هوشمند',
          description:
            'مخاطبان خود را هوشمندانه بخش‌بندی کنید و پیام‌های شخصی‌سازی شده که تأثیرگذار هستند ارسال کنید.',
        },
        analytics: {
          title: 'تحلیلات بلادرنگ',
          description:
            'عملکرد کمپین را با تحلیلات دقیق و بینش‌های قابل اجرا پیگیری کنید.',
        },
        compliance: {
          title: 'سازگاری مقرراتی',
          description:
            'ویژگی‌های سازگاری داخلی اطمینان حاصل می‌کنند که کمپین‌های شما تمام الزامات مقرراتی را برآورده می‌کنند.',
        },
      },
      howItWorks: {
        title: 'چگونه کار می‌کند',
        subtitle: 'در سه مرحله ساده با بازاریابی پیامکی شروع کنید',
        step1: {
          title: 'حساب کاربری خود را ایجاد کنید',
          description:
            'ثبت نام کنید و پروفایل کسب و کار خود را در چند دقیقه با فرآیند ساده‌سازی شده ما تنظیم کنید.',
        },
        step2: {
          title: 'کمپین خود را طراحی کنید',
          description:
            'از ابزارهای شهودی ما برای ایجاد کمپین‌های پیامکی جذاب با گزینه‌های هدف‌گذاری پیشرفته استفاده کنید.',
        },
        step3: {
          title: 'ارسال و پیگیری نتایج',
          description:
            'کمپین‌های خود را راه‌اندازی کنید و عملکرد بلادرنگ را با تحلیلات جامع نظارت کنید.',
        },
      },
      cta: {
        title: 'آماده شروع هستید؟',
        subtitle:
          'به هزاران کسب و کاری که قبلاً از پلتفرم ما برای رشد پایگاه مشتریان خود استفاده می‌کنند بپیوندید.',
        button: 'شروع آزمایشی رایگان',
      },
    },

    // Error Boundary
    error: {
      title: 'چیزی به‌روزرسانی نشد',
      message:
        'متاسفانه، چیزی به‌روزرسانی نشد. لطفاً صفحه را دوباره بارگذاری کنید.',
      refresh: 'بارگذاری مجدد صفحه',
    },

    // Common
    common: {
      loading: 'در حال بارگذاری...',
      required: '*',
      cancel: 'انصراف',
      close: 'بستن',
      save: 'ذخیره',
      edit: 'ویرایش',
      delete: 'حذف',
      confirm: 'تأیید',
      back: 'بازگشت',
      next: 'بعدی',
      submit: 'ارسال',
      resend: 'ارسال مجدد',
      seconds: 'ث',
    },
  },
};

export type TranslationKey = keyof typeof translations.en;
