import React from 'react';
import { ArrowRight, User } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../hooks/useLanguage';
import { jobCategoryI18n, JobCategoryLocale } from '../../locales/jobCategory';
import {
  AccountTypeSelect,
  AgencyCodeField,
  CategoryJobFields,
  CompanyFields,
  CredentialsFields,
  PersonalInfoFields,
  TermsCheckbox,
} from './components';
import OtpModal from '../../components/auth/OtpModal';
import { signupTranslations, SignupLocale } from './translations';
import { useSignupForm } from './useSignupForm';

interface SignupPageProps {
  onNavigateToLogin?: () => void;
  onNavigateToLoginWithOtp?: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigateToLogin, onNavigateToLoginWithOtp }) => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const strings = signupTranslations[language as SignupLocale] || signupTranslations.en;
  const {
    formData,
    errors,
    isLoading,
    showPassword,
    showConfirmPassword,
    acceptedTerms,
    setAcceptedTerms,
    setShowPassword,
    setShowConfirmPassword,
    handleInputChange,
    handleSubmit,
    isCompanyAccount,
    showOtpModal,
    otpCode,
    setOtpCode,
    handleOtpVerification,
    canResendOtp,
    resendCountdown,
    handleResendOtp,
    setShowOtpModal,
  } = useSignupForm({ language, strings });

  const categories = (jobCategoryI18n[language as JobCategoryLocale] || jobCategoryI18n.en) as Record<
    string,
    readonly string[]
  >;

  const requiredLabel = <span className='text-red-500'>{t('common.required')}</span>;

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-2xl mx-auto'>
        <div className='text-center mb-8'>
          <div className='mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center'>
            <User className='h-6 w-6 text-white' />
          </div>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>{strings.title}</h2>
          <p className='mt-2 text-sm text-gray-600'>{strings.subtitle}</p>
        </div>

        <div className='bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <AccountTypeSelect
              value={formData.accountType}
              onChange={handleInputChange}
              error={errors.accountType}
              requiredLabel={requiredLabel}
              strings={strings}
            />

            {isCompanyAccount && (
              <CompanyFields
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
                requiredLabel={requiredLabel}
                strings={strings}
                isRTL={isRTL}
              />
            )}

            {formData.accountType !== 'marketing_agency' && (
              <CategoryJobFields
                category={formData.jobCategory}
                job={formData.job}
                errors={{ category: errors.jobCategory, job: errors.job }}
                onChange={handleInputChange}
                requiredLabel={requiredLabel}
                strings={{
                  categoryHeader: strings.categoryHeader,
                  category: strings.category,
                  selectCategory: strings.selectCategory,
                  job: strings.job,
                  selectJob: strings.selectJob,
                }}
                categories={categories}
              />
            )}

            <PersonalInfoFields
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              requiredLabel={requiredLabel}
              strings={strings}
              isCompanyAccount={isCompanyAccount}
              isRTL={isRTL}
            />

            <CredentialsFields
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              requiredLabel={requiredLabel}
              strings={strings}
              isRTL={isRTL}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              onTogglePassword={() => setShowPassword(prev => !prev)}
              onToggleConfirmPassword={() => setShowConfirmPassword(prev => !prev)}
            />

            {formData.accountType !== 'marketing_agency' && (
              <AgencyCodeField
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
                strings={strings}
              />
            )}

            <TermsCheckbox accepted={acceptedTerms} onChange={setAcceptedTerms} strings={strings} />

            <button
              type='submit'
              disabled={isLoading || !acceptedTerms}
              className={`w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
            >
              {isLoading ? (
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
              ) : (
                <>
                  <span>{strings.createAccount}</span>
                  <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                {strings.haveAccount}{' '}
                <button
                  type='button'
                  onClick={onNavigateToLogin}
                  className='text-primary-600 hover:text-primary-700 font-medium'
                >
                  {strings.signInHere}
                </button>
              </p>
              <p className='text-sm text-gray-600 mt-2'>
                <button
                  type='button'
                  onClick={onNavigateToLoginWithOtp || onNavigateToLogin}
                  className='text-primary-600 hover:text-primary-700 font-medium'
                >
                  {strings.signInWithOtp}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      <OtpModal
        open={showOtpModal}
        isRTL={isRTL}
        title={strings.verifyMobile}
        otpSentLabel={strings.otpSent}
        enterCodeLabel={strings.enterVerificationCode}
        verifyLabel={strings.verifyCode}
        resendLabel={t('common.resend')}
        resendInLabel={strings.resendIn}
        secondsLabel={t('common.seconds')}
        mobile={formData.representativeMobile}
        otpCode={otpCode}
        onClose={() => setShowOtpModal(false)}
        onOtpChange={setOtpCode}
        onVerify={handleOtpVerification}
        canResendOtp={canResendOtp}
        resendCountdown={resendCountdown}
        onResend={handleResendOtp}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SignupPage;
