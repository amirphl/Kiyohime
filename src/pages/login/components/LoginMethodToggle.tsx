import React from 'react';
import { LoginMethod } from '../types';

interface LoginMethodToggleProps {
  method: LoginMethod;
  onChange: (method: LoginMethod) => void;
  passwordLabel: string;
  otpLabel: string;
}

const LoginMethodToggle: React.FC<LoginMethodToggleProps> = ({
  method,
  onChange,
  passwordLabel,
  otpLabel,
}) => (
  <div className='bg-gray-100 p-1 rounded-lg flex gap-2 mb-6'>
    <button
      type='button'
      onClick={() => onChange('password')}
      className={`flex-1 text-sm font-medium py-2 rounded-md transition ${method === 'password'
        ? 'bg-white text-gray-900 shadow'
        : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {passwordLabel}
    </button>
    <button
      type='button'
      onClick={() => onChange('otp')}
      className={`flex-1 text-sm font-medium py-2 rounded-md transition ${method === 'otp'
        ? 'bg-white text-gray-900 shadow'
        : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {otpLabel}
    </button>
  </div>
);

export default LoginMethodToggle;
