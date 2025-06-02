import React, { useState } from 'react';
import { Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';
import { getApiErrorMessage } from '../utils/errorHandler';

interface LoginPageProps {
  onNavigateToSignup?: () => void;
  onNavigateToForgotPassword?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToSignup,
  onNavigateToForgotPassword,
}) => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const { showSuccess } = useToast();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      setError(t('login.validation.allFieldsRequired'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.login(identifier, password);
      if (response.success && response.data) {
        // The API service wraps the server response, so we need to access response.data.data
        const responseData = response.data.data || response.data;

        // Store tokens and user data using auth context
        if (
          responseData.customer &&
          responseData.access_token &&
          responseData.refresh_token
        ) {
          login(
            {
              token: responseData.access_token,
              refresh_token: responseData.refresh_token,
            },
            responseData.customer
          );

          // Redirect to dashboard or show success
          showSuccess(t('login.success'));
          // Redirect to dashboard
          window.location.href = '/dashboard';
        } else {
          console.error(
            'Missing required data in login response:',
            responseData
          );
          setError(t('login.error.invalidCredentials'));
        }
      } else {
        // Use the new error handling utility
        const errorMessage = getApiErrorMessage(
          response,
          language,
          t('login.error.invalidCredentials')
        );
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(getApiErrorMessage(
        { success: false, error: { code: 'NETWORK_ERROR' } },
        language,
        t('login.error.networkError')
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center'>
            <Mail className='h-6 w-6 text-white' />
          </div>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            {t('login.title')}
          </h2>
          <p className='mt-2 text-sm text-gray-600'>{t('login.subtitle')}</p>
        </div>

        {/* Login Form */}
        <div className='bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200'>
          <form onSubmit={handleLogin} className='space-y-6'>
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
                {t('login.emailOrMobile')}
              </label>
              <input
                type='text'
                id='identifier'
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className='input-field'
                placeholder={t('login.emailOrMobilePlaceholder')}
                dir='ltr'
                required
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                {t('login.password')}
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`input-field ${isRTL ? 'pl-10' : 'pr-10'}`}
                  placeholder={t('login.passwordPlaceholder')}
                  dir='ltr'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5 text-gray-400' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-400' />
                  )}
                </button>
              </div>
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
                  <span>{t('login.signIn')}</span>
                  <ArrowRight
                    className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`}
                  />
                </>
              )}
            </button>

            <div className='text-center'>
              <button
                type='button'
                onClick={onNavigateToForgotPassword}
                className='text-sm text-primary-600 hover:text-primary-700'
              >
                {t('login.forgotPassword')}
              </button>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className='bg-white p-6 rounded-lg border border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            {t('login.features.title')}
          </h3>
          <div className='space-y-3'>
            <div
              className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}
            >
              <div className='w-2 h-2 bg-primary-600 rounded-full'></div>
              <span className='text-sm text-gray-600'>
                {t('login.features.targeted')}
              </span>
            </div>
            <div
              className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}
            >
              <div className='w-2 h-2 bg-primary-600 rounded-full'></div>
              <span className='text-sm text-gray-600'>
                {t('login.features.segmentation')}
              </span>
            </div>
            <div
              className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}
            >
              <div className='w-2 h-2 bg-primary-600 rounded-full'></div>
              <span className='text-sm text-gray-600'>
                {t('login.features.analytics')}
              </span>
            </div>
            <div
              className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}
            >
              <div className='w-2 h-2 bg-primary-600 rounded-full'></div>
              <span className='text-sm text-gray-600'>
                {t('login.features.compliance')}
              </span>
            </div>
          </div>
        </div>

        {/* Signup Link */}
        <div className='text-center'>
          <p className='text-sm text-gray-600'>
            {t('login.noAccount')}{' '}
            <button
              type='button'
              onClick={onNavigateToSignup}
              className='text-primary-600 hover:text-primary-700 font-medium'
            >
              {t('login.signUpHere')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
