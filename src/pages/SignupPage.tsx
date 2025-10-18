import React, { useState } from 'react';
import {
  Building2,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  X,
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';
import { getApiErrorMessage } from '../utils/errorHandler';

interface SignupFormData {
  accountType: 'individual' | 'independent_company' | 'marketing_agency' | '';
  // Company fields
  companyName: string;
  nationalId: string;
  companyPhone: string;
  companyAddress: string;
  postalCode: string;
  shebaNumber: string; // 24 English digits, without IR prefix
  // Representative/Individual fields
  representativeFirstName: string;
  representativeLastName: string;
  representativeMobile: string;
  // Common fields
  email: string;
  password: string;
  confirmPassword: string;
  // Optional agency referral
  referrerAgencyCode: string;
}

interface FormErrors {
  [key: string]: string;
}

interface SignupPageProps {
  onNavigateToLogin?: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigateToLogin }) => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const { showError, showSuccess, showInfo } = useToast();
  const { login } = useAuth();

  const [formData, setFormData] = useState<SignupFormData>({
    accountType: '',
    companyName: '',
    nationalId: '',
    companyPhone: '',
    companyAddress: '',
    postalCode: '',
    shebaNumber: '',
    representativeFirstName: '',
    representativeLastName: '',
    representativeMobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    referrerAgencyCode: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'companyName':
        if (formData.accountType !== 'individual' && !value.trim()) {
          return t('signup.validation.companyNameRequired');
        }
        if (value.length > 60) {
          return t('signup.validation.companyNameMax');
        }
        return '';

      case 'nationalId':
        if (formData.accountType !== 'individual' && !value.trim()) {
          return t('signup.validation.nationalIdRequired');
        }
        if (
          value &&
          (value.length < 10 || value.length > 20 || !/^\d+$/.test(value))
        ) {
          return t('signup.validation.nationalIdFormat');
        }
        return '';

      case 'companyPhone':
        if (formData.accountType !== 'individual' && !value.trim()) {
          return t('signup.validation.companyPhoneRequired');
        }
        if (value && !/^09\d{9}$/.test(value)) {
          return t('signup.validation.mobileFormat');
        }
        return '';

      case 'companyAddress':
        if (formData.accountType !== 'individual' && !value.trim()) {
          return t('signup.validation.companyAddressRequired');
        }
        if (value.length > 255) {
          return t('signup.validation.companyAddressMax');
        }
        return '';

      case 'postalCode':
        if (formData.accountType !== 'individual' && !value.trim()) {
          return t('signup.validation.postalCodeRequired');
        }
        if (value && (value.length < 10 || !/^\d+$/.test(value))) {
          return t('signup.validation.postalCodeFormat');
        }
        return '';

      case 'representativeFirstName':
        if (!value.trim()) {
          return t('signup.validation.firstNameRequired');
        }
        return '';

      case 'representativeLastName':
        if (!value.trim()) {
          return t('signup.validation.lastNameRequired');
        }
        return '';

      case 'representativeMobile':
        if (!value.trim()) {
          return t('signup.validation.mobileRequired');
        }
        if (!/^09\d{9}$/.test(value)) {
          return t('signup.validation.mobileFormat');
        }
        return '';

      case 'email':
        if (!value.trim()) {
          return t('signup.validation.emailRequired');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return t('signup.validation.emailFormat');
        }
        return '';

      case 'password':
        if (!value) {
          return t('signup.validation.passwordRequired');
        }
        if (value.length < 8) {
          return t('signup.validation.passwordMin');
        }
        if (!/[A-Z]/.test(value)) {
          return t('signup.validation.passwordUppercase');
        }
        if (!/\d/.test(value)) {
          return t('signup.validation.passwordNumber');
        }
        return '';

      case 'confirmPassword':
        if (!value) {
          return t('signup.validation.confirmPasswordRequired');
        }
        if (value !== formData.password) {
          return t('signup.validation.passwordMismatch');
        }
        return '';

      case 'referrerAgencyCode':
        // Allow any string (varchar 255). Length constrained by input maxLength.
        return '';

      case 'shebaNumber':
        if (formData.accountType === 'marketing_agency') {
          if (!value.trim()) {
            return t('signup.validation.shebaRequiredAgency');
          }
          if (!/^\d+$/.test(value)) {
            return t('signup.validation.shebaDigits');
          }
          if (value.length !== 24) {
            return t('signup.validation.shebaLength');
          }
          return '';
        } else {
          if (value && value.trim().length > 0) {
            return t('signup.validation.shebaNotAllowed');
          }
          return '';
        }

      default:
        return '';
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const sanitizedValue = name === 'shebaNumber'
      ? value.replace(/\D/g, '').slice(0, 24)
      : value;

    if (name === 'accountType') {
      const newType = sanitizedValue as SignupFormData['accountType'];
      setFormData(prev => ({
        ...prev,
        accountType: newType,
        ...(newType === 'marketing_agency' ? { referrerAgencyCode: '' } : {}),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate account type
    if (!formData.accountType) {
      newErrors.accountType = t('signup.validation.accountTypeRequired');
    }

    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (key !== 'accountType') {
        const error = validateField(
          key,
          formData[key as keyof SignupFormData] as string
        );
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    setErrors(newErrors);

    // If there are errors, scroll to the first one in visual order
    if (Object.keys(newErrors).length > 0) {
      const fieldOrder = [
        'accountType',
        'companyName',
        'nationalId',
        'companyPhone',
        'postalCode',
        'companyAddress',
        'representativeFirstName',
        'representativeLastName',
        'representativeMobile',
        'email',
        'password',
        'confirmPassword',
        'shebaNumber',
        'referrerAgencyCode',
      ];
      const firstErrorKey = fieldOrder.find(name => newErrors[name]);
      if (firstErrorKey) {
        const el = document.querySelector(
          `[name='${firstErrorKey}']`
        ) as (HTMLElement | null);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (typeof (el as any).focus === 'function') {
            (el as HTMLElement).focus();
          }
        }
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare signup data according to backend DTO
      const signupData = {
        account_type: formData.accountType,
        company_name:
          formData.accountType !== 'individual'
            ? formData.companyName
            : undefined,
        national_id:
          formData.accountType !== 'individual'
            ? formData.nationalId
            : undefined,
        company_phone:
          formData.accountType !== 'individual'
            ? formData.companyPhone
            : undefined,
        company_address:
          formData.accountType !== 'individual'
            ? formData.companyAddress
            : undefined,
        postal_code:
          formData.accountType !== 'individual'
            ? formData.postalCode
            : undefined,
        sheba_number:
          formData.accountType === 'marketing_agency'
            ? `IR${formData.shebaNumber}`
            : undefined,
        representative_first_name: formData.representativeFirstName,
        representative_last_name: formData.representativeLastName,
        representative_mobile: formData.representativeMobile,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        referrer_agency_code:
          formData.accountType !== 'marketing_agency' && formData.referrerAgencyCode
            ? formData.referrerAgencyCode
            : undefined,
      };

      const response = await apiService.signup(signupData);

      if (response.success && response.data) {
        // Extract customer_id from the response data
        const responseData = response.data.data || response.data;
        const customerId = responseData?.customer_id;

        if (customerId) {
          setCustomerId(customerId);
          setShowOtpModal(true);
          startResendCountdown();
        } else {
          showError(t('signup.error.noCustomerId'));
        }
      } else {
        // Use the new error handling utility
        const errorMessage = getApiErrorMessage(
          response,
          language,
          t('signup.error.signupFailed')
        );
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error);
      showError(t('signup.error.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  const startResendCountdown = () => {
    setCanResendOtp(false);
    setResendCountdown(60);

    const interval = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          setCanResendOtp(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpVerification = async () => {
    if (otpCode.length !== 6) {
      showError(t('signup.validation.invalidOtp'));
      return;
    }

    if (!customerId) {
      showError(t('signup.error.noCustomerId'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.verifyOtp(
        customerId,
        otpCode,
        'mobile'
      );

      if (response.success && response.data) {
        // The API service wraps the server response, so we need to access response.data.data
        const responseData = response.data.data || response.data;

        // Store tokens and user data using auth context
        if (
          responseData.customer &&
          responseData.access_token &&
          responseData.refresh_token
        ) {
          login(
            {
              token: responseData.access_token,
              refresh_token: responseData.refresh_token,
            },
            responseData.customer
          );

          showSuccess(t('signup.success'));
          setShowOtpModal(false);

          // Redirect to dashboard
          window.location.href = '/dashboard';
        } else {
          console.error('Missing required data in OTP response:', responseData);
          showError(t('signup.error.invalidOtp'));
        }
      } else {
        // Use the new error handling utility
        const errorMessage = getApiErrorMessage(
          response,
          language,
          t('signup.error.invalidOtp')
        );
        showError(errorMessage);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      showError(t('signup.error.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResendOtp || !customerId) return;

    setIsLoading(true);
    try {
      const response = await apiService.resendOtp(customerId, 'mobile');

      if (response.success && response.data) {
        // The API service wraps the server response, so we need to access response.data.data
        const responseData = response.data.data || response.data;

        // Check if OTP was sent successfully
        if (responseData.otp_sent) {
          showInfo(t('signup.otpResent'));
          startResendCountdown();
        } else {
          showError(t('signup.error.resendFailed'));
        }
      } else {
        // Use the new error handling utility
        const errorMessage = getApiErrorMessage(
          response,
          language,
          t('signup.error.resendFailed')
        );
        showError(errorMessage);
      }
    } catch (error) {
      showError(t('signup.error.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  const isCompanyAccount =
    formData.accountType === 'independent_company' ||
    formData.accountType === 'marketing_agency';

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='mx-auto h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center'>
            <User className='h-6 w-6 text-white' />
          </div>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            {t('signup.title')}
          </h2>
          <p className='mt-2 text-sm text-gray-600'>{t('signup.subtitle')}</p>
        </div>

        {/* Signup Form */}
        <div className='bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Account Type */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('signup.accountType')}{' '}
                <span className='text-red-500'>
                  {t('common.required')}
                </span>
              </label>
              <select
                name='accountType'
                value={formData.accountType}
                onChange={handleInputChange}
                className='input-field'
              >
                <option value=''>{t('signup.selectAccountType')}</option>
                <option value='individual'>{t('signup.individual')}</option>
                <option value='independent_company'>
                  {t('signup.independentCompany')}
                </option>
                <option value='marketing_agency'>
                  {t('signup.marketingAgency')}
                </option>
              </select>
              {errors.accountType && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.accountType}
                </p>
              )}
            </div>

            {/* Company Fields - Only show for company accounts */}
            {isCompanyAccount && (
              <div className='space-y-6 border-t pt-6'>
                <h3
                  className={`text-lg font-medium text-gray-900 flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                >
                  <Building2 className='h-5 w-5' />
                  <span>{t('signup.companyInfo')}</span>
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      {t('signup.companyName')}{' '}
                      <span className='text-red-500'>
                        {t('common.required')}
                      </span>
                    </label>
                    <input
                      type='text'
                      name='companyName'
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className='input-field'
                      placeholder={t('signup.companyNamePlaceholder')}
                      maxLength={60}
                    />
                    {errors.companyName && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      {t('signup.nationalId')}{' '}
                      <span className='text-red-500'>
                        {t('common.required')}
                      </span>
                    </label>
                    <input
                      type='text'
                      name='nationalId'
                      value={formData.nationalId}
                      onChange={handleInputChange}
                      className='input-field'
                      placeholder={t('signup.nationalIdPlaceholder')}
                      maxLength={20}
                    />
                    {errors.nationalId && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.nationalId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      {t('signup.companyPhone')}{' '}
                      <span className='text-red-500'>
                        {t('common.required')}
                      </span>
                    </label>
                    <input
                      type='tel'
                      name='companyPhone'
                      value={formData.companyPhone}
                      onChange={handleInputChange}
                      className='input-field'
                      placeholder={t('signup.companyPhonePlaceholder')}
                      maxLength={11}
                    />
                    {errors.companyPhone && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.companyPhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      {t('signup.postalCode')}{' '}
                      <span className='text-red-500'>
                        {t('common.required')}
                      </span>
                    </label>
                    <input
                      type='text'
                      name='postalCode'
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className='input-field'
                      placeholder={t('signup.postalCodePlaceholder')}
                      maxLength={20}
                    />
                    {errors.postalCode && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('signup.companyAddress')}{' '}
                    <span className='text-red-500'>
                      {t('common.required')}
                    </span>
                  </label>
                  <textarea
                    name='companyAddress'
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className='input-field'
                    placeholder={t('signup.companyAddressPlaceholder')}
                    maxLength={255}
                  />
                  {errors.companyAddress && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.companyAddress}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Representative/Individual Information */}
            <div className='space-y-6 border-t pt-6'>
              <h3
                className={`text-lg font-medium text-gray-900 flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
              >
                <User className='h-5 w-5' />
                <span>
                  {isCompanyAccount
                    ? t('signup.representativeInfo')
                    : t('signup.personalInfo')}
                </span>
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('signup.firstName')}{' '}
                    <span className='text-red-500'>
                      {t('common.required')}
                    </span>
                  </label>
                  <input
                    type='text'
                    name='representativeFirstName'
                    value={formData.representativeFirstName}
                    onChange={handleInputChange}
                    className='input-field'
                    placeholder={t('signup.firstNamePlaceholder')}
                  />
                  {errors.representativeFirstName && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.representativeFirstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('signup.lastName')}{' '}
                    <span className='text-red-500'>
                      {t('common.required')}
                    </span>
                  </label>
                  <input
                    type='text'
                    name='representativeLastName'
                    value={formData.representativeLastName}
                    onChange={handleInputChange}
                    className='input-field'
                    placeholder={t('signup.lastNamePlaceholder')}
                  />
                  {errors.representativeLastName && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.representativeLastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('signup.mobileNumber')}{' '}
                  <span className='text-red-500'>
                    {t('common.required')}
                  </span>
                </label>
                <input
                  type='tel'
                  name='representativeMobile'
                  value={formData.representativeMobile}
                  onChange={handleInputChange}
                  className='input-field'
                  placeholder={t('signup.mobilePlaceholder')}
                  maxLength={11}
                />
                {errors.representativeMobile && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.representativeMobile}
                  </p>
                )}
              </div>
            </div>

            {/* Account Credentials */}
            <div className='space-y-6 border-t pt-6'>
              <h3
                className={`text-lg font-medium text-gray-900 flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
              >
                <Lock className='h-5 w-5' />
                <span>{t('signup.credentials')}</span>
              </h3>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('signup.email')}{' '}
                  <span className='text-red-500'>
                    {t('common.required')}
                  </span>
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='input-field'
                  placeholder={t('signup.emailPlaceholder')}
                />
                {errors.email && (
                  <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
                )}
              </div>

              {formData.accountType === 'marketing_agency' && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('signup.sheba')}{' '}
                    <span className='text-red-500'>
                      {t('common.required')}
                    </span>
                  </label>
                  <div className='relative'>
                    <span className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center text-gray-500 font-medium`} dir='ltr'>
                      IR
                    </span>
                    <input
                      type='text'
                      name='shebaNumber'
                      value={formData.shebaNumber}
                      onChange={handleInputChange}
                      className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`}
                      dir={isRTL ? 'ltr' : undefined}
                      placeholder={t('signup.shebaPlaceholder')}
                      maxLength={24}
                    />
                  </div>
                  {errors.shebaNumber && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.shebaNumber}
                    </p>
                  )}
                </div>
              )}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('signup.password')}{' '}
                    <span className='text-red-500'>
                      {t('common.required')}
                    </span>
                  </label>
                  <div className='relative'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`input-field ${isRTL ? 'pl-10' : 'pr-10'}`}
                      placeholder={t('signup.passwordPlaceholder')}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
                    >
                      {showPassword ? (
                        <EyeOff className='h-5 w-5 text-gray-400' />
                      ) : (
                        <Eye className='h-5 w-5 text-gray-400' />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.password}
                    </p>
                  )}

                  {/* Password Requirements */}
                  <div className='mt-2 text-xs text-gray-500'>
                    <p className='font-medium mb-1'>
                      {t('signup.passwordRequirements')}:
                    </p>
                    <ul className='space-y-1'>
                      <li>• {t('signup.validation.passwordMin')}</li>
                      <li>• {t('signup.validation.passwordUppercase')}</li>
                      <li>• {t('signup.validation.passwordNumber')}</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('signup.confirmPassword')}{' '}
                    <span className='text-red-500'>
                      {t('common.required')}
                    </span>
                  </label>
                  <div className='relative'>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name='confirmPassword'
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`input-field ${isRTL ? 'pl-10' : 'pr-10'}`}
                      placeholder={t('signup.confirmPasswordPlaceholder')}
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='h-5 w-5 text-gray-400' />
                      ) : (
                        <Eye className='h-5 w-5 text-gray-400' />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Optional Agency Code */}
            {formData.accountType !== 'marketing_agency' && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('signup.agencyCode')}
              </label>
              <input
                type='text'
                name='referrerAgencyCode'
                value={formData.referrerAgencyCode}
                onChange={handleInputChange}
                className='input-field'
                placeholder={t('signup.agencyCodePlaceholder')}
                maxLength={255}
              />
              {errors.referrerAgencyCode && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.referrerAgencyCode}
                </p>
              )}
              <p className='mt-1 text-xs text-gray-500'>
                {t('signup.agencyCodeHelp')}
              </p>
            </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className={`w-full btn-red disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
            >
              {isLoading ? (
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
              ) : (
                <>
                  <span>{t('signup.createAccount')}</span>
                  <ArrowRight
                    className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`}
                  />
                </>
              )}
            </button>

            {/* Login Link */}
            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                {t('signup.haveAccount')}{' '}
                <button
                  type='button'
                  onClick={onNavigateToLogin}
                  className='text-red-600 hover:text-red-700 font-medium'
                >
                  {t('signup.signInHere')}
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* OTP Verification Modal */}
        {showOtpModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg max-w-md w-full p-6'>
              <div
                className={`flex justify-between items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <h3 className='text-lg font-medium text-gray-900'>
                  {t('signup.verifyMobile')}
                </h3>
                <button
                  onClick={() => setShowOtpModal(false)}
                  className='text-gray-400 hover:text-gray-600'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              <div className='text-center mb-6'>
                <CheckCircle className='mx-auto h-12 w-12 text-green-500 mb-4' />
                <p className='text-sm text-gray-600'>{t('signup.otpSent')}</p>
                <p className='font-medium text-gray-900'>
                  {formData.representativeMobile}
                </p>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('signup.enterVerificationCode')}
                  </label>
                  <input
                    type='text'
                    value={otpCode}
                    onChange={e =>
                      setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    className='input-field text-center text-2xl tracking-widest'
                    placeholder='000000'
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={handleOtpVerification}
                  disabled={isLoading || otpCode.length !== 6}
                  className='w-full btn-red disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? (
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto'></div>
                  ) : (
                    t('signup.verifyCode')
                  )}
                </button>

                <div className='text-center space-y-2'>
                  {canResendOtp ? (
                    <button
                      onClick={handleResendOtp}
                      disabled={!canResendOtp || isLoading}
                      className='text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {t('common.resend')}
                    </button>
                  ) : (
                    <p className='text-sm text-gray-600'>
                      {t('signup.resendIn')} {resendCountdown}
                      {t('common.seconds')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
