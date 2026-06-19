import { useCallback, useContext, useMemo } from 'react';
import { ToastContext } from '../components/ToastContainer';
import { ToastType } from '../components/Toast';

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { showToast: contextShowToast } = context;

  const showToast = useCallback(
    (type: ToastType, message: string, duration?: number) => {
      contextShowToast(type, message, duration);
    },
    [contextShowToast]
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showToast('success', message, duration);
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      showToast('error', message, duration);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showToast('warning', message, duration);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showToast('info', message, duration);
    },
    [showToast]
  );

  return useMemo(
    () => ({
      showToast,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    }),
    [showError, showInfo, showSuccess, showToast, showWarning]
  );
};
