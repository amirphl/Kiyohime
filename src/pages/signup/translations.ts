export type SignupLocale = 'en' | 'fa';

export interface SignupTranslations {
  title: string;
  subtitle: string;
  accountType: string;
  selectAccountType: string;
  individual: string;
  independentCompany: string;
  marketingAgency: string;
  companyInfo: string;
  companyName: string;
  companyNamePlaceholder: string;
  nationalId: string;
  nationalIdPlaceholder: string;
  companyPhone: string;
  companyPhonePlaceholder: string;
  postalCode: string;
  postalCodePlaceholder: string;
  companyAddress: string;
  companyAddressPlaceholder: string;
  personalInfo: string;
  representativeInfo: string;
  firstName: string;
  firstNamePlaceholder: string;
  lastName: string;
  lastNamePlaceholder: string;
  mobileNumber: string;
  mobilePlaceholder: string;
  credentials: string;
  sheba: string;
  shebaPlaceholder: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  agencyCode: string;
  agencyCodePlaceholder: string;
  agencyCodeHelp: string;
  createAccount: string;
  haveAccount: string;
  signInHere: string;
  passwordRequirements: string;
  verifyMobile: string;
  otpSent: string;
  enterVerificationCode: string;
  verifyCode: string;
  attemptsRemaining: string;
  maxAttemptsReached: string;
  resendIn: string;
  acceptTerms: string;
  mustAcceptTerms: string;
  categoryHeader: string;
  category: string;
  job: string;
  selectCategory: string;
  selectJob: string;
  validation: {
    required: string;
    accountTypeRequired: string;
    companyNameRequired: string;
    companyNameMax: string;
    nationalIdRequired: string;
    nationalIdFormat: string;
    companyPhoneRequired: string;
    companyPhoneMin: string;
    companyAddressRequired: string;
    companyAddressMax: string;
    postalCodeRequired: string;
    postalCodeFormat: string;
    firstNameRequired: string;
    lastNameRequired: string;
    mobileRequired: string;
    mobileFormat: string;
    phoneFormat: string;
    emailRequired: string;
    emailFormat: string;
    passwordRequired: string;
    passwordMin: string;
    passwordUppercase: string;
    passwordNumber: string;
    passwordStrength: string;
    confirmPasswordRequired: string;
    passwordMismatch: string;
    agencyCodeFormat: string;
    invalidOtp: string;
    maxOtpAttempts: string;
    shebaRequiredAgency: string;
    shebaDigits: string;
    shebaLength: string;
    shebaNotAllowed: string;
  };
  success: string;
  otpResent: string;
  error: {
    signupFailed: string;
    invalidOtp: string;
    resendFailed: string;
    customerNotFound: string;
    accountInactive: string;
    accountAlreadyVerified: string;
    emailExists: string;
    mobileExists: string;
    nationalIdExists: string;
    accountTypeNotFound: string;
    companyFieldsRequired: string;
    referrerAgencyNotFound: string;
    referrerMustBeAgency: string;
    referrerAgencyInactive: string;
    noValidOtp: string;
    invalidOtpType: string;
    otpExpired: string;
    networkError: string;
    noCustomerId: string;
  };
}

