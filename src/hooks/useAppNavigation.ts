import { useCallback } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { ROUTES } from '../config/routes';

export const useAppNavigation = () => {
  const { navigate, goBack, isCurrentRoute } = useNavigation();

  const goToHome = useCallback(() => navigate(ROUTES.HOME.path), [navigate]);
  const goToLogin = useCallback(() => navigate(ROUTES.LOGIN.path), [navigate]);
  const goToSignup = useCallback(() => navigate(ROUTES.SIGNUP.path), [navigate]);
  const goToDashboard = useCallback(() => navigate(ROUTES.DASHBOARD.path), [navigate]);
  const goToCampaignCreation = useCallback(() => navigate(ROUTES.CAMPAIGN_CREATION.path), [navigate]);
  const goToForgotPassword = useCallback(() => navigate(ROUTES.FORGOT_PASSWORD.path), [navigate]);
  const goToResetPassword = useCallback(() => navigate(ROUTES.RESET_PASSWORD.path), [navigate]);

  return {
    // Navigation actions
    goToHome,
    goToLogin,
    goToSignup,
    goToDashboard,
    goToCampaignCreation,
    goToForgotPassword,
    goToResetPassword,
    goBack,
    
    // Route checking
    isCurrentRoute,
    
    // Route constants
    ROUTES,
  };
}; 