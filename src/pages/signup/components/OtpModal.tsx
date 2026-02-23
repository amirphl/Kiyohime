import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { SignupTranslations } from '../translations';

interface Props {
  open: boolean;
  strings: SignupTranslations;
  isRTL: boolean;
  mobile: string;
  otpCode: string;
  onClose: () => void;
  onOtpChange: (value: string) => void;
  onVerify: () => void;
  canResendOtp: boolean;
  resendCountdown: number;
  onResend: () => void;
  isLoading: boolean;
  commonResendLabel: string;
  commonSecondsLabel: string;
}

const OtpModal: React.FC<Props> = ({
  open,
  strings,
  isRTL,
  mobile,
  otpCode,
  onClose,
  onOtpChange,
  onVerify,
  canResendOtp,
  resendCountdown,
  onResend,
  isLoading,
  commonResendLabel,
  commonSecondsLabel,
}) => {
  if (!open) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-md w-full p-6'>
        <div className={`flex justify-between items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h3 className='text-lg font-medium text-gray-900'>{strings.verifyMobile}</h3>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='text-center mb-6'>
          <CheckCircle className='mx-auto h-12 w-12 text-green-500 mb-4' />
          <p className='text-sm text-gray-600'>{strings.otpSent}</p>
          <p className='font-medium text-gray-900'>{mobile}</p>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {strings.enterVerificationCode}
            </label>
            <input
              type='text'
              value={otpCode}
              onChange={e => onOtpChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className='input-field text-center text-2xl tracking-widest'
              placeholder='000000'
              maxLength={6}
            />
          </div>

          <button
            onClick={onVerify}
            disabled={isLoading || otpCode.length !== 6}
            className='w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? (
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto'></div>
            ) : (
              strings.verifyCode
            )}
          </button>

          <div className='text-center space-y-2'>
            {canResendOtp ? (
              <button
                onClick={onResend}
                disabled={!canResendOtp || isLoading}
                className='text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {commonResendLabel}
              </button>
            ) : (
              <p className='text-sm text-gray-600'>
                {strings.resendIn} {resendCountdown}
                {commonSecondsLabel}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
