import { useState, useEffect, useContext, createContext } from 'react';

interface Customer {
  id: number;
  uuid: string;
  account_type_id: number;
  company_name?: string;
  national_id?: string;
  company_phone?: string;
  company_address?: string;
  postal_code?: string;
  representative_first_name: string;
  representative_last_name: string;
  representative_mobile: string;
  email: string;
  is_email_verified: boolean;
  is_mobile_verified: boolean;
  is_active: boolean;
  created_at: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: Customer | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (tokens: { token: string; refresh_token: string }, userData: Customer) => void;
  logout: () => void;
  updateUser: (userData: Partial<Customer>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        logout();
      }
    }
  }, []);

  const login = (tokens: { token: string; refresh_token: string }, userData: Customer) => {
    localStorage.setItem('access_token', tokens.token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('customer_data', JSON.stringify(userData));
    localStorage.setItem('user_id', userData.id.toString());
    localStorage.setItem('user_uuid', userData.uuid);
    localStorage.setItem('account_type_id', userData.account_type_id.toString());
    localStorage.setItem('is_authenticated', 'true');

    setAccessToken(tokens.token);
    setRefreshToken(tokens.refresh_token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('customer_data');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_uuid');
    localStorage.removeItem('account_type_id');
    localStorage.removeItem('is_authenticated');

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: Partial<Customer>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('customer_data', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      accessToken,
      refreshToken,
      login,
      logout,
      updateUser,
    }}>
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