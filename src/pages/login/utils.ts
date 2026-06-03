import { getApiErrorMessage } from '../../utils/errorHandler';
import { LoginLocale, loginTranslations } from './translations';

type LoginStrings = (typeof loginTranslations)[LoginLocale];

const LOGIN_ERROR_MESSAGES = {
  INVALID_IDENTIFIER: 'invalidIdentifier',
  INVALID_PASSWORD: 'invalidPassword',
  INVALID_MOBILE_NUMBER: 'invalidMobile',
  INVALID_CUSTOMER_ID: 'invalidCustomerId',
  INVALID_OTP_CODE: 'invalidOtp',
  INVALID_URL: 'invalidRequest',
  INVALID_RESPONSE_CONTENT_TYPE: 'invalidResponse',
  NETWORK_ERROR: 'networkError',
  TIMEOUT_ERROR: 'timeoutError',
  UNAUTHORIZED: 'unauthorized',
} as const;

type LoginErrorCode = keyof typeof LOGIN_ERROR_MESSAGES;

const isLoginErrorCode = (value: string): value is LoginErrorCode =>
  value in LOGIN_ERROR_MESSAGES;

export const getLoginErrorMessage = (
  response: {
    success: boolean;
    message?: string;
    error?: { code?: string; details?: unknown };
  },
  language: LoginLocale,
  strings: LoginStrings,
  fallbackMessage: string
): string => {
  const errorCode = response.error?.code;

  if (errorCode && isLoginErrorCode(errorCode)) {
    return strings.error[LOGIN_ERROR_MESSAGES[errorCode]];
  }

  return getApiErrorMessage(response, language, fallbackMessage);
};
