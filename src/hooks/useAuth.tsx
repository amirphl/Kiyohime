import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { apiService } from '../services/api';
import { clearAllUserData } from '../utils/errorHandler';

// Import campaign context to clear campaign data during logout
let campaignContextClearFunction: (() => void) | null = null;

// Function to register campaign clear function
export const registerCampaignClearFunction = (clearFn: () => void) => {
  campaignContextClearFunction = clearFn;
};

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
  logout: () => void;
  logoutAndRedirect: () => void; // New method for 401 handling
  updateUser: (userData: Partial<Customer>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<Customer | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing authentication on app load
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
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear localStorage on error
        localStorage.clear();
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        setIsAuthenticated(false);
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

    console.log('User data stored successfully. Authentication state updated.');
    console.log('Account type:', userData.account_type);
  };

  const logout = useCallback(() => {
    console.log('🔄 Starting comprehensive logout - clearing all localStorage data...');
    
    // Use the utility function to clear all user data
    clearAllUserData();
    
    // Clear campaign data if available
    if (campaignContextClearFunction) {
      console.log('🧹 Clearing campaign context data...');
      campaignContextClearFunction();
    }
    
    // Clear all state
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear API service token
    apiService.setAccessToken(null);
    
    console.log('✅ Logout completed - all localStorage data cleared');
    console.log('🧹 localStorage items remaining:', Object.keys(localStorage));
  }, []);

  const logoutAndRedirect = useCallback(() => {
    console.log('🚨 Logging out due to 401 Unauthorized response');
    console.log('🧹 Performing comprehensive cleanup...');
    
    // First logout (clear state and localStorage)
    logout();
    
    // Additional safety check - ensure all user data is cleared
    const remainingItems = Object.keys(localStorage);
    if (remainingItems.length > 0) {
      console.log('⚠️  Remaining localStorage items after logout:', remainingItems);
      // These should only be user preferences like language
      remainingItems.forEach(item => {
        if (!item.includes('language') && !item.includes('theme') && !item.includes('ui_')) {
          console.log(`🗑️  Force removing: ${item}`);
          localStorage.removeItem(item);
        }
      });
    }
    
    // Then redirect to login page
    // Use window.location.href for a full page reload to ensure clean state
    console.log('🔄 Redirecting to login page...');
    window.location.href = '/login';
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

  const updateUser = (userData: Partial<Customer>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('customer_data', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    accessToken,
    refreshToken,
    login,
    logout,
    logoutAndRedirect,
    updateUser,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
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