export const signupTranslations: Record<SignupLocale, SignupTranslations> = {
  en: {
    title: 'Create Your Account',
    subtitle: '',
    accountType: 'Account Type',
    selectAccountType: 'Select account type',
    individual: 'Individual',
    independentCompany: 'Independent Company',
    marketingAgency: 'Marketing Agency',
    companyInfo: 'Company Information',
    companyName: 'Company Name',
    companyNamePlaceholder: 'Enter company name',
    nationalId: 'National ID',
    nationalIdPlaceholder: '10 or 11-digit national ID',
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
    sheba: 'Sheba Number',
    shebaPlaceholder: 'Enter 24 digits (without IR)',
    email: 'Email Address',
    emailPlaceholder: 'example@example.com',
    password: 'Password',
    passwordPlaceholder: 'Enter password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm password',
    agencyCode: 'Agency Referral Code (Optional)',
    agencyCodePlaceholder: 'Enter agency code if you have one',
    agencyCodeHelp: 'If you were referred by an agency, enter their code here',
    createAccount: 'Create Account',
    haveAccount: 'Already have an account?',
    signInHere: 'Sign in here',
    passwordRequirements: 'Password Requirements',
    verifyMobile: 'Verify Your Mobile Number',
    otpSent: "We've sent a 6-digit verification code to",
    enterVerificationCode: 'Enter Verification Code',
    verifyCode: 'Verify Code',
    attemptsRemaining: 'Attempts remaining:',
    maxAttemptsReached: 'Maximum attempts reached',
    resendIn: 'Resend in',
    acceptTerms: 'I agree to the terms and conditions',
    mustAcceptTerms: 'You must accept the terms and conditions to continue',
    categoryHeader: 'Please select the category and subcategory that best describes your business',
    category: 'Category',
    job: 'Job',
    selectCategory: 'Select category',
    selectJob: 'Select job',
    validation: {
      required: 'This field is required',
      accountTypeRequired: 'Please select an account type',
      companyNameRequired: 'Company name is required',
      companyNameMax: 'Company name must be 60 characters or less',
      nationalIdRequired: 'National ID is required',
      nationalIdFormat: 'National ID must be 10 or 11 digits',
      companyPhoneRequired: 'Company phone is required',
      companyPhoneMin: 'Phone number must be at least 10 digits',
      companyAddressRequired: 'Company address is required',
      companyAddressMax: 'Address must be 255 characters or less',
      postalCodeRequired: 'Postal code is required',
      postalCodeFormat: 'Postal code must be 10 digits',
      firstNameRequired: 'First name is required',
      lastNameRequired: 'Last name is required',
      mobileRequired: 'Mobile number is required',
      mobileFormat: 'Mobile number must be in format 09xxxxxxxxx',
      phoneFormat: 'Phone number must be in format 0xxxxxxxxxx',
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
      shebaRequiredAgency: 'Sheba number is required for agencies',
      shebaDigits: 'Sheba must contain only English digits',
      shebaLength: 'Sheba must be exactly 24 digits (without IR)',
      shebaNotAllowed: 'Sheba must not be provided for this account type',
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
      emailExists: 'Email address already exists. Please use a different email.',
      mobileExists: 'Mobile number already exists. Please use a different number.',
      nationalIdExists: 'National ID already exists. Please check your information.',
      accountTypeNotFound: 'Account type not found. Please select a valid account type.',
      companyFieldsRequired: 'Company fields are required for business accounts.',
      referrerAgencyNotFound: 'Referrer agency not found. Please check the agency code.',
      referrerMustBeAgency: 'Referrer must be a marketing agency.',
      referrerAgencyInactive: 'Referrer agency is inactive. Please contact support.',
      noValidOtp: 'No valid OTP found. Please request a new OTP.',
      invalidOtpType: 'Invalid OTP type. Please try again.',
      otpExpired: 'OTP has expired. Please request a new OTP.',
      networkError: 'Network error. Please try again.',
      noCustomerId: 'No customer ID found. Please try again.',
    },
  },
  fa: {
    title: 'حساب کاربری خود را بسازید',
    subtitle: '',
    accountType: 'نوع حساب کاربری',
    selectAccountType: 'نوع حساب را انتخاب کنید',
    individual: 'انفرادی',
    independentCompany: 'شرکتی/سازمانی',
    marketingAgency: 'آژانس بازاریابی',
    companyInfo: 'اطلاعات شرکت',
    companyName: 'نام شرکت',
    companyNamePlaceholder: 'نام شرکت را وارد کنید',
    nationalId: 'شناسه ملی',
    nationalIdPlaceholder: 'شناسه ملی ۱۰ یا ۱۱ رقمی',
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
    sheba: 'شماره شبا',
    shebaPlaceholder: '۲۴ رقم انگلیسی (بدون IR)',
    email: 'آدرس ایمیل',
    emailPlaceholder: 'example@example.com',
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
    verifyMobile: 'تأیید شماره موبایل شما',
    otpSent: 'کد تأیید ۶ رقمی به شماره زیر ارسال شده است',
    enterVerificationCode: 'کد تأیید را وارد کنید',
    verifyCode: 'تأیید کد',
    attemptsRemaining: 'تلاش باقی‌مانده:',
    maxAttemptsReached: 'حداکثر تلاش انجام شده است',
    resendIn: 'ارسال مجدد در',
    acceptTerms: 'با شرایط و ضوابط موافقت می‌کنم',
    mustAcceptTerms: 'برای ادامه باید با شرایط و ضوابط موافقت کنید',
    categoryHeader: 'لطفا با انتخاب دسته‌ و زیردسته نوع کسب‌وکار خود را به صورت دقیق انتخاب کنید',
    category: 'دسته‌بندی اصلی کسب و کار شما',
    job: 'زیردسته دقیق‌تر کسب و کار شما',
    selectCategory: 'انتخاب دسته‌بندی اصلی کسب و کار',
    selectJob: 'انتخاب زیردسته دقیق‌تر',
    validation: {
      required: 'این فیلد الزامی است',
      accountTypeRequired: 'لطفاً نوع حساب را انتخاب کنید',
      companyNameRequired: 'نام شرکت الزامی است',
      companyNameMax: 'نام شرکت باید حداکثر ۶۰ کاراکتر باشد',
      nationalIdRequired: 'شناسه ملی الزامی است',
      nationalIdFormat: 'شناسه ملی باید ۱۰ یا ۱۱ رقم باشد',
      companyPhoneRequired: 'تلفن شرکت الزامی است',
      companyPhoneMin: 'شماره تلفن باید حداقل ۱۰ رقم باشد',
      companyAddressRequired: 'آدرس شرکت الزامی است',
      companyAddressMax: 'آدرس باید حداکثر ۲۵۵ کاراکتر باشد',
      postalCodeRequired: 'کد پستی الزامی است',
      postalCodeFormat: 'کد پستی باید ۱۰ رقم باشد',
      firstNameRequired: 'نام الزامی است',
      lastNameRequired: 'نام خانوادگی الزامی است',
      mobileRequired: 'شماره موبایل الزامی است',
      mobileFormat: 'شماره موبایل باید به فرمت ۰۹xxxxxxxxx باشد',
      phoneFormat: 'شماره تلفن باید به فرمت ۰xxxxxxxxxx باشد',
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
      shebaRequiredAgency: 'شماره شبا برای آژانس الزامی است',
      shebaDigits: 'شماره شبا باید فقط شامل ارقام انگلیسی باشد',
      shebaLength: 'شماره شبا باید دقیقاً ۲۴ رقم باشد (بدون IR)',
      shebaNotAllowed: 'برای این نوع حساب، شماره شبا نباید وارد شود',
    },
    success: 'حساب کاربری با موفقیت ایجاد شد! به پلتفرم هوشمند و داده‌محور خوش آمدید!',
    otpResent: 'کد تأیید جدید به شماره موبایل شما ارسال شد',
    error: {
      signupFailed: 'ایجاد حساب ناموفق بود. لطفاً دوباره تلاش کنید.',
      invalidOtp: 'کد تأیید نامعتبر است. لطفاً دوباره تلاش کنید.',
      resendFailed: 'ارسال مجدد کد ناموفق بود. لطفاً دوباره تلاش کنید.',
      customerNotFound: 'مشتری یافت نشد. لطفاً اطلاعات خود را بررسی کنید.',
      accountInactive: 'حساب غیرفعال است. لطفاً با پشتیبانی تماس بگیرید.',
      accountAlreadyVerified: 'حساب قبلاً تأیید شده است. لطفاً وارد شوید.',
      emailExists: 'آدرس ایمیل قبلاً ثبت شده است. لطفاً از ایمیل دیگری استفاده کنید.',
      mobileExists: 'شماره موبایل قبلاً ثبت شده است. لطفاً شماره دیگری وارد کنید.',
      nationalIdExists: 'شناسه ملی قبلاً ثبت شده است. لطفاً اطلاعات را بررسی کنید.',
      accountTypeNotFound: 'نوع حساب یافت نشد. لطفاً یک نوع حساب معتبر انتخاب کنید.',
      companyFieldsRequired: 'فیلدهای شرکت برای حساب‌های سازمانی الزامی است.',
      referrerAgencyNotFound: 'آژانس معرف یافت نشد. لطفاً کد را بررسی کنید.',
      referrerMustBeAgency: 'معرف باید یک آژانس بازاریابی باشد.',
      referrerAgencyInactive: 'آژانس معرف غیرفعال است. لطفاً با پشتیبانی تماس بگیرید.',
      noValidOtp: 'کد تأیید معتبری یافت نشد. لطفاً دوباره درخواست دهید.',
      invalidOtpType: 'نوع کد تأیید نامعتبر است. لطفاً دوباره تلاش کنید.',
      otpExpired: 'کد تأیید منقضی شده است. لطفاً دوباره درخواست دهید.',
      networkError: 'خطای شبکه. لطفاً دوباره تلاش کنید.',
      noCustomerId: 'شناسه مشتری یافت نشد. لطفاً دوباره تلاش کنید.',
    },
  },
};
