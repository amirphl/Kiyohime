import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import { getApiErrorMessage } from '../../../utils/errorHandler';
import { login, requestLoginOtp, verifyLoginOtp } from '../../../services/auth/api';
import { OTP_CODE_LENGTH, OTP_RESEND_SECONDS } from '../../../services/auth/constants';
import { LoginFormValues, LoginMethod } from '../types';
import { loginTranslations } from '../translations';

interface UseLoginFormOptions {
  language: keyof typeof loginTranslations;
  strings: typeof loginTranslations.en;
}

const PHONE_REGEX = /^[\d+]+$/;

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
    mutationFn: (values: LoginFormValues) => login(values.identifier, values.password),
    retry: false,
  });

  const requestOtpMutation = useMutation({
    mutationFn: (identifier: string) => requestLoginOtp(identifier),
    retry: false,
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ customerId, otpCode }: { customerId: number; otpCode: string }) =>
      verifyLoginOtp(customerId, otpCode),
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

  const handleSubmit = form.handleSubmit(async values => {
    setErrorMessage('');

    if (loginMethod === 'password') {
      const response = await loginMutation.mutateAsync(values);
      if (response.success && response.data) {
        const responseData = response.data.data || response.data;
        const applied = applyLoginSuccess(responseData);
        if (!applied) {
          setErrorMessage(strings.error.invalidCredentials);
        }
      } else {
        const errorText = getApiErrorMessage(
          response,
          language,
          strings.error.invalidCredentials
        );
        setErrorMessage(errorText);
      }
      return;
    }

    const identifierValue = values.identifier?.trim();
    if (!identifierValue) {
      setErrorMessage(strings.validation.allFieldsRequired);
      showError(strings.validation.allFieldsRequired);
      return;
    }

    const response = await requestOtpMutation.mutateAsync(identifierValue);
    if (response.success) {
      const responseData = response.data?.data || response.data;
      const customerId = responseData?.customer_id ?? responseData?.customerId;
      if (!customerId || typeof customerId !== 'number') {
        const errorText = getApiErrorMessage(
          { success: false, error: { code: 'INVALID_CUSTOMER_ID' } },
          language,
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
      const errorText = getApiErrorMessage(
        response,
        language,
        strings.error.otpSendFailed
      );
      setErrorMessage(errorText);
      showError(errorText);
    }
  });

  const handleVerifyOtp = useCallback(async () => {
    if (otpCode.length !== OTP_CODE_LENGTH) {
      setErrorMessage(strings.validation.otpRequired);
      showError(strings.validation.otpRequired);
      return;
    }

    if (!otpCustomerId) {
      setErrorMessage(strings.error.otpVerifyFailed);
      showError(strings.error.otpVerifyFailed);
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
        setErrorMessage(strings.error.otpVerifyFailed);
        showError(strings.error.otpVerifyFailed);
      } else {
        setShowOtpModal(false);
      }
    } else {
      const errorText = getApiErrorMessage(
        response,
        language,
        strings.error.invalidOtp
      );
      setErrorMessage(errorText);
      showError(errorText);
    }
  }, [
    otpCode,
    otpCustomerId,
    verifyOtpMutation,
    applyLoginSuccess,
    language,
    strings,
    showError,
  ]);

  const handleResendOtp = useCallback(async () => {
    if (!canResendOtp || requestOtpMutation.isPending) return;

    const identifierValue = form.getValues('identifier').trim();
    const response = await requestOtpMutation.mutateAsync(identifierValue);
    if (response.success) {
      const responseData = response.data?.data || response.data;
      const customerId = responseData?.customer_id ?? responseData?.customerId;
      if (customerId && typeof customerId === 'number') {
        setOtpCustomerId(customerId);
      }
      startResendCountdown();
      showSuccess(response.message || strings.otpSent);
    } else {
      const errorText = getApiErrorMessage(
        response,
        language,
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
    language,
    strings,
  ]);

  const identifierRules = useMemo(() => {
    if (loginMethod === 'otp') {
      return {
        required: strings.validation.allFieldsRequired,
        validate: (value: string) =>
          PHONE_REGEX.test(value.trim()) || strings.validation.invalidMobile,
      };
    }
    return {
      required: strings.validation.allFieldsRequired,
    };
  }, [loginMethod, strings]);

  const setIdentifierValue = useCallback(
    (value: string) => {
      const nextValue = loginMethod === 'otp'
        ? value.replace(/[^\d+]/g, '')
        : value;
      form.setValue('identifier', nextValue, { shouldDirty: true, shouldValidate: true });
    },
    [form, loginMethod]
  );

  const isSubmitting = loginMutation.isPending || requestOtpMutation.isPending;
  const isOtpLoading = verifyOtpMutation.isPending || requestOtpMutation.isPending;

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
