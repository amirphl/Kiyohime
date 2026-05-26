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

export const isValidOtpCode = (value: string): boolean =>
  /^\d{6}$/.test(value);

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
    return details.join('\n');
  }

  const errorCode = response?.error?.code;
  if (errorCode && errorCode in strings.backend) {
    return strings.backend[errorCode as keyof typeof strings.backend];
  }

  const message = response?.message;
  if (message) {
    if (message === 'Invalid request body') {
      return strings.backend.invalidRequestBody;
    }
    if (message === 'Validation failed') {
      return strings.backend.validationFailed;
    }
    if (message === 'Invalid captcha') {
      return strings.backend.invalidCaptchaMessage;
    }
    if (message === 'OTP sent') {
      return strings.backend.otpSentMessage;
    }
    if (message === 'Login successful') {
      return strings.backend.loginSuccessfulMessage;
    }
  }

  return strings.errors[fallbackKey];
};
