import React from 'react';

interface FormErrorAlertProps {
  message?: string;
}

const FormErrorAlert: React.FC<FormErrorAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className='bg-red-50 border border-red-200 rounded-md p-4'>
      <p className='text-sm text-red-600'>{message}</p>
    </div>
  );
};

export default FormErrorAlert;
