import React from 'react';
import { Mail } from 'lucide-react';

interface LoginHeaderProps {
  title: string;
  subtitle: string;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ title, subtitle }) => (
  <div className='text-center'>
    <div className='mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center'>
      <Mail className='h-6 w-6 text-white' />
    </div>
    <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>{title}</h2>
    <p className='mt-2 text-sm text-gray-600'>{subtitle}</p>
  </div>
);

export default LoginHeader;
