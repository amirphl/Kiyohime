import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import apiService from '../services/api';
import { getApiErrorMessage } from '../utils/errorHandler';
import { forgotPasswordI18n } from '../locales/forgotPassword';

interface ForgotPasswordPageProps {
  onNavigateToLogin?: () => void;
  onNavigateToResetPassword?: (customerId: number, maskedPhone: string) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigateToLogin,
  onNavigateToResetPassword,
}) => {
  const { language } = useLanguage();
  const { isRTL } = useLanguage();
  const forgotPasswordT = forgotPasswordI18n[language as keyof typeof forgotPasswordI18n] || forgotPasswordI18n.en;

  const formatMessage = (template: string, params: Record<string, any>) =>
    template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ''));

  const [identifier, setIdentifier] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<number | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [maskedPhone, setMaskedPhone] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setError(forgotPasswordT.validation.identifierRequired);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.forgotPassword(identifier);

      if (response.success && response.data) {
        console.log("delete this", response.data?.customer_id);
        console.log("delete this", response.data?.masked_phone);
        setSuccess(true);
        setCustomerId(response.data?.customer_id);
        setMaskedPhone(response.data?.masked_phone);
      } else {
        // Use the new error handling utility
        const errorMessage = getApiErrorMessage(
          response,
          language,
          forgotPasswordT.error.requestFailed
        );
        setError(errorMessage);
      }
    } catch (error) {
      setError(getApiErrorMessage(
        { success: false, error: { code: 'NETWORK_ERROR' } },
        language,
        forgotPasswordT.error.networkError
      ));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          {/* Header */}
          <div className='text-center'>
            <div className='mx-auto h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center'>
              <CheckCircle className='h-6 w-6 text-white' />
            </div>
            <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
              {forgotPasswordT.success.title}
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              {forgotPasswordT.success.subtitle}
            </p>
          </div>

          {/* Success Message */}
          <div className='bg-green-50 border border-green-200 rounded-md p-6'>
            <div className='text-center'>
              <p className='text-sm text-green-800 mb-4'>
                {formatMessage(forgotPasswordT.success.message, { phone: maskedPhone })}
              </p>
              <p className='text-xs text-green-600'>
                {formatMessage(forgotPasswordT.success.expiresIn, { minutes: 5 })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='space-y-4'>
            <button
              type='button'
              onClick={() => {
                if (onNavigateToResetPassword && customerId) {
                  onNavigateToResetPassword(customerId, maskedPhone);
                }
              }}
              className={`w-full btn-primary flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
            >
              <span>{forgotPasswordT.success.resetPassword}</span>
              <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>

            <button
              type='button'
              onClick={() => {
                setSuccess(false);
                setIdentifier('');
                setCustomerId(null);
                setMaskedPhone('');
              }}
              className={`w-full btn-secondary flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
            >
              <span>{forgotPasswordT.success.tryAgain}</span>
              <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>

            <button
              type='button'
              onClick={onNavigateToLogin}
              className={`w-full btn-secondary flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{forgotPasswordT.success.backToLogin}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center'>
            <Mail className='h-6 w-6 text-white' />
          </div>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            {forgotPasswordT.title}
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            {forgotPasswordT.subtitle}
          </p>
        </div>

        {/* Forgot Password Form */}
        <div className='bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <div className='bg-red-50 border border-red-200 rounded-md p-4'>
                <p className='text-sm text-red-600'>{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor='identifier'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                {forgotPasswordT.emailOrMobile}
              </label>
              <input
                type='text'
                id='identifier'
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className='input-field'
                placeholder={forgotPasswordT.emailOrMobilePlaceholder}
                required
              />
              <p className='mt-1 text-xs text-gray-500'>
                {forgotPasswordT.helpText}
              </p>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className={`w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
            >
              {isLoading ? (
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
              ) : (
                <>
                  <span>{forgotPasswordT.sendResetLink}</span>
                  <ArrowRight
                    className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`}
                  />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Login */}
        <div className='text-center'>
          <button
            type='button'
            onClick={onNavigateToLogin}
            className={`text-sm text-primary-600 hover:text-primary-700 flex items-center justify-center mx-auto ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{forgotPasswordT.backToLogin}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
