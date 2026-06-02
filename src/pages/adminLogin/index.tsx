import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { AdminCaptchaStep, AdminOtpStep } from './components';
import { AdminLoginLocale } from './translations';
import { useAdminLoginFlow } from './hooks/useAdminLoginFlow';

const AdminLoginPage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const locale: AdminLoginLocale = language === 'fa' ? 'fa' : 'en';
  const {
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
    setOtpCode,
    loadCaptcha,
    submitCredentials,
    submitOtp,
    backToCredentials,
    restart,
  } = useAdminLoginFlow({ locale });

  const isOtpStep = step === 'otp' && otpChallenge;

  // Show the banner for errors unrelated to captcha load failures so that the
  // captcha-area inline message isn't duplicated. When captcha is missing and
  // we're on the credentials step, the error is shown only inside the captcha
  // section where it is most actionable.
  const showBannerError = errorMessage && (isOtpStep || captcha !== null);
  const captchaAreaError = !captcha && !isOtpStep ? errorMessage : null;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className='min-h-screen flex items-center justify-center bg-gray-50 p-4'
    >
      <div className='w-full max-w-md bg-white shadow-md rounded-lg p-6'>
        {!isOtpStep && (
          <div className='text-center mb-6'>
            <h1 className='text-xl font-semibold'>{strings.title}</h1>
            <p className='mt-2 text-sm text-gray-600'>{strings.subtitle}</p>
          </div>
        )}

        {showBannerError && (
          <div className='mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 whitespace-pre-line'>
            {errorMessage}
          </div>
        )}

        {isOtpStep ? (
          <AdminOtpStep
            strings={strings}
            otpCode={otpCode}
            verifying={verifyingOtp}
            onOtpCodeChange={setOtpCode}
            onVerify={submitOtp}
            onBack={backToCredentials}
            onRestart={restart}
          />
        ) : (
          <AdminCaptchaStep
            locale={locale}
            strings={strings}
            username={username}
            password={password}
            captcha={captcha}
            angle={captchaAngle}
            loadingCaptcha={loadingCaptcha}
            submitting={submittingLogin}
            captchaError={captchaAreaError}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onAngleChange={setCaptchaAngle}
            onReloadCaptcha={() => {
              void loadCaptcha(true);
            }}
            onSubmit={submitCredentials}
          />
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;
