import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import apiService from '../../services/api';
import { getApiErrorMessage } from '../../utils/errorHandler';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { SignupFormData, FormErrors, AccountType } from './types';
import { SignupTranslations, SignupLocale } from './translations';
import {
  buildSignupPayload,
  defaultSignupForm,
  extractApiData,
  normalizeTextInput,
  parseCustomerId,
  sanitizeEmailInput,
  sanitizeNumericInput,
  sanitizePhoneInput,
  sanitizeSheba,
  toEnglishDigits,
} from './utils';

interface UseSignupFormParams {
  language: SignupLocale | string;
  strings: SignupTranslations;
}

type SignupAction = 'submit' | 'verifyOtp' | 'resendOtp';

const OTP_RESEND_SECONDS = 60;

const fieldErrorCodeMap: Partial<Record<string, keyof FormErrors>> = {
  EMAIL_EXISTS: 'email',
  MOBILE_EXISTS: 'representativeMobile',
  REFERRER_AGENCY_NOT_FOUND: 'referrerAgencyCode',
  REFERRER_MUST_BE_AGENCY: 'referrerAgencyCode',
  REFERRER_AGENCY_INACTIVE: 'referrerAgencyCode',
  COMPANY_FIELDS_REQUIRED: 'companyName',
};

const apiFieldMap: Partial<Record<string, keyof SignupFormData>> = {
  company_name: 'companyName',
  national_id: 'nationalId',
  company_phone: 'companyPhone',
  company_address: 'companyAddress',
  postal_code: 'postalCode',
  sheba_number: 'shebaNumber',
  representative_first_name: 'representativeFirstName',
  representative_last_name: 'representativeLastName',
  representative_mobile: 'representativeMobile',
  email: 'email',
  password: 'password',
  confirm_password: 'confirmPassword',
  referrer_agency_code: 'referrerAgencyCode',
  job_category: 'jobCategory',
  job: 'job',
};

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
  const [resendCountdown, setResendCountdown] = useState(OTP_RESEND_SECONDS);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const actionInFlightRef = useRef<SignupAction | null>(null);

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

  const beginAction = useCallback((action: SignupAction) => {
    if (actionInFlightRef.current) {
      return false;
    }

    actionInFlightRef.current = action;
    setIsLoading(true);
    return true;
  }, []);

  const finishAction = useCallback(() => {
    actionInFlightRef.current = null;
    setIsLoading(false);
  }, []);

  useEffect(() => () => resetCountdown(), [resetCountdown]);

  const validateField = useCallback(
    (
      name: keyof SignupFormData | 'accountType',
      value: string,
      data: SignupFormData
    ): string => {
      switch (name) {
        case 'jobCategory':
        case 'job':
          if (data.accountType !== 'marketing_agency' && !value.trim()) {
            return strings.validation.required;
          }
          return '';
        case 'companyName':
          if (data.accountType !== 'individual' && !normalizeTextInput(value)) {
            return strings.validation.companyNameRequired;
          }
          if (value.length > 60) {
            return strings.validation.companyNameMax;
          }
          return '';
        case 'nationalId':
          if (data.accountType !== 'individual' && !normalizeTextInput(value)) {
            return strings.validation.nationalIdRequired;
          }
          if (
            value &&
            (!/^\d+$/.test(value) ||
              (value.length !== 10 && value.length !== 11))
          ) {
            return strings.validation.nationalIdFormat;
          }
          return '';
        case 'nationalCode':
          if (data.accountType === 'individual' && !normalizeTextInput(value)) {
            return strings.validation.nationalCodeRequired;
          }
          const normalizedCode = toEnglishDigits(value);
          if (
            normalizedCode &&
            (!/^\d+$/.test(normalizedCode) ||
              (normalizedCode.length !== 10 && normalizedCode.length !== 11))
          ) {
            return strings.validation.nationalCodeFormat;
          }
          return '';
        case 'companyPhone':
          if (data.accountType !== 'individual' && !normalizeTextInput(value)) {
            return strings.validation.companyPhoneRequired;
          }
          if (value && !/^0\d{10}$/.test(value)) {
            return strings.validation.phoneFormat;
          }
          return '';
        case 'companyAddress':
          if (data.accountType !== 'individual' && !normalizeTextInput(value)) {
            return strings.validation.companyAddressRequired;
          }
          if (value.length > 255) {
            return strings.validation.companyAddressMax;
          }
          return '';
        case 'postalCode':
          if (data.accountType !== 'individual' && !normalizeTextInput(value)) {
            return strings.validation.postalCodeRequired;
          }
          if (value && (value.length !== 10 || !/^\d+$/.test(value))) {
            return strings.validation.postalCodeFormat;
          }
          return '';
        case 'representativeFirstName':
          return !normalizeTextInput(value)
            ? strings.validation.firstNameRequired
            : '';
        case 'representativeLastName':
          return !normalizeTextInput(value)
            ? strings.validation.lastNameRequired
            : '';
        case 'representativeMobile':
          if (!normalizeTextInput(value))
            return strings.validation.mobileRequired;
          if (!/^09\d{9}$/.test(value)) return strings.validation.mobileFormat;
          return '';
        case 'email':
          if (!normalizeTextInput(value))
            return strings.validation.emailRequired;
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
          if (value !== data.password)
            return strings.validation.passwordMismatch;
          return '';
        case 'referrerAgencyCode':
          return '';
        case 'shebaNumber':
          if (data.accountType === 'marketing_agency') {
            if (!normalizeTextInput(value))
              return strings.validation.shebaRequiredAgency;
            if (!/^\d+$/.test(value)) return strings.validation.shebaDigits;
            if (value.length !== 24) return strings.validation.shebaLength;
            return '';
          }
          if (value && normalizeTextInput(value).length > 0) {
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
      let normalized: string;

      switch (name) {
        case 'shebaNumber':
          normalized = sanitizeSheba(rawValue);
          break;
        case 'nationalId':
        case 'nationalCode':
          normalized = sanitizeNumericInput(rawValue, 11);
          break;
        case 'companyPhone':
        case 'representativeMobile':
          normalized = sanitizePhoneInput(rawValue);
          break;
        case 'postalCode':
          normalized = sanitizeNumericInput(rawValue, 10);
          break;
        case 'email':
          normalized = sanitizeEmailInput(rawValue);
          break;
        case 'accountType':
          normalized = rawValue;
          break;
        default:
          normalized = toEnglishDigits(rawValue);
          break;
      }

      setFormData(prev => {
        if (name === 'accountType') {
          const newType = normalized as AccountType;
          return {
            ...prev,
            accountType: newType,
            ...(newType === 'marketing_agency'
              ? { referrerAgencyCode: '' }
              : {}),
            ...(newType !== 'marketing_agency' ? { shebaNumber: '' } : {}),
            ...(newType === 'individual'
              ? {
                  companyName: '',
                  nationalId: '',
                  companyPhone: '',
                  companyAddress: '',
                  postalCode: '',
                }
              : { nationalCode: '' }),
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

      if (name === 'accountType') {
        setErrors(prev => ({
          ...prev,
          accountType: '',
          companyName: '',
          nationalId: '',
          nationalCode: '',
          companyPhone: '',
          companyAddress: '',
          postalCode: '',
          shebaNumber: '',
          referrerAgencyCode: '',
          jobCategory: '',
          job: '',
        }));
      }

      if (name === 'representativeMobile') {
        setCustomerId(null);
        setOtpCode('');
        setShowOtpModal(false);
        setCanResendOtp(false);
        setResendCountdown(OTP_RESEND_SECONDS);
        resetCountdown();
      }
    },
    [errors, resetCountdown]
  );

  const setFieldError = useCallback(
    (field: keyof FormErrors, message: string) => {
      setErrors(prev => ({ ...prev, [field]: message }));
    },
    []
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
          const el = document.querySelector(
            `[name='${firstErrorKey}']`
          ) as HTMLElement | null;
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
    setResendCountdown(OTP_RESEND_SECONDS);
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

  const showApiError = useCallback(
    (
      response: {
        success: boolean;
        message?: string;
        error?: { code?: string; details?: unknown };
      },
      fallbackMessage: string
    ) => {
      const errorCode = response.error?.code;
      const message = getApiErrorMessage(
        response,
        normalizedLanguage,
        fallbackMessage
      );
      const details = response.error?.details;

      if (details && typeof details === 'object' && !Array.isArray(details)) {
        Object.entries(details as Record<string, unknown>).forEach(
          ([apiField, fieldMessage]) => {
            const field = apiFieldMap[apiField];
            if (field && typeof fieldMessage === 'string') {
              setFieldError(
                field,
                getApiErrorMessage(
                  {
                    success: false,
                    message: fieldMessage,
                    error: { code: fieldMessage },
                  },
                  normalizedLanguage,
                  fieldMessage
                )
              );
            }
          }
        );
      }

      if (errorCode) {
        const field =
          errorCode === 'NATIONAL_ID_EXISTS'
            ? formData.accountType === 'individual'
              ? 'nationalCode'
              : 'nationalId'
            : fieldErrorCodeMap[errorCode];
        if (field) {
          setFieldError(field, message);
        }
      }

      showError(message);
    },
    [formData.accountType, normalizedLanguage, setFieldError, showError]
  );

  const getRequestErrorMessage = useCallback(
    (error: unknown) => {
      if (
        error instanceof Error &&
        (error.name === 'TimeoutError' || error.message.includes('timed out'))
      ) {
        return strings.error.timeout;
      }

      return strings.error.networkError;
    },
    [strings.error.networkError, strings.error.timeout]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (actionInFlightRef.current) return;

      if (!acceptedTerms) {
        showError(strings.mustAcceptTerms);
        return;
      }

      const currentData = { ...formData };
      if (!validateForm(currentData)) return;

      if (!beginAction('submit')) return;

      try {
        const response = await apiService.signup(
          buildSignupPayload(currentData)
        );
        const responseData = extractApiData(response);

        if (response.success && responseData) {
          const id = parseCustomerId(
            responseData?.customer_id ?? responseData?.customerId
          );
          if (id) {
            setCustomerId(id);
            setShowOtpModal(true);
            startResendCountdown();
          } else {
            showError(strings.error.noCustomerId);
          }
        } else {
          showApiError(response, strings.error.signupFailed);
        }
      } catch (error) {
        console.error('Signup error:', error);
        showError(getRequestErrorMessage(error));
      } finally {
        finishAction();
      }
    },
    [
      acceptedTerms,
      beginAction,
      finishAction,
      formData,
      getRequestErrorMessage,
      showApiError,
      showError,
      startResendCountdown,
      strings,
      validateForm,
    ]
  );

  const handleOtpVerification = useCallback(async () => {
    if (actionInFlightRef.current) return;
    if (otpCode.length !== 6) {
      showError(strings.validation.invalidOtp);
      return;
    }
    if (!customerId) {
      showError(strings.error.invalidCustomerId);
      return;
    }
    if (!beginAction('verifyOtp')) return;
    try {
      const response = await apiService.verifyOtp(
        customerId,
        otpCode,
        'mobile'
      );
      const responseData = extractApiData(response);

      if (response.success && responseData) {
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
          showSuccess(strings.success);
          setShowOtpModal(false);
          window.location.href = '/dashboard';
        } else {
          console.error('Missing required data in OTP response:', responseData);
          showError(strings.error.invalidOtp);
        }
      } else {
        showApiError(response, strings.error.invalidOtp);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      showError(getRequestErrorMessage(error));
    } finally {
      finishAction();
    }
  }, [
    beginAction,
    customerId,
    finishAction,
    getRequestErrorMessage,
    login,
    otpCode,
    showApiError,
    showError,
    showSuccess,
    strings,
  ]);

  const handleResendOtp = useCallback(async () => {
    if (actionInFlightRef.current || !canResendOtp || !customerId) return;
    if (!beginAction('resendOtp')) return;
    try {
      const response = await apiService.resendOtp(customerId, 'mobile');
      const responseData = extractApiData(response);

      if (response.success && responseData) {
        if (responseData.otp_sent) {
          showInfo(strings.otpResent);
          startResendCountdown();
        } else {
          showError(strings.error.resendFailed);
        }
      } else {
        showApiError(response, strings.error.resendFailed);
      }
    } catch (error) {
      console.error('OTP resend error:', error);
      showError(getRequestErrorMessage(error));
    } finally {
      finishAction();
    }
  }, [
    beginAction,
    canResendOtp,
    customerId,
    finishAction,
    getRequestErrorMessage,
    showApiError,
    showError,
    showInfo,
    startResendCountdown,
    strings,
  ]);

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
