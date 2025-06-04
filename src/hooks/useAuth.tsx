import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { apiService } from '../services/api';
import { clearAllUserData, clearCampaignData } from '../utils/errorHandler';

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
        
        // Sync token with API service
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
    
    // Use a more reliable redirect method
    // Force a full page reload to ensure clean state and prevent React Router conflicts
    console.log('🔄 Redirecting to login page with full page reload...');
    
    // Small delay to ensure logout state is fully processed
    setTimeout(() => {
      window.location.replace('/login');
    }, 100);
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

  // Keep API service token in sync with accessToken state
  useEffect(() => {
    if (accessToken) {
      apiService.setAccessToken(accessToken);
      console.log('✅ Access token synced with API service:', accessToken.substring(0, 20) + '...');
    } else {
      apiService.setAccessToken(null);
      console.log('✅ API service token cleared');
    }
  }, [accessToken]);

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
