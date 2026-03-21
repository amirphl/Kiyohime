import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../hooks/useLanguage';
import OtpModal from '../../components/auth/OtpModal';
import { loginTranslations, LoginLocale } from './translations';
import { useLoginForm } from './hooks';
import {
  LoginHeader,
  LoginMethodToggle,
  FormErrorAlert,
  IdentifierField,
  PasswordField,
  SubmitButton,
} from './components';
import { LoginPageProps } from './types';

const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToSignup,
  onNavigateToForgotPassword,
}) => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const strings = loginTranslations[language as LoginLocale] || loginTranslations.en;
  const {
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
  } = useLoginForm({ language: language as LoginLocale, strings });

  const identifierValue = form.watch('identifier');
  const passwordValue = form.watch('password');
  const { errors } = form.formState;

  return (
    <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <LoginHeader title={strings.title} subtitle={strings.subtitle} />

        <div className='bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200'>
          <LoginMethodToggle
            method={loginMethod}
            onChange={setLoginMethod}
            passwordLabel={strings.passwordLogin}
            otpLabel={strings.otpLogin}
          />

          <form onSubmit={handleSubmit} className='space-y-6'>
            <FormErrorAlert message={errorMessage} />

            <Controller
              name='identifier'
              control={form.control}
              rules={identifierRules}
              render={({ field }) => (
                <IdentifierField
                  label={loginMethod === 'otp' ? strings.mobileOnly : strings.emailOrMobile}
                  placeholder={loginMethod === 'otp' ? strings.mobileOnlyPlaceholder : strings.emailOrMobilePlaceholder}
                  value={field.value || ''}
                  onChange={setIdentifierValue}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  error={errors.identifier?.message as string | undefined}
                  isOtp={loginMethod === 'otp'}
                />
              )}
            />

            {loginMethod === 'password' && (
              <Controller
                name='password'
                control={form.control}
                rules={{ required: strings.validation.allFieldsRequired }}
                render={({ field }) => (
                  <PasswordField
                    value={passwordValue}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    error={errors.password?.message as string | undefined}
                    label={strings.password}
                    placeholder={strings.passwordPlaceholder}
                    showPassword={showPassword}
                    onToggleShow={() => setShowPassword(prev => !prev)}
                    isRTL={isRTL}
                  />
                )}
              />
            )}

            <SubmitButton
              isLoading={isSubmitting}
              label={loginMethod === 'password' ? strings.signIn : strings.sendOtp}
              showArrow={loginMethod === 'password'}
              isRTL={isRTL}
            />

            {loginMethod === 'password' && (
              <div className='text-center'>
                <button
                  type='button'
                  onClick={onNavigateToForgotPassword}
                  className='text-sm text-primary-600 hover:text-primary-700'
                >
                  {strings.forgotPassword}
                </button>
              </div>
            )}
          </form>
        </div>

        <div className='text-center'>
          <p className='text-sm text-gray-600'>
            {strings.noAccount}{' '}
            <button
              type='button'
              onClick={onNavigateToSignup}
              className='text-primary-600 hover:text-primary-700 font-medium'
            >
              {strings.signUpHere}
            </button>
          </p>
        </div>
      </div>

      <OtpModal
        open={showOtpModal}
        isRTL={isRTL}
        title={strings.otpLogin}
        otpSentLabel={strings.otpSent}
        enterCodeLabel={strings.enterOtpCode}
        verifyLabel={strings.verifyOtp}
        resendLabel={strings.resendOtp}
        resendInLabel={strings.resendIn}
        secondsLabel={t('common.seconds')}
        mobile={identifierValue || ''}
        otpCode={otpCode}
        onClose={() => setShowOtpModal(false)}
        onOtpChange={setOtpCode}
        onVerify={handleVerifyOtp}
        canResendOtp={canResendOtp}
        resendCountdown={resendCountdown}
        onResend={handleResendOtp}
        isLoading={isOtpLoading}
      />
    </div>
  );
};

export default LoginPage;
