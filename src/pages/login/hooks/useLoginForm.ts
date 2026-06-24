import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import {
  login,
  requestLoginOtp,
  verifyLoginOtp,
} from '../../../services/auth/api';
import {
  OTP_CODE_LENGTH,
  OTP_RESEND_SECONDS,
} from '../../../services/auth/constants';
import {
  isValidOtpIdentifier,
  normalizeIdentifierInput,
  parsePositiveInteger,
  sanitizeOtpIdentifierInput,
} from '../../../services/auth/utils';
import { LoginFormValues, LoginMethod } from '../types';
import { loginTranslations } from '../translations';
import { getLoginErrorMessage } from '../utils';

type LoginStrings = (typeof loginTranslations)[keyof typeof loginTranslations];

interface UseLoginFormOptions {
  language: keyof typeof loginTranslations;
  strings: LoginStrings;
}

export const useLoginForm = ({ language, strings }: UseLoginFormOptions) => {
  const { login: handleLogin } = useAuth();
  const { showSuccess, showError } = useToast();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>(() => {
    if (typeof window === 'undefined') return 'password';
    const method = new URLSearchParams(window.location.search).get('method');
    return method === 'otp' ? 'otp' : 'password';
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpCustomerId, setOtpCustomerId] = useState<number | null>(null);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(OTP_RESEND_SECONDS);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const form = useForm<LoginFormValues>({
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const resetCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  useEffect(() => () => resetCountdown(), [resetCountdown]);

  useEffect(() => {
    setErrorMessage('');
    form.clearErrors();
    form.setValue(
      'identifier',
      sanitizeOtpIdentifierInput(form.getValues('identifier')),
      {
        shouldDirty: false,
        shouldValidate: false,
      }
    );
    if (loginMethod === 'otp') {
      form.setValue('password', '');
    } else {
      setOtpCode('');
      setShowOtpModal(false);
      setOtpCustomerId(null);
      resetCountdown();
      setCanResendOtp(false);
      setResendCountdown(OTP_RESEND_SECONDS);
    }
  }, [form, loginMethod, resetCountdown]);

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

  const loginMutation = useMutation({
    mutationFn: (values: LoginFormValues) =>
      login(values.identifier, values.password),
    retry: false,
  });

  const requestOtpMutation = useMutation({
    mutationFn: (identifier: string) => requestLoginOtp(identifier),
    retry: false,
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({
      customerId,
      otpCode,
    }: {
      customerId: number;
      otpCode: string;
    }) => verifyLoginOtp(customerId, otpCode),
    retry: false,
  });

  const applyLoginSuccess = useCallback(
    (responseData: any) => {
      if (
        responseData?.customer &&
        responseData?.access_token &&
        responseData?.refresh_token
      ) {
        handleLogin(
          {
            token: responseData.access_token,
            refresh_token: responseData.refresh_token,
          },
          responseData.customer
        );
        showSuccess(strings.success);
        window.location.href = '/dashboard';
        return true;
      }
      return false;
    },
    [handleLogin, showSuccess, strings.success]
  );

  const resolveErrorMessage = useCallback(
    (
      response: {
        success: boolean;
        message?: string;
        error?: { code?: string; details?: unknown };
      },
      fallbackMessage: string
    ) => getLoginErrorMessage(response, language, strings, fallbackMessage),
    [language, strings]
  );

  const handleSubmit = form.handleSubmit(async values => {
    if (loginMutation.isPending || requestOtpMutation.isPending) {
      return;
    }

    setErrorMessage('');

    if (loginMethod === 'password') {
      const response = await loginMutation.mutateAsync({
        ...values,
        identifier: normalizeIdentifierInput(values.identifier),
      });
      if (response.success && response.data) {
        const responseData = response.data.data || response.data;
        const applied = applyLoginSuccess(responseData);
        if (!applied) {
          const errorText = strings.error.invalidResponse;
          setErrorMessage(errorText);
          showError(errorText);
        }
      } else {
        const errorText = resolveErrorMessage(
          response,
          strings.error.invalidCredentials
        );
        setErrorMessage(errorText);
        showError(errorText);
      }
      return;
    }

    const identifierValue = normalizeIdentifierInput(values.identifier || '');
    if (!identifierValue) {
      setErrorMessage(strings.validation.allFieldsRequired);
      showError(strings.validation.allFieldsRequired);
      return;
    }

    const response = await requestOtpMutation.mutateAsync(identifierValue);
    if (response.success) {
      const responseData = response.data?.data || response.data;
      const customerId = parsePositiveInteger(
        responseData?.customer_id ?? responseData?.customerId
      );
      if (!customerId) {
        const errorText = resolveErrorMessage(
          { success: false, error: { code: 'INVALID_CUSTOMER_ID' } },
          strings.error.otpSendFailed
        );
        setErrorMessage(errorText);
        showError(errorText);
        return;
      }
      setOtpCustomerId(customerId);
      setShowOtpModal(true);
      startResendCountdown();
      showSuccess(response.message || strings.otpSent);
    } else {
      const errorText = resolveErrorMessage(
        response,
        strings.error.otpSendFailed
      );
      setErrorMessage(errorText);
      showError(errorText);
    }
  });

  const handleVerifyOtp = useCallback(async () => {
    if (verifyOtpMutation.isPending) {
      return;
    }

    if (otpCode.length !== OTP_CODE_LENGTH) {
      setErrorMessage(strings.validation.otpRequired);
      showError(strings.validation.otpRequired);
      return;
    }

    if (!otpCustomerId) {
      const errorText = strings.error.invalidCustomerId;
      setErrorMessage(errorText);
      showError(errorText);
      return;
    }

    const response = await verifyOtpMutation.mutateAsync({
      customerId: otpCustomerId,
      otpCode,
    });

    if (response.success && response.data) {
      const responseData = response.data.data || response.data;
      const applied = applyLoginSuccess(responseData);
      if (!applied) {
        const errorText = strings.error.invalidResponse;
        setErrorMessage(errorText);
        showError(errorText);
      } else {
        setShowOtpModal(false);
      }
    } else {
      const errorText = resolveErrorMessage(response, strings.error.invalidOtp);
      setErrorMessage(errorText);
      showError(errorText);
    }
  }, [
    otpCode,
    otpCustomerId,
    verifyOtpMutation,
    applyLoginSuccess,
    showError,
    resolveErrorMessage,
    strings,
  ]);

  const handleResendOtp = useCallback(async () => {
    if (!canResendOtp || requestOtpMutation.isPending) return;

    const identifierValue = normalizeIdentifierInput(
      form.getValues('identifier')
    );
    const response = await requestOtpMutation.mutateAsync(identifierValue);
    if (response.success) {
      const responseData = response.data?.data || response.data;
      const customerId = parsePositiveInteger(
        responseData?.customer_id ?? responseData?.customerId
      );
      if (customerId) {
        setOtpCustomerId(customerId);
      }
      startResendCountdown();
      showSuccess(response.message || strings.otpSent);
    } else {
      const errorText = resolveErrorMessage(
        response,
        strings.error.otpSendFailed
      );
      setErrorMessage(errorText);
      showError(errorText);
    }
  }, [
    canResendOtp,
    form,
    requestOtpMutation,
    startResendCountdown,
    showSuccess,
    showError,
    resolveErrorMessage,
    strings,
  ]);

  const identifierRules = useMemo(() => {
    return {
      required: strings.validation.allFieldsRequired,
      validate: (value: string) =>
        isValidOtpIdentifier(value) || strings.validation.invalidMobile,
    };
  }, [strings]);

  const setIdentifierValue = useCallback(
    (value: string) => {
      const nextValue = sanitizeOtpIdentifierInput(value);
      form.setValue('identifier', nextValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [form]
  );

  const isSubmitting = loginMutation.isPending || requestOtpMutation.isPending;
  const isOtpLoading =
    verifyOtpMutation.isPending || requestOtpMutation.isPending;

  return {
    form,
    loginMethod,
    setLoginMethod,
    showPassword,
    setShowPassword,
    errorMessage,
    handleSubmit,
    identifierRules,
    setIdentifierValue,
    showOtpModal,
    setShowOtpModal,
    otpCode,
    setOtpCode,
    handleVerifyOtp,
    canResendOtp,
    resendCountdown,
    handleResendOtp,
    isSubmitting,
    isOtpLoading,
  };
};
