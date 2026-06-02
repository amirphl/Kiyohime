import React from 'react';

interface AdminOtpStepProps {
  strings: {
    fields: {
      otpCode: string;
      otpPlaceholder: string;
    };
    actions: {
      verifyOtp: string;
      verifyingOtp: string;
      back: string;
      restart: string;
    };
  };
  otpCode: string;
  verifying: boolean;
  onOtpCodeChange: (value: string) => void;
  onVerify: (event: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  onRestart: () => void;
}

export const AdminOtpStep: React.FC<AdminOtpStepProps> = ({
  strings,
  otpCode,
  verifying,
  onOtpCodeChange,
  onVerify,
  onBack,
  onRestart,
}) => (
  <form onSubmit={onVerify} className='space-y-4'>
    <div>
      <label className='block text-sm font-medium mb-1'>
        {strings.fields.otpCode}
      </label>
      <input
        type='text'
        inputMode='numeric'
        autoComplete='one-time-code'
        maxLength={6}
        className='w-full border rounded px-3 py-2 text-center tracking-[0.35em]'
        value={otpCode}
        onChange={event => onOtpCodeChange(event.target.value)}
        placeholder={strings.fields.otpPlaceholder}
        disabled={verifying}
      />
    </div>

    <button
      type='submit'
      disabled={verifying}
      className='w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 disabled:opacity-60'
    >
      {verifying ? strings.actions.verifyingOtp : strings.actions.verifyOtp}
    </button>

    <div className='flex gap-3'>
      <button
        type='button'
        onClick={onBack}
        disabled={verifying}
        className='flex-1 border border-gray-300 rounded py-2 text-sm disabled:opacity-60'
      >
        {strings.actions.back}
      </button>
      <button
        type='button'
        onClick={onRestart}
        disabled={verifying}
        className='flex-1 border border-gray-300 rounded py-2 text-sm disabled:opacity-60'
      >
        {strings.actions.restart}
      </button>
    </div>
  </form>
);
