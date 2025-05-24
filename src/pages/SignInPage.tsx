import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const SignInPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      window.location.href = '/dashboard';
      return;
    }

    // Redirect to the login page (which is currently handled by AuthRouter)
    // We'll update the routing to handle this properly
    window.location.href = '/login';
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default SignInPage; 