import React, { useState, useEffect } from 'react';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import CampaignCreationPage from '../pages/CampaignCreationPage';
import WalletPage from '../pages/WalletPage';
import ReportsPage from '../pages/ReportsPage';
import HomePage from '../pages/HomePage';
import CustomerManagementPage from '../pages/CustomerManagementPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import AdminSardisPage from '../pages/AdminSardisPage';
import AdminLineNumbersPage from '../pages/AdminLineNumbersPage';
import AdminCampaignsPage from '../pages/AdminCampaignsPage';
import ContactUsPage from '../pages/ContactUsPage';
import { useAuth } from '../hooks/useAuth';
import { ROUTES, getRouteByPath } from '../config/routes';
import { useTranslation } from '../hooks/useTranslation';
import AdminCustomerManagementPage from '../pages/AdminCustomerManagementPage';

type PageType = 'home' | 'login' | 'signup' | 'forgotPassword' | 'resetPassword' | 'dashboard' | 'campaign-creation' | 'wallet' | 'reports' | 'customer-management' | 'contact' | 'admin-login' | 'admin-sardis' | 'admin-line-numbers' | 'admin-campaigns' | 'admin-customers';

const AuthRouter: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const { isAuthenticated } = useAuth();
  const [sessionExpired, setSessionExpired] = useState(false);
  const { t } = useTranslation();

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

  // Listen for admin session expiration to show blocking overlay and redirect
  useEffect(() => {
    const onExpired = () => {
      if (sessionExpired) return;
      setSessionExpired(true);
      // Block interaction and redirect after short delay
      setTimeout(() => {
        window.location.href = ROUTES.ADMIN_LOGIN.path;
      }, 2000);
    };
    window.addEventListener('admin-session-expired', onExpired as EventListener);
    return () => {
      window.removeEventListener('admin-session-expired', onExpired as EventListener);
    };
  }, [sessionExpired]);

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

  // Blocking overlay on session expiration
  if (sessionExpired) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 text-white text-center select-none">
        <div className="max-w-md p-6 bg-gray-900 rounded shadow-lg">
          <div className="text-lg font-semibold mb-2">{t('adminCommon.sessionExpired')}</div>
          <div className="text-sm opacity-80">Please wait…</div>
        </div>
      </div>
    );
  }

  // If user is not authenticated and trying to access protected routes, redirect to home
  if (!isAuthenticated && ['dashboard', 'campaign-creation', 'wallet', 'reports', 'customer-management'].includes(currentPage)) {
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

    case 'wallet':
      return <WalletPage />;
    case 'reports':
      return <ReportsPage />;
    case 'customer-management':
      return <CustomerManagementPage />;
    case 'contact':
      return <ContactUsPage />;

    case 'admin-login':
      return <AdminLoginPage />;

    case 'admin-sardis':
      return <AdminSardisPage />;

    case 'admin-line-numbers':
      return <AdminLineNumbersPage />;

    case 'admin-campaigns':
      return <AdminCampaignsPage />;

    case 'admin-customers':
      return <AdminCustomerManagementPage />;

    default:
      return <HomePage />;
  }
};

export default AuthRouter;
