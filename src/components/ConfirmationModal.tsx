import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message?: string;
  confirmText: string;
  cancelText: string;
  children?: React.ReactNode;
  loading?: boolean; // optional loading state for confirm action
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText,
  cancelText,
  children,
  loading = false,
}) => {
  const { isRTL } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {title}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children ? (
            children
          ) : (
            <p className="text-gray-600 whitespace-pre-line">
              {message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className={`px-6 py-4 border-t border-gray-200 flex ${isRTL ? 'flex-row-reverse' : 'flex-row'
          } justify-end space-x-3`}>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
          >
            {loading && (
              <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'en' | 'fa';
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ isOpen, onClose, locale }) => {
  if (!isOpen) return null;
  const isFa = locale === 'fa';
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-md w-full p-6'>
        <div className={`flex justify-between items-center mb-4 ${isFa ? 'flex-row-reverse' : ''}`}>
          <h3 className='text-lg font-medium text-gray-900'>
            {isFa ? 'پایان جلسه مدیریتی' : 'Admin Session Expired'}
          </h3>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
            ×
          </button>
        </div>
        <div className='space-y-4'>
          <p className='text-sm text-gray-700'>
            {isFa
              ? 'نشست مدیریتی شما منقضی شده است. برای ادامه باید دوباره وارد شوید.'
              : 'Your admin session has expired. Please sign in again to continue.'}
          </p>
          <div className={`flex ${isFa ? 'space-x-reverse space-x-3' : 'space-x-3'} justify-end`}>
            <button
              className='btn-primary'
              onClick={onClose}
            >
              {isFa ? 'باشه' : 'OK'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SessionExpiredModal };
export default ConfirmationModal; 