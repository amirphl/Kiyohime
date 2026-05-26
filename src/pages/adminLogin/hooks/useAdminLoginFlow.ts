import { useCallback, useEffect, useRef, useState } from 'react';
import adminApi from '../../../services/adminApi';
import {
  AdminCaptchaInitResponse,
  AdminLoginInitResponse,
} from '../../../types/admin';
import { useToast } from '../../../hooks/useToast';
import { useNavigation } from '../../../contexts/NavigationContext';
import { ROUTES } from '../../../config/routes';
import { AdminLoginLocale, adminLoginTranslations } from '../translations';
import {
  clampCaptchaAngle,
  formatOtpExpiry,
  getAdminAuthMessage,
  isValidOtpCode,
  sanitizeOtpCode,
} from '../utils';

type AdminLoginStep = 'credentials' | 'otp';

interface UseAdminLoginFlowOptions {
  locale: AdminLoginLocale;
}

interface OtpChallengeState {
  challengeId: string;
  maskedPhone: string;
  otpExpiresAt: string | null;
  alreadySent: boolean;
}

let captchaCache: AdminCaptchaInitResponse | null = null;
let captchaRequest: Promise<AdminCaptchaInitResponse> | null = null;

export const useAdminLoginFlow = ({ locale }: UseAdminLoginFlowOptions) => {
  const strings = adminLoginTranslations[locale];
  const { showError, showSuccess } = useToast();
  const { navigate } = useNavigation();
  const showErrorRef = useRef(showError);
  const showSuccessRef = useRef(showSuccess);

  const [step, setStep] = useState<AdminLoginStep>('credentials');
  const [captcha, setCaptcha] = useState<AdminCaptchaInitResponse | null>(null);
  const [loadingCaptcha, setLoadingCaptcha] = useState(false);
  const [submittingLogin, setSubmittingLogin] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaAngle, setCaptchaAngle] = useState(0);
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [otpChallenge, setOtpChallenge] = useState<OtpChallengeState | null>(
    null
  );

  useEffect(() => {
    showErrorRef.current = showError;
    showSuccessRef.current = showSuccess;
  }, [showError, showSuccess]);

  const setError = useCallback((message: string) => {
    setErrorMessage(message);
    showErrorRef.current(message);
  }, []);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const loadCaptcha = useCallback(
    async (force = false) => {
      clearError();
      setLoadingCaptcha(true);

      try {
        if (force) {
          captchaCache = null;
          captchaRequest = null;
          setCaptcha(null);
        }

        if (captchaCache) {
          setCaptcha(captchaCache);
          setCaptchaAngle(0);
          return;
        }

        if (!captchaRequest) {
          captchaRequest = (async () => {
            const response = await adminApi.initCaptcha();
            if (!response.success || !response.data) {
              throw response;
            }
            return response.data;
          })();
        }

        const nextCaptcha = await captchaRequest;
        captchaCache = nextCaptcha;
        setCaptcha(nextCaptcha);
        setCaptchaAngle(0);
      } catch (error) {
        const message = getAdminAuthMessage(
          error as any,
          locale,
          'captchaInitFailed'
        );
        setError(message);
      } finally {
        setLoadingCaptcha(false);
        captchaRequest = null;
      }
    },
    [clearError, locale, setError]
  );

  useEffect(() => {
    if (adminApi.getAccessToken()) {
      navigate(ROUTES.ADMIN_SARDIS.path);
      return;
    }

    void loadCaptcha(false);
  }, [loadCaptcha, navigate]);

  const moveToOtpStep = useCallback(
    (response: AdminLoginInitResponse) => {
      setOtpChallenge({
        challengeId: response.challenge_id,
        maskedPhone: response.masked_phone,
        otpExpiresAt: response.otp_expires_at || null,
        alreadySent: Boolean(response.already_sent),
      });
      setOtpCode('');
      setStep('otp');
      clearError();
      showSuccessRef.current(
        getAdminAuthMessage(
          {
            success: true,
            message: 'OTP sent',
          },
          locale,
          'loginInitFailed'
        )
      );
    },
    [clearError, locale]
  );

  const submitCredentials = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (loadingCaptcha || submittingLogin) return;

      clearError();

      if (!captcha) {
        setError(strings.validation.captchaNotReady);
        return;
      }

      if (!username.trim()) {
        setError(strings.validation.usernameRequired);
        return;
      }

      if (!password.trim()) {
        setError(strings.validation.passwordRequired);
        return;
      }

      setSubmittingLogin(true);

      try {
        const response = await adminApi.verifyLogin({
          challenge_id: captcha.challenge_id,
          username: username.trim(),
          password,
          user_angle: clampCaptchaAngle(captchaAngle),
        });

        if (!response.success || !response.data) {
          setError(getAdminAuthMessage(response, locale, 'loginInitFailed'));
          await loadCaptcha(true);
          return;
        }

        moveToOtpStep(response.data);
      } finally {
        setSubmittingLogin(false);
      }
    },
    [
      captcha,
      captchaAngle,
      clearError,
      loadCaptcha,
      loadingCaptcha,
      locale,
      moveToOtpStep,
      password,
      setError,
      strings.validation.captchaNotReady,
      strings.validation.passwordRequired,
      strings.validation.usernameRequired,
      submittingLogin,
      username,
    ]
  );

  const submitOtp = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (verifyingOtp) return;

      clearError();

      if (!otpChallenge) {
        setError(strings.errors.otpVerifyFailed);
        return;
      }

      if (!otpCode) {
        setError(strings.validation.otpRequired);
        return;
      }

      if (!isValidOtpCode(otpCode)) {
        setError(strings.validation.otpInvalid);
        return;
      }

      setVerifyingOtp(true);

      try {
        const response = await adminApi.verifyLoginOtp({
          challenge_id: otpChallenge.challengeId,
          otp_code: otpCode,
        });

        if (!response.success || !response.data) {
          setError(getAdminAuthMessage(response, locale, 'otpVerifyFailed'));
          return;
        }

        showSuccessRef.current(strings.success.loginSuccessful);
        navigate(ROUTES.ADMIN_SARDIS.path);
      } finally {
        setVerifyingOtp(false);
      }
    },
    [
      clearError,
      locale,
      navigate,
      otpChallenge,
      otpCode,
      setError,
      strings.errors.otpVerifyFailed,
      strings.success.loginSuccessful,
      strings.validation.otpInvalid,
      strings.validation.otpRequired,
      verifyingOtp,
    ]
  );

  const restart = useCallback(async () => {
    setStep('credentials');
    setOtpChallenge(null);
    setOtpCode('');
    clearError();
    await loadCaptcha(true);
  }, [clearError, loadCaptcha]);

  const backToCredentials = useCallback(() => {
    setStep('credentials');
    setOtpCode('');
    clearError();
  }, [clearError]);

  return {
    strings,
    step,
    captcha,
    loadingCaptcha,
    submittingLogin,
    verifyingOtp,
    username,
    password,
    captchaAngle,
    otpCode,
    errorMessage,
    otpChallenge,
    setUsername,
    setPassword,
    setCaptchaAngle,
    setOtpCode: (value: string) => setOtpCode(sanitizeOtpCode(value)),
    loadCaptcha,
    submitCredentials,
    submitOtp,
    backToCredentials,
    restart,
    formatOtpExpiry: (value: string | null) =>
      value ? formatOtpExpiry(value, locale) : null,
  };
};
