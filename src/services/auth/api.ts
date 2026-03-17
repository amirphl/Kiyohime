import { getApiUrl, isProduction } from '../../config/environment';
import { AUTH_ENDPOINTS, OTP_CODE_LENGTH } from './constants';
import { AuthApiResponse } from './types';

const PHONE_REGEX = /^[\d+]+$/;

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

const authRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<AuthApiResponse<T>> => {
  const url = getApiUrl(endpoint);

  if (!isValidUrl(url)) {
    return {
      success: false,
      message: 'Invalid URL',
      error: {
        code: 'Invalid URL',
        details: null,
      },
    };
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
    signal: options.signal || AbortSignal.timeout(30000),
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response content type');
    }

    const data = await response.json();

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
    const errorMessage = isProduction()
      ? 'An error occurred'
      : error instanceof Error
        ? error.message
        : 'Unknown error';

    return {
      success: false,
      message: errorMessage,
      error: {
        code: errorMessage,
        details: null,
      },
    };
  }
};

export const login = async (identifier: string, password: string): Promise<AuthApiResponse> => {
  if (!identifier || typeof identifier !== 'string' || identifier.length > 255) {
    return {
      success: false,
      message: 'Invalid identifier',
      error: {
        code: 'Invalid identifier',
        details: null,
      },
    };
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return {
      success: false,
      message: 'Invalid password',
      error: {
        code: 'Invalid password',
        details: null,
      },
    };
  }

  let formattedIdentifier = identifier.trim();
  if (PHONE_REGEX.test(formattedIdentifier)) {
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

export const requestLoginOtp = async (identifier: string): Promise<AuthApiResponse> => {
  if (!identifier || typeof identifier !== 'string' || identifier.length > 255) {
    return {
      success: false,
      message: 'Invalid identifier',
      error: {
        code: 'Invalid identifier',
        details: null,
      },
    };
  }

  let formattedIdentifier = identifier.trim();
  if (!PHONE_REGEX.test(formattedIdentifier)) {
    return {
      success: false,
      message: 'Invalid mobile number',
      error: {
        code: 'Invalid mobile number',
        details: null,
      },
    };
  }

  formattedIdentifier = formatPhoneNumber(formattedIdentifier);

  return authRequest(AUTH_ENDPOINTS.loginOtp, {
    method: 'POST',
    body: JSON.stringify({
      identifier: formattedIdentifier,
    }),
  });
};

export const verifyLoginOtp = async (customerId: number, otpCode: string): Promise<AuthApiResponse> => {
  if (!customerId || typeof customerId !== 'number' || customerId <= 0) {
    return {
      success: false,
      message: 'Invalid customer id',
      error: {
        code: 'Invalid customer id',
        details: null,
      },
    };
  }

  if (!otpCode || typeof otpCode !== 'string' || otpCode.length !== OTP_CODE_LENGTH) {
    return {
      success: false,
      message: 'Invalid OTP code',
      error: {
        code: 'Invalid OTP code',
        details: null,
      },
    };
  }

  return authRequest(AUTH_ENDPOINTS.loginOtpVerify, {
    method: 'POST',
    body: JSON.stringify({
      customer_id: customerId,
      otp_code: otpCode,
    }),
  });
};
