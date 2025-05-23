import React, { useState } from 'react';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

const AuthRouter: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'forgotPassword' | 'resetPassword'>('signup');

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
          // Store the data and navigate to reset password
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