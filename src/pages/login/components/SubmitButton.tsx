import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
  label: string;
  showArrow: boolean;
  isRTL: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  label,
  showArrow,
  isRTL,
}) => (
  <button
    type='submit'
    disabled={isLoading}
    className={`w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
  >
    {isLoading ? (
      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
    ) : (
      <>
        <span>{label}</span>
        {showArrow && <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />}
      </>
    )}
  </button>
);

export default SubmitButton;
