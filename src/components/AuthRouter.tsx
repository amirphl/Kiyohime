import React, { useState, useEffect } from 'react';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import HomePage from '../pages/HomePage';
import SignInPage from '../pages/SignInPage';
import { useAuth } from '../hooks/useAuth';

const AuthRouter: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup' | 'forgotPassword' | 'resetPassword' | 'dashboard'>('home');
  const { isAuthenticated } = useAuth();

  // Get current path from URL
  useEffect(() => {
    const path = window.location.pathname;
    
    if (path === '/') {
      setCurrentPage('home');
    } else if (path === '/signin') {
      setCurrentPage('login');
    } else if (path === '/login') {
      setCurrentPage('login');
    } else if (path === '/signup') {
      setCurrentPage('signup');
    } else if (path === '/forgot-password') {
      setCurrentPage('forgotPassword');
    } else if (path === '/reset-password') {
      setCurrentPage('resetPassword');
    } else if (path === '/dashboard') {
      setCurrentPage('dashboard');
    } else {
      // Default to home for unknown routes
      setCurrentPage('home');
    }
  }, []);

  // Redirect to dashboard if user is authenticated and trying to access auth pages
  useEffect(() => {
    if (isAuthenticated && ['login', 'signup', 'forgotPassword', 'resetPassword'].includes(currentPage)) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated, currentPage]);

  // If user is authenticated and on home page, show dashboard
  if (isAuthenticated && currentPage === 'home') {
    return <DashboardPage />;
  }

  // If user is not authenticated and trying to access dashboard, redirect to home
  if (!isAuthenticated && currentPage === 'dashboard') {
    window.location.href = '/';
    return null;
  }

  // Render appropriate page based on current route
  switch (currentPage) {
    case 'home':
      return <HomePage />;
      
    case 'login':
      return (
        <LoginPage
          onNavigateToSignup={() => {
            setCurrentPage('signup');
            window.history.pushState({}, '', '/signup');
          }}
          onNavigateToForgotPassword={() => {
            setCurrentPage('forgotPassword');
            window.history.pushState({}, '', '/forgot-password');
          }}
        />
      );
      
    case 'signup':
      return (
        <SignupPage
          onNavigateToLogin={() => {
            setCurrentPage('login');
            window.history.pushState({}, '', '/signin');
          }}
        />
      );
      
    case 'forgotPassword':
      return (
        <ForgotPasswordPage
          onNavigateToLogin={() => {
            setCurrentPage('login');
            window.history.pushState({}, '', '/signin');
          }}
          onNavigateToResetPassword={(customerId, maskedPhone) => {
            localStorage.setItem('reset_customer_id', customerId.toString());
            localStorage.setItem('reset_masked_phone', maskedPhone);
            setCurrentPage('resetPassword');
            window.history.pushState({}, '', '/reset-password');
          }}
        />
      );
      
    case 'resetPassword':
      const customerId = localStorage.getItem('reset_customer_id');
      const maskedPhone = localStorage.getItem('reset_masked_phone');

      return (
        <ResetPasswordPage
          onNavigateToLogin={() => {
            localStorage.removeItem('reset_customer_id');
            localStorage.removeItem('reset_masked_phone');
            setCurrentPage('login');
            window.history.pushState({}, '', '/signin');
          }}
          customerId={customerId ? parseInt(customerId) : undefined}
          maskedPhone={maskedPhone || undefined}
        />
      );
      
    case 'dashboard':
      return <DashboardPage />;
      
    default:
      return <HomePage />;
  }
};

export default AuthRouter;