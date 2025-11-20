import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { apiService } from '../services/api';
import { clearAllUserData, clearCampaignData } from '../utils/errorHandler';

// Import campaign context to clear campaign data during logout
let campaignContextClearFunction: (() => void) | null = null;

// Function to register campaign clear function
export const registerCampaignClearFunction = (clearFn: () => void) => {
  campaignContextClearFunction = clearFn;
};

// Guard to ensure we only handle customer unauthorized once per session
let customerUnauthorizedHandled = false;

interface Customer {
  id: number;
  uuid: string;
  email: string;
  representative_first_name: string;
  representative_last_name: string;
  representative_mobile: string;
  account_type: string;
  company_name?: string;
  is_active?: boolean;
  is_email_verified?: boolean;
  is_mobile_verified?: boolean;
  created_at: string;
  referrer_agency_id?: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: Customer | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (
    tokens: { token: string; refresh_token: string },
    userData: Customer
  ) => void;
  logout: (redirectToLogin?: boolean) => void;
  manualLogout: () => void;
  logoutAndRedirect: () => void; // New method for 401 handling
  registerCampaignClearFunction: (clearFunction: () => void) => void;
  updateUser: (userData: Partial<Customer>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state from localStorage synchronously to avoid token race on first render
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('is_authenticated') === 'true');
  const [user, setUser] = useState<Customer | null>(() => {
    const userData = localStorage.getItem('customer_data');
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  });
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem('refresh_token'));

  useEffect(() => {
    // Keep API service token in sync with accessToken state (runs immediately after mount)
    if (accessToken) {
      apiService.setAccessToken(accessToken);
      console.log('✅ Access token synced with API service:', accessToken.substring(0, 20) + '...');
    } else {
      apiService.setAccessToken(null);
      console.log('✅ API service token cleared');
    }
  }, [accessToken]);

  // Backward compatibility: fallback initialization if localStorage changes or was not set
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    const userData = localStorage.getItem('customer_data');
    const isAuth = localStorage.getItem('is_authenticated');

    if (token && refresh && userData && isAuth === 'true') {
      try {
        const parsedUser = JSON.parse(userData);
        setAccessToken(token);
        setRefreshToken(refresh);
        setUser(parsedUser);
        setIsAuthenticated(true);
        apiService.setAccessToken(token);
        console.log('✅ Access token synced with API service on app initialization');
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear localStorage on error
        localStorage.clear();
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        setIsAuthenticated(false);
        apiService.setAccessToken(null);
      }
    }
  }, []);

  const login = (
    tokens: { token: string; refresh_token: string },
    userData: Customer
  ) => {
    localStorage.setItem('access_token', tokens.token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('customer_data', JSON.stringify(userData));
    localStorage.setItem('user_id', userData.id.toString());
    localStorage.setItem('user_uuid', userData.uuid);
    localStorage.setItem('account_type', userData.account_type);
    localStorage.setItem('is_authenticated', 'true');

    setAccessToken(tokens.token);
    setRefreshToken(tokens.refresh_token);
    setUser(userData);
    setIsAuthenticated(true);

    // Attach token to API service immediately
    apiService.setAccessToken(tokens.token);

    console.log('User data stored successfully. Authentication state updated.');
    console.log('Account type:', userData.account_type);
  };

  const logout = useCallback((redirectToLogin: boolean = false) => {
    console.log('🔄 Starting comprehensive logout - clearing all localStorage data...');

    // Clear campaign data first (this will clear localStorage items)
    clearCampaignData();

    // Clear campaign context data if available
    if (campaignContextClearFunction) {
      console.log('🧹 Clearing campaign context data...');
      campaignContextClearFunction();
    }

    // Use the utility function to clear all other user data (but not campaign data)
    clearAllUserData();

    // Clear all state
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Clear API service token
    apiService.setAccessToken(null);

    console.log('✅ Logout completed - all localStorage data cleared');
    console.log('🧹 localStorage items remaining:', Object.keys(localStorage));

    // If redirect is requested, handle it after state is cleared
    if (redirectToLogin) {
      console.log('🔄 Manual logout - redirecting to login page...');
      setTimeout(() => {
        window.location.replace('/login');
      }, 100);
    }
  }, []);

  const logoutAndRedirect = useCallback(() => {
    console.log('🚨 Logging out due to 401 Unauthorized response');
    // Prevent duplicate alerts/redirects if multiple requests hit 401
    if (customerUnauthorizedHandled) {
      return;
    }
    customerUnauthorizedHandled = true;

    // Perform cleanup first to stop further authenticated requests
    logout();

    // Determine language for alert before clearing storage
    let lang: 'en' | 'fa' = 'en';
    try {
      const docLang = (document?.documentElement?.lang || '').toLowerCase();
      const storedLang = (localStorage.getItem('language') || '').toLowerCase();
      if (docLang === 'fa' || storedLang === 'fa') lang = 'fa';
    } catch { }

    // Show alert to user before redirecting
    try {
      if (lang === 'fa') {
        alert('نشست شما منقضی شده است. در حال هدایت به صفحه ورود...');
      } else {
        alert('Session expired. Redirecting to login page...');
      }
    } catch { }

    // Ensure all local storage is cleared before redirecting
    try {
      localStorage.clear();
    } catch { }

    // Redirect after a short delay
    setTimeout(() => {
      window.location.replace('/signin');
    }, 1500);
  }, [logout]);

  // Set up the unauthorized handler for the API service
  useEffect(() => {
    console.log('Setting up unauthorized handler for API service...');
    apiService.setUnauthorizedHandler(logoutAndRedirect);

    // Verify the handler was set up correctly
    if (apiService.isUnauthorizedHandlerConfigured()) {
      console.log('✅ Unauthorized handler configured successfully');
    } else {
      console.error('❌ Failed to configure unauthorized handler');
    }
  }, [logoutAndRedirect]);

  // Manual logout function for user-initiated logout
  const manualLogout = useCallback(() => {
    console.log('👤 User initiated logout');
    logout(true); // Pass true to redirect to login
  }, [logout]);

  // Function to update user data
  const updateUser = useCallback((userData: Partial<Customer>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('customer_data', JSON.stringify(updatedUser));
    }
  }, [user]);

  const value: AuthContextType = {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    login,
    logout,
    manualLogout,
    logoutAndRedirect,
    registerCampaignClearFunction,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
