import React, { useState, useEffect } from 'react';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import { useAuth } from '../hooks/useAuth';

const AuthRouter: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'forgotPassword' | 'resetPassword'>('signup');
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // TODO: Implement proper routing with React Router
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  // If user is authenticated, show dashboard
  if (isAuthenticated) {
    return <DashboardPage />;
  }

  if (currentPage === 'login') {
    return (
      <LoginPage
        onNavigateToSignup={() => setCurrentPage('signup')}
        onNavigateToForgotPassword={() => setCurrentPage('forgotPassword')}
      />
    );
  }

  if (currentPage === 'forgotPassword') {
    return (
      <ForgotPasswordPage
        onNavigateToLogin={() => setCurrentPage('login')}
        onNavigateToResetPassword={(customerId, maskedPhone) => {
          localStorage.setItem('reset_customer_id', customerId.toString());
          localStorage.setItem('reset_masked_phone', maskedPhone);
          setCurrentPage('resetPassword');
        }}
      />
    );
  }

  if (currentPage === 'resetPassword') {
    const customerId = localStorage.getItem('reset_customer_id');
    const maskedPhone = localStorage.getItem('reset_masked_phone');

    return (
      <ResetPasswordPage
        onNavigateToLogin={() => {
          localStorage.removeItem('reset_customer_id');
          localStorage.removeItem('reset_masked_phone');
          setCurrentPage('login');
        }}
        customerId={customerId ? parseInt(customerId) : undefined}
        maskedPhone={maskedPhone || undefined}
      />
    );
  }

  return <SignupPage onNavigateToLogin={() => setCurrentPage('login')} />;
};

export default AuthRouter;