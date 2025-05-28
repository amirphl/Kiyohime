import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { getRouteByPath } from '../config/routes';

interface NavigationContextType {
  navigate: (path: string) => void;
  goBack: () => void;
  getCurrentRoute: () => string;
  isCurrentRoute: (path: string) => boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const navigate = useCallback((path: string) => {
    // Validate the route exists
    const route = getRouteByPath(path);
    if (!route) {
      console.warn(`Navigation attempted to invalid route: ${path}`);
      return;
    }

    // Update the URL
    window.history.pushState({}, '', path);
    
    // Dispatch a custom navigation event that the AuthRouter can listen to
    window.dispatchEvent(new CustomEvent('navigation', { detail: { path } }));
  }, []);

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  const getCurrentRoute = useCallback(() => {
    return window.location.pathname;
  }, []);

  const isCurrentRoute = useCallback((path: string) => {
    return window.location.pathname === path;
  }, []);

  const value: NavigationContextType = {
    navigate,
    goBack,
    getCurrentRoute,
    isCurrentRoute,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}; 