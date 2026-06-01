import { getApiUrl, isProduction } from '../../config/environment';
import { AUTH_ENDPOINTS, OTP_CODE_LENGTH } from './constants';
import { AuthApiResponse } from './types';
import {
  isPhoneLikeIdentifier,
  isValidEmailIdentifier,
  normalizeIdentifierInput,
} from './utils';

const AUTH_ERROR_CODES = {
  invalidUrl: 'INVALID_URL',
  invalidIdentifier: 'INVALID_IDENTIFIER',
  invalidPassword: 'INVALID_PASSWORD',
  invalidMobileNumber: 'INVALID_MOBILE_NUMBER',
  invalidCustomerId: 'INVALID_CUSTOMER_ID',
  invalidOtpCode: 'INVALID_OTP_CODE',
  invalidResponseContentType: 'INVALID_RESPONSE_CONTENT_TYPE',
  networkError: 'NETWORK_ERROR',
  timeoutError: 'TIMEOUT_ERROR',
} as const;

const createAuthErrorResponse = <T>(
  code: string,
  message = code,
  details: unknown = null
): AuthApiResponse<T> => ({
  success: false,
  message,
  error: {
    code,
    details,
  },
});

const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem('access_token');
};

const createTimeoutSignal = (
  timeoutMs: number,
  signal?: AbortSignal | null
): AbortSignal => {
  if (!signal) {
    return AbortSignal.timeout(timeoutMs);
  }

  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  const clearTimer = () => globalThis.clearTimeout(timeoutId);

  if (signal.aborted) {
    clearTimer();
    controller.abort(signal.reason);
    return controller.signal;
  }

  signal.addEventListener(
    'abort',
    () => {
      clearTimer();
      controller.abort(signal.reason);
    },
    { once: true }
  );

  controller.signal.addEventListener('abort', clearTimer, { once: true });

  return controller.signal;
};

const parseJsonResponse = async (response: Response): Promise<any | null> => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
};

const formatPhoneNumber = (phoneNumber: string): string => {
  let cleaned = phoneNumber.replace(/^\+98/, '').replace(/^0+/, '');

  if (cleaned.startsWith('9')) {
    return `+98${cleaned}`;
  }

  if (cleaned.startsWith('98')) {
    return `+${cleaned}`;
  }

  return `+98${cleaned}`;
};

const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    if (isProduction() && urlObj.protocol !== 'https:') {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

const authRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<AuthApiResponse<T>> => {
  const url = getApiUrl(endpoint);

  if (!isValidUrl(url)) {
    return createAuthErrorResponse(AUTH_ERROR_CODES.invalidUrl);
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    signal: createTimeoutSignal(30000, options.signal),
  };

  const accessToken = getStoredAccessToken();
  if (
    accessToken &&
    !(config.headers as Record<string, string>).Authorization
  ) {
    (config.headers as Record<string, string>).Authorization =
      `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await parseJsonResponse(response);
    if (data === null) {
      return createAuthErrorResponse(
        AUTH_ERROR_CODES.invalidResponseContentType
      );
    }

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      if (data.error && data.error.code) {
        errorMessage = data.error.code;
      } else if (data.message) {
        errorMessage = data.message;
      }

      return {
        success: false,
        message: errorMessage,
        error: {
          code: errorMessage,
          details: data.error?.details,
        },
      };
    }

    return {
      success: true,
      message: data.message || 'Success',
      data: data.data,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return createAuthErrorResponse(AUTH_ERROR_CODES.timeoutError);
    }

    const errorMessage =
      error instanceof TypeError
        ? AUTH_ERROR_CODES.networkError
        : isProduction()
          ? AUTH_ERROR_CODES.networkError
          : error instanceof Error
            ? error.message
            : AUTH_ERROR_CODES.networkError;

    return createAuthErrorResponse(
      errorMessage === AUTH_ERROR_CODES.networkError
        ? AUTH_ERROR_CODES.networkError
        : 'UNKNOWN_ERROR',
      errorMessage
    );
  }
};

export const login = async (
  identifier: string,
  password: string
): Promise<AuthApiResponse> => {
  if (
    !identifier ||
    typeof identifier !== 'string' ||
    identifier.length > 255
  ) {
    return createAuthErrorResponse(AUTH_ERROR_CODES.invalidIdentifier);
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return createAuthErrorResponse(AUTH_ERROR_CODES.invalidPassword);
  }

  let formattedIdentifier = normalizeIdentifierInput(identifier);
  if (!formattedIdentifier || formattedIdentifier.length > 255) {
    return createAuthErrorResponse(AUTH_ERROR_CODES.invalidIdentifier);
  }

  const isPhoneIdentifier = isPhoneLikeIdentifier(formattedIdentifier);
  const isEmailIdentifier = isValidEmailIdentifier(formattedIdentifier);
  if (!isPhoneIdentifier && !isEmailIdentifier) {
    return createAuthErrorResponse(AUTH_ERROR_CODES.invalidIdentifier);
  }

  if (isPhoneIdentifier) {
    formattedIdentifier = formatPhoneNumber(formattedIdentifier);
  }

  return authRequest(AUTH_ENDPOINTS.login, {
    method: 'POST',
    body: JSON.stringify({
      identifier: formattedIdentifier,
      password,
    }),
  });
};

export const requestLoginOtp = async (
  identifier: string
): Promise<AuthApiResponse> => {
  if (
    !identifier ||
    typeof identifier !== 'string' ||
    identifier.length > 255
  ) {
    return createAuthErrorResponse(AUTH_ERROR_CODES.invalidIdentifier);
  }

  let formattedIdentifier = normalizeIdentifierInput(identifier);
  if (!isPhoneLikeIdentifier(formattedIdentifier)) {
    return createAuthErrorResponse(AUTH_ERROR_CODES.invalidMobileNumber);
  }

  formattedIdentifier = formatPhoneNumber(formattedIdentifier);

  return authRequest(AUTH_ENDPOINTS.loginOtp, {
    method: 'POST',
    body: JSON.stringify({
      identifier: formattedIdentifier,
    }),
  });
};

export const verifyLoginOtp = async (
  customerId: number,
  otpCode: string
): Promise<AuthApiResponse> => {
  if (!customerId || typeof customerId !== 'number' || customerId <= 0) {
    return createAuthErrorResponse(AUTH_ERROR_CODES.invalidCustomerId);
  }

  if (
    !otpCode ||
    typeof otpCode !== 'string' ||
    otpCode.length !== OTP_CODE_LENGTH
  ) {
    return createAuthErrorResponse(AUTH_ERROR_CODES.invalidOtpCode);
  }

  return authRequest(AUTH_ENDPOINTS.loginOtpVerify, {
    method: 'POST',
    body: JSON.stringify({
      customer_id: customerId,
      otp_code: otpCode,
    }),
  });
};
