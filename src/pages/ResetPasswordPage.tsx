import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import apiService from '../services/api';

interface ResetPasswordPageProps {
  onNavigateToLogin?: () => void;
  customerId?: number;
  maskedPhone?: string;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ 
  onNavigateToLogin, 
  customerId: propCustomerId, 
  maskedPhone: propMaskedPhone 
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<number | null>(propCustomerId || null);
  const [maskedPhone, setMaskedPhone] = useState<string>(propMaskedPhone || '');

  // Get customer ID from URL params if not provided as prop
  useEffect(() => {
    if (!customerId) {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('customer_id');
      const phone = urlParams.get('masked_phone');
      
      if (id) {
        setCustomerId(parseInt(id));
      }
      if (phone) {
        setMaskedPhone(phone);
      }
    }
  }, [customerId]);

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return t('resetPassword.validation.passwordMin');
    }
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      return t('resetPassword.validation.passwordStrength');
    }
    return '';
  };

  const validateForm = (): boolean => {
    if (!newPassword.trim()) {
      setError(t('resetPassword.validation.newPasswordRequired'));
      return false;
    }
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setError(t('resetPassword.validation.passwordMismatch'));
      return false;
    }
    
    if (otpCode.length !== 6) {
      setError(t('resetPassword.validation.otpRequired'));
      return false;
    }
    
    if (!customerId) {
      setError(t('resetPassword.error.noCustomerId'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await apiService.resetPassword(customerId!, newPassword, confirmPassword, otpCode);
      
      if (response.success && response.data) {
        setSuccess(true);
      } else {
        setError(response.error || t('resetPassword.error.resetFailed'));
      }
    } catch (error) {
      setError(t('resetPassword.error.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {t('resetPassword.success.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('resetPassword.success.subtitle')}
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-md p-6">
            <div className="text-center">
              <p className="text-sm text-green-800">
                {t('resetPassword.success.message')}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className={`w-full btn-primary flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t('resetPassword.success.backToLogin')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('resetPassword.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('resetPassword.subtitle')}
          </p>
          {maskedPhone && (
            <p className="mt-1 text-xs text-gray-500">
              {t('resetPassword.forPhone', { phone: maskedPhone })}
            </p>
          )}
        </div>

        {/* Reset Password Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* OTP Code */}
            <div>
              <label htmlFor="otpCode" className="block text-sm font-medium text-gray-700 mb-2">
                {t('resetPassword.otpCode')}
              </label>
              <input
                type="text"
                id="otpCode"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('resetPassword.otpHelp')}
              </p>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('resetPassword.newPassword')}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`input-field ${isRTL ? 'pl-10' : 'pr-10'}`}
                  placeholder={t('resetPassword.newPasswordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('resetPassword.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`input-field ${isRTL ? 'pl-10' : 'pr-10'}`}
                  placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                {t('resetPassword.requirements.title')}
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• {t('resetPassword.requirements.minLength')}</li>
                <li>• {t('resetPassword.requirements.letterAndDigit')}</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>{t('resetPassword.resetPassword')}</span>
                  <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <button
            type="button"
            onClick={onNavigateToLogin}
            className={`text-sm text-primary-600 hover:text-primary-700 flex items-center justify-center mx-auto ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t('resetPassword.backToLogin')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 