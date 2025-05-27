import { useContext } from 'react';
import { ToastContext } from '../components/ToastContainer';
import { ToastType } from '../components/Toast';

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const showToast = (type: ToastType, message: string, duration?: number) => {
    context.showToast(type, message, duration);
  };

  const showSuccess = (message: string, duration?: number) => {
    showToast('success', message, duration);
  };

  const showError = (message: string, duration?: number) => {
    showToast('error', message, duration);
  };

  const showWarning = (message: string, duration?: number) => {
    showToast('warning', message, duration);
  };

  const showInfo = (message: string, duration?: number) => {
    showToast('info', message, duration);
  };

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
