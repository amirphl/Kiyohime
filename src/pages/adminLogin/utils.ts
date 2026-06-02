import { ApiResponse } from '../../services/api';
import { AdminLoginLocale, adminLoginTranslations } from './translations';

const OTP_CODE_LENGTH = 6;

export const toCaptchaImageSrc = (raw?: string | null): string => {
  if (!raw) return '';
  return raw.startsWith('data:image') ? raw : `data:image/png;base64,${raw}`;
};

export const clampCaptchaAngle = (value: number): number => {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 360) return 360;
  return Math.round(value);
};

export const sanitizeOtpCode = (value: string): string =>
  value.replace(/\D/g, '').slice(0, OTP_CODE_LENGTH);

export const isValidOtpCode = (value: string): boolean => /^\d{6}$/.test(value);

export const formatOtpExpiry = (
  isoDate: string,
  locale: AdminLoginLocale
): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export const getAdminAuthMessage = (
  response: ApiResponse<unknown> | null | undefined,
  locale: AdminLoginLocale,
  fallbackKey:
    | 'captchaInitFailed'
    | 'loginInitFailed'
    | 'otpVerifyFailed'
    | 'unknown'
): string => {
  const strings = adminLoginTranslations[locale];
  const details = response?.error?.details;

  if (Array.isArray(details) && details.length > 0) {
    return details
      .map(detail => translateAdminAuthText(detail, strings))
      .join('\n');
  }

  const errorCode = response?.error?.code;
  if (errorCode && errorCode in strings.backend) {
    return strings.backend[errorCode as keyof typeof strings.backend];
  }

  const message = response?.message;
  if (message) {
    return translateAdminAuthText(message, strings);
  }

  return strings.errors[fallbackKey];
};

const translateAdminAuthText = (
  value: unknown,
  strings: (typeof adminLoginTranslations)[AdminLoginLocale]
): string => {
  if (typeof value !== 'string' || !value.trim()) {
    return strings.errors.unknown;
  }

  const normalizedValue = value.trim();
  const exactBackendMatch =
    strings.backend[normalizedValue as keyof typeof strings.backend];
  if (exactBackendMatch) {
    return exactBackendMatch;
  }

  const exactErrorMatch =
    strings.errors[normalizedValue as keyof typeof strings.errors];
  if (exactErrorMatch) {
    return exactErrorMatch;
  }

  const messageMap: Record<string, string> = {
    'Invalid request body': strings.backend.invalidRequestBody,
    'Validation failed': strings.backend.validationFailed,
    'Invalid captcha': strings.backend.invalidCaptchaMessage,
    'OTP sent': strings.backend.otpSentMessage,
    'Login successful': strings.backend.loginSuccessfulMessage,
    'OTP verification failed': strings.backend.otpVerifyFailedMessage,
    'Login failed': strings.backend.loginFailedMessage,
    'Captcha init failed': strings.backend.captchaInitFailedMessage,
    'Network error': strings.errors.networkError,
    'An error occurred': strings.errors.unknown,
    'Invalid login response': strings.errors.invalidResponse,
    'Invalid OTP response': strings.errors.invalidResponse,
  };

  return messageMap[normalizedValue] ?? normalizedValue;
};
