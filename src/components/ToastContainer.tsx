import React, { useState, useCallback } from 'react';
import Toast, { ToastType } from './Toast';
import { useLanguage } from '../hooks/useLanguage';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContainerProps {
  children: React.ReactNode;
}

export const ToastContext = React.createContext<{
  showToast: (type: ToastType, message: string, duration?: number) => void;
}>({
  showToast: () => {},
});

export const ToastProvider: React.FC<ToastContainerProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { isRTL } = useLanguage();

  const showToast = useCallback((type: ToastType, message: string, duration?: number) => {
    const id = Date.now().toString();
    const newToast: ToastItem = {
      id,
      type,
      message,
      duration,
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className={`fixed top-4 z-50 flex flex-col gap-2 ${
          isRTL ? 'left-4' : 'right-4'
        }`}
      >
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider; 