import React, { useState, useEffect } from 'react';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import CampaignCreationPage from '../pages/CampaignCreationPage';
import HomePage from '../pages/HomePage';
import { useAuth } from '../hooks/useAuth';
import { ROUTES, getRouteByPath } from '../config/routes';

type PageType = 'home' | 'login' | 'signup' | 'forgotPassword' | 'resetPassword' | 'dashboard' | 'campaign-creation';

const AuthRouter: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const { isAuthenticated } = useAuth();

  // Helper function to update current page based on path
  const updateCurrentPage = (path: string) => {
    const route = getRouteByPath(path);
    if (route) {
      setCurrentPage(route.page as PageType);
    } else {
      // Default to home for unknown routes
      setCurrentPage('home');
    }
  };

  // Get current path from URL on mount
  useEffect(() => {
    const path = window.location.pathname;
    updateCurrentPage(path);
  }, []);

  // Listen for custom navigation events
  useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      const path = event.detail.path;
      updateCurrentPage(path);
    };

    window.addEventListener('navigation', handleNavigation as EventListener);
    
    return () => {
      window.removeEventListener('navigation', handleNavigation as EventListener);
    };
  }, []);

  // Redirect to dashboard if user is authenticated and trying to access auth pages
  useEffect(() => {
    if (
      isAuthenticated &&
      ['login', 'signup', 'forgotPassword', 'resetPassword'].includes(
        currentPage
      )
    ) {
      window.location.href = ROUTES.DASHBOARD.path;
    }
  }, [isAuthenticated, currentPage]);

  // If user is authenticated and on home page, show dashboard
  if (isAuthenticated && currentPage === 'home') {
    return <DashboardPage />;
  }

  // If user is not authenticated and trying to access protected routes, redirect to home
  if (!isAuthenticated && ['dashboard', 'campaign-creation'].includes(currentPage)) {
    window.location.href = ROUTES.HOME.path;
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
            window.history.pushState({}, '', ROUTES.SIGNUP.path);
          }}
          onNavigateToForgotPassword={() => {
            setCurrentPage('forgotPassword');
            window.history.pushState({}, '', ROUTES.FORGOT_PASSWORD.path);
          }}
        />
      );

    case 'signup':
      return (
        <SignupPage
          onNavigateToLogin={() => {
            setCurrentPage('login');
            window.history.pushState({}, '', ROUTES.LOGIN.path);
          }}
        />
      );

    case 'forgotPassword':
      return (
        <ForgotPasswordPage
          onNavigateToLogin={() => {
            setCurrentPage('login');
            window.history.pushState({}, '', ROUTES.LOGIN.path);
          }}
          onNavigateToResetPassword={(customerId, maskedPhone) => {
            localStorage.setItem('reset_customer_id', customerId.toString());
            localStorage.setItem('reset_masked_phone', maskedPhone);
            setCurrentPage('resetPassword');
            window.history.pushState({}, '', ROUTES.RESET_PASSWORD.path);
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
            window.history.pushState({}, '', ROUTES.LOGIN.path);
          }}
          customerId={customerId ? parseInt(customerId) : undefined}
          maskedPhone={maskedPhone || undefined}
        />
      );

    case 'dashboard':
      return <DashboardPage />;

    case 'campaign-creation':
      return <CampaignCreationPage />;

    default:
      return <HomePage />;
  }
};

export default AuthRouter;
