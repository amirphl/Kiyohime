import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import apiService from '../../services/api';
import { getApiErrorMessage } from '../../utils/errorHandler';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { SignupFormData, FormErrors, AccountType } from './types';
import { SignupTranslations, SignupLocale } from './translations';
import { defaultSignupForm, sanitizeSheba, toEnglishDigits } from './utils';

interface UseSignupFormParams {
  language: SignupLocale | string;
  strings: SignupTranslations;
}

export const useSignupForm = ({ language, strings }: UseSignupFormParams) => {
  const { showError, showSuccess, showInfo } = useToast();
  const { login } = useAuth();
  const normalizedLanguage: SignupLocale = language === 'fa' ? 'fa' : 'en';

  const [formData, setFormData] = useState<SignupFormData>(defaultSignupForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isCompanyAccount = useMemo(
    () =>
      formData.accountType === 'independent_company' ||
      formData.accountType === 'marketing_agency',
    [formData.accountType]
  );

  const resetCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  useEffect(() => () => resetCountdown(), [resetCountdown]);

  const validateField = useCallback(
    (name: keyof SignupFormData | 'accountType', value: string, data: SignupFormData): string => {
      switch (name) {
        case 'jobCategory':
        case 'job':
          if (data.accountType !== 'marketing_agency' && !value.trim()) {
            return strings.validation.required;
          }
          return '';
        case 'companyName':
          if (data.accountType !== 'individual' && !value.trim()) {
            return strings.validation.companyNameRequired;
          }
          if (value.length > 60) {
            return strings.validation.companyNameMax;
          }
          return '';
        case 'nationalId':
          if (data.accountType !== 'individual' && !value.trim()) {
            return strings.validation.nationalIdRequired;
          }
          if (value && (!/^\d+$/.test(value) || (value.length !== 10 && value.length !== 11))) {
            return strings.validation.nationalIdFormat;
          }
          return '';
        case 'nationalCode':
          if (data.accountType === 'individual' && !value.trim()) {
            return strings.validation.nationalCodeRequired;
          }
          const normalizedCode = toEnglishDigits(value);
          if (normalizedCode && (!/^\d+$/.test(normalizedCode) || (normalizedCode.length !== 10 && normalizedCode.length !== 11))) {
            return strings.validation.nationalCodeFormat;
          }
          return '';
        case 'companyPhone':
          if (data.accountType !== 'individual' && !value.trim()) {
            return strings.validation.companyPhoneRequired;
          }
          if (value && !/^0\d{10}$/.test(value)) {
            return strings.validation.phoneFormat;
          }
          return '';
        case 'companyAddress':
          if (data.accountType !== 'individual' && !value.trim()) {
            return strings.validation.companyAddressRequired;
          }
          if (value.length > 255) {
            return strings.validation.companyAddressMax;
          }
          return '';
        case 'postalCode':
          if (data.accountType !== 'individual' && !value.trim()) {
            return strings.validation.postalCodeRequired;
          }
          if (value && (value.length !== 10 || !/^\d+$/.test(value))) {
            return strings.validation.postalCodeFormat;
          }
          return '';
        case 'representativeFirstName':
          return !value.trim() ? strings.validation.firstNameRequired : '';
        case 'representativeLastName':
          return !value.trim() ? strings.validation.lastNameRequired : '';
        case 'representativeMobile':
          if (!value.trim()) return strings.validation.mobileRequired;
          if (!/^09\d{9}$/.test(value)) return strings.validation.mobileFormat;
          return '';
        case 'email':
          if (!value.trim()) return strings.validation.emailRequired;
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return strings.validation.emailFormat;
          }
          return '';
        case 'password':
          if (!value) return strings.validation.passwordRequired;
          if (value.length < 8) return strings.validation.passwordMin;
          if (!/[A-Z]/.test(value)) return strings.validation.passwordUppercase;
          if (!/\d/.test(value)) return strings.validation.passwordNumber;
          return '';
        case 'confirmPassword':
          if (!value) return strings.validation.confirmPasswordRequired;
          if (value !== data.password) return strings.validation.passwordMismatch;
          return '';
        case 'referrerAgencyCode':
          return '';
        case 'shebaNumber':
          if (data.accountType === 'marketing_agency') {
            if (!value.trim()) return strings.validation.shebaRequiredAgency;
            if (!/^\d+$/.test(value)) return strings.validation.shebaDigits;
            if (value.length !== 24) return strings.validation.shebaLength;
            return '';
          }
          if (value && value.trim().length > 0) {
            return strings.validation.shebaNotAllowed;
          }
          return '';
        case 'accountType':
          return value ? '' : strings.validation.accountTypeRequired;
        default:
          return '';
      }
    },
    [strings]
  );

  const handleInputChange = useCallback(
    (name: keyof SignupFormData | 'accountType', rawValue: string) => {
      const normalized = name === 'shebaNumber'
        ? sanitizeSheba(rawValue)
        : toEnglishDigits(rawValue);

      setFormData(prev => {
        if (name === 'accountType') {
          const newType = normalized as AccountType;
          return {
            ...prev,
            accountType: newType,
            ...(newType === 'marketing_agency' ? { referrerAgencyCode: '' } : {}),
            ...(newType !== 'marketing_agency' ? { shebaNumber: '' } : {}),
          };
        }
        if (name === 'jobCategory') {
          return { ...prev, jobCategory: normalized, job: '' };
        }
        return { ...prev, [name]: normalized } as SignupFormData;
      });

      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  const validateForm = useCallback(
    (data: SignupFormData): boolean => {
      const newErrors: FormErrors = {};

      if (!data.accountType) {
        newErrors.accountType = strings.validation.accountTypeRequired;
      }

      (Object.keys(data) as Array<keyof SignupFormData>).forEach(key => {
        const error = validateField(key, data[key], data);
        if (error) newErrors[key] = error;
      });

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        const fieldOrder: Array<keyof SignupFormData | 'accountType'> = [
          'accountType',
          'companyName',
          'nationalId',
          'nationalCode',
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
          'jobCategory',
          'job',
        ];
        const firstErrorKey = fieldOrder.find(name => newErrors[name]);
        if (firstErrorKey) {
          const el = document.querySelector(`[name='${firstErrorKey}']`) as HTMLElement | null;
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus?.();
          }
        }
      }

      return Object.keys(newErrors).length === 0;
    },
    [strings.validation, validateField]
  );

  const startResendCountdown = useCallback(() => {
    resetCountdown();
    setCanResendOtp(false);
    setResendCountdown(60);
    countdownRef.current = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          setCanResendOtp(true);
          resetCountdown();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [resetCountdown]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!acceptedTerms) {
        showError(strings.mustAcceptTerms);
        return;
      }

      const currentData = { ...formData };
      if (!validateForm(currentData)) return;

      setIsLoading(true);

      try {
        const signupData = {
          account_type: currentData.accountType,
          company_name: currentData.accountType !== 'individual' ? currentData.companyName : undefined,
          national_id: currentData.accountType === 'individual' ? currentData.nationalCode : currentData.nationalId,
          company_phone: currentData.accountType !== 'individual' ? currentData.companyPhone : undefined,
          company_address: currentData.accountType !== 'individual' ? currentData.companyAddress : undefined,
          postal_code: currentData.accountType !== 'individual' ? currentData.postalCode : undefined,
          sheba_number: currentData.accountType === 'marketing_agency' ? `IR${currentData.shebaNumber}` : undefined,
          representative_first_name: currentData.representativeFirstName,
          representative_last_name: currentData.representativeLastName,
          representative_mobile: currentData.representativeMobile,
          email: currentData.email,
          password: currentData.password,
          confirm_password: currentData.confirmPassword,
          referrer_agency_code: currentData.accountType !== 'marketing_agency' && currentData.referrerAgencyCode
            ? currentData.referrerAgencyCode
            : undefined,
          job_category: currentData.accountType !== 'marketing_agency' ? currentData.jobCategory : undefined,
          job: currentData.accountType !== 'marketing_agency' ? currentData.job : undefined,
        };

        const response = await apiService.signup(signupData);
        if (response.success && response.data) {
          const responseData = response.data.data || response.data;
          const id = responseData?.customer_id;
          if (id) {
            setCustomerId(id);
            setShowOtpModal(true);
            startResendCountdown();
          } else {
            showError(strings.error.noCustomerId);
          }
        } else {
          const errorMessage = getApiErrorMessage(response, normalizedLanguage, strings.error.signupFailed);
          showError(errorMessage);
        }
      } catch (error) {
        console.error('Signup error:', error);
        showError(strings.error.networkError);
      } finally {
        setIsLoading(false);
      }
    },
    [acceptedTerms, formData, normalizedLanguage, showError, startResendCountdown, strings, validateForm]
  );

  const handleOtpVerification = useCallback(async () => {
    if (otpCode.length !== 6) {
      showError(strings.validation.invalidOtp);
      return;
    }
    if (!customerId) {
      showError(strings.error.noCustomerId);
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiService.verifyOtp(customerId, otpCode, 'mobile');
      if (response.success && response.data) {
        const responseData = response.data.data || response.data;
        if (responseData.customer && responseData.access_token && responseData.refresh_token) {
          login(
            { token: responseData.access_token, refresh_token: responseData.refresh_token },
            responseData.customer
          );
          showSuccess(strings.success);
          setShowOtpModal(false);
          window.location.href = '/dashboard';
        } else {
          console.error('Missing required data in OTP response:', responseData);
          showError(strings.error.invalidOtp);
        }
      } else {
        const errorMessage = getApiErrorMessage(response, normalizedLanguage, strings.error.invalidOtp);
        showError(errorMessage);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      showError(strings.error.networkError);
    } finally {
      setIsLoading(false);
    }
  }, [customerId, normalizedLanguage, login, otpCode, showError, showSuccess, strings]);

  const handleResendOtp = useCallback(async () => {
    if (!canResendOtp || !customerId) return;
    setIsLoading(true);
    try {
      const response = await apiService.resendOtp(customerId, 'mobile');
      if (response.success && response.data) {
        const responseData = response.data.data || response.data;
        if (responseData.otp_sent) {
          showInfo(strings.otpResent);
          startResendCountdown();
        } else {
          showError(strings.error.resendFailed);
        }
      } else {
        const errorMessage = getApiErrorMessage(response, normalizedLanguage, strings.error.resendFailed);
        showError(errorMessage);
      }
    } catch (error) {
      showError(strings.error.networkError);
    } finally {
      setIsLoading(false);
    }
  }, [canResendOtp, customerId, normalizedLanguage, showError, showInfo, startResendCountdown, strings]);

  return {
    formData,
    errors,
    isLoading,
    showPassword,
    showConfirmPassword,
    acceptedTerms,
    setAcceptedTerms,
    setShowPassword,
    setShowConfirmPassword,
    handleInputChange,
    handleSubmit,
    isCompanyAccount,
    showOtpModal,
    otpCode,
    setOtpCode,
    handleOtpVerification,
    canResendOtp,
    resendCountdown,
    handleResendOtp,
    setShowOtpModal,
  };
};
