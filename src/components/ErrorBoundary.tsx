import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Wrapper component to use hooks in class component
const ErrorBoundaryContent: React.FC<{
  error?: Error;
  onRefresh: () => void;
}> = ({ error, onRefresh }) => {
  const { t } = useTranslation();

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-6'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4'>
            <svg
              className='h-6 w-6 text-red-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h2 className='text-lg font-medium text-gray-900 mb-2'>
            {t('error.title')}
          </h2>
          <p className='text-sm text-gray-600 mb-4'>{t('error.message')}</p>
          <button onClick={onRefresh} className='btn-red'>
            {t('error.refresh')}
          </button>
        </div>
      </div>
    </div>
  );
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: send to error reporting service
      // errorReportingService.captureException(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorBoundaryContent
          error={this.state.error}
          onRefresh={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
